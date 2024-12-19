from collections.abc import Mapping
from typing import Literal

import backoff
import requests

from app.const import ACCEPT, USER_AGENT
from app.logs import logger
from app.util import chunk_array


@backoff.on_exception(
    backoff.expo,
    requests.RequestException,
    max_tries=3,
    giveup=lambda x: x.status_code != 429 or x.status,
)
def scryfall_request(card_names: list[str]) -> list[dict]:
    """Takes a list of card names and spits out a dict w/ images.
    Respects 429 ratelimiting

    Args:
        card_list_chunk (List[str]):

    Returns:
        Dict[str, str]: _description_
    """
    ret = []
    resp = requests.post(
        "https://api.scryfall.com/cards/collection",
        json={"identifiers": [{"name": n} for n in card_names if n]},
        headers={"User-Agent": USER_AGENT, "Accept": ACCEPT},
    )

    try:
        resp.raise_for_status()
    except requests.HTTPError:
        logger.error(
            f"Scryfall request failed with status {resp.status_code}:\n{resp.json()}"
        )
        raise

    data = resp.json()["data"]
    for card in data:
        if "oracle_text" not in card:
            logger.warning(f"Missing oracle_text for card: {card}")
        if "image_uris" not in card:
            logger.warning(f"Missing image_uris for card: {card}")
            continue

        ret.append(
            {
                "name": card["name"],
                "image": card["image_uris"]["normal"],
                "id": card["id"],
                "oracle_text": card["oracle_text"] if "oracle_text" in card else "",
                "type": card.get("type_line", ""),
            }
        )

    return ret


def get_scryfall_cards(
    card_names: list[str],
) -> list[Mapping[Literal["id", "oracle_text", "name", "type", "image"], str]]:
    # Respect scryfall API
    card_chunks = chunk_array(card_names, 75)
    ret = []
    for chunk in card_chunks:
        ret.extend(scryfall_request(chunk))

    return ret
