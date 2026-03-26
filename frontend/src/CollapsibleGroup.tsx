import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Combo } from "./Combo";
import { HoverableCard } from "./HoverableCard";
import { MasonryLayout } from "./MasonryLayout";
import { useExpandAll, useShowImages } from "./ListControls";
import { Layout } from "./LayoutSelect";
import { ComboTable } from "./ComboTable";

export function CollapsibleGroup({
  cardName,
  combos,
  cards,
  layout,
}: {
  cardName: string;
  combos: AlmostIncluded[];
  cards: DeckCard[];
  layout?: Layout;
}) {
  const [expanded, setExpanded] = useState(false);
  const { showImages } = useShowImages();
  const { expandAll } = useExpandAll();

  return (
    <div
      className={`h-fit overflow-hidden rounded-md border border-zinc-700 ${expanded ? "col-span-2" : ""}`}
    >
      <button
        className="flex w-full cursor-pointer items-center justify-between gap-4 bg-zinc-950 px-4 py-3 font-serif text-lg font-bold hover:bg-zinc-950/50"
        onClick={() => setExpanded(!expanded)}
      >
        <span className="font-sans">
          Add{" "}
          <HoverableCard
            cardName={cardName}
            image={cards.find((c) => c.name === cardName)?.image}
          />{" "}
          <wbr />
          <span className="whitespace-nowrap">
            (+{combos.length} combo{combos.length > 1 ? "s" : ""})
          </span>
        </span>
        <FontAwesomeIcon icon={expanded ? faMinus : faPlus} />
      </button>
      {expanded &&
        (layout === Layout.GRID ? (
          <div className="flex flex-col gap-2 bg-zinc-900 px-3 py-4">
            <MasonryLayout
              wide={false}
              items={combos.map((c) => (
                <Combo
                  cards={cards}
                  key={c.id}
                  combo={c}
                  showImages={showImages}
                  initialExpanded={expandAll}
                  missingCard={cardName}
                />
              ))}
            />
          </div>
        ) : (
          <ComboTable
            className="rounded-t-none border-0"
            combos={combos}
            cards={cards}
            missingCard={cardName}
          />
        ))}
    </div>
  );
}
