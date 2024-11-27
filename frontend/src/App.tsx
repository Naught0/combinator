import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { Footer } from "./Footer";
import logo from "./images/logo.svg";
import { SearchType, SearchTypeSelector } from "./SearchTypeSelector";
import { ComboContainer } from "./ComboContainer";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import "./style/rainbow-button.sass";
import { useComboData } from "./hooks/useComboData";
import { MoxfieldDeadbanner } from "./MoxfieldDeadbanner";
import { useRecoilState } from "recoil";
import { pastedDeckListAtom } from "./atoms";
import { useDebouncedCallback } from "use-debounce";

export const App = () => {
  const [deckUrl, setDeckUrl] = useState("");
  const [pastedList, setPastedList] = useRecoilState(pastedDeckListAtom);
  const [searchType, setSearchType] = useState(SearchType.PASTE);
  const {
    comboData,
    isLoading: loadingCombos,
    errorMessage: comboError,
    getList,
    getUrl,
  } = useComboData();
  const fetching = loadingCombos;
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
    <main className="w-full h-full flex flex-col items-center">
      <ToastContainer theme="dark" />
      <div className="section fullheight flex flex-col items-center md:max-w-screen-lg xl:max-w-screen-lg gap-3 w-full">
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-row gap-3 items-center">
            <div>
              <img src={logo} alt="" width={64} />
            </div>
            <div>
              <span className="fancy title is-1">
                <span className="text-orange-300">mtg</span>
                <wbr />
                combinator
              </span>
            </div>
          </div>
          <div className="italic">infinite combos, finite brain cells</div>
        </div>
        <MoxfieldDeadbanner />
        <div className="flex flex-col w-full">
          <SearchTypeSelector
            searchType={searchType}
            setSearchType={saveSearchType}
          />
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              switch (searchType) {
                case SearchType.DECK:
                  await getUrl(deckUrl);
                  break;
                case SearchType.PASTE:
                  await getList(pastedList);
                  break;
                default:
                  break;
              }
            }}
          >
            <div className="field is-horizontal">
              <div className="field-body">
                <div className="field">
                  {searchType === SearchType.PASTE && (
                    <div className="flex flex-col flex-grow">
                      <textarea
                        id="pastedList"
                        placeholder={
                          "Allowed formats:\n1x Lightning Bolt\n1 Lightning Bolt\nLightning Bolt"
                        }
                        onChange={(e) => {
                          setPastedList(e.target.value);
                          persistList();
                        }}
                        value={pastedList || ""}
                        className="has-background-grey rounded min-h-36 h-36 p-2 max-w-96 max-h-[512px]"
                      ></textarea>
                    </div>
                  )}
                  {searchType === SearchType.DECK && (
                    <>
                      <input
                        type="text"
                        className={`bg-transparent px-3 py-2 border border-zinc-500 rounded w-full ${comboError ? "is-danger" : ""}`}
                        placeholder="Archidekt or MTGGoldfish deck URL"
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
                </div>
              </div>
            </div>
            <div className="field">
              <div className="buttons">
                <button
                  className={`button is-primary wowee-that-is-a-nice-button ${
                    fetching && "is-loading"
                  }`}
                  disabled={
                    searchType === SearchType.DECK
                      ? deckUrl.length === 0
                      : pastedList.length === 0
                  }
                  type="submit"
                >
                  <span>think for me</span>
                  <span className="icon">
                    <FontAwesomeIcon icon={faArrowRight} />
                  </span>
                </button>
              </div>
            </div>
          </form>
          {comboData && <ComboContainer />}
        </div>
      </div>
      <Footer />
    </main>
  );
};
