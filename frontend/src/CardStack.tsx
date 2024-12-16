import StackableCard from "./StackableCard";

export function CardStack({ cards }: { cards: DeckCard[] }) {
  return (
    <div className="flex select-none flex-col items-start justify-start gap-3 md:flex-row md:items-center md:gap-6">
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
