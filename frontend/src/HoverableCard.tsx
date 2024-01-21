import { usePopperTooltip } from "react-popper-tooltip";
import { useRecoilValue } from "recoil";
import { deckDataAtom } from "./atoms";

export const HoverableCard = ({
  cardName,
  display = "text",
}: {
  cardName: string;
  display?: "image" | "text";
}) => {
  const deckData = useRecoilValue(deckDataAtom);
  const deckCard = deckData?.cards.find((dc) => dc.name === cardName);
  const isImage = display === "image";
  const cardImage =
    deckCard?.image ??
    `https://api.scryfall.com/cards/named?exact=${cardName}&format=image`;

  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      placement: "auto-start",
      offset: [0, 5],
      trigger: ["click", "hover"],
      delayShow: 75,
      delayHide: 150,
    });
  return (
    <>
      {!isImage && display === "text" && (
        <span
          className={`tag is-clickable !text-base ${deckCard ? "is-dark" : "is-danger"
            }`}
          ref={setTriggerRef}
        >
          {cardName}
        </span>
      )}
      {!isImage && visible && (
        <div className="bg-transparent rounded-2xl">
          <img
            ref={setTooltipRef}
            src={cardImage}
            className="rounded-2xl max-w-[256px] lg:max-w-[300px] shadow-black shadow-lg"
            {...getTooltipProps()}
          />
        </div>
      )}
      {isImage && (
        <div className="bg-transparent !rounded-2xl">
          <img src={cardImage} className="rounded-2xl w-full" />
        </div>
      )}
    </>
  );
};
