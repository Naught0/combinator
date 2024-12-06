import { ComboContainer } from "@/ComboContainer";
import { useParams } from "react-router";

export function DeckCombos() {
  let { source, deckId } = useParams<{ source: DeckSource; deckId: string }>();
  if (!source || !deckId) return null; // TODO: Redirect to 404

  return <ComboContainer deckId={deckId} source={source} />;
}
