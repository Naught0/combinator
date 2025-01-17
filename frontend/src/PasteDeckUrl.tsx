import { useNavigate, useParams } from "react-router";
import { Field } from "./Field";
import { Form } from "./Form";
import { TabContainer } from "./TabContainer";
import { Input } from "./components/ui/input";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { parseDeckUrl } from "./services";
import { AxiosError } from "axios";

export function PasteDeckUrl() {
  const { deckUrl } = useParams<{ deckUrl: string }>();
  const [enabled, setEnabled] = useState(false);
  const [value, setValue] = useState(deckUrl ?? "");
  let navigate = useNavigate();
  const { data } = useQuery<DeckData, AxiosError>({
    queryKey: ["deck-url", value],
    queryFn: async () => {
      return await parseDeckUrl(value);
    },
    enabled,
  });
  useEffect(
    function redirectOnDeckData() {
      if (!data) return;
      setEnabled(false);
      navigate(`/deck/${data.source}/${data.id}`, { replace: true });
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
        disabled={value.length < 5}
      >
        <Field>
          <Input
            name="deck-url"
            type="text"
            placeholder="Moxfield, Archidekt, or MTGGoldfish deck URL"
            onInput={(e) => {
              setValue((e.target as HTMLInputElement).value);
            }}
            value={value}
          />
        </Field>
      </Form>
    </TabContainer>
  );
}
