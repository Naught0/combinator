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

export const getComboData = async (json: {
  main: string[];
  commanders: string[];
}): Promise<Results> => {
  const { data } = await cachedClient.post<Results>(
    import.meta.env.VITE_WORKER_URL,
    json,
    {
      headers: { "Content-Type": "application/json" },
    },
  );
  return data;
};
