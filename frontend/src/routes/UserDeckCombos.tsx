import { NotFound } from "@/404";
import { ComboContainer } from "@/ComboContainer";
import { IconText } from "@/IconText";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from "react-router";

export function UserDeckCombos({ source }: { source: DeckSource }) {
  let { userId, deckId } = useParams();
  if (!userId) return <NotFound what={"User"} />;
  if (!deckId) return <NotFound what={"Deck"} />;

  return (
    <div className="flex flex-1 flex-col gap-3">
      <Link to={`/user/${source}/${userId}`}>
        <IconText icon={faArrowLeft}>Back to decks</IconText>
      </Link>
      <ComboContainer deckId={deckId} source={source} />
    </div>
  );
}
