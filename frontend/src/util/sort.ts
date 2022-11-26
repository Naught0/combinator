import { SortDirection } from "../UserDeck/UserDecksContainer";
import dayjs from "dayjs";

interface props {
  decks: Deck[];
  titleFilter: string;
  sortDir: SortDirection;
  sortBy: keyof Deck;
  formatFilter?: Format;
}
export const sortAndFilterUserDecks = ({
  decks,
  sortBy,
  sortDir,
  titleFilter,
  formatFilter,
}: props): Deck[] => {
  const pattern = /[^\w]+/g;
  let ret = [];
  for (const deck of decks) {
    if (
      titleFilter &&
      !deck.name.replaceAll(pattern, "").toLowerCase().includes(titleFilter)
    )
      continue;
    if (formatFilter && !(deck.format.toLowerCase() === formatFilter.toLowerCase())) continue;
    ret.push(deck);
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
