from __future__ import annotations

from typing import List, Optional

from pydantic import BaseModel, Field, field_serializer


class User(BaseModel):
    user_name: str = Field(..., alias="userName")
    display_name: str = Field(..., alias="displayName")
    badges: List


class ColorPercentages(BaseModel):
    white: float
    blue: float
    black: float
    red: float
    green: float


class ColorIdentityPercentages(BaseModel):
    white: float
    blue: float
    black: float
    red: float
    green: float


class MoxfieldDeck(BaseModel):
    id: str
    name: str
    has_primer: bool = Field(..., alias="hasPrimer")
    format: str
    are_comments_enabled: bool = Field(..., alias="areCommentsEnabled")
    visibility: str
    public_url: str = Field(..., alias="publicUrl")
    public_id: str = Field(..., alias="publicId")
    like_count: int = Field(..., alias="likeCount")
    view_count: int = Field(..., alias="viewCount")
    comment_count: int = Field(..., alias="commentCount")
    is_legal: bool = Field(..., alias="isLegal")
    authors_can_edit: bool = Field(..., alias="authorsCanEdit")
    is_shared: bool = Field(..., alias="isShared")
    main_card_id: Optional[str] = Field(None, alias="mainCardId")
    main_card_id_is_card_face: bool = Field(..., alias="mainCardIdIsCardFace")
    main_card_id_is_back_face: bool = Field(..., alias="mainCardIdIsBackFace")
    created_by_user: User = Field(..., alias="createdByUser")
    authors: List[User]
    created_at_utc: str = Field(..., alias="createdAtUtc")
    last_updated_at_utc: str = Field(..., alias="lastUpdatedAtUtc")
    mainboard_count: int = Field(..., alias="mainboardCount")
    sideboard_count: int = Field(..., alias="sideboardCount")
    maybeboard_count: int = Field(..., alias="maybeboardCount")
    hub_names: List = Field(..., alias="hubNames")
    colors: List[str]
    color_percentages: ColorPercentages = Field(..., alias="colorPercentages")
    color_identity: List[str] = Field(..., alias="colorIdentity")
    color_identity_percentages: ColorIdentityPercentages = Field(
        ..., alias="colorIdentityPercentages"
    )


class UserDecksResponse(BaseModel):
    page_number: int = Field(..., alias="pageNumber")
    page_size: int = Field(..., alias="pageSize")
    total_results: int = Field(..., alias="totalResults")
    total_pages: int = Field(..., alias="totalPages")
    data: List[MoxfieldDeck]


class MoxfieldUserSearchParams(BaseModel):
    show_illegal: Optional[bool] = Field(alias="showIllegal", default=True)
    author_user_names: List[str] = Field(alias="authorUserNames", default=None)
    page_number: Optional[int] = Field(alias="pageNumber", default=1)
    page_size: Optional[int] = Field(alias="pageSize", default=12)
    sort_type: Optional[str] = Field(alias="sortType", default=None)
    sort_direction: Optional[str] = Field(alias="sortDirection", default=None)
    board: Optional[str] = Field(alias="board", default=None)
    filter: Optional[str] = Field(alias="filter", default=None)
    fmt: Optional[str] = Field(alias="fmt", default=None)

    @field_serializer("author_user_names")
    def _user_names(self, value: list[str], *_, **__):
        return ",".join(value)

    @field_serializer("fmt")
    def _remove_any_format(self, value: str, *_, **__):
        if value == "any":
            return None
        return value
