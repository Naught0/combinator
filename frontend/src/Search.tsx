import { useState } from "react";
import MoxfieldSearch from "./MoxfieldSearch";
import { PasteDeckUrl } from "./PasteDeckUrl";
import { PasteList } from "./PasteList";
import { SearchTypeSelector, SearchType } from "./SearchTypeSelector";

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
        <div className="flex w-full flex-col gap-3 rounded-lg rounded-tl-none border border-zinc-700 bg-zinc-800 px-4 py-3 lg:max-w-screen-sm">
          <div className="flex w-full flex-col gap-3">
            {searchType === SearchType.MOXFIELD_USER && <MoxfieldSearch />}
            {searchType === SearchType.DECK && <PasteDeckUrl />}
            {searchType === SearchType.PASTE && <PasteList />}
          </div>
        </div>
      </div>
      <div className="grid max-w-screen-sm gap-3 text-sm">
        <p className="text-zinc-300">
          mtgcombinator is a convenient tool that finds the combos in your
          Magic: The Gathering deck. You can browse your Moxfield decks by
          username, provide a deck URL, or even paste in a list.
        </p>
      </div>
    </div>
  );
}
