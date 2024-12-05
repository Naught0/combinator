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

type DeckSource = "moxfield" | "archidekt" | "mtggoldfish";
interface DeckData {
  id: string;
  source: DeckSource;
  meta: DeckMeta;
  cards: DeckCard[];
}
