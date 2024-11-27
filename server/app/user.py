import requests

from app.const import USER_AGENT
from app.models.moxfield import MoxfieldDeck, UserDecksResponse


class MoxfieldError(Exception):
    pass


class NoDecksFoundError(MoxfieldError):
    pass


def get_moxfield_user_decks(user_name: str) -> list[MoxfieldDeck]:
    decks = []

    page = 1
    while True:
        resp = requests.get(
            f"https://api2.moxfield.com/v2/users/{user_name}/decks",
            params={"pageNumber": page, "pageSize": 50},
            headers={
                "Content-Type": "application/json",
                "User-Agent": USER_AGENT,
            },
        )
        data = UserDecksResponse(**resp.json())
        page += 1

        if data.total_results == 0:
            raise NoDecksFoundError(f"User {user_name} does not have any decks")

        decks.extend(data.data)

        if page >= data.total_pages:
            break

    return decks
