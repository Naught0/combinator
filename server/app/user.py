import requests

from app.const import USER_AGENT
from app.models.moxfield import UserDecksResponse


class MoxfieldError(Exception):
    pass


class NoDecksFoundError(MoxfieldError):
    pass


def get_moxfield_user_decks(user_name: str, page: int | None = None, page_size: int | None = None):
    resp = requests.get(
        f"https://api2.moxfield.com/v2/users/{user_name}/decks",
        params={"pageNumber": page, "pageSize": page_size},
        headers={
            "Content-Type": "application/json",
            "User-Agent": USER_AGENT,
        },
    )
    data = UserDecksResponse(**resp.json())
    page += 1

    if data.total_results == 0:
        if page == 1:
            raise NoDecksFoundError(f"User {user_name} does not have any decks")

        raise NoDecksFoundError()

    return data.data

