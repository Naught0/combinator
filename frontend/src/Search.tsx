import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "use-debounce";
import MoxfieldSearch from "./MoxfieldSearch";
import { PasteDeckUrl } from "./PasteDeckUrl";
import { SearchTypeSelector, SearchType } from "./SearchTypeSelector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { Textarea } from "./components/ui/textarea";
import { Field } from "./Field";
import { Form } from "./Form";
import { getCardData } from "./services";
import { ComboTabs } from "./ComboTabs";
import { TabContainer } from "./TabContainer";
import { DeckInfo } from "./DeckInfo";

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
  const hashBuffer = await crypto.subtle.digest(
    "sha-1",
    new TextEncoder().encode(cards.join("\n")),
  );
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

function getMessage(type: SearchType) {
  switch (type) {
    case SearchType.MOXFIELD_USER:
      return "Enter your Moxfield username to browse your decks & see what combos are inside";
    case SearchType.DECK:
      return "Paste a deck url to see its combos";
    case SearchType.PASTE:
      return "Paste a list of cards to see possible combos";
    default:
      return "uh... i'd probably just refresh if i was you";
  }
}

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchType =
    (searchParams.get("type") as SearchType) || SearchType.MOXFIELD_USER;

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

  const saveSearchType = (type: SearchType) => {
    setSearchParams({ type });
  };

  return (
    <div className="mx-auto flex w-full flex-col items-center">
      <div className="flex w-full max-w-[636px] flex-col">
        <SearchTypeSelector
          searchType={searchType}
          setSearchType={saveSearchType}
        />
        <div className="flex w-full flex-col gap-3 rounded-md border border-zinc-700 bg-zinc-800 p-6 sm:rounded-tl-none">
          <div className="flex w-full flex-col gap-3">
            {searchType === SearchType.MOXFIELD_USER && <MoxfieldSearch />}
            {searchType === SearchType.DECK && <PasteDeckUrl />}
            {searchType === SearchType.PASTE && (
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
                    className="h-36 max-h-[512px] min-h-36 w-full rounded p-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        e.currentTarget.form?.dispatchEvent(
                          new Event("submit", {
                            bubbles: true,
                            cancelable: true,
                          }),
                        );
                      }
                    }}
                  />
                </Field>
              </Form>
            )}
          </div>
          <div className="mt-2 h-[1px] w-full bg-zinc-700" />
          <article className="inline-flex items-center gap-1.5 text-sm italic text-hit-pink-50/80">
            <FontAwesomeIcon icon={faInfoCircle} />
            {getMessage(searchType)}
          </article>
        </div>
      </div>

      {searchType === SearchType.PASTE &&
        deckData?.cards &&
        deckData.cards.length > 0 && (
          <div className="mt-6 w-full">
            <TabContainer>
              {deckData.meta && <DeckInfo meta={deckData.meta} />}
              <ComboTabs deckData={deckData} />
            </TabContainer>
          </div>
        )}
    </div>
  );
}
