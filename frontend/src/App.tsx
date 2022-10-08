import { faCircleRight } from "@fortawesome/free-regular-svg-icons";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { Combo } from "./Combo";
import { Footer } from "./Footer";
import { useRecoilState } from "recoil";
import logo from "./images/logo.svg";
import { hoveredCard } from "./atoms";
import useOnclickOutside from "react-cool-onclickoutside";

enum Tab {
  COMBOS,
  ONE,
  TWO,
}

export const App = () => {
  const [deckUrl, setDeckUrl] = useState("");
  const [deckData, setDeckData] = useState<DeckData>();
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string>();
  const [tab, setTab] = useState<Tab>(Tab.COMBOS);
  const [cardImageUrl, setCardImageUrl] = useRecoilState(hoveredCard);
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

  const findCombos = useCallback(
    (url?: string) => {
      setDeckData(undefined);
      setError(undefined);
      setTab(Tab.COMBOS);

      (async () => {
        setFetching(true);
        try {
          const { data } = await axios.get("/api/search", {
            params: { url: url || deckUrl },
          });
          setDeckData(data);
        } catch (e) {
          setError(
            "Error -- Ensure you provided a valid Moxfield, MTGGoldfish, or Archidekt URL."
          );
        }
        setFetching(false);
      })();
    },
    [deckUrl]
  );

  const shareUrl = () => {
    if (!deckData) return window.location.href;

    const base = window.location.origin;
    const qs = new URLSearchParams(`?deck_url=${deckData.meta.url}`).toString();
    return `${base}?${qs}`;
  };

  const doShareUrl = () => {
    navigator.clipboard
      .writeText(shareUrl())
      .then((v) => toast.success("Copied link to clipboard"))
      .catch((v) => toast.error("Couldn't copy text to clipboard"));
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
          <h1 className="title">What combos are in your deck?</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              findCombos();
            }}
          >
            <div className="field is-horizontal mb-5">
              <div className="field-body">
                <div className="field">
                  <input
                    type="text"
                    className={`input is-medium ${error && "is-danger"}`}
                    placeholder="Archidekt, Moxfield, or MTGGoldfish deck URL"
                    onInput={(e) =>
                      setDeckUrl((e.target as HTMLInputElement).value)
                    }
                    value={deckUrl}
                  />
                  {error && <p className="has-text-danger help">{error}</p>}
                </div>
                <div className="field">
                  <div className="buttons">
                    <button
                      className={`button is-primary is-medium ${
                        fetching && "is-loading"
                      }`}
                      disabled={deckUrl.length < 10}
                      onClick={() => findCombos()}
                    >
                      <span>think for me</span>
                      <span className="icon">
                        <FontAwesomeIcon icon={faCircleRight} />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
          {deckData && (
            <>
              <div className="is-flex mt-4">
                <div className="is-flex is-flex-grow-1 is-flex-direction-column">
                  <h1 className="title">{deckData.meta.name}</h1>
                  <p className="subtitle mb-2">by {deckData.meta.author}</p>
                  {deckData.combos.length > 0 && (
                    <p className="help">
                      Click a combo to see its prerequisites and steps
                    </p>
                  )}
                  {deckData.one.length > 0 && (
                    <p className="help">
                      If more combos are found by adding one or two cards to the
                      deck, you can access them by clicking the respective 'Add
                      X' tab
                    </p>
                  )}
                </div>
                <div className="is-flex is-flex-grow-0">
                  <div className="buttons is-right">
                    <button
                      className="button is-dark is-outlined"
                      onClick={doShareUrl}
                    >
                      <span>Share</span>
                      <span className="icon">
                        <FontAwesomeIcon icon={faShare} />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="tabs is-medium is-fullwidth mb-0">
                <ul>
                  <li className={`${tab === Tab.COMBOS ? "is-active" : ""}`}>
                    <a role="button" onClick={() => setTab(Tab.COMBOS)}>
                      Combos &ndash;&nbsp;
                      <span className="is-size-6">
                        ({deckData.combos.length})
                      </span>
                    </a>
                  </li>
                  {deckData.one.length > 0 && (
                    <li className={`${tab === Tab.ONE ? "is-active" : ""}`}>
                      <a role="button" onClick={() => setTab(Tab.ONE)}>
                        Add 1 &ndash;&nbsp;
                        <span className="is-size-6">
                          ({deckData.one.length})
                        </span>
                      </a>
                    </li>
                  )}
                  {deckData.two.length > 0 && (
                    <li className={`${tab === Tab.TWO ? "is-active" : ""}`}>
                      <a role="button" onClick={() => setTab(Tab.TWO)}>
                        Add 2 &ndash;&nbsp;
                        <span className="is-size-6">
                          ({deckData.two.length})
                        </span>
                      </a>
                    </li>
                  )}
                </ul>
              </div>
              <div className="container combo-container has-background-grey p-5">
                {deckData.combos.length > 0 && (
                  <>
                    <div className="columns">
                      <div className="column">
                        <p className="title is-5 has-text-centered">Cards</p>
                      </div>
                      <div className="column">
                        <p className="title is-5 has-text-centered">Effect</p>
                      </div>
                    </div>
                    {deckData[
                      tab === Tab.COMBOS
                        ? "combos"
                        : tab === Tab.ONE
                        ? "one"
                        : "two"
                    ].map((c) => (
                      <Combo key={c.d} deckData={deckData} combo={c} />
                    ))}
                  </>
                )}
                {!(deckData.combos.length > 0) && (
                  <h1 className="is-size-4">
                    💡 Pro Tip: Try adding some combos to your list
                  </h1>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};
