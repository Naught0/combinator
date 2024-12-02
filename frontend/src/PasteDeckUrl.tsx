import { useEffect, useState } from "react";
import { Input } from "./components/ui/input";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getComboData, getDeckData } from "./services";
import { Field } from "./Field";
import type { AxiosError } from "axios";
import { TabContainer } from "./TabContainer";
import { Form } from "./Form";
import { comboDataAtom, deckDataAtom } from "./atoms";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ComboContainer } from "./ComboContainer";

export function PasteDeckUrl() {
  const [deckUrl, setDeckUrl] = useState("");
  const [enabled, setEnabled] = useState(false);
  const [comboData, setComboData] = useRecoilState(comboDataAtom);
  const queryClient = useQueryClient();
  const setDeckData = useSetRecoilState(deckDataAtom);
  const { data, error, isLoading } = useQuery<DeckData, AxiosError>({
    queryKey: ["deck-data", deckUrl],
    queryFn: () => getDeckData(deckUrl),
    enabled,
  });
  useEffect(
    function setDeckDataAtom() {
      if (!data) return;

      (async () => {
        setDeckData(data);
        setEnabled(false);

        const d = await queryClient.fetchQuery({
          queryKey: ["combo-data", data.meta.url],
          queryFn: async () =>
            await getComboData({
              commanders: [],
              main: data.cards.map((c) => ({ card: c.name, quantity: 1 })),
            }),
        });
        setComboData(d);
      })();
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
      {data && comboData && (
        <ComboContainer
          deckData={data}
          allCombos={comboData}
          cardNames={data.cards.map((c) => c.name)}
        />
      )}
    </TabContainer>
  );
}
