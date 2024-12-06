import { ComboContainer } from "@/ComboContainer";
import { IconText } from "@/IconText";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from "react-router";

export function UserDeckCombos({ source }: { source: DeckSource }) {
  let { userId, deckId } = useParams();
  if (!userId || !deckId) return null; // TODO: Redirect to 404

  return (
    <div className="flex flex-col gap-3">
      <Link to={`/user/${source}/${userId}`}>
        <IconText icon={faArrowLeft}>Back to decks</IconText>
      </Link>
      <ComboContainer deckId={deckId} source={source} />
    </div>
  );
}
