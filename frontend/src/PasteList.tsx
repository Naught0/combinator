import { useRecoilState, useSetRecoilState } from "recoil";
import { useDebouncedCallback } from "use-debounce";
import { comboDataAtom, pastedDeckListAtom } from "./atoms";
import { Textarea } from "./components/ui/textarea";
import { TabContainer } from "./TabContainer";
import { Form } from "./Form";
import { useMutation, useQuery } from "react-query";
import { getComboData } from "./services";
import { useEffect, useState } from "react";
import { Field } from "./Field";
import { AxiosError } from "axios";

export const PasteList = () => {
  const [pastedList, setPastedList] = useRecoilState(pastedDeckListAtom);
  const setComboData = useSetRecoilState(comboDataAtom);
  const persistList = useDebouncedCallback(() => {
    localStorage.setItem("pastedList", pastedList);
  }, 500);
  const { data, error, isLoading, mutate } = useMutation<Results, AxiosError>(
    ["pasted-list"],
    () =>
      getComboData({
        main: parseCardList(pastedList).map((name) => ({
          card: name,
          quantity: 1,
        })),
        commanders: [],
      }),
  );
  useEffect(
    function syncDataToAtom() {
      if (data) setComboData(data);
    },
    [data],
  );

  return (
    <TabContainer>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          mutate();
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
            onChange={(e) => {
              setPastedList(e.target.value);
              persistList();
            }}
            value={pastedList || ""}
            className="h-36 max-h-[512px] min-h-36 max-w-96 rounded p-2"
          ></Textarea>
        </Field>
      </Form>
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
