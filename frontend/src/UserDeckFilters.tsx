import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";
import { Dropdown } from "./Dropdown";

interface Props {
  setSortBy: (k: string) => void;
  setSortDir: (k: "ASC" | "DESC") => void;
  titleFilter?: string;
  setFormatFilter: (key: string) => void;
  resetFilters: () => void;
  setTitleFilter: (s: string) => void;
}
export const UserDeckFilters: FC<Props> = ({
  setSortBy,
  titleFilter,
  setTitleFilter,
  setFormatFilter,
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
            <Dropdown title={"Sort by"} hoverable>
              {["lastUpdatedAtUtc", "createdAtUtc"].map((s) => (
                <a
                  className="dropdown-item"
                  key={`dropdown-sort-opt-${s}`}
                  onClick={() => setSortBy(s)}
                >
                  {s}
                </a>
              ))}
            </Dropdown>
          </div>
        </div>
      </div>
    </>
  );
};
