import dayjs from "dayjs";
import fuzzysort from "fuzzysort";
import { YesNoAny } from "@/UserDeck";

interface props {
  decks: Deck[];
  titleFilter: string;
  sortBy: keyof Deck;
  formatFilter: Format;
  isLegal: YesNoAny;
}
export const sortAndFilterUserDecks = ({
  decks,
  sortBy,
  titleFilter,
  formatFilter,
  isLegal,
}: props): Deck[] => {
  let ret = titleFilter
    ? fuzzysort
        .go(titleFilter, decks, { key: "name", threshold: 0.5 })
        .map((res) => res.obj)
    : decks;
  switch (isLegal) {
    case "yes":
      ret = ret.filter((deck) => deck.isLegal);
      break;
    case "no":
      ret = ret.filter((deck) => !deck.isLegal);
      break;
    default:
      break;
  }
  if (formatFilter !== "any") {
    ret = ret.filter((deck) => deck.format === formatFilter);
  }

  // Sort DESC by default
  ret.sort((a, b) => {
    const dateKeys: (keyof Deck)[] = ["createdAtUtc", "lastUpdatedAtUtc"];
    if (dateKeys.includes(sortBy)) {
      const bool = dayjs(a[sortBy] as string).isAfter(b[sortBy] as string);
    }
    return 0;
  });

  return ret;
};
