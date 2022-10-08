interface Combo {
  c: string[];
  d: number;
  i: string;
  p: string;
  r: string;
  s: string;
}

interface DeckMeta {
  name: string;
  author: string;
  url: string;
}

interface CardsWithImages {
  [card_name: string]: string;
}

interface DeckData {
  meta: DeckMeta;
  cards: CardsWithImages;
  combos: Combo[];
  one: Combo[] | [];
  two: Combo[] | [];
}
