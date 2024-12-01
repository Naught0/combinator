import { useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { deckDataAtom } from "../atoms";

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
