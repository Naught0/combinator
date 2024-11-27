import { createPortal } from "react-dom";
import { usePopperTooltip } from "react-popper-tooltip";
import { cardNameToImageSrc } from "./services/scryfall";

export const HoverableCard = ({
  cardName,
  inDeck = true,
  image,
  classNameOverride,
}: {
  cardName: string;
  classNameOverride?: string;
  image?: string;
  inDeck?: boolean;
}) => {
  const cardImage = image ?? cardNameToImageSrc(cardName);

  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      placement: "auto-start",
      offset: [0, 5],
      trigger: ["click", "hover"],
      delayShow: 10,
      delayHide: 30,
    });
  return (
    <>
      <span
        className={
          classNameOverride
            ? classNameOverride
            : `tag is-clickable !text-base ${inDeck ? "is-dark" : "is-danger"}`
        }
        ref={setTriggerRef}
      >
        {cardName}
      </span>
      {visible &&
        createPortal(
          <div className="bg-transparent rounded-2xl">
            <img
              ref={setTooltipRef}
              src={cardImage}
              className="rounded-2xl max-w-[256px] lg:max-w-[300px] shadow-black shadow-lg"
              {...getTooltipProps()}
            />
          </div>,
          document.body,
        )}
    </>
  );
};
