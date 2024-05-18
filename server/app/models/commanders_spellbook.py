from pydantic import BaseModel
from typing import Any, Optional
from uuid import UUID


class Card(BaseModel):
    id: int
    name: str
    oracleId: UUID
    spoiler: bool


class Use(BaseModel):
    card: Card
    zoneLocations: list[str]
    battlefieldCardState: str
    exileCardState: str
    libraryCardState: str
    graveyardCardState: str
    mustBeCommander: bool


class IncludeOrOf(BaseModel):
    id: int


class Produce(BaseModel):
    id: int
    name: str
    description: str


class Legalities(BaseModel):
    commander: bool
    pauperCommanderMain: bool
    pauperCommander: bool
    oathbreaker: bool
    predh: bool
    brawl: bool
    vintage: bool
    legacy: bool
    modern: bool
    pioneer: bool
    standard: bool
    pauper: bool


class Prices(BaseModel):
    tcgplayer: str
    cardkingdom: str
    cardmarket: str


class AlmostIncluded(BaseModel):
    id: str
    status: str
    uses: list[Use]
    requires: list[Any]
    produces: list[Produce]
    of: list[IncludeOrOf]
    includes: list[IncludeOrOf]
    identity: str
    manaNeeded: str
    manaValueNeeded: int
    otherPrerequisites: str
    description: str
    popularity: Optional[int]
    spoiler: bool
    legalities: Legalities
    prices: Prices


class Results(BaseModel):
    identity: str
    included: list[AlmostIncluded]
    includedByChangingCommanders: list[Any]
    almostIncluded: list[AlmostIncluded]
    almostIncludedByAddingColors: list[AlmostIncluded]
    almostIncludedByChangingCommanders: list[AlmostIncluded]
    almostIncludedByAddingColorsAndChangingCommanders: list[AlmostIncluded]


class SearchResponse(BaseModel):
    count: int
    next: str | None
    previous: str | None
    results: Results
