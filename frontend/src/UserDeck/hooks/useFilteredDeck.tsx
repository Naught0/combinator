import { useMemo } from "react";
import { sortAndFilterUserDecks } from "../../util";
import { SortDirection } from "../UserDecksContainer";

interface props {
  decks: Deck[];
  sortDir: SortDirection;
  sortBy: keyof Deck;
  titleFilter?: string;
  formatFilter?: Legality;
}
export const useFilteredDeck = ({
  decks,
  sortBy,
  sortDir,
  formatFilter,
  titleFilter,
}: props) => {
  const data = useMemo(() => {
    return sortAndFilterUserDecks(
      decks,
      titleFilter || "",
      formatFilter || "",
      sortDir,
      sortBy
    );
  }, [decks, titleFilter, formatFilter, sortDir, sortBy]);

  return data;
};
