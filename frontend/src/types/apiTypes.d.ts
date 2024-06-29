interface DeckMeta {
  name: string;
  author: string;
  url: string;
}

type CardsWithImages = Record<string, string>;

interface DeckCard {
  id: string;
  name: string;
  image: string;
  oracle_text: string;
}

interface DeckData {
  meta: DeckMeta;
  cards: DeckCard[];
}
