import { FC } from "react";

export enum SearchType {
  DECK = "DECK",
  PASTE = "PASTE",
  // USER = "USER",
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
      <p className="text-lg mb-2">Paste a...</p>
      <div className="tabs is-toggle">
        <div className="buttons has-addons">
          <button
            className={`button ${
              searchType === SearchType.PASTE
                ? "is-primary"
                : "is-inverted is-dark"
            }`}
            onClick={() => setSearchType(SearchType.PASTE)}
          >
            List
          </button>
          <button
            className={`button ${
              searchType === SearchType.DECK
                ? "is-primary"
                : "is-inverted is-dark"
            }`}
            onClick={() => setSearchType(SearchType.DECK)}
          >
            URL
          </button>
        </div>
      </div>
    </>
  );
};
