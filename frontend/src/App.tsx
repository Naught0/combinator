import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { Footer } from "./Footer";
import { useRecoilState } from "recoil";
import logo from "./images/logo.svg";
import { hoveredCard } from "./atoms";
import useOnclickOutside from "react-cool-onclickoutside";
import { SearchType, SearchTypeSelector } from "./SearchTypeSelector";
import { ComboContainer } from "./ComboContainer";
import { UserDecksContainer } from "./UserDeck/UserDecksContainer";
import { getComboData } from "./services";
import { cachedClient } from "./services/cachedRequest";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export const App = () => {
  const [deckUrl, setDeckUrl] = useState("");
  const [userName, setUserName] = useState("");
  const [deckData, setDeckData] = useState<DeckData>();
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string>();
  const [cardImageUrl, setCardImageUrl] = useRecoilState(hoveredCard);
  const [searchType, setSearchType] = useState(SearchType.USER);
  const [userDeckData, setUserDeckData] = useState<Deck[]>();
  const [, setUserSelectedDeck] = useState<Deck>();

  const ref = useOnclickOutside(() => {
    setCardImageUrl("");
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const url = params.get("deck_url");
    if (url !== null) {
      setDeckUrl(url);
    }
  }, []);

  useEffect(() => {
    if (!deckUrl) return;
    setSearchType(SearchType.DECK);
  }, [deckUrl]);

  const findCombos = useCallback(() => {
    setDeckData(undefined);
    setError(undefined);
    (async () => {
      setFetching(true);
      try {
        const data = await getComboData(deckUrl);
        setDeckData(data);
      } catch (e) {
        setError(
          "Error -- Ensure you provided a valid Moxfield, MTGGoldfish, or Archidekt URL."
        );
      }
      setFetching(false);
    })();
  }, [deckUrl]);

  const getUserDecks = async () => {
    setUserDeckData(undefined);
    setError(undefined);
    setUserSelectedDeck(undefined);
    setFetching(true);
    try {
      const data = await (
        await cachedClient.get("/api/user/search", {
          params: { userName: userName },
        })
      ).data;
      setUserDeckData(data);
    } catch (e) {
      setError(
        "Error -- Please supply only your Moxfield username. Other sites are not yet supported."
      );
    }
    setFetching(false);
  };

  return (
    <React.Fragment>
      <ToastContainer theme="dark" />
      <div className="section fullheight">
        {cardImageUrl && (
          <div className="card-popup" ref={ref}>
            <img src={cardImageUrl} alt="Card" style={{ width: "100%" }} />
          </div>
        )}
        <div className="level">
          <div className="level-left">
            <div className="level-item">
              <img src={logo} alt="" width={64} />
            </div>
            <div className="level-item">
              <span className="fancy title is-1">
                infinite combos, finite brain cells
              </span>
            </div>
          </div>
        </div>
        <div className="container mt-6">
          <SearchTypeSelector
            searchType={searchType}
            setSearchType={(type) => setSearchType(type)}
          />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              switch (searchType) {
                case SearchType.DECK:
                  findCombos();
                  break;
                case SearchType.USER:
                  getUserDecks();
                  break;
                default:
                  break;
              }
            }}
          >
            <div className="field is-horizontal">
              <div className="field-body">
                <div className="field">
                  {searchType === SearchType.DECK && (
                    <input
                      type="text"
                      className={`input is-medium ${error ? "is-danger" : ""}`}
                      placeholder="Archidekt, Moxfield, or MTGGoldfish deck URL"
                      onInput={(e) => {
                        setDeckUrl((e.target as HTMLInputElement).value);
                      }}
                      value={deckUrl}
                    />
                  )}
                  {searchType === SearchType.USER && (
                    <input
                      type="text"
                      className={`input is-medium ${error ? "is-danger" : ""}`}
                      placeholder="Moxfield username"
                      onInput={(e) =>
                        setUserName((e.target as HTMLInputElement).value)
                      }
                      value={userName}
                    />
                  )}
                  {error && <p className="has-text-danger help">{error}</p>}
                </div>
                <div className="field">
                  <div className="buttons">
                    <button
                      className={`button is-primary is-medium ${
                        fetching && "is-loading"
                      }`}
                      disabled={
                        searchType === SearchType.DECK
                          ? deckUrl.length === 0
                          : userName.length === 0
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
              </div>
            </div>
          </form>
          {searchType === SearchType.DECK && deckData && (
            <ComboContainer {...deckData} />
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
