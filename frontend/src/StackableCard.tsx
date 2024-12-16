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
  if (totalCards <= 0) return 0;
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
  return (
    <div className="contents">
      <div className="hidden md:contents">
        <img
          key={card.id}
          className={`w-64 max-w-fit rounded-2xl border border-zinc-700 transition-all delay-75 md:w-64 lg:w-64 xl:w-72`}
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
          className={`w-64 max-w-fit rounded-2xl border border-zinc-700 transition-all delay-75 md:w-64 lg:w-64 xl:w-72`}
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
