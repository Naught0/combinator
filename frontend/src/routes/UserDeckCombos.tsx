import { ComboContainer } from "@/ComboContainer";
import { Error } from "@/Error";
import { Hyperlink } from "@/Hyperlink";
import { IconText } from "@/IconText";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { PropsWithChildren } from "react";
import { Navigate, useParams } from "react-router";

export function UserDeckCombos() {
  let { source, userId, deckId, tab } = useParams();
  if (!userId) return <Error message={"User not found"} />;
  if (!deckId) return <Error message={"Deck not found"} />;
  if (!source) return <Error message={"Source not found"} />;

  const basePath = `/user/${source}/${userId}/deck/${deckId}`;

  if (!tab) {
    return <Navigate to={`${basePath}/combos`} replace />;
  }

  return (
    <Container>
      {source === "moxfield" && (
        <Hyperlink href={`/user/moxfield/${userId}`} target="">
          <IconText className="text-base text-hit-pink-200" icon={faArrowLeft}>
            {userId}'s decks
          </IconText>
        </Hyperlink>
      )}
      <ComboContainer deckId={deckId} source={source as DeckSource} />
    </Container>
  );
}

function Container({ children }: PropsWithChildren) {
  return <article className="flex flex-1 flex-col gap-3">{children}</article>;
}
