import { useMemo, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { deckDataAtom, comboDataAtom } from "../atoms";
import { getComboData, getDeckData } from "../services";

const MAX_CARDS = 512;
export const parseCardList = (list: string) => {
  const split = list.split("\n");
  if (split.length > MAX_CARDS)
    console.warn(
      `Submitted a deck with > ${MAX_CARDS} cards. Results will be truncated`,
    );

  return split
    .filter((c) => c)
    .map((c) => c.replace(/^\dx?\s*/, ""))
    .slice(0, MAX_CARDS);
};

export const useComboData = () => {
  const [deckData, setDeckData] = useRecoilState(deckDataAtom);
  const [comboData, setComboData] = useRecoilState(comboDataAtom);
  const [deckIsLoading, setDeckIsLoading] = useState(false);
  const [comboIsLoading, setComboIsLoading] = useState(false);
  const [errorMessage, setError] = useState("");

  const reset = () => {
    setError("");
    setDeckData(undefined);
    setComboData(undefined);
  };

  const startLoadingState = () => {
    setError("");
    setDeckData(undefined);
    setComboData(undefined);
    setComboIsLoading(true);
    setDeckIsLoading(true);
  };

  const getList = async (list: string) => {
    startLoadingState();
    setDeckIsLoading(false);
    const cards = parseCardList(list);

    const resp = await getComboData({
      main: cards.map((name) => ({ card: name, quantity: 1 })),
      commanders: [],
    });
    setComboIsLoading(false);
    setComboData(resp);
  };

  const getUrl = async (deckUrl: string) => {
    if (!deckUrl) return;
    startLoadingState();

    let deckResp;
    try {
      deckResp = await getDeckData(deckUrl);
      setDeckData(deckResp);
    } catch (e) {
      setError(
        "Error -- Ensure you provided a valid Moxfield, MTGGoldfish, or Archidekt URL.",
      );
    }
    setDeckIsLoading(false);

    if (deckResp?.cards)
      setComboData(
        await getComboData({
          main: deckResp.cards.map(({ name }) => ({ card: name, quantity: 1 })),
          commanders: [],
        }),
      );
    setComboIsLoading(false);
  };

  return {
    deckData,
    comboData,
    isLoading: deckIsLoading || comboIsLoading,
    hasError: !!errorMessage,
    errorMessage,
    deckIsLoading,
    comboIsLoading,
    getList,
    getUrl,
    reset,
  };
};

export const useFilteredCombos = ({ combos }: { combos: AlmostIncluded[] }) => {
  const deckData = useRecoilValue(deckDataAtom);
  const [filter, setFilter] = useState("");
  const filteredCombos = useMemo(() => {
    const f = filter.toLowerCase();
    return combos.filter((c) => {
      const inMeta = [c.description, c.otherPrerequisites].some((s) =>
        s.toLowerCase().includes(f),
      );
      const inCards = c.uses.some((u) =>
        u.card?.name.toLowerCase().includes(f),
      );
      const inProduces = c.produces.some((p) =>
        p.feature.name?.toLowerCase().includes(f),
      );

      return inMeta || inCards || inProduces;
    });
  }, [filter, combos]);

  const groupedByMissing = useMemo(() => {
    if (!deckData || !filteredCombos) return;

    const deckCards = deckData.cards.map((c) => c.name);
    const comboCards = filteredCombos.flatMap((c) =>
      c.uses.map((u) => u.card?.name).filter((u) => !!u),
    );
    const missingCards = comboCards.filter((c) => !deckCards.includes(c ?? ""));
    const grouped: Record<string, AlmostIncluded[]> = {};
    for (const card of missingCards) {
      if (!card) continue;
      grouped[card] = filteredCombos.filter((combo) =>
        combo.uses.map((c) => c.card?.name).includes(card),
      );
    }
    return grouped;
  }, [filteredCombos, deckData]);

  return { filteredCombos, groupedByMissing, setFilter, filter };
};
