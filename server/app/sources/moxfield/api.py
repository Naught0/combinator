import requests

from app.const import USER_AGENT
from app.models.api import Deck
from app.models.moxfield import MoxfieldUserSearchParams, UserDecksResponse

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


class MoxfieldError(Exception):
    pass


class NoDecksFoundError(MoxfieldError):
    pass


def moxfield_user_exists(user_name: str) -> bool:
    resp = requests.head(
        f"https://api2.moxfield.com/v1/users/{user_name}",
        headers={"User-Agent": USER_AGENT},
    )
    return resp.status_code == 200


def get_moxfield_user_decks(params: MoxfieldUserSearchParams):
    resp = requests.get(
        "https://api2.moxfield.com/v2/decks/search",
        params=params.model_dump(by_alias=True, exclude_none=True),
        headers={
            "Content-Type": "application/json",
            "User-Agent": USER_AGENT,
        },
    )
    data = UserDecksResponse(**resp.json())

    if data.total_results == 0:
        if params.page_number == 1:
            raise NoDecksFoundError(
                f"User {params.author_user_names} does not have any decks"
            )

        raise NoDecksFoundError()

    return data
