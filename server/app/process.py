import contextlib
import re
from typing import Dict, List, Literal, TypedDict
from urllib.parse import urlparse

import backoff
import requests
from bs4 import BeautifulSoup

COMBO_DATA_URL = "data.json"
MOXFIELD_BASE_URL = "https://api.moxfield.com/v2/decks/all/{}"
COLOR_MAP = {"white": "w", "blue": "u", "black": "b", "red": "r", "green": "g"}


def chunk_array(lst: list, n: int) -> List[List[any]]:
    """https://www.geeksforgeeks.org/break-list-chunks-size-n-python/

    Args:
        l (list): The list to chunk
        n (int): the max chunk size

    Yields:
        List[any]
    """
    for i in range(0, len(lst), n):
        yield lst[i : i + n]


def get_moxfield_deck(url: str) -> dict:
    """Retrieve a deck from moxfield

    Args:
        url (str)

    Raises:
        ValueError: Malformed URL

    Returns:
        dict
    """
    parsed = urlparse(url)

    try:
        deck_id = parsed.path.split("/")[-1]
    except IndexError:
        raise ValueError("Invalid or malformed URL supplied.")

    resp = requests.get(MOXFIELD_BASE_URL.format(deck_id)).json()
    return {
        "meta": {
            "name": resp.get("name"),
            "author": resp["createdByUser"]["userName"],
            "url": url,
            "colors": [x.lower() for x in resp["main"]["colors"]],
        },
        "cards": list(
            set(
                [
                    resp["main"]["name"],
                    *resp["mainboard"].keys(),
                    *resp["sideboard"].keys(),
                ]
            )
        ),
    }


def get_goldfish_deck(url: str) -> dict:
    """Retrieve an mtggoldfish deck

    Args:
        url (str)

    Raises:
        ValueError: On malformed URL

    Returns:
        dict
    """
    parsed = urlparse(url)
    download_url = "https://www.mtggoldfish.com/deck/download/{}"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36",
        "Accept": "text/html",
        "Accept-Language": "en-US",
    }
    try:
        deck_id = parsed.path.split("/")[-1]
    except IndexError:
        raise ValueError("Invalid or malformed URL supplied.")

    soup = BeautifulSoup(requests.get(url, headers=headers).text, "lxml")
    author = soup.span.text[3:]
    title = soup.title.text.split("by ")[0]
    resp = requests.get(download_url.format(deck_id)).text
    cards = list(set([re.findall("\D+", x)[0].strip() for x in resp.split("\n") if x]))

    return {
        "meta": {"name": title, "author": author, "url": url, "colors": []},
        "cards": cards,
    }


def get_archidekt_deck(url: str) -> dict:
    """Retrieve an archidekt deck

    Args:
        url (str)

    Raises:
        RequestException

    Returns:
        dict
    """
    parsed = urlparse(url)
    id = parsed.path.split("/")[-1]
    url = "https://archidekt.com/api/decks/{}/small/".format(id)
    resp = requests.get(url)
    resp.raise_for_status()
    data = resp.json()

    author = data["owner"]["username"]
    title = data["name"]
    cards = set([x["card"]["oracleCard"]["name"] for x in data["cards"]])
    colors = []
    for card in data["cards"]:
        colors.extend(card["card"]["oracleCard"]["colorIdentity"])

    return {
        "meta": {
            "name": title,
            "author": author,
            "url": url,
            "colors": list(set(COLOR_MAP[x.lower()] for x in colors)),
        },
        "cards": list(cards),
    }


PartialCard = TypedDict("PartialCard", {"name": str, "in_deck": str})


@backoff.on_exception(backoff.expo, requests.RequestException, max_tries=3)
def scryfall_request(card_list_chunk: List[PartialCard]) -> Dict[str, str]:
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
        json={"identifiers": [{"name": x["name"]} for x in card_list_chunk]},
    )
    data = resp.json()["data"]
    for card in data:
        if "image_uris" not in card:
            continue
        in_deck = False
        with contextlib.suppress(IndexError):
            in_deck = [c for c in card_list_chunk if c["name"] == card["name"]][0].get(
                "in_deck", False
            )
        ret.append(
            {
                "name": card["name"],
                "image": card["image_uris"]["normal"],
                "id": card["id"],
                "oracle_text": card["oracle_text"],
                "in_deck": in_deck,
            }
        )

    return ret


def get_scryfall_cards(
    main_card_list: List[PartialCard],
) -> Dict[Literal["id", "oracle_text", "name", "image"], str]:
    # Respect scryfall API
    card_chunks = list(chunk_array(main_card_list, 75))
    ret = []
    for chunk in card_chunks:
        ret.extend(scryfall_request(chunk))

    return ret
