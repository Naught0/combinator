import { useRecoilState, useRecoilValue } from "recoil";
import { useDebouncedCallback } from "use-debounce";
import { pastedCardNamesAtom, pastedDeckListAtom } from "./atoms";
import { Textarea } from "./components/ui/textarea";
import { TabContainer } from "./TabContainer";
import { Form } from "./Form";
import { useQuery } from "@tanstack/react-query";
import { getComboData } from "./services";
import { Field } from "./Field";
import { AxiosError } from "axios";
import { ComboContainer } from "./ComboContainer";
import { useEffect, useState } from "react";

export const PasteList = () => {
  const [pastedList, setPastedList] = useRecoilState(pastedDeckListAtom);
  const cardNames = useRecoilValue(pastedCardNamesAtom);
  const persistList = useDebouncedCallback(() => {
    localStorage.setItem("pastedList", pastedList);
  }, 500);
  const [queryEnabled, setQueryEnabled] = useState(false);
  const { data, error, isLoading } = useQuery<Results, AxiosError>({
    queryKey: ["combo-data", pastedList],
    queryFn: () =>
      getComboData({
        main: parseCardList(pastedList).map((name) => ({
          card: name,
          quantity: 1,
        })),
        commanders: [],
      }),
    enabled: queryEnabled,
  });
  useEffect(
    function disableQuery() {
      if (!data) return;
      setQueryEnabled(false);
    },
    [data],
  );

  return (
    <TabContainer>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          setQueryEnabled(true);
        }}
        disabled={!pastedList}
        loading={isLoading}
      >
        <Field
          error={
            error && "Unable to find combos. Make sure your format is correct!"
          }
        >
          <Textarea
            placeholder={
              "Allowed formats:\n1x Lightning Bolt\n1 Lightning Bolt\nLightning Bolt"
            }
            variant={error ? "error" : "default"}
            onChange={(e) => {
              setPastedList(e.target.value);
              persistList();
            }}
            value={pastedList || ""}
            className="h-36 max-h-[512px] min-h-36 rounded p-2"
          ></Textarea>
        </Field>
      </Form>
      {data && <ComboContainer allCombos={data} cardNames={cardNames} />}
    </TabContainer>
  );
};

const MAX_CARDS = 1024;

export function parseCardList(list: string) {
  const split = list.split("\n");
  if (split.length > MAX_CARDS)
    console.warn(
      `Submitted a deck with > ${MAX_CARDS} cards. Results will be truncated`,
    );

  return split
    .filter((c) => c)
    .map((c) => c.replace(/^\dx?\s*/, ""))
    .slice(0, MAX_CARDS);
}
