import { useState } from "react";
import useOnclickOutside from "react-cool-onclickoutside";
import { useDebouncedCallback } from "use-debounce";

const BASE_MARGIN = 150;

const getMarginRight = (index: number, totalCards: number) => {
  if (index + 1 >= totalCards) return 0;
  return Math.min(
    -BASE_MARGIN,
    -((BASE_MARGIN * (totalCards - 1)) / (totalCards / 1.9)),
  );
};

const getMarginTop = (index: number, totalCards: number) => {
  if (index === 0) return 0;
  return Math.max(-320, -((200 * (totalCards - 1)) / (totalCards / 3))); // anything > 2 cards hits the default value
};

function getTiltAngle(index: number, totalCards: number): number {
  // thanks ai for some math
  if (totalCards < 2) return 0;
  const centerIndex = (totalCards - 1) / 2;
  const offsetFromCenter = index - centerIndex;
  const maxTiltAngle = 3;
  // "quadratic function" apparently
  const tiltAngle = (offsetFromCenter * maxTiltAngle) / centerIndex;

  return tiltAngle;
}

export default function StackableCard({
  card,
  index,
  totalCards,
}: {
  card: DeckCard;
  index: number;
  totalCards: number;
}) {
  const [active, setActive] = useState(false);
  const debouncedSetActive = useDebouncedCallback(setActive, 50);
  const ref = useOnclickOutside(() => setActive(false));

  return (
    <div
      className="contents"
      onTouchEnd={() => debouncedSetActive((a) => !a)}
      ref={ref}
    >
      <div className="hidden md:contents">
        <img
          key={card.id}
          className={`w-full max-w-64 rounded-2xl border border-zinc-700 hover:z-30 hover:!scale-125 ${active ? "z-20" : "z-10"} transition-transform`}
          src={card.image}
          alt={card.id}
          style={{
            marginRight: getMarginRight(index, totalCards),
            transform: `rotate(${getTiltAngle(index, totalCards)}deg)`,
          }}
        />
      </div>
      <div className="contents md:hidden">
        <img
          key={card.id}
          className={`w-64 max-w-fit rounded-2xl border border-zinc-700 transition-all${active ? "z-20 scale-125 border-orange-300" : "z-10"}`}
          src={card.image}
          alt={card.id}
          style={{
            marginTop: getMarginTop(index, totalCards),
          }}
        />
      </div>
    </div>
  );
}
