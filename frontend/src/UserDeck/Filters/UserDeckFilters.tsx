import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";
import { Dropdown } from "../../Dropdown/Dropdown";
import { dumbTitalize } from "../../util";
import { SortDirection, sortDirIconMap } from "../UserDecksContainer";
import {
  deckFilters,
  deckLegalityMap,
  uniqueDeckFormatMap,
} from "./deckFilters";

export interface UserDeckFilterProps {
  setSortBy: (k: keyof Deck) => void;
  setSortDir: (k: SortDirection) => void;
  setFormatFilter: (key: Format | undefined) => void;
  resetFilters: () => void;
  setTitleFilter: (s: string) => void;
  setPageSize: (size: number) => void;
  setIsLegal: (isLegal: boolean | null) => void;
  formats: Format[];
  formatFilter?: Format;
  titleFilter?: string;
  pageSize: number;
  sortDirection: SortDirection;
  sortBy: string;
  isLegal: boolean | null;
}
export const UserDeckFilters: FC<UserDeckFilterProps> = ({
  titleFilter,
  sortDirection,
  sortBy,
  formatFilter,
  pageSize,
  formats,
  isLegal,
  setSortBy,
  setTitleFilter,
  setFormatFilter,
  setSortDir,
  setPageSize,
  setIsLegal,
  resetFilters,
}) => {
  return (
    <>
      <div
        className="is-flex is-flex-direction-row is-flex-wrap-wrap is-align-items-baseline mb-3 is-justify-content-flex-start"
        style={{ gap: "0.75rem" }}
      >
        <div className="field mb-0">
          <div className="control has-icons-right">
            <input
              type="text"
              className="input"
              placeholder="Filter decks by title"
              value={titleFilter}
              onInput={(e) =>
                setTitleFilter((e.target as HTMLInputElement).value)
              }
            />
            {!!titleFilter && (
              <span
                className="icon is-small is-right is-clickable"
                onClick={() => {
                  setTitleFilter("");
                }}
              >
                <FontAwesomeIcon icon={faXmarkCircle} />
              </span>
            )}
          </div>
        </div>
        <Dropdown
          title={`Format: ${formatFilter
              ? uniqueDeckFormatMap.get(formatFilter) ||
              dumbTitalize({ text: formatFilter })
              : "Any"
            }`}
        >
          <a
            className={`dropdown-item ${formatFilter === undefined ? "is-active" : ""
              }`}
            onClick={() => setFormatFilter(undefined)}
          >
            Any
          </a>
          {formats.map((fmt) => (
            <a
              key={fmt}
              className={`dropdown-item ${formatFilter === fmt ? "is-active" : ""
                }`}
              onClick={() => setFormatFilter(fmt as Format)}
            >
              {uniqueDeckFormatMap.get(fmt) || dumbTitalize({ text: fmt })}
            </a>
          ))}
        </Dropdown>
        <div>
          <Dropdown
            title={
              <>
                <span>Is legal: </span>
                <span className={deckLegalityMap.get(isLegal)?.className}>
                  {deckLegalityMap.get(isLegal)?.display}
                </span>
              </>
            }
          >
            {[
              deckLegalityMap.get(null),
              deckLegalityMap.get(true),
              deckLegalityMap.get(false),
            ].map(
              (legality) =>
                legality && (
                  <a
                    className={`dropdown-item ${legality.className} ${isLegal === legality.value ? "is-active" : ""
                      }`}
                    onClick={() => setIsLegal(legality.value)}
                    key={legality.display}
                  >
                    {legality.display}
                  </a>
                ),
            )}
          </Dropdown>
        </div>
        <div className="is-flex" style={{ gap: "0" }}>
          <Dropdown
            title={`Sort by: ${deckFilters.find((f) => f.key === sortBy)
              ?.display}`}
          >
            {deckFilters.map((s) => (
              <a
                className={`dropdown-item ${s.key === sortBy ? "is-active" : ""
                  }`}
                key={s.key}
                onClick={() => setSortBy(s.key)}
              >
                {s.display}
              </a>
            ))}
          </Dropdown>
          <div style={{ marginLeft: "-1px" }}>
            <button
              className="button"
              onClick={() =>
                setSortDir(
                  sortDirection === SortDirection.ASC
                    ? SortDirection.DESC
                    : SortDirection.ASC,
                )
              }
            >
              <span className="icon">{sortDirIconMap.get(sortDirection)}</span>
              <span>{sortDirection.toString()}</span>
            </button>
          </div>
        </div>
        <Dropdown title={`Page size: ${pageSize}`}>
          {[5, 10, 20, 50, 100].map((num) => (
            <a
              className={`dropdown-item ${pageSize === num ? "is-active" : ""}`}
              onClick={() => setPageSize(num)}
              key={num}
            >
              {num}
            </a>
          ))}
        </Dropdown>
      </div>
    </>
  );
};
