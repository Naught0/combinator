import { YesNoAny } from "../UserDecksContainer";

interface DeckFilter {
  key: "created" | "updated" | "name";
  display: string;
}
export const deckFilters: DeckFilter[] = [
  { key: "created", display: "Created at" },
  { key: "updated", display: "Updated at" },
  { key: "name", display: "Deck name" },
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
