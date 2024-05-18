import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { Footer } from "./Footer";
import logo from "./images/logo.svg";
import { SearchType, SearchTypeSelector } from "./SearchTypeSelector";
import { ComboContainer } from "./ComboContainer";
import { UserDecksContainer } from "./UserDeck/UserDecksContainer";
import { cachedClient } from "./services/cachedRequest";
import "./style/rainbow-button.sass";
import { useComboData } from "./hooks/useComboData";
import { Form } from "./Form";

export const App = () => {
  const [searchType, setSearchType] = useState(SearchType.USER);
  const saveSearchType = (type: SearchType) => {
    localStorage.setItem("searchType", type);
    setSearchType(type);
  };
  const [loadingUser, setLoadingUser] = useState(false);
  const {
    deckData,
    comboData,
    isLoading: loadingCombos,
    errorMessage: comboError,
    get: findCombos,
  } = useComboData();
  const [userDeckData, setUserDeckData] = useState<Deck[]>();
  const fetching = loadingUser || loadingCombos;

  return (
    <React.Fragment>
      <ToastContainer theme="dark" />
      <div className="section fullheight">
        <div className="container">
          <div className="flex flex-row gap-5 lg:gap-8 items-center mb-6">
            <img
              src={logo}
              alt=""
              className="w-16 lg:w-20 -rotate-[33.34deg]"
            />

            <span className="fancy text-3xl md:text-4xl lg:text-5xl">
              Infinite Combos. Finite Brain Cells.
            </span>
          </div>
          <SearchTypeSelector
            searchType={searchType}
            setSearchType={saveSearchType}
          />
          <Form
            {...{ setLoadingUser }}
            {...{ comboError }}
            {...{ findCombos }}
            {...{ setUserDeckData }}
            {...{ searchType }}
            {...{ setSearchType }}
            {...{ fetching }}
          />
          {searchType === SearchType.DECK && deckData && comboData && (
            <ComboContainer />
          )}
          {searchType === SearchType.USER && userDeckData && (
            <UserDecksContainer decks={userDeckData} />
          )}
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};
