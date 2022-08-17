import re
from bs4 import BeautifulSoup
import pandas as pd
import requests
from urllib.parse import urlparse
from typing import List, Set

COMBO_DATA_URL = "https://commanderspellbook.com/api/combo-data.json"
MOXFIELD_BASE_URL = "https://api.moxfield.com/v2/decks/all/{}"


def find_matches(data: List[dict], to_match: Set[str]) -> List[dict]:
    """Finds combos in a given decklist based on card names

    Args:
        data (List[dict])
        to_match (Set[str])

    Returns:
        List[dict]: List of combos
    """
    db = pd.DataFrame(data)
    return db[db["c"].apply(lambda x: set(x).issubset(to_match))].to_dict("records")


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
        "meta": {"name": resp.get("name"), "author": resp["createdByUser"]["userName"], "url": url},
        "cards": set([resp["main"]["name"], *resp["mainboard"].keys(), *resp["sideboard"].keys()]),
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
    cards = set([re.findall("\D+", x)[0].strip() for x in resp.split("\n") if x])

    return {"meta": {"name": title, "author": author, "url": url}, "cards": cards}


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

    return {"meta": {"name": title, "author": author, "url": url}, "cards": cards}


def get_combo_data():
    """Retrieve combo data from commanders spellbook

    Returns:
        dict
    """
    return requests.get(COMBO_DATA_URL).json()
