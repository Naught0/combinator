import { parseCardList } from "@/PasteList";
import { atom, selector } from "recoil";

export const deckDataAtom = atom<DeckData | undefined>({
  key: "DeckData",
  default: undefined,
});

export const comboDataAtom = atom<Results | undefined>({
  key: "ComboData",
  default: undefined,
});

export const pastedDeckListAtom = atom<string>({
  key: "PastedDeckList",
  default: "",
});

export const pastedCardNamesAtom = selector<string[]>({
  key: "PastedCardNames",
  get: ({ get }) => {
    const list = get(pastedDeckListAtom);
    return parseCardList(list);
  },
});
