from __future__ import annotations

from typing import Any, TypedDict
from uuid import UUID


class SearchResponse(TypedDict):
    count: int
    next: None
    previous: None
    results: Results


class Results(TypedDict):
    identity: str
    included: list[AlmostIncluded]
    includedByChangingCommanders: list[Any]
    almostIncluded: list[AlmostIncluded]
    almostIncludedByAddingColors: list[AlmostIncluded]
    almostIncludedByChangingCommanders: list[AlmostIncluded]
    almostIncludedByAddingColorsAndChangingCommanders: list[AlmostIncluded]


class AlmostIncluded(TypedDict):
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
    popularity: int
    spoiler: bool
    legalities: Legalities
    prices: Prices


class Use(TypedDict):
    card: Card
    zoneLocations: list[str]
    battlefieldCardState: str
    exileCardState: str
    libraryCardState: str
    graveyardCardState: str
    mustBeCommander: bool


class Card(TypedDict):
    id: int
    name: str
    oracleId: UUID
    spoiler: bool


class Produce(TypedDict):
    id: int
    name: str
    description: str


class IncludeOrOf(TypedDict):
    id: int


class Legalities(TypedDict):
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


class Prices(TypedDict):
    tcgplayer: str
    cardkingdom: str
    cardmarket: str
