import { ComboContainer } from "@/ComboContainer";
import { BackToSearch } from "@/GoBack";
import { useParams } from "react-router";

export function DeckCombos() {
  let { source, deckId } = useParams<{ source: DeckSource; deckId: string }>();
  if (!source || !deckId) return null; // TODO: Redirect to 404

  return (
    <main className="flex flex-col gap-3">
      <ComboContainer deckId={deckId} source={source} />
    </main>
  );
}
