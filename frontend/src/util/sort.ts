import { SortDirection } from "../UserDeck/UserDecksContainer";
import dayjs from "dayjs";

export const sortAndFilterUserDecks = (
  decks: Deck[],
  titleFilter: string,
  formatFilter: string,
  sortDir: SortDirection,
  sortBy: keyof Deck
): Deck[] => {
  const pattern = /[^\w]+/g;
  let ret = [];
  for (const deck of decks) {
    if (
      titleFilter &&
      !deck.name.replaceAll(pattern, "").toLowerCase().includes(titleFilter)
    )
      continue;
    if (formatFilter && !(deck.format.toLowerCase() === formatFilter)) continue;
    ret.push(deck);
  }

  // Sort ASC by default
  ret.sort((a, b) => {
    const dateKeys: (keyof Deck)[] = ["createdAtUtc", "lastUpdatedAtUtc"];
    if (dateKeys.includes(sortBy)) {
      console.log("iskeyof")
      const bool = dayjs(a[sortBy] as string).isAfter(b[sortBy] as string);
      if (sortDir === SortDirection.ASC) return bool ? 1 : -1;
      else return bool ? -1 : 1;
    }
    return 0;
  });

  return ret;
};
