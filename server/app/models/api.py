from pydantic import BaseModel, Field


class UserSearchRequest(BaseModel):
    user_name: str = Field(..., alias="userName")

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


class Deck(BaseModel):
    meta: DeckMeta
    cards: list[str]
