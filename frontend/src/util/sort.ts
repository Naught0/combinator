import dayjs from "dayjs";
import { SortDirection } from "../UserDeck/util/sort";
import fuzzysort from "fuzzysort";

interface props {
  decks: Deck[];
  titleFilter: string;
  sortDir: SortDirection;
  sortBy: keyof Deck;
  formatFilter?: Format;
  isLegal: boolean | null;
}
export const sortAndFilterUserDecks = ({
  decks,
  sortBy,
  sortDir,
  titleFilter,
  isLegal,
}: props): Deck[] => {
  let ret = titleFilter
    ? fuzzysort
        .go(titleFilter, decks, { key: "name", threshold: 0.5 })
        .map((res) => res.obj)
    : decks;
  if (isLegal !== null) {
    ret = ret.filter((deck) => deck.isLegal === isLegal);
  }

  // Sort DESC by default
  ret.sort((a, b) => {
    const dateKeys: (keyof Deck)[] = ["createdAtUtc", "lastUpdatedAtUtc"];
    if (dateKeys.includes(sortBy)) {
      const bool = dayjs(a[sortBy] as string).isAfter(b[sortBy] as string);
      if (sortDir === SortDirection.ASC) return bool ? 1 : -1;
      else return bool ? -1 : 1;
    }
    return 0;
  });

  return ret;
};
