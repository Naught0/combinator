import { faCalendarDays, faCheck } from "@fortawesome/free-solid-svg-icons";
import { BsExclamationTriangleFill } from "react-icons/bs";
import { TbCardsFilled } from "react-icons/tb";
import { FC } from "react";
import { Link } from "react-router";
import { IconText } from "./IconText";
import { Badge } from "./components/ui/badge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  deck: Deck;
}

export const Deck: FC<Props> = ({ deck }) => {
  return (
    <Link
      to={`/user/moxfield/${deck.authors[0].userName}/deck/${deck.publicId}`}
      className="border border-zinc-800 text-zinc-100 visited:text-zinc-200 hover:text-white hover:no-underline"
    >
      <div
        className="flex flex-col justify-between gap-2 rounded bg-zinc-950 bg-no-repeat p-4"
        style={{
          backgroundImage: deck.mainCardId
            ? `radial-gradient(transparent, rgb(0, 0, 0)),
        url("https://assets.moxfield.net/cards/card-${deck.mainCardId}-art_crop.webp")`
            : "",
          backgroundSize: "100%",
        }}
      >
        <p className="overflow-hidden text-ellipsis whitespace-nowrap font-serif text-lg">
          {deck.name}
        </p>
        <div>
          <Badge className="text-sm capitalize" title={"deck format"}>
            {deck.format}
          </Badge>
        </div>
        <div className="flex flex-row flex-wrap gap-1">
          <Badge title={"# cards in deck"}>
            <div className="5 inline-flex items-center gap-1">
              <TbCardsFilled />
              {deck.mainboardCount}
            </div>
          </Badge>
          <Badge
            className={`inline-flex items-center gap-1.5 ${deck.isLegal ? "" : "!text-rose-300"}`}
          >
            {deck.isLegal ? (
              <FontAwesomeIcon icon={faCheck} />
            ) : (
              <BsExclamationTriangleFill />
            )}
            {deck.isLegal ? "Legal" : "Not legal"}
          </Badge>
          <Badge title={"Last updated"}>
            <IconText icon={faCalendarDays}>
              {new Date(deck.lastUpdatedAtUtc).toLocaleDateString(undefined, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </IconText>
          </Badge>
        </div>
      </div>
    </Link>
  );
};
