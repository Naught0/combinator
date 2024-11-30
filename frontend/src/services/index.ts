import { cachedClient } from "./cachedRequest";

export const getMoxfieldUserData = async ({
  userName,
  page,
  pageSize,
}: {
  userName: string;
  page?: number;
  pageSize?: number;
}): Promise<Deck[]> => {
  const { data } = await cachedClient.post<Deck[]>(
    import.meta.env.VITE_API_URL + "/api/search/user",
    { userName, page, pageSize },
  );
  return data;
};

export const getDeckData = async (url: string): Promise<DeckData> => {
  const { data } = await cachedClient.get<DeckData>(
    import.meta.env.VITE_API_URL + "/api/search/deck",
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
    import.meta.env.VITE_API_URL + "/api/search/combo",
    json,
    {
      headers: { "Content-Type": "application/json" },
    },
  );
  return data;
};
