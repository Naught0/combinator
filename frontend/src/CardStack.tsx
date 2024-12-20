import StackableCard from "./StackableCard";

export function CardStack({ cards }: { cards: DeckCard[] }) {
  return (
    <div className="flex w-full select-none flex-col items-center justify-center gap-3 md:flex-row md:gap-5">
      {cards.map((card, index) => (
        <StackableCard
          key={card.id}
          card={card}
          index={index}
          totalCards={cards.length}
        />
      ))}
    </div>
  );
}
