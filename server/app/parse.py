from urllib.parse import urlparse

from app.models.api import Source


def parse_source_from_url(url: str) -> Source | None:
    source = None
    url = url.lower()
    if "moxfield" in url:
        source = "moxfield"
    if "mtggoldfish" in url:
        source = "mtggoldfish"
    if "archidekt" in url:
        source = "archidekt"

    return source


def parse_moxfield_deck_id(url: str) -> str:
    parsed = urlparse(url)
    try:
        deck_id = parsed.path.split("/")[-1]
    except IndexError:
        raise ValueError("Invalid or malformed URL supplied.")

    return deck_id


def parse_mtggoldfish_deck_id(url: str) -> str:
    parsed = urlparse(url)
    url_parts = [part for part in parsed.path.split("/") if part]
    if not url_parts:
        raise ValueError("Invalid or malformed URL supplied.")
    return url_parts[-1]


def parse_archidekt_deck_id(url: str) -> str:
    parsed = urlparse(url)
    try:
        return next(filter(lambda x: x.isdigit(), reversed(parsed.path.split("/"))))
    except StopIteration:
        raise ValueError("Could not parse numeric deck ID from URL", url)


def parse_id_from_url(source: Source, url: str) -> str | None:
    id = None
    if source == "moxfield":
        id = parse_moxfield_deck_id(url)
    if source == "mtggoldfish":
        id = parse_mtggoldfish_deck_id(url)
    if source == "archidekt":
        id = parse_archidekt_deck_id(url)

    return id
