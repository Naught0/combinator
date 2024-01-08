import requests


def get_moxfield_user_decks(user_name: str):
    decks = []

    page = 1
    while True:
        resp = requests.get(
            f"https://api2.moxfield.com/v2/users/{user_name}/decks?pageNumber={page}&pageSize=100",
            headers={"Content-Type": "application/json"},
        )
        data = resp.json()
        page += 1

        if data["totalResults"] == 0:
            raise ValueError(f"User {user_name} does not have any decks")

        decks.extend(data["data"])

        if page >= data["totalPages"]:
            break

    return decks
