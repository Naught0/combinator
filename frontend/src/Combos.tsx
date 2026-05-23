import { Combo } from "./Combo";
import { Layout } from "./LayoutSelect";
import { MasonryLayout } from "./MasonryLayout";
import { useExpandAll, useLayout, useShowImages } from "./ListControls";
import { Hyperlink } from "./Hyperlink";
import { ComboTable } from "./ComboTable";

export function Combos({
  noCombos,
  filter,
  noFilteredCombos,
  deckData,
  filteredCombos,
}: {
  noCombos: boolean;
  filter: string;
  noFilteredCombos: boolean;
  deckData: DeckData;
  filteredCombos: AlmostIncluded[];
}) {
  const { expandAll } = useExpandAll();
  const { showImages } = useShowImages();
  const { layout } = useLayout();

  return (
    <div className="flex flex-col gap-3">
      {noCombos && (
        <h1 className="text-2xl">
          Pro Tip: Try adding some{" "}
          <Hyperlink href="https://commanderspellbook.com/">combos</Hyperlink>{" "}
          to your list
        </h1>
      )}
      {!!filter && noFilteredCombos && (
        <h1 className="mt-6 text-2xl">No combos matching search</h1>
      )}
      {filteredCombos && layout === Layout.GRID && (
        <MasonryLayout
          items={filteredCombos.map((c) => (
            <Combo
              showImages={showImages}
              initialExpanded={expandAll}
              cards={deckData.cards ?? []}
              key={c.id}
              combo={c}
            />
          ))}
        />
      )}
      {filteredCombos && layout === Layout.LIST && (
        <ComboTable combos={filteredCombos} cards={deckData.cards} />
      )}
    </div>
  );
}
