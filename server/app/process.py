from app.models.api import Source
from app.sources.archidekt.api import get_archidekt_deck
from app.sources.moxfield.api import get_moxfield_deck
from app.sources.mtggoldfish.api import get_goldfish_deck
from app.sources.scryfall.api import get_scryfall_cards


def get_deck(source: Source, deck_id: str):
    deck = None
    if source == "moxfield":
        deck = get_moxfield_deck(deck_id)
    if source == "mtggoldfish":
        deck = get_goldfish_deck(deck_id)
    if source == "archidekt":
        deck = get_archidekt_deck(deck_id)

    if deck is None:
        raise ValueError(f"Unknown source: {source}")

    deck.cards = get_scryfall_cards(deck.cards)

    return deck
