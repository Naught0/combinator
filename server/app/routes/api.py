import json
import traceback

import requests
from app.models.api import ComboSearchPayload, Deck, UserSearchRequest
from app.models.commanders_spellbook import Results
from app.models.moxfield import MoxfieldDeck
from app.process import (
    find_matches,
    get_archidekt_deck,
    get_goldfish_deck,
    get_moxfield_deck,
    get_scryfall_cards,
)
from app.user import MoxfieldError, get_moxfield_user_decks
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/search")

with open("./app/data/combos.json") as f:
    COMBO_DATA = json.load(f)


@router.post("/combo", response_model=Results)
def combo_search(data: ComboSearchPayload):
    return requests.get(
        "https://backend.commanderspellbook.com/find-my-combos",
        json=data.model_dump(mode="json"),
    ).json()["results"]


@router.get("/deck", response_model=Deck)
def deck_search(url: str):
    fn = None
    lowered = url.lower()
    if "moxfield" in lowered:
        fn = get_moxfield_deck
    if "mtggoldfish" in lowered:
        fn = get_goldfish_deck
    if "archidekt" in lowered:
        fn = get_archidekt_deck

    if fn is None:
        return ("Provider not found", 404)

    try:
        deck = fn(url)
        deck.cards = get_scryfall_cards(deck.cards)
    except Exception:
        traceback.print_exc()
        raise HTTPException(status_code=404, detail="Deck not found")

    return find_matches(COMBO_DATA, set(deck.cards), deck.meta.colors)


@router.post("/user", response_model=list[MoxfieldDeck])
def user_search(user: UserSearchRequest):
    try:
        return get_moxfield_user_decks(user.user_name)
    except MoxfieldError as e:
        raise HTTPException(status_code=400, detail=str(e))
