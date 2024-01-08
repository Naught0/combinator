import { useMemo } from "react";
import { sortAndFilterUserDecks } from "../../util";
import { SortDirection } from "../util/sort";

interface props {
  decks: Deck[];
  sortDir: SortDirection;
  sortBy: keyof Deck;
  titleFilter: string;
  formatFilter?: Format;
  isLegal: boolean | null;
}
export const useFilteredDeck = (props: props) => {
  const data = useMemo(() => {
    return sortAndFilterUserDecks(props);
  }, [props]);

  return data;
};
