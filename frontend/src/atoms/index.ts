import { atom } from "recoil";

export const deckDataAtom = atom<DeckData | undefined>({
  key: "DeckData",
  default: undefined,
});

export const comboDataAtom = atom<ComboData | undefined>({
  key: "ComboData",
  default: undefined,
});
