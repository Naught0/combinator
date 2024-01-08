import pathlib

from flask import Flask, send_from_directory
from app.routes.api import api_bp

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
