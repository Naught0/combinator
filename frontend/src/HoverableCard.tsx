import { createPortal } from "react-dom";
import { usePopperTooltip } from "react-popper-tooltip";
import { cardNameToImageSrc } from "./services/scryfall";
import { cn } from "./lib/utils";
import { ReactNode } from "react";

export const HoverableCard = ({
  cardName,
  inDeck = true,
  image,
  className,
}: {
  cardName: string;
  className?: string;
  image?: string;
  inDeck?: boolean;
}) => {
  const cardImage = image ?? cardNameToImageSrc(cardName);

  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      placement: "auto-end",
      trigger: ["hover"],
      delayShow: 150,
      delayHide: 10,
    });
  return (
    <>
      <span
        className={cn(`${inDeck ? "" : "text-rose-400"}`, className)}
        ref={setTriggerRef}
      >
        {cardName}
      </span>
      {visible &&
        createPortal(
          <div className="rounded-2xl bg-transparent">
            <img
              ref={setTooltipRef}
              src={cardImage}
              className="z-30 max-w-[256px] rounded-2xl shadow-lg shadow-black lg:max-w-[300px]"
              {...getTooltipProps()}
            />
          </div>,
          document.body,
        )}
    </>
  );
};
