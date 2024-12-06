import re
from collections.abc import Mapping
from typing import Literal
from urllib.parse import urlparse

import backoff
import requests
from bs4 import BeautifulSoup
from pyrchidekt.api import getDeckById

from app.const import ACCEPT, USER_AGENT
from app.logs import logger
from app.models.api import Deck, Source

MOXFIELD_BASE_URL = "https://api.moxfield.com/v2/decks/all/{}"
COLOR_MAP = {"white": "w", "blue": "u", "black": "b", "red": "r", "green": "g"}


def chunk_array(lst: list, n: int):
    """https://www.geeksforgeeks.org/break-list-chunks-size-n-python/

    Args:
        l (list): The list to chunk
        n (int): the max chunk size

    Yields:
        List[any]
    """
    for i in range(0, len(lst), n):
        yield lst[i : i + n]


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


def parse_id_from_url(source: Source, url: str) -> str | None:
    id = None
    if source == "moxfield":
        id = parse_moxfield_deck_id(url)
    if source == "mtggoldfish":
        id = parse_mtggoldfish_deck_id(url)
    if source == "archidekt":
        id = parse_archidekt_deck_id(url)

    return id


def parse_moxfield_deck_id(url: str) -> str:
    parsed = urlparse(url)
    try:
        deck_id = parsed.path.split("/")[-1]
    except IndexError:
        raise ValueError("Invalid or malformed URL supplied.")

    return deck_id


def get_moxfield_deck(deck_id: str) -> Deck:
    resp = requests.get(
        MOXFIELD_BASE_URL.format(deck_id), headers={"User-Agent": USER_AGENT}
    )
    resp.raise_for_status()
    resp = resp.json()
    return Deck(
        id=deck_id,
        source="moxfield",
        meta={
            "name": resp.get("name"),
            "author": resp["createdByUser"]["userName"],
            "url": resp["publicUrl"],
            "colors": [x.lower() for x in resp["main"]["colors"]],
        },
        cards=list(
            set(
                [
                    resp["main"]["name"],
                    *resp["mainboard"].keys(),
                    # TODO: Only add sideboard for non-EDH
                    *resp["sideboard"].keys(),
                ]
            )
        ),
    )


def parse_mtggoldfish_deck_id(url: str) -> str:
    parsed = urlparse(url)
    try:
        url_parts = parsed.path.split("/")
        return url_parts[url_parts.index("deck") + 1]
    except IndexError:
        raise ValueError("Invalid or malformed URL supplied.")


def get_goldfish_deck(deck_id: str) -> Deck:
    url = f"https://www.mtggoldfish.com/deck/{deck_id}"
    download_url = "https://www.mtggoldfish.com/deck/download/{}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36",
        "Accept": "text/html",
        "Accept-Language": "en-US",
    }

    soup = BeautifulSoup(
        requests.get(
            url,
            headers=headers,
        ).text,
        "lxml",
    )
    author = soup.span.text[3:]
    title = soup.title.text.split("by ")[0]
    resp = requests.get(download_url.format(deck_id)).text
    cards = list(set([re.findall(r"\D+", x)[0].strip() for x in resp.split("\n") if x]))

    return Deck(
        id=deck_id,
        source="mtggoldfish",
        meta={"name": title, "author": author, "url": url, "colors": []},
        cards=cards,
    )


def parse_archidekt_deck_id(url: str) -> str:
    parsed = urlparse(url)
    try:
        return next(filter(lambda x: x.isdigit(), reversed(parsed.path.split("/"))))
    except StopIteration:
        raise ValueError("Could not parse numeric deck ID from URL", url)


def get_archidekt_deck(deck_id: str) -> Deck:
    data = getDeckById(deck_id)
    author = data.owner.username
    title = data.name
    cards = set([x.card.oracle_card.name for x in data.cards])
    colors = []
    for card in data.cards:
        colors.extend(card.card.oracle_card.color_identity)

    return Deck(
        id=deck_id,
        source="archidekt",
        meta={
            "name": title,
            "author": author,
            "url": f"https://archidekt.com/decks/{deck_id}",
            "colors": list(set(COLOR_MAP[x.lower()] for x in colors)),
        },
        cards=list(cards),
    )


@backoff.on_exception(
    backoff.expo,
    requests.RequestException,
    max_tries=3,
    giveup=lambda x: x.status_code != 429 or x.status,
)
def scryfall_request(card_names: list[str]) -> list[dict]:
    """Takes a list of card names and spits out a dict w/ images.
    Respects 429 ratelimiting

    Args:
        card_list_chunk (List[str]):

    Returns:
        Dict[str, str]: _description_
    """
    ret = []
    resp = requests.post(
        "https://api.scryfall.com/cards/collection",
        json={"identifiers": [{"name": n} for n in card_names if n]},
        headers={"User-Agent": USER_AGENT, "Accept": ACCEPT},
    )

    try:
        resp.raise_for_status()
    except requests.HTTPError:
        logger.error(
            f"Scryfall request failed with status {resp.status_code}:\n{resp.json()}"
        )
        raise

    data = resp.json()["data"]
    for card in data:
        if "oracle_text" not in card:
            __import__("pprint").pprint(card)
        if "image_uris" not in card:
            continue

        ret.append(
            {
                "name": card["name"],
                "image": card["image_uris"]["normal"],
                "id": card["id"],
                "oracle_text": card["oracle_text"] if "oracle_text" in card else "",
                "type": card.get("type_line", ""),
            }
        )

    return ret


def get_scryfall_cards(
    card_names: list[str],
) -> list[Mapping[Literal["id", "oracle_text", "name", "type", "image"], str]]:
    # Respect scryfall API
    card_chunks = chunk_array(card_names, 75)
    ret = []
    for chunk in card_chunks:
        ret.extend(scryfall_request(chunk))

    return ret


def get_deck(source: Source, deck_id: str):
    deck = None
    if source == "moxfield":
        deck = get_moxfield_deck(deck_id)
    if source == "mtggoldfish":
        deck = get_goldfish_deck(deck_id)
    if source == "archidekt":
        deck = get_archidekt_deck(deck_id)

    if deck is None:
        raise ValueError(f"Unknown source: {source}")

    deck.cards = get_scryfall_cards(deck.cards)

    return deck
