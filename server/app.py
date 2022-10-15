import pathlib
import traceback

from dotenv import load_dotenv

load_dotenv()


from itertools import chain
from http import HTTPStatus
from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
from user import get_moxfield_user_decks


from process import (
    find_matches,
    get_archidekt_deck,
    get_combo_data,
    get_goldfish_deck,
    get_moxfield_deck,
    get_scryfall_images,
)

app = Flask(__name__, static_url_path="/", static_folder="static")

CORS(app)

COMBO_DATA = get_combo_data()


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def _index(path):
    if path and pathlib.Path(app.static_folder, path).exists():
        return send_from_directory(f"{app.static_folder}/{path}")
    else:
        return send_from_directory(app.static_folder, "index.html")


@app.errorhandler(404)
def fourohfour(*args, **kwargs):
    return send_from_directory(app.static_folder, "index.html")


@app.route("/api/user/search")
def user_search():
    params = request.args
    user = params.get("userName")
    if not user:
        return jsonify({"error": True, "message": "Field `userName` must be supplied"}), HTTPStatus.UNPROCESSABLE_ENTITY

    try:
        decks = get_moxfield_user_decks(user)
        return jsonify(decks), HTTPStatus.OK
    except Exception as e:
        return jsonify({"error": True, "message": str(e)}), HTTPStatus.BAD_REQUEST


@app.route("/api/search")
def search():
    params = request.args
    fn = None
    url = params["url"].lower()
    if "moxfield" in url:
        fn = get_moxfield_deck
    if "mtggoldfish" in url:
        fn = get_goldfish_deck
    if "archidekt" in url:
        fn = get_archidekt_deck

    try:
        deck = fn(params["url"])
        combos = find_matches(COMBO_DATA, deck["cards"], deck["meta"]["colors"])
        deck.update(combos)
        all_cards = deck["cards"]
        extra_cards = [
            *list(chain(*[x["c"] for x in deck.get("one", {"c": []})])),
            *list(chain(*[x["c"] for x in deck.get("two", {"c": []})])),
        ]
        deck["cardImages"] = get_scryfall_images([*all_cards, *extra_cards])
    except Exception as e:
        traceback.print_exc()
        return jsonify("Deck not found or malformed"), HTTPStatus.BAD_REQUEST

    return jsonify(deck), HTTPStatus.OK
