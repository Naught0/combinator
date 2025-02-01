import { useMemo, useState } from "react";
import { CardImage } from "../CardImage";
import { HoverableCard } from "../HoverableCard";
import { SelectItem } from "@/components/ui/select";
import { useDebounce } from "use-debounce";
import { Dropdown } from "@/Dropdown";

type ViewMode = "image" | "text";

type CardType =
  | "Creature"
  | "Instant"
  | "Sorcery"
  | "Artifact"
  | "Enchantment"
  | "Battle"
  | "Land";

function determineCardType(type: DeckCard["type"]): CardType {
  if (type.toLowerCase().includes("creature")) return "Creature";
  if (type.toLowerCase().includes("instant")) return "Instant";
  if (type.toLowerCase().includes("sorcery")) return "Sorcery";
  if (type.toLowerCase().includes("artifact")) return "Artifact";
  if (type.toLowerCase().includes("land")) return "Land";
  if (type.toLowerCase().includes("enchantment")) return "Enchantment";
  if (type.toLowerCase().includes("battle")) return "Battle";
  return "Creature";
}

export const CardFilter = ({
  filter,
  deckData,
}: {
  filter: string;
  deckData: DeckData;
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>(
    (localStorage.getItem("cardViewMode") as ViewMode) ?? "text",
  );
  const [debouncedFilter] = useDebounce(filter, 300);
  const filteredGroupedCards = useMemo(
    () =>
      Object.groupBy(
        deckData?.cards
          .filter((c) => {
            const f = debouncedFilter.toLowerCase();
            return (
              c.name.toLowerCase().includes(f) ||
              c.oracle_text.toLowerCase().includes(f) ||
              c.type.toLowerCase().includes(f)
            );
          })
          .toSorted((c1, c2) => c1.name.localeCompare(c2.name)),
        (c) => determineCardType(c.type),
      ),
    [deckData, debouncedFilter],
  );
  return (
    <div className="flex flex-1 flex-col gap-3">
      <div className="flex-0 flex">
        <Dropdown
          onChange={(value) => setViewMode(value as ViewMode)}
          value={viewMode}
          defaultValue={"text" as ViewMode}
        >
          <SelectItem value="text">Text</SelectItem>
          <SelectItem value="image">Images</SelectItem>
        </Dropdown>
      </div>
      <div className="flex flex-row flex-wrap justify-center gap-6 md:justify-start">
        {filteredGroupedCards &&
          Object.entries(filteredGroupedCards)
            .toSorted((a, b) => a[0].localeCompare(b[0]))
            .map(([type, cards]) => {
              return (
                cards && (
                  <div key={type} className="min-w-44 flex-1 basis-1/4">
                    <h2 className="text-xl font-bold md:text-2xl">{type}</h2>
                    <hr />
                    {cards.map((card) => (
                      <div key={card.id} className="min-w-fit">
                        {viewMode === "text" ? (
                          <HoverableCard
                            cardName={card.name}
                            image={card.image}
                          />
                        ) : (
                          <CardImage cardImage={card.image} />
                        )}
                      </div>
                    ))}
                  </div>
                )
              );
            })}
      </div>
    </div>
  );
};
