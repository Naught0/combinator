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
    import.meta.env.VITE_API_URL + "/api/user",
    { userName, page, pageSize },
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
