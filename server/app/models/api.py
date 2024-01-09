from pydantic import BaseModel, Field


class UserSearchRequest(BaseModel):
    user_name: str = Field(..., alias="userName")


class ComboSearchPayload(BaseModel):
    main: list[str]
    commanders: list[str]


class DeckMeta(BaseModel):
    name: str
    author: str
    url: str
    colors: list[str]


class Deck(BaseModel):
    meta: DeckMeta
    cards: list[str]
