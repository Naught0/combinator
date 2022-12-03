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
  value: DeckLegalityValue;
  className?: string;
}
type DeckLegalityValue = boolean | null;
export const deckLegalityMap = new Map<
  string | boolean | null,
  DisplayValueItem
>([
  [null, { className: "", display: "Any", value: null }],
  [false, { className: "has-text-danger", display: "Not legal", value: false }],
  [true, { className: "has-text-primary", display: "Legal", value: true }],
  ["Any", { className: "", display: "Any", value: null }],
  ["Legal", { className: "has-text-primary", display: "Legal", value: true }],
  [
    "Not legal",
    { className: "has-text-danger", display: "Not legal", value: false },
  ],
]);

export const uniqueDeckFormatMap = new Map<string, string>([
  ["historicbrawl", "Historic Brawl"],
  ["pauperEdh", "Pauper Commander"],
]);
