import { ComboContainer } from "@/ComboContainer";
import { useParams } from "react-router";

export function PasteCombos() {
  const { deckId } = useParams<{ deckId: string }>();
  if (!deckId) return null;

  return <ComboContainer deckId={deckId} source="paste" />;
}