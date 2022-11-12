import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";
import { Dropdown } from "./Dropdown";
import { SortDirection, sortDirIconMap } from "./UserDecksContainer";

interface Props {
  setSortBy: (k: keyof Deck) => void;
  setSortDir: (k: SortDirection) => void;
  titleFilter?: string;
  sortDirection: SortDirection;
  setFormatFilter: (key: string) => void;
  resetFilters: () => void;
  setTitleFilter: (s: string) => void;
}
export const UserDeckFilters: FC<Props> = ({
  titleFilter,
  sortDirection,
  setSortBy,
  setTitleFilter,
  setFormatFilter,
  setSortDir,
  resetFilters,
}) => {
  return (
    <>
      <div
        className="is-flex is-flex-direction-row is-flex-wrap-wrap is-align-items-baseline"
        style={{ gap: "0.75rem" }}
      >
        <div className="field">
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
        <div className="level">
          <div className="level-item">
            <div className="field is-horizontal">
              <div className="control">
                <Dropdown title={"Sort by"} hoverable>
                  {["lastUpdatedAtUtc", "createdAtUtc"].map((s) => (
                    <a
                      className="dropdown-item"
                      key={`dropdown-sort-opt-${s}`}
                      onClick={() => setSortBy(s as keyof Deck)}
                    >
                      {s}
                    </a>
                  ))}
                </Dropdown>
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
                  <span className="icon">
                    {sortDirIconMap.get(sortDirection)}
                  </span>
                  <span>{sortDirection.toString()}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
