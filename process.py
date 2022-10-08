import json
import re
import backoff
from bs4 import BeautifulSoup
import pandas as pd
import requests
from urllib.parse import urlparse
from typing import Dict, List, Set

COMBO_DATA_URL = "https://commanderspellbook.com/api/combo-data.json"
MOXFIELD_BASE_URL = "https://api.moxfield.com/v2/decks/all/{}"
COLOR_MAP = {"white": "w", "blue": "u", "black": "b", "red": "r", "green": "g"}


def chunk_array(l: list, n: int) -> List[List[any]]:
    """https://www.geeksforgeeks.org/break-list-chunks-size-n-python/

    Args:
        l (list): The list to chunk
        n (int): the max chunk size

    Yields:
        List[any]
    """
    for i in range(0, len(l), n):
        yield l[i : i + n]


def find_matches(data: List[dict], to_match: Set[str], identity: List[str]) -> List[dict]:
    """Finds combos in a given decklist based on card names

    Args:
        data (List[dict])
        to_match (Set[str])

    Returns:
        List[dict]: List of combos
    """
    identity = set(identity)
    db = pd.DataFrame(data)
    one_match, two_match = find_near_matches(db, to_match, identity)
    return {
        "combos": db[db["c"].apply(lambda x: set(x).issubset(to_match))].to_dict("records"),
        "one": one_match,
        "two": two_match,
    }


def find_near_matches(db: pd.DataFrame, to_match: Set[str], identity: List[str]) -> List[dict]:
    """Finds combos that are within 1-2 cards away from adding to your deck

    Args:
        db (pd.DataFrame)
        to_match (Set[str])

    Returns:
        Dict[str, List[dict]]: Dictionary of combos nearly in the deck
    """
    identity = set(identity)
    to_match = set(to_match)
    in_color = db[db["i"].apply(lambda x: set(x.split(",")) == set(identity))]
    one = in_color[db["c"].apply(lambda x: (len(set(x) & to_match) > 1) and (len(set(x) - to_match) == 1))].to_dict(
        "records"
    )
    two = in_color[db["c"].apply(lambda x: (len(set(x) & to_match) > 1) and (len(set(x) - to_match) == 2))].to_dict(
        "records"
    )

    return (one[:25], two[:25])


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
        "cards": list(set([resp["main"]["name"], *resp["mainboard"].keys(), *resp["sideboard"].keys()])),
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

    return {"meta": {"name": title, "author": author, "url": url, "colors": []}, "cards": cards}


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


def get_combo_data():
    """Retrieve combo data from commanders spellbook

    Returns:
        dict
    """
    return requests.get(COMBO_DATA_URL).json()


@backoff.on_exception(backoff.expo, requests.RequestException, max_tries=3)
def scryfall_request(card_list_chunk: List[str]) -> Dict[str, str]:
    """Takes a list of card names and spits out a dict w/ images.
    Respects 429 ratelimiting

    Args:
        card_list_chunk (List[str]):

    Returns:
        Dict[str, str]: _description_
    """
    ret = {}
    resp = requests.post(
        "https://api.scryfall.com/cards/collection", json={"identifiers": [{"name": x} for x in card_list_chunk]}
    )
    data = resp.json()["data"]
    for card in data:
        ret.update({card["name"]: card["image_uris"]["normal"]})

    return ret


def get_scryfall_images(card_names: List[str]) -> Dict[str, str]:
    """Returns images for a list of scryfall cards

    Args:
        card_names (List[str]): List of card names

    Returns:
        Dict[str, str]: {"Card name": "http://image.link"}
    """
    # Respect scryfall API
    card_chunks = list(chunk_array(card_names, 75))
    ret = {}
    for chunk in card_chunks:
        ret.update(scryfall_request(chunk))

    return ret
