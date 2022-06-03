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

interface DeckData {
  meta: DeckMeta;
  cards: string[];
  combos: Combo[];
}