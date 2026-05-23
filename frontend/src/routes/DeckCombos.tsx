import { ComboContainer } from "@/ComboContainer";
import { useParams, Navigate, useSearchParams } from "react-router";

export function DeckCombos() {
  let { source, deckId } = useParams<{ source: DeckSource; deckId: string }>();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "combos";

  if (!source || !deckId) return null;

  if (!tab) {
    return <Navigate to={`/deck/${source}/${deckId}?tab=combos`} replace />;
  }

  return <ComboContainer deckId={deckId} source={source} />;
}
