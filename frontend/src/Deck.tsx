import {
  faEye,
  faEdit,
  faBalanceScale,
  faSquarePlus,
  faThumbsUp,
  faHashtag,
} from "@fortawesome/free-solid-svg-icons";
import { FC } from "react";
import { IconText } from "./IconText";

interface Props {
  deck: Deck;
  onClick: (deck: Deck) => void;
}

export const Deck: FC<Props> = ({ deck, onClick }) => {
  return (
    <div
      className="flex cursor-pointer flex-col justify-between rounded p-4 transition-all hover:shadow-md hover:shadow-black"
      style={{
        backgroundImage: deck.mainCardId
          ? `radial-gradient(transparent, rgb(0, 0, 0)),
        url("https://assets.moxfield.net/cards/card-${deck.mainCardId}-art_crop.webp")`
          : "",
        backgroundRepeat: "no-repeat",
        backgroundSize: "100%",
      }}
      onClick={() => onClick(deck)}
      title={deck.name}
    >
      <div
        style={{
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
        }}
      >
        {deck.name}
      </div>
      <div className="tags my-2">
        <span className="tag is-dark">{deck.format}</span>
      </div>
      <div className="flex flex-row flex-wrap" style={{ gap: "0.50rem" }}>
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
  );
};
