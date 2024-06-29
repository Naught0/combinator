import { createPortal } from "react-dom";
import { usePopperTooltip } from "react-popper-tooltip";
import { useRecoilValue } from "recoil";
import { deckDataAtom } from "./atoms";
import { Tag } from "./Tag";

export const HoverableCard = ({ cardName }: { cardName: string }) => {
  const deckData = useRecoilValue(deckDataAtom);
  const deckCard = deckData?.cards.find((dc) => dc.name === cardName);
  const cardImage =
    deckCard?.image ??
    `https://api.scryfall.com/cards/named?exact=${cardName}&format=image`;

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
      <Tag ref={setTriggerRef}>{cardName}</Tag>
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
