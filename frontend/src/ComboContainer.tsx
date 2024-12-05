import { ComboTabs } from "./ComboTabs";
import { Loading } from "./Loading";
import { getDeckById } from "./services";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { DeckInfo } from "./DeckInfo";

// TODO: Move deck data to parent component let the data flow down to combos and other components
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

  return (
    <div className="flex flex-col gap-3">
      {isLoading && <Loading size="lg" message="Loading deck" />}
      {deckData && <DeckInfo deckData={deckData} />}
      {deckData && <ComboTabs deckData={deckData} />}
    </div>
  );
};
