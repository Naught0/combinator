import { ComboTabs } from "./ComboTabs";
import { Loading } from "./Loading";
import { getDeckById } from "./services";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { DeckInfo } from "./DeckInfo";

export const ComboContainer = ({
  deckId,
  source,
}: {
  deckId: string;
  source: DeckSource;
}) => {
  const { data: deckData, isLoading } = useQuery<DeckData, AxiosError>({
    queryKey: ["deck-data", { id: deckId, source }],
    queryFn: () => getDeckById(source, deckId),
  });
  const { meta } = deckData || {};

  return (
    <div className="flex flex-col gap-3">
      {isLoading && <Loading size="lg" message="Loading deck" />}
      {meta && <DeckInfo meta={meta} />}
      {deckData && <ComboTabs deckData={deckData} />}
    </div>
  );
};
