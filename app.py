import pathlib
from dotenv import load_dotenv

load_dotenv()

from http import HTTPStatus
from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS

from process import (
    find_matches,
    get_archidekt_deck,
    get_combo_data,
    get_goldfish_deck,
    get_moxfield_deck,
)

app = Flask(__name__, static_url_path="/", static_folder="frontend/build")

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
        combos = find_matches(COMBO_DATA, deck["cards"])
        deck.update({"combos": combos})
        del deck["cards"]
    except:
        return jsonify("Deck not found or malformed"), HTTPStatus.BAD_REQUEST

    return jsonify(deck), HTTPStatus.OK
