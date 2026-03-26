import { createPortal } from "react-dom";
import { usePopperTooltip } from "react-popper-tooltip";
import { cardNameToImageSrc } from "./services/scryfall";
import { cn } from "./lib/utils";

export const HoverableCard = ({
  cardName,
  image,
  className,
}: {
  cardName: string;
  className?: string;
  image?: string;
}) => {
  const cardImage = image ?? cardNameToImageSrc(cardName);

  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      placement: "auto-end",
      trigger: ["hover", "click"],
      closeOnOutsideClick: true,
      interactive: true,
      delayShow: 130,
      delayHide: 100,
    });
  return (
    <>
      <span
        className={cn(
          "inline-flex gap-1 text-zinc-300 underline decoration-zinc-300 decoration-dashed underline-offset-4",
          className,
        )}
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
