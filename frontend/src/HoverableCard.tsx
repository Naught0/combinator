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

  const { image, in_deck } = deckCard ?? { image: undefined, in_deck: false };
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      placement: "auto",
      offset: [0, 15],
      trigger: ["click", "hover"],
      delayShow: 75,
    });
  return (
    <>
      {!isImage && display === "text" && (
        <span
          className={`tag is-clickable !text-base ${in_deck ? "is-dark" : "is-danger"
            }`}
          ref={setTriggerRef}
        >
          {cardName}
        </span>
      )}
      {!isImage && visible && (
        <div className="bg-black rounded-2xl">
          <img
            ref={setTooltipRef}
            src={image}
            className="rounded-2xl max-w-[90vw] max-h-[60vh] lg:max-h-[50vh] shadow-black shadow-lg"
            {...getTooltipProps()}
          />
        </div>
      )}
      {isImage && (
        <div className="bg-black !rounded-2xl">
          <img src={image} className="rounded-2xl w-full" />
        </div>
      )}
    </>
  );
};
