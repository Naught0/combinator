from traceback import print_exc

import requests
import sentry_sdk
from fastapi import APIRouter, HTTPException, Response

from app.const import USER_AGENT
from app.logs import logger
from app.models.api import (
    CardSearchPayload,
    ComboSearchPayload,
    DeckResponse,
    ScryfallCard,
    ScryfallCardResponse,
    Source,
)
from app.models.commanders_spellbook import Results
from app.models.moxfield import MoxfieldUserSearchParams
from app.parse import parse_id_from_url, parse_source_from_url
from app.process import get_deck
from app.sources.moxfield.api import (
    MoxfieldError,
    NoDecksFoundError,
    get_moxfield_user_decks,
    moxfield_user_exists,
)
from app.sources.scryfall.api import get_scryfall_cards

router = APIRouter(prefix="/api")


@router.post("/combo", response_model=Results)
def combo_search(data: ComboSearchPayload):
    logger.info("Executing combo search")
    return requests.get(
        "https://backend.commanderspellbook.com/find-my-combos",
        json=data.model_dump(mode="json"),
        headers={"User-Agent": USER_AGENT},
    ).json()["results"]


@router.get("/deck/{source}/{deck_id}", response_model=DeckResponse)
def read_deck(source: Source, deck_id: str):
    logger.info(f"Reading deck: {source}/{deck_id}")
    try:
        return get_deck(source, deck_id)
    except Exception:
        sentry_sdk.capture_exception()
        logger.exception(f"Error reading deck {source}/{deck_id}")
        return Response("Deck not found", 404)


@router.get("/deck/parse_url")
def parse_deck_url(url: str):
    logger.info(f"Parsing deck URL: {url}")
    source = parse_source_from_url(url)
    if source is None:
        logger.warning(f"Unknown source for URL: {url}")
        return Response("Unknown source", 404)

    id = parse_id_from_url(source, url)
    if id is None:
        logger.warning(f"Invalid/malformed URL: {url}")
        return Response("Invalid or malformed URL", 404)

    logger.info(f"Parsed URL successfully: source={source}, id={id}")
    return {"source": source, "id": id}


@router.get("/deck", response_model=DeckResponse)
def deck_search(url: str):
    logger.info(f"Searching deck with URL: {url}")
    source = parse_source_from_url(url)
    if source is None:
        logger.warning(f"Unknown source for URL: {url}")
        return Response("Unknown source", 404)

    deck_id = parse_id_from_url(source, url)

    try:
        deck = get_deck(source, deck_id)
    except Exception:
        sentry_sdk.capture_exception()
        logger.exception(f"Error searching deck {source}/{deck_id}")
        raise HTTPException(status_code=404, detail="Deck not found")

    return deck


@router.head("/user/moxfield/{user_name}/exists")
def user_exists(user_name: str):
    logger.warning(f"Received request: check moxfield user exists: {user_name}")
    headers = {"Cache-Control": "no-store, no-cache, must-revalidate, max-age=0"}

    if moxfield_user_exists(user_name):
        logger.warning(f"User {user_name} exists, returning 204")
        return Response(status_code=204, headers=headers)

    logger.warning(f"User {user_name} not found, returning 404")
    return Response("User not found", status_code=404, headers=headers)


@router.post("/user")
def user_search(req: MoxfieldUserSearchParams):
    logger.info(f"Searching moxfield user decks: {req}")
    try:
        return get_moxfield_user_decks(req)
    except NoDecksFoundError as e:
        logger.warning(f"No decks found for user {req.author_user_names}")
        raise HTTPException(status_code=404, detail=str(e))
    except MoxfieldError as e:
        logger.exception("Moxfield error occurred")
        print_exc()
        raise HTTPException(status_code=422, detail=str(e))


@router.post("/card/search")
def card_search(
    cards: CardSearchPayload,
) -> ScryfallCardResponse:
    logger.info(f"Executing card search for {len(cards.cards)} cards")
    return ScryfallCardResponse(
        cards=[ScryfallCard(**card) for card in get_scryfall_cards(cards.cards)],
    )
