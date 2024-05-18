import { faShare, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { SearchType } from "./SearchTypeSelector";
import { cachedClient } from "./services/cachedRequest";
import { copyToClipboardAndToast } from "./util";

const parseMoxfieldUsername = (nameOrUrl: string): string => {
  return nameOrUrl.split("/").pop() ?? "";
};

const formTextClassName = "!text-base lg:!text-xl";

export const Form = ({
  setUserDeckData,
  findCombos,
  comboError,
  setLoadingUser,
  setSearchType,
  searchType,
  fetching,
}: {
  setLoadingUser: (loading: boolean) => void;
  comboError?: string;
  findCombos: (deckUrl: string) => void;
  setUserDeckData: (data: Deck[] | undefined) => void;
  searchType?: SearchType;
  setSearchType: (type: SearchType) => void;
  fetching?: boolean;
}) => {
  const [deckUrl, setDeckUrl] = useState("");
  const [userName, setUserName] = useState("");
  const [userError, setUserError] = useState<string>();

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
        await cachedClient.post("/api/search/user", { userName })
      ).data;
      setUserDeckData(data);
    } catch (e) {
      console.error(e);
      setUserError(
        "Error -- Please supply only your Moxfield username. Other sites are not yet supported.",
      );
    }
    setLoadingUser(false);
  };
  return (
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
                    className={`input is-medium ${
                      userError ? "is-danger" : ""
                    }`}
                    placeholder="Moxfield username"
                    onInput={({ target }) =>
                      setUserName(
                        parseMoxfieldUsername(
                          (target as HTMLInputElement).value,
                        ),
                      )
                    }
                    value={userName}
                  />
                  <span
                    className={`icon is-right is-small is-clickable ${
                      !(userName.length > 0) ? "is-hidden" : ""
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
                  className={`input ${formTextClassName} is-medium ${
                    comboError ? "is-danger" : ""
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
                className={`button ${formTextClassName} is-primary is-medium wowee-that-is-a-nice-button ${
                  fetching && "is-loading"
                }`}
                disabled={
                  searchType === SearchType.DECK
                    ? deckUrl.length === 0
                    : userName.length === 0
                }
                type="submit"
              >
                <span>Think for me</span>
                <span className="icon">
                  <FontAwesomeIcon icon={faArrowRight} />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
