/* eslint-disable jsx-a11y/anchor-is-valid */

import { faShare, faSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, ReactNode, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Combo } from "./Combo";
import { Hyperlink } from "./Hyperlink";

enum Tab {
  COMBOS,
  ONE,
  TWO,
}

export const ComboContainer: FC<DeckData> = ({ ...deckData }) => {
  const [tab, setTab] = useState<Tab>(Tab.COMBOS);
  const addCardTabExplanation = useMemo<ReactNode>(() => {
    if ([Tab.ONE, Tab.TWO].includes(tab)) {
      return (
        <div className="has-text-centered" style={{ width: "100%" }}>
          <span className="icon-text">
            <span className="icon">
              <FontAwesomeIcon icon={faSquare} className="has-text-danger" />
            </span>
            <span>= card not in deck</span>
          </span>
        </div>
      );
    }
    return null;
  }, [tab]);
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
    <>
      <div className="is-flex mt-4">
        <div className="is-flex is-flex-grow-1 is-flex-direction-column">
          <h1 className="title">
            <Hyperlink href={deckData.meta.url}>{deckData.meta.name}</Hyperlink>
          </h1>
          <p className="subtitle mb-2">by {deckData.meta.author}</p>
          {deckData.combos.length > 0 && (
            <p className="help">
              Click a combo to see its prerequisites and steps
            </p>
          )}
          {(deckData.one.length > 0 || deckData.two.length > 0) && (
            <p className="help">
              If more combos are found by adding one or two cards to the deck,
              you can access them by clicking the respective 'Add X' tab
            </p>
          )}
        </div>
        <div className="is-flex is-flex-grow-0">
          <div className="buttons is-right">
            <button className="button is-dark is-outlined" onClick={doShareUrl}>
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
              <span className="is-size-6">({deckData.combos.length})</span>
            </a>
          </li>
          {deckData.one.length > 0 && (
            <li className={`${tab === Tab.ONE ? "is-active" : ""}`}>
              <a role="button" onClick={() => setTab(Tab.ONE)}>
                Add 1 &ndash;&nbsp;
                <span className="is-size-6">({deckData.one.length})</span>
              </a>
            </li>
          )}
          {deckData.two.length > 0 && (
            <li className={`${tab === Tab.TWO ? "is-active" : ""}`}>
              <a role="button" onClick={() => setTab(Tab.TWO)}>
                Add 2 &ndash;&nbsp;
                <span className="is-size-6">({deckData.two.length})</span>
              </a>
            </li>
          )}
        </ul>
      </div>
      <div className="container combo-container has-background-grey p-5">
        {[deckData.combos, deckData.one, deckData.two].some(
          (a) => a.length > 0
        ) ? (
          <>
            <div className="columns">
              <div className="column">
                <p className="title is-5 has-text-centered">Cards</p>
              </div>
              <div className="column">
                <p className="title is-5 has-text-centered">Effect</p>
              </div>
            </div>
            {addCardTabExplanation}
            {deckData[
              tab === Tab.COMBOS ? "combos" : tab === Tab.ONE ? "one" : "two"
            ].map((c) => (
              <Combo key={c.d} deckData={deckData} combo={c} />
            ))}
          </>
        ) : (
          <h1 className="is-size-4">
            💡 Pro Tip: Try adding some <Hyperlink href="https://commanderspellbook.com/">combos</Hyperlink> to your list
          </h1>
        )}
      </div>
    </>
  );
};
