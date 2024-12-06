import { FC } from "react";
import { Button, buttonVariants } from "./components/ui/button";

export enum SearchType {
  DECK = "DECK",
  PASTE = "PASTE",
  MOXFIELD_USER = "MOXFIELD_USER",
}
interface Props {
  searchType: SearchType;
  setSearchType: (type: SearchType) => void;
}

const buttonVariant = (type: SearchType, currentType: SearchType) => {
  if (type === currentType) {
    return "activeTab";
  }
  return "tab";
};
export const SearchTypeSelector: FC<Props> = ({
  searchType,
  setSearchType,
}) => {
  return (
    <>
      <p className="text-lg">Paste a...</p>
      <div className="inline-flex flex-wrap gap-3">
        <Button
          variant={buttonVariant(searchType, SearchType.MOXFIELD_USER)}
          className="flex items-center justify-center"
          onClick={() => setSearchType(SearchType.MOXFIELD_USER)}
        >
          <span>Moxfield user</span>
        </Button>
        <Button
          variant={buttonVariant(searchType, SearchType.DECK)}
          onClick={() => setSearchType(SearchType.DECK)}
        >
          Deck URL
        </Button>
        <Button
          variant={buttonVariant(searchType, SearchType.PASTE)}
          onClick={() => setSearchType(SearchType.PASTE)}
        >
          Card list
        </Button>
      </div>
    </>
  );
};
