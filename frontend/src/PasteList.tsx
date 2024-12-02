import { useRecoilState } from "recoil";
import { useDebouncedCallback } from "use-debounce";
import { pastedDeckListAtom } from "./atoms";
import { Textarea } from "./components/ui/textarea";
import { Field } from "./Field";
import { Form } from "./Form";
import { TabContainer } from "./TabContainer";
import { useNavigate, useParams } from "react-router";
import { useEffect } from "react";

export const PasteList = () => {
  const { pastedList: urlPastedList } = useParams<{ pastedList: string }>();
  const [pastedList, setPastedList] = useRecoilState(pastedDeckListAtom);
  const persistList = useDebouncedCallback(() => {
    localStorage.setItem("pastedList", pastedList);
  }, 500);
  let navigate = useNavigate();
  useEffect(
    function initState() {
      if (urlPastedList) {
        return setPastedList(urlPastedList);
      }
      const localPastedList = localStorage.getItem("pastedList");
      if (localPastedList) {
        return setPastedList(localPastedList);
      }
    },
    [urlPastedList],
  );

  return (
    <TabContainer>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          navigate(`/paste/${encodeURIComponent(pastedList)}`);
        }}
        disabled={!pastedList}
      >
        <Field>
          <Textarea
            placeholder={
              "Allowed formats:\n1x Lightning Bolt\n1 Lightning Bolt\nLightning Bolt"
            }
            onChange={(e) => {
              setPastedList(e.target.value);
              persistList();
            }}
            value={pastedList || ""}
            className="h-36 max-h-[512px] min-h-36 rounded p-2"
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
