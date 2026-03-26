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
    <div>
      <SearchTypeSelector
        searchType={searchType}
        setSearchType={saveSearchType}
      />
      <div className="flex w-full flex-col gap-3 rounded-lg rounded-tl-none border border-zinc-700 bg-zinc-800 px-4 py-3 lg:max-w-screen-sm">
        <p className="text-lg">Paste a...</p>
        <div className="flex w-full flex-col gap-3">
          {searchType === SearchType.MOXFIELD_USER && <MoxfieldSearch />}
          {searchType === SearchType.DECK && <PasteDeckUrl />}
          {searchType === SearchType.PASTE && <PasteList />}
        </div>
      </div>
    </div>
  );
}
