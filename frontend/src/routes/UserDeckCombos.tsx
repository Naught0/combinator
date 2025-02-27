import { ComboContainer } from "@/ComboContainer";
import { Error } from "@/Error";
import { Hyperlink } from "@/Hyperlink";
import { IconText } from "@/IconText";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { PropsWithChildren } from "react";
import { useParams } from "react-router";

export function UserDeckCombos({ source }: { source: DeckSource }) {
  let { userId, deckId } = useParams();
  if (!userId) return <Error message={"User not found"} />;
  if (!deckId) return <Error message={"Deck not found"} />;

  return (
    <Container>
      {source === "moxfield" && (
        <Hyperlink href={`/user/moxfield/${userId}`}>
          <IconText className="text-base text-orange-100" icon={faArrowLeft}>
            {userId}'s decks
          </IconText>
        </Hyperlink>
      )}
      <ComboContainer deckId={deckId} source={source} />
    </Container>
  );
}

function Container({ children }: PropsWithChildren) {
  return <article className="flex flex-1 flex-col gap-3">{children}</article>;
}
