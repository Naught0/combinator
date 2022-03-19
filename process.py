import json
import pandas as pd
import requests
from urllib.parse import urlparse
from typing import List, Set

COMBO_DATA_URL = "https://commanderspellbook.com/api/combo-data.json"
MOXFIELD_BASE_URL = "https://api.moxfield.com/v2/decks/all/{}"


def find_matches(data: List[dict], to_match: Set[str]) -> List[dict]:
    db = pd.DataFrame(data)
    return db[db["c"].apply(lambda x: set(x).issubset(to_match))].to_dict("records")


def get_moxfield_deck(url: str) -> Set[str]:
    parsed = urlparse(url)

    try:
        deck_id = parsed.path.split("/")[-1]
    except IndexError:
        raise ValueError("Invalid or malformed URL supplied.")

    resp = requests.get(MOXFIELD_BASE_URL.format(deck_id)).json()
    return {
        "meta": {"name": resp.get("name"), "author": resp["createdByUser"]["userName"]},
        "cards": set([*resp["mainboard"].keys(), *resp["sideboard"].keys()]),
    }


def get_combo_data():
    return json.load(open("data.json"))  # TODO
    # return requests.get(COMBO_DATA_URL).json()
