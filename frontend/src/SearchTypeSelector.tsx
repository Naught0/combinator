import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";

export enum SearchType {
  DECK,
  USER,
}
interface Props {
  searchType: SearchType;
  setSearchType: (type: SearchType) => void;
}
export const SearchTypeSelector: FC<Props> = ({
  searchType,
  setSearchType,
}) => {
  return (
    <>
      <p>Search for a...</p>
      <div className="tabs is-toggle">
        <div className="buttons has-addons">
          <button
            className={`button ${searchType === SearchType.USER ? "is-primary" : "is-inverted is-dark"}`}
            onClick={() => setSearchType(SearchType.USER)}
          >
            User
          </button>
          <button
            className={`button ${searchType === SearchType.DECK ? "is-primary" : "is-inverted is-dark"}`}
            onClick={() => setSearchType(SearchType.DECK)}
          >
            Deck
          </button>
        </div>
      </div>
    </>
  );
};
