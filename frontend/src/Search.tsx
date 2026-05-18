import { useState } from "react";
import MoxfieldSearch from "./MoxfieldSearch";
import { PasteDeckUrl } from "./PasteDeckUrl";
import { PasteList } from "./PasteList";
import { SearchTypeSelector, SearchType } from "./SearchTypeSelector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

function getMessage(type: SearchType) {
  switch (type) {
    case SearchType.MOXFIELD_USER:
      return "Enter your Moxfield username to browse your decks & see what combos are inside";
    case SearchType.DECK:
      return "Paste a deck url to see its combos";
    case SearchType.PASTE:
      return "Paste a list of cards to see possible combos";
    default:
      return "uh... i'd probably just refresh if i was you";
  }
}

export function Search() {
  const [searchType, setSearchType] = useState(
    (localStorage.getItem("searchType") as SearchType) ||
      SearchType.MOXFIELD_USER,
  );
  const saveSearchType = (type: SearchType) => {
    localStorage.setItem("searchType", type);
    setSearchType(type);
  };
  return (
    <div className="grid gap-2">
      <div>
        <SearchTypeSelector
          searchType={searchType}
          setSearchType={saveSearchType}
        />
        <div className="flex w-full flex-col gap-3 rounded-lg rounded-tl-none border border-zinc-700 bg-zinc-800 p-6 lg:max-w-screen-sm">
          <div className="flex w-full flex-col gap-3">
            {searchType === SearchType.MOXFIELD_USER && <MoxfieldSearch />}
            {searchType === SearchType.DECK && <PasteDeckUrl />}
            {searchType === SearchType.PASTE && <PasteList />}
          </div>
          <div className="h-[1px] w-full bg-zinc-700" />
          <article className="inline-flex items-center gap-1.5 text-sm italic text-hit-pink-50/80">
            <FontAwesomeIcon icon={faInfoCircle} />
            {getMessage(searchType)}
          </article>
        </div>
      </div>
    </div>
  );
}
