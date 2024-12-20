interface DeckFilter {
  key: "created" | "updated" | "name";
  display: string;
}
export const deckFilters: DeckFilter[] = [
  { key: "created", display: "Created at" },
  { key: "updated", display: "Updated at" },
  { key: "name", display: "Deck name" },
];
