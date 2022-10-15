import axios from "axios";

export const getComboData = async (url: string): Promise<DeckData> => {
  try {
    const { data } = await axios.get("/api/search", {
      params: { url: url },
    });
    return await data;
  } catch (e) {
    throw e;
  }
};
