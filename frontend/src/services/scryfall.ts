export const cardNameToImageSrc = (cardName: string): string => {
  return `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}&format=image&version=normal`;
};
