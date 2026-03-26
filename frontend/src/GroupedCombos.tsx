import { useMemo } from "react";
import { CollapsibleGroup } from "./CollapsibleGroup";
import { useLayout } from "./ListControls";

export function GroupedCombos({
  data,
  cards,
}: {
  data: Record<string, AlmostIncluded[]>;
  cards: DeckCard[];
}) {
  const { layout } = useLayout();
  const sortedEntries = useMemo(
    () =>
      Object.entries(data).sort(
        ([, combosA], [, combosB]) => combosB.length - combosA.length,
      ),
    [data],
  );

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {sortedEntries.map(([cardName, combos]: [string, AlmostIncluded[]]) => (
        <CollapsibleGroup
          key={cardName}
          cardName={cardName}
          combos={combos}
          cards={cards}
          layout={layout}
        />
      ))}
    </div>
  );
}
