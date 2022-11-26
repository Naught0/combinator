interface CreatedByUser {
  userName: string;
  badges: string[];
}

interface Author {
  userName: string;
  badges: string[];
}

interface Deck {
  id: string;
  name: string;
  hasPrimer: boolean;
  format: Format;
  areCommentsEnabled: boolean;
  visibility: string;
  publicUrl: string;
  publicId: string;
  likeCount: number;
  viewCount: number;
  commentCount: number;
  isLegal: boolean;
  authorsCanEdit: boolean;
  isShared: boolean;
  mainCardId: string;
  mainCardIdIsCardFace: boolean;
  createdByUser: CreatedByUser;
  authors: Author[];
  createdAtUtc: Date;
  lastUpdatedAtUtc: Date;
  mainboardCount: number;
  sideboardCount: number;
  maybeboardCount: number;
  hubNames: string[];
}

interface MoxfieldDecksResults {
  pageNumber: number;
  pageSize: number;
  totalResults: number;
  totalPages: number;
  data: Deck[];
}

type Format =
  | "standard"
  | "future"
  | "historic"
  | "gladiator"
  | "pioneer"
  | "explorer"
  | "modern"
  | "legacy"
  | "pauper"
  | "vintage"
  | "penny"
  | "commander"
  | "brawl"
  | "historicbrawl"
  | "alchemy"
  | "paupercommander"
  | "duel"
  | "oldschool"
  | "premodern";
