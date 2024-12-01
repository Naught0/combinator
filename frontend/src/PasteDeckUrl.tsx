import { useEffect, useState } from "react";
import { Input } from "./components/ui/input";
import { useQuery } from "react-query";
import { getDeckData } from "./services";
import { Field } from "./Field";
import type { AxiosError } from "axios";
import { TabContainer } from "./TabContainer";
import { Form } from "./Form";
import { deckDataAtom } from "./atoms";
import { useSetRecoilState } from "recoil";

export function PasteDeckUrl() {
  const [deckUrl, setDeckUrl] = useState("");
  const [enabled, setEnabled] = useState(false);
  const setDeckData = useSetRecoilState(deckDataAtom);
  const { data, error, isLoading } = useQuery<DeckData, AxiosError>(
    ["deck-data", deckUrl],
    () => getDeckData(deckUrl),
    {
      enabled,
      onSettled() {
        setEnabled(false);
      },
    },
  );
  useEffect(
    function setDeckDataAtom() {
      setDeckData(data);
    },
    [data],
  );
  return (
    <TabContainer>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          setEnabled(true);
        }}
        loading={isLoading}
        disabled={deckUrl.length < 5}
      >
        <Field error={error && "Unable to find deck"}>
          <Input
            type="text"
            variant={error ? "error" : "default"}
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
