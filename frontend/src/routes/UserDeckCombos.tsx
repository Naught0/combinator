import { ComboContainer } from "@/ComboContainer";
import { Error } from "@/Error";
import { IconText } from "@/IconText";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { PropsWithChildren } from "react";
import { Link, useParams } from "react-router";

export function UserDeckCombos({ source }: { source: DeckSource }) {
  let { userId, deckId } = useParams();
  if (!userId) return <Error message={"User not found"} />;
  if (!deckId) return <Error message={"Deck not found"} />;

  return (
    <Container>
      <Link to={`/user/${source}/${userId}`}>
        <IconText icon={faArrowLeft}>Back to decks</IconText>
      </Link>
      <ComboContainer deckId={deckId} source={source} />
    </Container>
  );
}

function Container({ children }: PropsWithChildren) {
  return <article className="flex flex-1 flex-col gap-3">{children}</article>;
}
