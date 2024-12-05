import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo } from "react";
import { Hyperlink } from "./Hyperlink";
import { copyToClipboardAndToast } from "./util";

export const DeckInfo = ({ deckData }: { deckData: DeckData }) => {
  const shareUrl = useMemo(() => {
    if (!deckData) return window.location.href;

    const base = window.location.origin;
    const qs = new URLSearchParams(`?deck_url=${deckData.meta.url}`).toString();
    return `${base}?${qs}`;
  }, [deckData]);

  const doShareUrl = () => {
    copyToClipboardAndToast({ text: shareUrl });
  };

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
        <p className="mb-2 text-lg">by {deckData?.meta.author}</p>
        <p className="text-sm">
          Click a combo to see its prerequisites and steps
        </p>
        <p className="text-sm">
          If more combos are found by adding a card to the deck, you can access
          them by clicking the &quot;Add 1&quot; tab
        </p>
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
    </div>
  );
};
