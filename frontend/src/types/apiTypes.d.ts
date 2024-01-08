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
  in_deck: boolean;
}

interface DeckData {
  meta: DeckMeta;
  cards: DeckCard[];
}

interface ComboData {
  identity: string;
  included: AlmostIncluded[];
  includedByChangingCommanders: AlmostIncluded[];
  almostIncluded: AlmostIncluded[];
  almostIncludedByAddingColors: AlmostIncluded[];
  almostIncludedByChangingCommanders: AlmostIncluded[];
  almostIncludedByAddingColorsAndChangingCommanders: AlmostIncluded[];
}

interface AlmostIncluded {
  id: string;
  status: string;
  uses: ComboPiece[];
  requires: never[];
  produces: Produce[];
  of: Include[];
  includes: Include[];
  identity: string;
  manaNeeded: string;
  manaValueNeeded: number;
  otherPrerequisites: string;
  description: string;
  popularity: number;
  spoiler: boolean;
  legalities: { [key: string]: boolean };
  prices: Prices;
}

interface Include {
  id: number;
}

interface Prices {
  tcgplayer: string;
  cardkingdom: string;
  cardmarket: string;
}

interface Produce {
  id: number;
  name: string;
  description: string;
}

interface ComboPiece {
  card: ComboCard;
  zoneLocations: ZoneLocation[];
  battlefieldCardState: string;
  exileCardState: string;
  libraryCardState: string;
  graveyardCardState: string;
  mustBeCommander: boolean;
}

interface ComboCard {
  id: number;
  name: string;
  oracleId: string;
  spoiler: boolean;
}

type ZoneLocation = "B" | "G" | "H" | "E" | "C";
