import { FC } from "react";
import { Button } from "./components/ui/button";
import { MoxfieldLogo } from "./components/MoxfieldLogo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faList } from "@fortawesome/free-solid-svg-icons";

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
    <div className="flex flex-col justify-start gap-0.5 sm:flex-row sm:gap-2">
      <Button
        variant={buttonVariant(searchType, SearchType.MOXFIELD_USER)}
        className="flex items-center justify-center"
        onClick={() => setSearchType(SearchType.MOXFIELD_USER)}
      >
        <MoxfieldLogo className="rounded-full bg-white/20" />
        <span>Moxfield User</span>
      </Button>
      <Button
        variant={buttonVariant(searchType, SearchType.DECK)}
        onClick={() => setSearchType(SearchType.DECK)}
      >
        <FontAwesomeIcon icon={faLink} />
        Deck URL
      </Button>
      <Button
        variant={buttonVariant(searchType, SearchType.PASTE)}
        onClick={() => setSearchType(SearchType.PASTE)}
      >
        <FontAwesomeIcon icon={faList} />
        Card List
      </Button>
    </div>
  );
};
