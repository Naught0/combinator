import { cachedClient } from "./cachedRequest";

export const getComboData = async (url: string): Promise<DeckData> => {
  try {
    const { data } = await cachedClient.get("/api/search", {
      params: { url: url },
    });
    return await data;
  } catch (e) {
    throw e;
  }
};
