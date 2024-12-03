import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo } from "react";
import { Hyperlink } from "./Hyperlink";
import { copyToClipboardAndToast } from "./util";
import { ComboTabs } from "./ComboTabs";
import { Loading } from "./Loading";

export const ComboContainer = ({
  allCombos,
  deckData,
  cardNames,
  loading,
}: {
  allCombos?: Results;
  deckData?: DeckData;
  cardNames?: string[];
  loading?: boolean;
}) => {
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

  if (loading) {
    return <Loading message="Loading deck" />;
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-grow flex-col">
        <h1 className="text-3xl md:text-4xl">
          {deckData?.meta?.url && (
            <Hyperlink href={deckData?.meta.url}>
              {deckData?.meta.name}
            </Hyperlink>
          )}
        </h1>
        <p className="subtitle mb-2">by {deckData?.meta.author}</p>
        {(allCombos?.included?.length ?? -1) > 0 && (
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
      <div className="flex flex-grow-0">
        <div className="buttons is-right">
          <button className="button is-dark is-outlined" onClick={doShareUrl}>
            <span>Share</span>
            <span className="icon">
              <FontAwesomeIcon icon={faShare} />
            </span>
          </button>
        </div>
      </div>
      <ComboTabs
        allCombos={allCombos}
        deckData={deckData}
        cardNames={cardNames}
        loading={loading}
      />
    </div>
  );
};
