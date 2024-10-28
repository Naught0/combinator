from __future__ import annotations

from pydantic import BaseModel
from typing import List, Any
from uuid import UUID

class IncludeOrOf(BaseModel):
    id: int

class Card(BaseModel):
    id: int
    name: str
    spoiler: bool
    oracleId: UUID

class Use(BaseModel):
    card: Card
    quantity: int
    zoneLocations: List[str]
    exileCardState: str
    mustBeCommander: bool
    libraryCardState: str
    graveyardCardState: str
    battlefieldCardState: str

class Prices(BaseModel):
    tcgplayer: str
    cardmarket: str
    cardkingdom: str

class Feature(BaseModel):
    id: int
    name: str
    uncountable: bool

class Produce(BaseModel):
    feature: Feature
    quantity: int

class Template(BaseModel):
    id: int
    name: str
    scryfallApi: str
    scryfallQuery: str

class Require(BaseModel):
    quantity: int
    template: Template
    zoneLocations: List[str]
    exileCardState: str
    mustBeCommander: bool
    libraryCardState: str
    graveyardCardState: str
    battlefieldCardState: str

class Legalities(BaseModel):
    brawl: bool
    predh: bool
    legacy: bool
    modern: bool
    pauper: bool
    pioneer: bool
    vintage: bool
    standard: bool
    commander: bool
    oathbreaker: bool
    pauperCommander: bool
    pauperCommanderMain: bool

class IncludedOrAlmostIncludedOrAlmostIncludedByAddingColor(BaseModel):
    id: str
    of: List[IncludeOrOf]
    uses: List[Use]
    notes: str
    prices: Prices
    status: str
    spoiler: bool
    identity: str
    includes: List[IncludeOrOf]
    produces: List[Produce]
    requires: List[Require]
    legalities: Legalities
    popularity: int
    description: str
    manaNeeded: str
    variantCount: int
    manaValueNeeded: int
    otherPrerequisites: str

class Results(BaseModel):
    identity: str
    included: List[IncludedOrAlmostIncludedOrAlmostIncludedByAddingColor]
    includedByChangingCommanders: List[Any]
    almostIncluded: List[IncludedOrAlmostIncludedOrAlmostIncludedByAddingColor]
    almostIncludedByAddingColors: List[IncludedOrAlmostIncludedOrAlmostIncludedByAddingColor]
    almostIncludedByChangingCommanders: List[Any]
    almostIncludedByAddingColorsAndChangingCommanders: List[Any]

class SearchResponse(BaseModel):
    count: int
    next: None
    previous: None
    results: Results
