import requests
from fastapi import APIRouter, HTTPException

from app.const import USER_AGENT
from app.models.api import ComboSearchPayload, Deck, Source, UserSearchRequest
from app.models.commanders_spellbook import Results
from app.models.moxfield import MoxfieldDeck
from app.process import get_deck, parse_id_from_url, parse_source_from_url
from app.user import MoxfieldError, NoDecksFoundError, get_moxfield_user_decks

router = APIRouter(prefix="/api")


@router.post("/combo", response_model=Results)
def combo_search(data: ComboSearchPayload):
    return requests.get(
        "https://backend.commanderspellbook.com/find-my-combos",
        json=data.model_dump(mode="json"),
        headers={"User-Agent": USER_AGENT},
    ).json()["results"]


@router.get("/deck/{source}/{deck_id}", response_model=Deck)
def read_deck(source: Source, deck_id: str):
    try:
        return get_deck(source, deck_id)
    except ValueError:
        return "Unknown provider", 404


@router.get("/deck/parse_url")
def parse_deck_url(url: str):
    source = parse_source_from_url(url)
    if source is None:
        return ("Unknown source", 404)

    id = parse_id_from_url(source, url)
    if id is None:
        return ("Invalid or malformed URL", 404)

    return {"source": source, "id": id}


@router.get("/deck", response_model=Deck)
def deck_search(url: str):
    source = parse_source_from_url(url)
    if source is None:
        return ("Unknown source", 404)

    deck_id = parse_id_from_url(source, url)

    try:
        deck = get_deck(source, deck_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Deck not found")

    return deck


@router.post("/user", response_model=list[MoxfieldDeck])
def user_search(user: UserSearchRequest):
    try:
        return get_moxfield_user_decks(
            user.user_name, user.page, page_size=user.per_page
        )
    except NoDecksFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except MoxfieldError as e:
        raise HTTPException(status_code=422, detail=str(e))
