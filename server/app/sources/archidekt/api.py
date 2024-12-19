from pyrchidekt.api import getDeckById

from app.const import COLOR_MAP
from app.models.api import Deck


def get_archidekt_deck(deck_id: str) -> Deck:
    data = getDeckById(deck_id)
    author = data.owner.username
    title = data.name
    cards = set([x.card.oracle_card.name for x in data.cards])
    colors = []
    for card in data.cards:
        colors.extend(card.card.oracle_card.color_identity)

    return Deck(
        id=deck_id,
        source="archidekt",
        meta={
            "name": title,
            "author": author,
            "url": f"https://archidekt.com/decks/{deck_id}",
            "colors": list(set(COLOR_MAP[x.lower()] for x in colors)),
        },
        cards=list(cards),
    )
