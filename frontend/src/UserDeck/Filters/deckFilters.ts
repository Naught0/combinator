interface DeckFilter {
  key: keyof Deck;
  display: string;
}
export const deckFilters: DeckFilter[] = [
  { key: "createdAtUtc", display: "Created at" },
  { key: "lastUpdatedAtUtc", display: "Updated at" },
];
