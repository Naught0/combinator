import { faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Hyperlink } from "./Hyperlink";
import { copyToClipboardAndToast } from "./util";
import { TabInstructions } from "./TabInstructions";
import { Button } from "./components/ui/button";

export const DeckInfo = ({ meta }: { meta: DeckMeta }) => {
  const doShareUrl = () => {
    copyToClipboardAndToast({
      message: "Copied link to this page",
      text: window.location.href,
    });
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-grow flex-col items-start gap-2">
        <h1 className="font-serif text-3xl font-black md:text-4xl">
          {meta.url ? (
            <Hyperlink href={meta.url}>{meta.name}</Hyperlink>
          ) : (
            meta.name
          )}
        </h1>
        <p className="mb-2 text-lg">by {meta.author}</p>
        {meta.url && (
          <div>
            <Button
              className="inline-flex"
              variant={"outline"}
              onClick={doShareUrl}
            >
              <span>Share</span>
              <span className="icon">
                <FontAwesomeIcon icon={faShare} />
              </span>
            </Button>
          </div>
        )}
        <TabInstructions />
      </div>
    </div>
  );
};
