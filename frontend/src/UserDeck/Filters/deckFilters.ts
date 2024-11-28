import { YesNoAny } from "../UserDecksContainer";

interface DeckFilter {
  key: keyof Deck;
  display: string;
}
export const deckFilters: DeckFilter[] = [
  { key: "createdAtUtc", display: "Created at" },
  { key: "lastUpdatedAtUtc", display: "Updated at" },
];

interface DisplayValueItem {
  display: string;
  value: YesNoAny;
  className?: string;
}
export const deckLegalities: DisplayValueItem[] = [
  { className: "", display: "Any", value: "any" },
  { className: "text-rose-400", display: "Not legal", value: "no" },
  { className: "text-green-400", display: "Legal", value: "yes" },
];

export const uniqueDeckFormatMap = new Map<string, string>([
  ["historicbrawl", "Historic Brawl"],
  ["pauperEdh", "Pauper Commander"],
]);
