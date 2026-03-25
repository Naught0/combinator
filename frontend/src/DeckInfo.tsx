import {
  faShare,
  faUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Hyperlink } from "./Hyperlink";
import { toast } from "sonner";

export const DeckInfo = ({ meta }: { meta: DeckMeta }) => {
  const doShareUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Copied link to clipboard");
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-grow flex-col items-start gap-2">
        <h1 className="font-serif text-3xl font-black md:text-4xl">
          {meta.name}
        </h1>
        {meta.url && (
          <Hyperlink
            href={meta.url}
            className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-zinc-200"
          >
            View deck on {new URL(meta.url).hostname}
            <FontAwesomeIcon icon={faUpRightFromSquare} />
          </Hyperlink>
        )}
        <p className="text-lg">
          by{" "}
          {meta.url ? (
            <Hyperlink href={meta.url}>{meta.author}</Hyperlink>
          ) : (
            meta.author
          )}
        </p>
        {meta.url && (
          <button
            className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-4 py-2 text-sm dark:border-zinc-600 dark:bg-zinc-950 dark:hover:bg-zinc-700 dark:hover:text-zinc-50"
            onClick={doShareUrl}
          >
            <FontAwesomeIcon icon={faShare} />
            Share page
          </button>
        )}
      </div>
    </div>
  );
};
