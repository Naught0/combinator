import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useCallback, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { Footer } from "./Footer";
import { useRecoilState } from "recoil";
import logo from "./images/logo.svg";
import { comboDataAtom, deckDataAtom } from "./atoms";
import { SearchType, SearchTypeSelector } from "./SearchTypeSelector";
import { ComboContainer } from "./ComboContainer";
import { UserDecksContainer } from "./UserDeck/UserDecksContainer";
import { getComboData, getDeckData } from "./services";
import { cachedClient } from "./services/cachedRequest";
import { faArrowRight, faShare } from "@fortawesome/free-solid-svg-icons";
import { copyToClipboardAndToast } from "./util";
import "./style/rainbow-button.sass";

export const App = () => {
  const [deckUrl, setDeckUrl] = useState("");
  const [userName, setUserName] = useState("");
  const [deckData, setDeckData] = useRecoilState(deckDataAtom);
  const [comboData, setComboData] = useRecoilState(comboDataAtom);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string>();
  const [searchType, setSearchType] = useState(SearchType.USER);
  const [userDeckData, setUserDeckData] = useState<Deck[]>();
  console.log(userDeckData);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const url = params.get("deck_url");
    const user = params.get("moxfield_user");
    const searchType = localStorage.getItem("searchType");
    if (url) {
      setDeckUrl(url);
      setSearchType(SearchType.DECK);
    }
    if (user) {
      setUserName(user);
      setSearchType(SearchType.USER);
    }

    if (searchType) {
      setSearchType(SearchType[searchType as SearchType]);
    }
  }, []);

  useEffect(
    function fetchComboData() {
      if (!deckData?.cards) return;

      (async () => {
        const data = await getComboData({
          main: deckData.cards.map((c) => c.name),
          commanders: [],
        });
        setComboData(data);
      })();
    },
    [deckData, setComboData],
  );

  const findCombos = useCallback(() => {
    setDeckData(undefined);
    setError(undefined);
    (async () => {
      setFetching(true);
      try {
        const data = await getDeckData(deckUrl);
        setDeckData(data);
      } catch (e) {
        setError(
          "Error -- Ensure you provided a valid Moxfield, MTGGoldfish, or Archidekt URL.",
        );
      }
      setFetching(false);
    })();
  }, [deckUrl, setDeckData]);

  const getUserDecks = async () => {
    setUserDeckData(undefined);
    setError(undefined);
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
        "Error -- Please supply only your Moxfield username. Other sites are not yet supported.",
      );
    }
    setFetching(false);
  };

  const saveSearchType = (type: SearchType) => {
    localStorage.setItem("searchType", type);
    setSearchType(type);
  };

  return (
    <React.Fragment>
      <ToastContainer theme="dark" />
      <div className="section fullheight">
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
            setSearchType={saveSearchType}
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
                  {searchType === SearchType.USER && (
                    <div className="field">
                      <div className="control has-icons-right">
                        <input
                          type="text"
                          className={`input is-medium ${error ? "is-danger" : ""
                            }`}
                          placeholder="Moxfield username"
                          onInput={(e) =>
                            setUserName((e.target as HTMLInputElement).value)
                          }
                          value={userName}
                        />
                        <span
                          className={`icon is-right is-small is-clickable ${!(userName.length > 0) ? "is-hidden" : ""
                            }`}
                          role="button"
                          title="Share a link to this page"
                          onClick={() => {
                            copyToClipboardAndToast({
                              text: `${window.location.origin}?moxfield_user=${userName}`,
                            });
                          }}
                        >
                          <FontAwesomeIcon icon={faShare} />
                        </span>
                      </div>
                    </div>
                  )}
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
                  {error && <p className="has-text-danger help">{error}</p>}
                </div>
                <div className="field">
                  <div className="buttons has-addons">
                    <button
                      className={`button is-primary is-medium wowee-that-is-a-nice-button ${fetching && "is-loading"
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
