import re

import requests
from bs4 import BeautifulSoup

from app.models.api import Deck


DECK_URL = "https://www.mtggoldfish.com/deck/{}"
ARCHETYPE_URL = "https://www.mtggoldfish.com/archetype/{}"
DOWNLOAD_URL = "https://www.mtggoldfish.com/deck/download/{}"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.84 Safari/537.36",
    "Accept": "text/html",
    "Accept-Language": "en-US",
}


def get_goldfish_deck(deck_id: str) -> Deck:
    url = ARCHETYPE_URL.format(deck_id) if not deck_id.isdigit() else DECK_URL.format(deck_id)
    resp = requests.get(url, headers=HEADERS)
    if resp.status_code != 200:
        raise ValueError(f"MTGGoldfish deck not found for id: {deck_id}")

    soup = BeautifulSoup(resp.text, "lxml")
    download_link = soup.find("a", href=re.compile(r"/deck/download/\d+"))
    if download_link is None:
        raise ValueError(f"Could not find deck list on MTGGoldfish page: {url}")
    numeric_id = re.search(r"/deck/download/(\d+)", download_link["href"]).group(1)

    author = soup.span.text[3:]
    title = soup.title.text.split("by ")[0]
    download_resp = requests.get(DOWNLOAD_URL.format(numeric_id)).text
    cards = list(set([re.findall(r"\D+", x)[0].strip() for x in download_resp.split("\n") if x]))

    return Deck(
        id=deck_id,
        source="mtggoldfish",
        meta={"name": title, "author": author, "url": url, "colors": []},
        cards=cards,
    )
