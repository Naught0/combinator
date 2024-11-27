import { FC } from "react";

export enum SearchType {
  DECK = "DECK",
  PASTE = "PASTE",
  MOXFIELD_USER = "MOXFIELD_USER",
}
interface Props {
  searchType: SearchType;
  setSearchType: (type: SearchType) => void;
}

const buttonClassName = (type: SearchType, currentType: SearchType) => {
  const base = "button";
  if (type === currentType) {
    return `${base} is-primary`;
  }
  return `${base} is-dark is-inverted`;
};
export const SearchTypeSelector: FC<Props> = ({
  searchType,
  setSearchType,
}) => {
  return (
    <>
      <p className="text-lg mb-2">Paste a...</p>
      <div className="tabs is-toggle">
        <div className="flex flex-row gap-2">
          <button
            onClick={() => setSearchType(SearchType.MOXFIELD_USER)}
            className={buttonClassName(searchType, SearchType.MOXFIELD_USER)}
          >
            Moxfield user
          </button>
          <button
            className={buttonClassName(searchType, SearchType.DECK)}
            onClick={() => setSearchType(SearchType.DECK)}
          >
            Deck URL
          </button>
          <button
            className={buttonClassName(searchType, SearchType.PASTE)}
            onClick={() => setSearchType(SearchType.PASTE)}
          >
            Card List
          </button>
        </div>
      </div>
    </>
  );
};
