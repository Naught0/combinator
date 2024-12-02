import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useRecoilState } from "recoil";
import { Field } from "./Field";
import { Form } from "./Form";
import { TabContainer } from "./TabContainer";
import { deckUrlAtom } from "./atoms";
import { Input } from "./components/ui/input";

export function PasteDeckUrl() {
  const { deckUrl: urlDeckUrl } = useParams<{ deckUrl: string }>();
  const [deckUrl, setDeckUrl] = useRecoilState(deckUrlAtom);
  let navigate = useNavigate();
  useEffect(
    function initDeckUrl() {
      if (urlDeckUrl) return setDeckUrl(urlDeckUrl);
    },
    [urlDeckUrl],
  );
  return (
    <TabContainer>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          navigate(`/deck/${encodeURIComponent(deckUrl)}`);
        }}
        disabled={deckUrl.length < 5}
      >
        <Field>
          <Input
            name="deck-url"
            type="text"
            placeholder="Moxfield, Archidekt, or MTGGoldfish deck URL"
            onInput={(e) => {
              setDeckUrl((e.target as HTMLInputElement).value);
            }}
            value={deckUrl}
          />
        </Field>
      </Form>
    </TabContainer>
  );
}
