import { ComboTabs } from "./ComboTabs";
import { Loading } from "./Loading";
import { getDeckById } from "./services";
import { AxiosError } from "axios";
import { useQuery } from "@tanstack/react-query";
import { DeckInfo } from "./DeckInfo";
import { Error } from "./Error";

export const ComboContainer = ({
  deckId,
  source,
}: {
  deckId: string;
  source: DeckSource;
}) => {
  const {
    data: deckData,
    isLoading,
    isError,
    error,
  } = useQuery<DeckData, AxiosError>({
    queryKey: ["deck-data", { id: deckId, source }],
    queryFn: () => getDeckById(source, deckId),
  });
  const { meta } = deckData || {};
  if (error?.response?.status === 404)
    return <Error message={"Deck not found"} />;

  return (
    <div className="flex flex-col gap-3">
      {isLoading && <Loading size="lg" message="Loading deck" />}
      {meta && <DeckInfo meta={meta} />}
      {deckData && <ComboTabs deckData={deckData} />}
      {isError && (
        <Error
          code={error?.response?.status || 500}
          message={
            typeof error?.response?.data === "string"
              ? error.response.data
              : "Something went wrong"
          }
        />
      )}
    </div>
  );
};
