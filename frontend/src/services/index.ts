import { cachedClient } from "./cachedRequest";

export const getDeckData = async (url: string): Promise<DeckData> => {
  const { data } = await cachedClient.get<DeckData>("/api/deck/search", {
    params: { url },
  });
  return data;
};

export const getComboData = async (json: {
  main: string[];
  commanders: string[];
}): Promise<ComboData> => {
  const { data } = await cachedClient.post<ComboData>(
    "/api/combo/search",
    json,
  );
  return data;
};
