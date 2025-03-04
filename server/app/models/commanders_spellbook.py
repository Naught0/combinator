from __future__ import annotations

from typing import Any, List
from uuid import UUID

from pydantic import BaseModel, Field, computed_field, model_serializer


class IncludeOrOf(BaseModel):
    id: int | None


class Card(BaseModel):
    id: int | None
    name: str | None
    spoiler: bool | None
    oracleId: UUID | None


class Use(BaseModel):
    card: Card | None
    quantity: int | None
    zoneLocations: List[str] | None
    exileCardState: str | None
    mustBeCommander: bool | None
    libraryCardState: str | None
    graveyardCardState: str | None
    battlefieldCardState: str | None


class Prices(BaseModel):
    tcgplayer: str | None
    cardmarket: str | None
    cardkingdom: str | None


class Feature(BaseModel):
    id: int | None
    name: str | None
    uncountable: bool | None


class Produce(BaseModel):
    feature: Feature | None
    quantity: int | None


class Template(BaseModel):
    id: int | None
    name: str | None
    scryfallApi: str | None
    scryfallQuery: str | None


class Require(BaseModel):
    quantity: int | None
    template: Template | None
    zoneLocations: List[str] | None
    exileCardState: str | None
    mustBeCommander: bool | None
    libraryCardState: str | None
    graveyardCardState: str | None
    battlefieldCardState: str | None


class Legalities(BaseModel):
    brawl: bool | None
    predh: bool | None
    legacy: bool | None
    modern: bool | None
    pauper: bool | None
    pioneer: bool | None
    vintage: bool | None
    standard: bool | None
    commander: bool | None
    oathbreaker: bool | None
    pauperCommander: bool | None
    pauperCommanderMain: bool | None


class IncludedOrAlmostIncludedOrAlmostIncludedByAddingColor(BaseModel):
    id: str | None
    of: List[IncludeOrOf] | None
    uses: List[Use] | None
    notes: str | None
    prices: Prices | None
    status: str | None
    spoiler: bool | None
    identity: str | None
    includes: List[IncludeOrOf] | None
    produces: List[Produce] | None
    requires: List[Require] | None
    legalities: Legalities | None
    popularity: int | None
    description: str | None
    manaNeeded: str | None
    variantCount: int | None
    manaValueNeeded: int | None
    notablePrerequisites: str = Field(exclude=True)
    easyPrerequisites: str = Field(exclude=True)

    @computed_field
    @property
    def otherPrerequisites(self) -> str:
        return f"{self.notablePrerequisites}\n{self.easyPrerequisites}"


class Results(BaseModel):
    identity: str
    included: List[IncludedOrAlmostIncludedOrAlmostIncludedByAddingColor]
    includedByChangingCommanders: List[Any]
    almostIncluded: List[IncludedOrAlmostIncludedOrAlmostIncludedByAddingColor]
    almostIncludedByAddingColors: List[
        IncludedOrAlmostIncludedOrAlmostIncludedByAddingColor
    ]
    almostIncludedByChangingCommanders: List[Any]
    almostIncludedByAddingColorsAndChangingCommanders: List[Any]


class SearchResponse(BaseModel):
    count: int | None
    next: None
    previous: None
    results: Results | None
