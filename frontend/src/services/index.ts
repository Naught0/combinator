import { type DeckFilterParams } from "@/routes/MoxfieldUser";
import { cachedClient } from "./cachedRequest";

export const getMoxfieldUserExists = async (userName: string) => {
  await cachedClient.head<boolean>(
    `${import.meta.env.VITE_API_URL}/api/user/moxfield/${userName}/exists`,
  );
  return true;
};

export const getMoxfieldUserData = async (body: Partial<DeckFilterParams>) => {
  const { data } = await cachedClient.post<MoxfieldDecksResults>(
    import.meta.env.VITE_API_URL + "/api/user",
    body,
  );
  return data;
};

export const getDeckById = async (source: DeckSource, id: string) => {
  const { data } = await cachedClient.get<DeckData>(
    `${import.meta.env.VITE_API_URL}/api/deck/${source}/${id}`,
  );
  return data;
};

export const parseDeckUrl = async (url: string): Promise<DeckData> => {
  const { data } = await cachedClient.get<DeckData>(
    import.meta.env.VITE_API_URL + "/api/deck/parse_url",
    {
      params: { url },
    },
  );
  return data;
};

type Card = {
  card: string;
  quantity: number;
};

export const getComboData = async (json: {
  main: Card[];
  commanders: Card[];
}): Promise<Results> => {
  const { data } = await cachedClient.post<Results>(
    import.meta.env.VITE_API_URL + "/api/combo",
    json,
    {
      headers: { "Content-Type": "application/json" },
    },
  );
  return data;
};

export const getCardData = async (cards: string[]): Promise<CardResponse> => {
  const { data } = await cachedClient.post<CardResponse>(
    import.meta.env.VITE_API_URL + "/api/card/search",
    { cards },
    {
      headers: { "Content-Type": "application/json" },
    },
  );
  return data;
};
