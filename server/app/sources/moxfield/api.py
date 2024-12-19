import requests

from app.const import USER_AGENT
from app.models.api import Deck

MOXFIELD_BASE_URL = "https://api.moxfield.com/v2/decks/all/{}"


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
