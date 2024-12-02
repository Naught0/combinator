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

export const moxfieldUserNameAtom = atom<string>({
  key: "MoxfieldUserName",
  default: "",
});

export const deckUrlAtom = atom<string>({
  key: "DeckUrl",
  default: "",
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
