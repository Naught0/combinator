from traceback import print_exc

import requests
import sentry_sdk
from fastapi import APIRouter, HTTPException, Response

from app.const import USER_AGENT
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
    return requests.get(
        "https://backend.commanderspellbook.com/find-my-combos",
        json=data.model_dump(mode="json"),
        headers={"User-Agent": USER_AGENT},
    ).json()["results"]


@router.get("/deck/{source}/{deck_id}", response_model=DeckResponse)
def read_deck(source: Source, deck_id: str):
    try:
        return get_deck(source, deck_id)
    except Exception as e:
        sentry_sdk.capture_exception()
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/deck/parse_url")
def parse_deck_url(url: str):
    source = parse_source_from_url(url)
    if source is None:
        raise HTTPException(status_code=404, detail="Unknown deck source. Supported: Moxfield, Archidekt, MTGGoldfish.")

    try:
        id = parse_id_from_url(source, url)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    if id is None:
        raise HTTPException(status_code=404, detail="Could not parse a deck ID from the URL.")

    return {"source": source, "id": id}


@router.get("/deck", response_model=DeckResponse)
def deck_search(url: str):
    source = parse_source_from_url(url)
    if source is None:
        raise HTTPException(status_code=404, detail="Unknown deck source. Supported: Moxfield, Archidekt, MTGGoldfish.")

    try:
        deck_id = parse_id_from_url(source, url)
        deck = get_deck(source, deck_id)
    except Exception as e:
        sentry_sdk.capture_exception()
        raise HTTPException(status_code=404, detail=str(e))

    return deck


@router.head("/user/moxfield/{user_name}/exists")
def user_exists(user_name: str):
    if moxfield_user_exists(user_name):
        return Response(status_code=204)

    raise HTTPException(status_code=404, detail="User not found")


@router.post("/user")
def user_search(req: MoxfieldUserSearchParams):
    try:
        return get_moxfield_user_decks(req)
    except NoDecksFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except MoxfieldError as e:
        print_exc()
        raise HTTPException(status_code=422, detail=str(e))


@router.post("/card/search")
def card_search(
    cards: CardSearchPayload,
) -> ScryfallCardResponse:
    return ScryfallCardResponse(
        cards=[ScryfallCard(**card) for card in get_scryfall_cards(cards.cards)]
    )
