from dotenv import load_dotenv

load_dotenv()

from http import HTTPStatus
from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS

from process import find_matches, get_combo_data, get_moxfield_deck

app = Flask(import_name=__name__, static_url_path="/", static_folder="./frontend/build")

CORS(app)

COMBO_DATA = get_combo_data()


@app.route("/")
def _index():
    return send_from_directory("./frontend/build", "index.html")


@app.errorhandler(404)
def fourohfour():
    return send_from_directory("./frontend/build", "index.html")


@app.route("/api/search")
def search():
    params = request.args
    deck = get_moxfield_deck(params["url"])
    combos = find_matches(COMBO_DATA, deck["cards"])
    deck.update({"combos": combos})
    del deck["cards"]

    return jsonify(deck), HTTPStatus.OK
