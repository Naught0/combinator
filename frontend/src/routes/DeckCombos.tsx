import { ComboContainer } from "@/ComboContainer";
import { useParams, Navigate } from "react-router";

export function DeckCombos() {
  let { source, deckId, tab } = useParams<{ source: DeckSource; deckId: string; tab: string }>();
  if (!source || !deckId) return null;

  if (!tab) {
    return <Navigate to={`/deck/${source}/${deckId}/combos`} replace />;
  }

  return <ComboContainer deckId={deckId} source={source} />;
}
