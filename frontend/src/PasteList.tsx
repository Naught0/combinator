import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { ComboTabs } from "./ComboTabs";
import { Textarea } from "./components/ui/textarea";
import { Field } from "./Field";
import { Form } from "./Form";
import { getCardData } from "./services";
import { TabContainer } from "./TabContainer";
import { DeckInfo } from "./DeckInfo";

export const PasteList = () => {
  const [pastedList, setPastedList] = useState(
    localStorage.getItem("pastedList") ?? "",
  );
  const [enabled, setEnabled] = useState(false);
  const [deckHash, setDeckHash] = useState("");
  const [debouncedList] = useDebounce(pastedList, 500);
  useEffect(
    function persistList() {
      localStorage.setItem("pastedList", pastedList);
    },
    [debouncedList],
  );
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["pasted-list", deckHash],
    queryFn: async () => getCardData(parseCardList(pastedList)),
    enabled,
  });
  useEffect(
    function disableQuery() {
      if (enabled) setEnabled(false);
    },
    [isError, isSuccess],
  );
  useEffect(
    function calculateHash() {
      if (!debouncedList) return;

      (async () => {
        const hash = await generateDeckIdHash(parseCardList(debouncedList));
        setDeckHash(hash);
      })();
    },
    [debouncedList],
  );
  const deckData = useMemo<DeckData>(() => {
    return {
      id: deckHash,
      source: "paste" as DeckSource,
      cards: data?.cards ?? [],
    };
  }, [data?.cards, deckHash]);

  return (
    <TabContainer>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          setEnabled(true);
        }}
        disabled={!pastedList}
        loading={isLoading}
      >
        <Field>
          <Textarea
            placeholder={
              "Allowed formats:\n1x Lightning Bolt\n1 Lightning Bolt\nLightning Bolt"
            }
            onChange={(e) => {
              setPastedList(e.target.value);
            }}
            value={pastedList || ""}
            className="h-36 max-h-[512px] min-h-36 rounded p-2"
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                e.currentTarget.form?.dispatchEvent(
                  new Event("submit", { bubbles: true, cancelable: true })
                );
              }
            }}
          ></Textarea>
        </Field>
      </Form>
      {deckData?.cards.length > 0 && (
        <>
          {deckData.meta && <DeckInfo meta={deckData.meta} />}
          <ComboTabs deckData={deckData} />
        </>
      )}
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

async function generateDeckIdHash(cards: string[]) {
  // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
  const hashBuffer = await crypto.subtle.digest(
    "sha-1",
    new TextEncoder().encode(cards.join("\n")),
  );
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string

  return hashHex;
}
