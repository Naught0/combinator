import { atom } from "recoil";

export const hoveredCard = atom<string>({
  key: "hoveredCard",
  default: undefined,
});
