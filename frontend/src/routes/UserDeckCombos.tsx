import { ComboContainer } from "@/ComboContainer";
import { Button } from "@/components/ui/button";
import { Error } from "@/Error";
import { IconText } from "@/IconText";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { PropsWithChildren } from "react";
import { useNavigate, useParams } from "react-router";

export function UserDeckCombos({ source }: { source: DeckSource }) {
  let { userId, deckId } = useParams();
  let navigate = useNavigate();
  if (!userId) return <Error message={"User not found"} />;
  if (!deckId) return <Error message={"Deck not found"} />;

  return (
    <Container>
      <Button variant={"link"} className="w-fit" onClick={() => navigate(-1)}>
        <IconText
          className="text-lg text-orange-100 md:text-xl"
          icon={faArrowLeft}
        >
          Back to decks
        </IconText>
      </Button>
      <ComboContainer deckId={deckId} source={source} />
    </Container>
  );
}

function Container({ children }: PropsWithChildren) {
  return <article className="flex flex-1 flex-col gap-3">{children}</article>;
}
