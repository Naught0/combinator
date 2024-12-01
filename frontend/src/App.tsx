import { useEffect, useMemo, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { Footer } from "./Footer";
import { SearchType, SearchTypeSelector } from "./SearchTypeSelector";
import { ComboContainer } from "./ComboContainer";
import { useComboData } from "./hooks/useComboData";
import { useRecoilState } from "recoil";
import { pastedDeckListAtom } from "./atoms";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "@/components/ui/input";
import { Textarea } from "./components/ui/textarea";
import Nav from "./Nav";
import "@fontsource-variable/josefin-sans";
import "@fontsource-variable/inter";
import MoxfieldSearch from "./MoxfieldSearch";

export const App = () => {
  const [deckUrl, setDeckUrl] = useState("");
  const [pastedList, setPastedList] = useRecoilState(pastedDeckListAtom);
  const [searchType, setSearchType] = useState(SearchType.MOXFIELD_USER);
  const {
    comboData,
    errorMessage: comboError,
    getList,
    getUrl,
  } = useComboData();
  const persistList = useDebouncedCallback(() => {
    localStorage.setItem("pastedList", pastedList);
  }, 500);

  useEffect(
    function consumeUrlParams() {
      const params = new URLSearchParams(window.location.search);
      const url = params.get("deck_url");
      const pastedList = localStorage.getItem("pastedList");
      const searchType = localStorage.getItem("searchType");
      if (url) {
        setDeckUrl(url);
        setSearchType(SearchType.DECK);
      }
      if (pastedList) {
        setPastedList(pastedList);
        setSearchType(SearchType.PASTE);
      }

      if (searchType) {
        setSearchType(SearchType[searchType as SearchType]);
      }
    },
    [setPastedList],
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
          <form
            className="flex max-w-96 flex-col gap-3"
            onSubmit={async (e) => {
              e.preventDefault();
              switch (searchType) {
                case SearchType.DECK:
                  await getUrl(deckUrl);
                  break;
                case SearchType.PASTE:
                  await getList(pastedList);
                  break;
                case SearchType.MOXFIELD_USER:
                  break;
                default:
                  break;
              }
            }}
          >
            {searchType === SearchType.PASTE && (
              <div className="flex flex-grow flex-col">
                <Textarea
                  placeholder={
                    "Allowed formats:\n1x Lightning Bolt\n1 Lightning Bolt\nLightning Bolt"
                  }
                  onChange={(e) => {
                    setPastedList(e.target.value);
                    persistList();
                  }}
                  value={pastedList || ""}
                  className="h-36 max-h-[512px] min-h-36 max-w-96 rounded p-2"
                ></Textarea>
              </div>
            )}
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
          </form>
          {searchType === SearchType.MOXFIELD_USER && <MoxfieldSearch />}
          {comboData && searchType !== SearchType.MOXFIELD_USER && (
            <ComboContainer />
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
};
