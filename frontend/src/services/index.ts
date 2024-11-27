import { cachedClient } from "./cachedRequest";

export const getDeckData = async (url: string): Promise<DeckData> => {
  const { data } = await cachedClient.get<DeckData>(
    import.meta.env.VITE_GCLOUD_URL + "/api/search/deck",
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
    import.meta.env.VITE_GCLOUD_URL + "/api/search/combo",
    json,
    {
      headers: { "Content-Type": "application/json" },
    },
  );
  return data;
};
