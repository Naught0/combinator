import { faShare, faSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, ReactNode, useCallback, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { comboDataAtom, deckDataAtom } from "./atoms";
import { CardFilter } from "./CardFilter";
import { Combo } from "./Combo";
import { Hyperlink } from "./Hyperlink";
import { copyToClipboardAndToast } from "./util";

enum Tab {
  COMBOS,
  ONE,
  TWO,
  CARD_SEARCH,
}

export const ComboContainer: FC = () => {
  const comboData = useRecoilValue(comboDataAtom);
  const deckData = useRecoilValue(deckDataAtom);
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

  const shareUrl = useMemo(() => {
    if (!comboData) return window.location.href;
    if (!deckData) return window.location.href;

    const base = window.location.origin;
    const qs = new URLSearchParams(`?deck_url=${deckData.meta.url}`).toString();
    return `${base}?${qs}`;
  }, [comboData, deckData]);

  const doShareUrl = () => {
    copyToClipboardAndToast({ text: shareUrl });
  };

  const comboTabs = useMemo(
    () =>
      deckData ? (
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
          {comboData?.included.map((c) => (
            <Combo key={c.id} deckData={deckData} combo={c} />
          ))}
        </>
      ) : (
        <h1 className="is-size-4">
          💡 Pro Tip: Try adding some{" "}
          <Hyperlink href="https://commanderspellbook.com/">combos</Hyperlink>{" "}
          to your list
        </h1>
      ),
    [addCardTabExplanation, comboData?.included, deckData],
  );

  return (
    <>
      <div className="is-flex mt-4">
        <div className="is-flex is-flex-grow-1 is-flex-direction-column">
          <h1 className="title">
            {deckData?.meta?.url && (
              <Hyperlink href={deckData?.meta.url}>
                {deckData?.meta.name}
              </Hyperlink>
            )}
          </h1>
          <p className="subtitle mb-2">by {deckData?.meta.author}</p>
          {(comboData?.included?.length ?? -1 > 0) && (
            <p className="help">
              Click a combo to see its prerequisites and steps
            </p>
          )}
          {(comboData?.almostIncluded?.length ?? 1) > 0 && (
            <p className="help">
              If more combos are found by adding one or two cards to the deck,
              you can access them by clicking the respective &apos;Add X&apos;
              tab
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
              <span className="is-size-6">({comboData?.included.length})</span>
            </a>
          </li>
          {(comboData?.almostIncluded?.length ?? -1) > 0 && (
            <li className={`${tab === Tab.ONE ? "is-active" : ""}`}>
              <a role="button" onClick={() => setTab(Tab.ONE)}>
                Add 1 &ndash;&nbsp;
                <span className="text-sm">
                  ({comboData?.almostIncluded.length})
                </span>
              </a>
            </li>
          )}
          {deckData?.cards && (
            <li className={`${tab === Tab.CARD_SEARCH ? "is-active" : ""}`}>
              <a role="button" onClick={() => setTab(Tab.CARD_SEARCH)}>
                Search Cards &ndash;&nbsp;
                <span className="text-sm">({deckData.cards.length})</span>
              </a>
            </li>
          )}
        </ul>
      </div>
      <div className="container combo-container has-background-grey p-5">
        {tab !== Tab.CARD_SEARCH && comboTabs}
        {tab === Tab.CARD_SEARCH && <CardFilter />}
      </div>
    </>
  );
};
