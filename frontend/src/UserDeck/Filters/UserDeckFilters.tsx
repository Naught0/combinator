import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";
import { Dropdown } from "../../Dropdown/Dropdown";
import { SortDirection, sortDirIconMap } from "../UserDecksContainer";
import { deckFilters } from "./deckFilters";

interface Props {
  setSortBy: (k: keyof Deck) => void;
  setSortDir: (k: SortDirection) => void;
  setFormatFilter: (key: Legality) => void;
  resetFilters: () => void;
  setTitleFilter: (s: string) => void;
  titleFilter?: string;
  sortDirection: SortDirection;
  sortBy: string;
}
export const UserDeckFilters: FC<Props> = ({
  titleFilter,
  sortDirection,
  sortBy,
  setSortBy,
  setTitleFilter,
  setFormatFilter,
  setSortDir,
  resetFilters,
}) => {
  return (
    <>
      <div
        className="is-flex is-flex-direction-row is-flex-wrap-wrap is-align-items-baseline my-3"
        style={{ gap: "0.75rem" }}
      >
        <div className="field" style={{ flexBasis: "50%" }}>
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
          title={`Sort by: ${
            deckFilters.find((f) => f.key === sortBy)?.display
          }`}
          hoverable
        >
          {deckFilters.map((s) => (
            <a
              className="dropdown-item"
              key={`dropdown-sort-opt-${s.key}`}
              onClick={() => setSortBy(s.key)}
            >
              {s.display}
            </a>
          ))}
        </Dropdown>
        <div>
          <button
            className="button"
            onClick={() =>
              setSortDir(
                sortDirection === SortDirection.ASC
                  ? SortDirection.DESC
                  : SortDirection.ASC
              )
            }
          >
            <span className="icon">{sortDirIconMap.get(sortDirection)}</span>
            <span>{sortDirection.toString()}</span>
          </button>
        </div>
      </div>
    </>
  );
};
