import { ComboContainer } from "@/ComboContainer";
import { getComboData, getDeckData } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useParams } from "react-router";

export function DeckCombos() {
  let { deckUrl } = useParams<{ deckUrl: string }>();
  if (!deckUrl) return null;

  const { data: deckData } = useQuery<DeckData, AxiosError>({
    queryKey: ["deck-data", deckUrl],
    queryFn: () => getDeckData(decodeURIComponent(deckUrl!)),
  });
  const { data: comboData, isLoading: comboLoading } = useQuery({
    queryKey: ["combo-data", deckData?.meta.url],
    queryFn: async () => {
      const d = await getComboData({
        commanders: [],
        main: deckData!.cards.map((c) => ({ card: c.name, quantity: 1 })),
      });
      return d;
    },
    enabled: !!deckData?.cards,
  });

  return <ComboContainer allCombos={comboData} deckData={deckData} />;
}
