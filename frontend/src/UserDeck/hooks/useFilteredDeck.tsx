import { useMemo } from "react";
import { sortAndFilterUserDecks } from "../../util";
import { SortDirection } from "../UserDecksContainer";

interface props {
  decks: Deck[];
  sortDir: SortDirection;
  sortBy: keyof Deck;
  titleFilter: string;
  formatFilter?: Format;
}
export const useFilteredDeck = (props: props) => {
  const data = useMemo(() => {
    return sortAndFilterUserDecks(props);
  }, [props]);

  return data;
};
