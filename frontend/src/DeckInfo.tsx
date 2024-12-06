import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Hyperlink } from "./Hyperlink";
import { copyToClipboardAndToast } from "./util";
import { TabInstructions } from "./TabInstructions";

export const DeckInfo = ({ deckData }: { deckData: DeckData }) => {
  const doShareUrl = () => {
    copyToClipboardAndToast({ text: window.location.href });
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-grow flex-col">
        <h1 className="text-3xl md:text-4xl">
          {deckData.meta.url ? (
            <Hyperlink href={deckData.meta.url}>{deckData.meta.name}</Hyperlink>
          ) : (
            deckData.meta.name
          )}
        </h1>
        <p className="mb-2 text-lg">by {deckData.meta.author}</p>
        <TabInstructions />
      </div>
      {deckData.meta.url && (
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
      )}
    </div>
  );
};