import { useMemo, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { deckDataAtom, comboDataAtom } from "../atoms";
import { getComboData, getDeckData } from "../services";

export const useComboData = () => {
  const [deckData, setDeckData] = useRecoilState(deckDataAtom);
  const [comboData, setComboData] = useRecoilState(comboDataAtom);
  const [deckIsLoading, setDeckIsLoading] = useState(false);
  const [comboIsLoading, setComboIsLoading] = useState(false);
  const [errorMessage, setError] = useState("");

  const get = async (deckUrl: string) => {
    if (!deckUrl) return;
    setError("");
    setDeckData(undefined);
    setComboData(undefined);
    setComboIsLoading(true);
    setDeckIsLoading(true);

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
          main: deckResp.cards.map((c) => c.name),
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
    get,
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
        p.name?.toLowerCase().includes(f),
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
