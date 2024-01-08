import traceback
from flask import Blueprint, jsonify, request
from http import HTTPStatus

import requests
from process import (
    get_archidekt_deck,
    get_goldfish_deck,
    get_moxfield_deck,
    get_scryfall_cards,
)

from resources.api import ComboSearchPayload
from resources.commander_spellbook import SearchResponse


api_bp = Blueprint("combos", __name__, url_prefix="/api")


def combo_search(payload: ComboSearchPayload) -> SearchResponse:
    return requests.get(
        "https://backend.commanderspellbook.com/find-my-combos", json=payload
    ).json()


@api_bp.post("/combo/search")
def _combo_search():
    data: ComboSearchPayload | None = request.get_json(silent=True)
    if not data:
        return ("", HTTPStatus.BAD_REQUEST)

    resp = combo_search(data)
    return jsonify(resp["results"]), HTTPStatus.OK


@api_bp.get("/deck/search")
def deck_search():
    params = request.args
    fn = None
    url = params["url"].lower()
    if "moxfield" in url:
        fn = get_moxfield_deck
    if "mtggoldfish" in url:
        fn = get_goldfish_deck
    if "archidekt" in url:
        fn = get_archidekt_deck

    if fn is None:
        return ("Provider not found", 404)

    try:
        deck = fn(params["url"])
        print(deck)
        all_cards: list[str] = deck["cards"]
        deck["cards"] = get_scryfall_cards(
            [
                *({"name": c, "in_deck": True} for c in all_cards),
            ]
        )
    except Exception:
        traceback.print_exc()
        return jsonify("Deck not found or malformed"), HTTPStatus.BAD_REQUEST

    return jsonify(deck), HTTPStatus.OK
