import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { Footer } from "./Footer";
import logo from "./images/logo.svg";
import { SearchType, SearchTypeSelector } from "./SearchTypeSelector";
import { ComboContainer } from "./ComboContainer";
import { UserDecksContainer } from "./UserDeck/UserDecksContainer";
import { cachedClient } from "./services/cachedRequest";
import { faArrowRight, faShare } from "@fortawesome/free-solid-svg-icons";
import { copyToClipboardAndToast } from "./util";
import "./style/rainbow-button.sass";
import { useComboData } from "./hooks/useComboData";

export const App = () => {
  const [deckUrl, setDeckUrl] = useState("");
  const [userName, setUserName] = useState("");
  const [loadingUser, setLoadingUser] = useState(false);
  const [userError, setUserError] = useState<string>();
  const [searchType, setSearchType] = useState(SearchType.USER);
  const [userDeckData, setUserDeckData] = useState<Deck[]>();
  const {
    deckData,
    comboData,
    isLoading: loadingCombos,
    errorMessage: comboError,
    get: findCombos,
  } = useComboData();
  const fetching = loadingUser || loadingCombos;

  useEffect(function consumeUrlParams() {
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

  const getUserDecks = async () => {
    setUserDeckData(undefined);
    setUserError(undefined);
    setLoadingUser(true);
    try {
      const data = await (
        await cachedClient.get("/api/user/search", {
          params: { userName: userName },
        })
      ).data;
      setUserDeckData(data);
    } catch (e) {
      setUserError(
        "Error -- Please supply only your Moxfield username. Other sites are not yet supported.",
      );
    }
    setLoadingUser(false);
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
                  findCombos(deckUrl);
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
                          className={`input is-medium ${userError ? "is-danger" : ""
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
                        {userError && (
                          <p className="has-text-danger help">{userError}</p>
                        )}
                      </div>
                    </div>
                  )}
                  {searchType === SearchType.DECK && (
                    <>
                      <input
                        type="text"
                        className={`input is-medium ${comboError ? "is-danger" : ""
                          }`}
                        placeholder="Archidekt, Moxfield, or MTGGoldfish deck URL"
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
