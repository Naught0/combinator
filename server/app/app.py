import pathlib


from http import HTTPStatus

from flask import Flask, jsonify, request, send_from_directory
from routes.api import api_bp
from user import get_moxfield_user_decks

app = Flask(__name__, static_url_path="/", static_folder="static")

app.register_blueprint(api_bp)


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
        return (
            jsonify({"error": True, "message": "Field `userName` must be supplied"}),
            HTTPStatus.UNPROCESSABLE_ENTITY,
        )

    try:
        decks = get_moxfield_user_decks(user)
        return jsonify(decks), HTTPStatus.OK
    except Exception as e:
        return jsonify({"error": True, "message": str(e)}), HTTPStatus.BAD_REQUEST
