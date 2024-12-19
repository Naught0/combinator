import { FC } from "react";
import { Deck } from "../Deck";

interface Props {
  decks: Deck[];
}

export type YesNoAny = "yes" | "no" | "any";

export const UserDecksContainer: FC<Props> = ({ decks }) => {
  return (
    <div className="wrap grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
      {decks.map((deck) => (
        <Deck key={deck.id} deck={deck} />
      ))}
    </div>
  );
};
