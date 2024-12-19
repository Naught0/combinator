import re

import requests
from bs4 import BeautifulSoup

from app.models.api import Deck


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
