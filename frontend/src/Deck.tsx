import {
  faBalanceScale,
  faEdit,
  faEye,
  faHashtag,
  faSquarePlus,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { FC } from "react";
import { Link } from "react-router";
import { IconText } from "./IconText";

interface Props {
  deck: Deck;
}

export const Deck: FC<Props> = ({ deck }) => {
  return (
    <Link
      to={`/deck/${encodeURIComponent(deck.publicUrl)}`}
      className="text-zinc-100 no-underline visited:text-zinc-200 hover:text-white hover:no-underline"
    >
      <div
        className="flex flex-col justify-between rounded bg-zinc-900 bg-no-repeat p-4"
        style={{
          backgroundImage: deck.mainCardId
            ? `radial-gradient(transparent, rgb(0, 0, 0)),
        url("https://assets.moxfield.net/cards/card-${deck.mainCardId}-art_crop.webp")`
            : "",
          backgroundSize: "100%",
        }}
        title={deck.name}
      >
        <div className="overflow-hidden text-ellipsis whitespace-nowrap">
          {deck.name}
        </div>
        <div className="tags my-2">
          <span className="tag is-dark">{deck.format}</span>
        </div>
        <div className="flex flex-row flex-wrap gap-2">
          <IconText className="text-sm" icon={faHashtag}>
            {deck.mainboardCount}{" "}
            {deck.mainboardCount > 1 || deck.mainboardCount === 0
              ? "cards"
              : "card"}
          </IconText>
          <IconText className="text-sm" icon={faBalanceScale}>
            {deck.isLegal ? (
              "legal"
            ) : (
              <span className="has-text-danger">not legal</span>
            )}
          </IconText>
          <IconText className="text-sm" icon={faThumbsUp}>
            {deck.likeCount} likes
          </IconText>
          <IconText className="text-sm" icon={faEye}>
            {deck.viewCount} views
          </IconText>
          <IconText className="text-sm" icon={faSquarePlus}>
            created {new Date(deck.createdAtUtc).toLocaleDateString()}
          </IconText>
          <IconText className="text-sm" icon={faEdit}>
            modified {new Date(deck.lastUpdatedAtUtc).toLocaleDateString()}
          </IconText>
        </div>
      </div>
    </Link>
  );
};
