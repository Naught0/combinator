from typing import Literal

from pydantic import BaseModel, Field


class Card(BaseModel):
    card: str
    quantity: int


class ComboSearchPayload(BaseModel):
    main: list[Card]
    commanders: list[Card]


class DeckMeta(BaseModel):
    name: str
    author: str
    url: str
    colors: list[str]


Source = Literal["archidekt", "moxfield", "mtggoldfish"]


class Deck(BaseModel):
    source: Source
    id: str
    meta: DeckMeta
    cards: list[str]


class CardSearchPayload(BaseModel):
    cards: list[str]


class ScryfallCard(BaseModel):
    id: str
    oracle_text: str
    name: str
    image: str
    type: str


class ScryfallCardResponse(BaseModel):
    cards: list[ScryfallCard]


class DeckResponse(Deck):
    cards: list[ScryfallCard]
