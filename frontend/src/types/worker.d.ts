interface Results {
  identity: Identity;
  included: AlmostIncluded[];
  includedByChangingCommanders: any[];
  almostIncluded: AlmostIncluded[];
  almostIncludedByAddingColors: AlmostIncluded[];
  almostIncludedByChangingCommanders: any[];
  almostIncludedByAddingColorsAndChangingCommanders: any[];
}

interface AlmostIncluded {
  id: string;
  of: Include[];
  uses: Require[];
  notes: string;
  prices: Prices;
  status: Status;
  spoiler: boolean;
  identity: string;
  includes: Include[];
  produces: Produce[];
  requires: Require[];
  legalities: { [key: string]: boolean };
  popularity: number | null;
  description: string;
  manaNeeded: string;
  manaValueNeeded: number;
  otherPrerequisites: string;
}

interface Include {
  id: number;
}

interface Prices {
  tcgplayer: string;
  cardmarket: string;
  cardkingdom: string;
}

interface Produce {
  feature: Feature;
  quantity: number;
}

interface Feature {
  id: number;
  name: string;
  uncountable: boolean;
}

interface Require {
  card?: Card;
  quantity: number;
  zoneLocations: Identity[];
  exileCardState: ExileCardState;
  mustBeCommander: boolean;
  libraryCardState: string;
  graveyardCardState: string;
  battlefieldCardState: string;
  template?: Template;
}

interface Card {
  id: number;
  name: string;
  spoiler: boolean;
  oracleId: string;
}

type ExileCardState = string;

interface Template {
  id: number;
  name: string;
  scryfallApi: string;
  scryfallQuery: string;
}

type Identity = "B" | "H" | "C" | "G" | "E";

type Status = "OK";
