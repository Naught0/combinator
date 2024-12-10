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
    <div className="flex flex-col gap-3">
      <SearchTypeSelector
        searchType={searchType}
        setSearchType={saveSearchType}
      />
      <div className="flex w-full flex-col gap-3">
        {searchType === SearchType.MOXFIELD_USER && <MoxfieldSearch />}
        {searchType === SearchType.DECK && <PasteDeckUrl />}
        {searchType === SearchType.PASTE && <PasteList />}
      </div>
    </div>
  );
}
