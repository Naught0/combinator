export const cardTypes: CardType[] = [
  "artifact",
  "battle",
  "conspiracy",
  "creature",
  "enchantment",
  "instant",
  "land",
  "phenomenon",
  "planeswalker",
  "plane",
  "scheme",
  "sorcery",
  "tribal",
  "vanguard",
] as const;

export function determineCardSuperType(typeLine: string) {
  for (const type of cardTypes) {
    if (typeLine.toLowerCase().includes(type)) {
      return type;
    }
  }

  return "unknown";
}
