import { ComboContainer } from "@/ComboContainer";
import { ComboTabs } from "@/ComboTabs";
import { Loading } from "@/Loading";
import { parseCardList } from "@/PasteList";
import { getComboData } from "@/services";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useParams } from "react-router";

export function Paste() {
  const { pastedList } = useParams<{ pastedList: string }>();
  if (!pastedList) return null;

  const { data, isLoading } = useQuery<Results, AxiosError>({
    queryKey: ["combo-data", pastedList],
    queryFn: () =>
      getComboData({
        main: parseCardList(decodeURIComponent(pastedList)).map((name) => ({
          card: name,
          quantity: 1,
        })),
        commanders: [],
      }),
  });
  if (!data || isLoading) return <Loading size="lg" message="Loading combos" />;

  return <ComboTabs deckData={data} />;
}
