import { useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ComboContainer } from "./ComboContainer";
import { Field } from "./Field";
import { Form } from "./Form";
import { TabContainer } from "./TabContainer";
import { comboDataAtom, deckDataAtom, deckUrlAtom } from "./atoms";
import { Input } from "./components/ui/input";
import { getComboData, getDeckData } from "./services";

export function PasteDeckUrl() {
  const [deckUrl, setDeckUrl] = useRecoilState(deckUrlAtom);
  const [enabled, setDeckQueryEnabled] = useState(false);
  const setComboData = useSetRecoilState(comboDataAtom);
  const setDeckData = useSetRecoilState(deckDataAtom);
  const {
    data: deckData,
    error,
    isLoading: deckLoading,
    isFetched: deckFetched,
  } = useQuery<DeckData, AxiosError>({
    queryKey: ["deck-data", deckUrl],
    queryFn: async () => {
      const d = await getDeckData(deckUrl);
      setDeckData(d);
      return d;
    },
    enabled,
  });
  const { data: comboData, isLoading: comboLoading } = useQuery({
    queryKey: ["combo-data", deckData?.meta.url],
    queryFn: async () => {
      const d = await getComboData({
        commanders: [],
        main: deckData!.cards.map((c) => ({ card: c.name, quantity: 1 })),
      });
      setComboData(d);
      return d;
    },
    enabled: !!deckData?.cards,
  });
  useEffect(
    function disableQuery() {
      setDeckQueryEnabled(false);
    },
    [deckFetched],
  );
  return (
    <TabContainer>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          setDeckQueryEnabled(true);
        }}
        loading={deckLoading || comboLoading}
        disabled={deckUrl.length < 5}
      >
        <Field error={error && "Unable to find deck"}>
          <Input
            name="deck-url"
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
      {deckData && comboData && (
        <ComboContainer
          deckData={deckData}
          allCombos={comboData}
          cardNames={deckData.cards.map((c) => c.name)}
        />
      )}
    </TabContainer>
  );
}
