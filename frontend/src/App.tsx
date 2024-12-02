import "@fontsource-variable/inter";
import "@fontsource-variable/josefin-sans";
import { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { Footer } from "./Footer";
import MoxfieldSearch from "./MoxfieldSearch";
import Nav from "./Nav";
import { PasteList } from "./PasteList";
import { SearchType, SearchTypeSelector } from "./SearchTypeSelector";
import { PasteDeckUrl } from "./PasteDeckUrl";
import { Outlet } from "react-router";

export const App = () => {
  const [searchType, setSearchType] = useState(
    (localStorage.getItem("searchType") as SearchType) ||
      SearchType.MOXFIELD_USER,
  );

  const saveSearchType = (type: SearchType) => {
    localStorage.setItem("searchType", type);
    setSearchType(type);
  };

  return (
    <main className="flex h-full w-full flex-col items-center bg-zinc-800 px-3 py-6 text-zinc-100">
      <ToastContainer theme="dark" />
      <div className="flex min-h-screen w-full flex-col items-center gap-6 md:max-w-screen-lg md:gap-12 xl:max-w-screen-lg">
        <Nav />
        <div className="flex w-full flex-col gap-3">
          <SearchTypeSelector
            searchType={searchType}
            setSearchType={saveSearchType}
          />
          <div className="flex w-full flex-col gap-3">
            {searchType === SearchType.MOXFIELD_USER && <MoxfieldSearch />}
            {searchType === SearchType.DECK && <PasteDeckUrl />}
            {searchType === SearchType.PASTE && <PasteList />}
          </div>
          <Outlet />
        </div>
      </div>
      <Footer />
    </main>
  );
};
