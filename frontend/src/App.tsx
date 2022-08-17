import { faCircleRight } from "@fortawesome/free-regular-svg-icons";
import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { Combo } from "./Combo";
import { Footer } from "./Footer";
import logo from "./images/logo.svg";

export const App = () => {
  const [deckUrl, setDeckUrl] = useState("");
  const [deckData, setDeckData] = useState<DeckData>();
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const url = params.get("deck_url");
    if (url !== null) {
      setDeckUrl(url);
    }
  }, []);

  const findCombos = (url?: string) => {
    setDeckData(undefined);
    setError(undefined);

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
  };

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
            <div className="container combo-container has-background-grey p-5">
              <div className="columns">
                <div className="column">
                  <h1 className="title">{`${deckData.meta.name} - ${deckData.combos.length} combos`}</h1>
                </div>
                <div className="column">
                  <div className="buttons is-right">
                    <button className="button is-text" onClick={doShareUrl}>
                      <span>Share</span>
                      <span className="icon">
                        <FontAwesomeIcon icon={faShare} />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
              <p className="subtitle mb-2">by {deckData.meta.author}</p>
              {deckData.combos.length > 0 && (
                <p className="mb-4 help">
                  <i>Click a combo to see its prerequisites and steps</i>
                </p>
              )}
              {deckData.combos.length > 0 &&
                deckData.combos.map((c) => <Combo key={c.d} data={c} />)}
              {!(deckData.combos.length > 0) && (
                <h1 className="is-size-4">
                  💡 Pro Tip: Try adding some combos to your list
                </h1>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </React.Fragment>
  );
};
