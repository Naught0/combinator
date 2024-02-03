import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { comboDataAtom, deckDataAtom } from "./atoms";
import { CardFilter } from "./CardFilter";
import { Combo } from "./Combo";
import { useFilteredCombos } from "./hooks/useComboData";
import { Hyperlink } from "./Hyperlink";
import { MissingCardAccordion } from "./MissingCardAccordion";
import { copyToClipboardAndToast } from "./util";

enum Tab {
  COMBOS,
  ALMOST_INCLUDED,
  CARD_SEARCH,
}

export const ComboContainer: FC = () => {
  const allCombos = useRecoilValue(comboDataAtom);
  const deckData = useRecoilValue(deckDataAtom);
  const [tab, setTab] = useState<Tab>(Tab.COMBOS);
  const comboData = useMemo(
    () =>
      tab === Tab.ALMOST_INCLUDED
        ? allCombos?.almostIncluded
        : allCombos?.included,
    [allCombos, tab],
  );
  const { filter, setFilter, filteredCombos, groupedByMissing } =
    useFilteredCombos({
      combos: comboData ?? [],
    });

  const shareUrl = useMemo(() => {
    if (!allCombos) return window.location.href;
    if (!deckData) return window.location.href;

    const base = window.location.origin;
    const qs = new URLSearchParams(`?deck_url=${deckData.meta.url}`).toString();
    return `${base}?${qs}`;
  }, [allCombos, deckData]);

  const doShareUrl = () => {
    copyToClipboardAndToast({ text: shareUrl });
  };

  const comboTabs = useMemo(() => {
    const noCombos = !comboData?.length;
    const noCombosFound = !noCombos && filteredCombos.length < 1;
    const showGroups =
      tab === Tab.ALMOST_INCLUDED && deckData && groupedByMissing;
    return (
      <div className={"flex flex-col gap-6 flex-1"}>
        <div className="flex gap-6 flex-col">
          <input
            className="input is-medium"
            placeholder="Filter combos by keyword or card name"
            value={filter}
            onChange={({ target }) => setFilter(target.value)}
          />
        </div>
        {noCombos && (
          <h1 className="text-2xl mt-6">
            💡 Pro Tip: Try adding some{" "}
            <Hyperlink href="https://commanderspellbook.com/">combos</Hyperlink>{" "}
            to your list
          </h1>
        )}
        {noCombosFound && (
          <h1 className="text-2xl mt-6">❌ No combos matching search</h1>
        )}
        {showGroups
          ? Object.entries(groupedByMissing)
            .sort(
              ([, combosA], [, combosB]) => combosB.length - combosA.length,
            )
            .map(([cardName, combos]) => (
              <MissingCardAccordion
                cardName={cardName}
                key={cardName}
                count={combos.length}
              >
                <div className="p-3">
                  {combos.map((combo) => (
                    <Combo key={combo.id} deckData={deckData} combo={combo} />
                  ))}
                </div>
              </MissingCardAccordion>
            ))
          : deckData &&
          filteredCombos?.map((c) => (
            <Combo key={c.id} deckData={deckData} combo={c} />
          ))}
      </div>
    );
  }, [
    tab,
    comboData,
    filter,
    groupedByMissing,
    setFilter,
    filteredCombos,
    deckData,
  ]);

  return (
    <>
      <div className="flex mt-4">
        <div className="is-flex is-flex-grow-1 is-flex-direction-column">
          <h1 className="title">
            {deckData?.meta?.url && (
              <Hyperlink href={deckData?.meta.url}>
                {deckData?.meta.name}
              </Hyperlink>
            )}
          </h1>
          <p className="subtitle mb-2">by {deckData?.meta.author}</p>
          {(allCombos?.included?.length ?? -1 > 0) && (
            <p className="help">
              Click a combo to see its prerequisites and steps
            </p>
          )}
          {(allCombos?.almostIncluded?.length ?? 1) > 0 && (
            <p className="help">
              If more combos are found by adding a card to the deck, you can
              access them by clicking the &quot;Add 1&quot; tab
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
              <span className="is-size-6">
                ({allCombos?.included?.length ?? 0})
              </span>
            </a>
          </li>
          {(allCombos?.almostIncluded?.length ?? -1) > 0 && (
            <li className={`${tab === Tab.ALMOST_INCLUDED ? "is-active" : ""}`}>
              <a role="button" onClick={() => setTab(Tab.ALMOST_INCLUDED)}>
                Add 1 &ndash;&nbsp;
                <span className="text-sm">
                  ({allCombos?.almostIncluded.length})
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
      <div className="has-background-grey p-5">
        {tab !== Tab.CARD_SEARCH && comboTabs}
        {tab === Tab.CARD_SEARCH && <CardFilter />}
      </div>
    </>
  );
};
