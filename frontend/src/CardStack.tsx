import StackableCard from "./StackableCard";

export function CardStack({ cards }: { cards: DeckCard[] }) {
  return cards.map((card, index) => (
    <StackableCard
      key={card.id}
      card={card}
      index={index}
      totalCards={cards.length}
    />
  ));
}
