import { Input } from "@/components/ui/input";
import "@fontsource-variable/inter";
import "@fontsource-variable/josefin-sans";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { ComboContainer } from "./ComboContainer";
import { Footer } from "./Footer";
import { useComboData } from "./hooks/useComboData";
import MoxfieldSearch from "./MoxfieldSearch";
import Nav from "./Nav";
import { PasteList } from "./PasteList";
import { SearchType, SearchTypeSelector } from "./SearchTypeSelector";

export const App = () => {
  const [deckUrl, setDeckUrl] = useState("");
  const [searchType, setSearchType] = useState(SearchType.MOXFIELD_USER);
  const { comboData, errorMessage: comboError, getUrl } = useComboData();

  useEffect(function consumeUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const url = params.get("deck_url");
    const searchType = localStorage.getItem("searchType");
    if (url) {
      setDeckUrl(url);
      setSearchType(SearchType.DECK);
    }

    if (searchType) {
      setSearchType(SearchType[searchType as SearchType]);
    }
  }, []);

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
          <div className="flex max-w-96 flex-col gap-3">
            {searchType === SearchType.PASTE && <PasteList />}
            {searchType === SearchType.DECK && (
              <>
                <Input
                  type="text"
                  className={`w-full rounded border border-zinc-500 bg-transparent px-3 py-2 ${comboError ? "is-danger" : ""}`}
                  placeholder="Moxfield, Archidekt, or MTGGoldfish deck URL"
                  onInput={(e) => {
                    setDeckUrl((e.target as HTMLInputElement).value);
                  }}
                  value={deckUrl}
                />
                {comboError && (
                  <p className="has-text-danger help">{comboError}</p>
                )}
              </>
            )}
            {searchType === SearchType.MOXFIELD_USER && <MoxfieldSearch />}
          </div>
          {comboData && searchType !== SearchType.MOXFIELD_USER && (
            <ComboContainer />
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
};
