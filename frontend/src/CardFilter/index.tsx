import { useMemo } from "react";
import { CardImage } from "../CardImage";
import { HoverableCard } from "../HoverableCard";
import { useDebounce } from "use-debounce";

export type ViewMode = "image" | "text";

export const CardFilter = ({
  filter,
  deckData,
  viewMode,
}: {
  filter: string;
  deckData: DeckData;
  viewMode: ViewMode;
}) => {
  const [debouncedFilter] = useDebounce(filter, 300);
  const filteredCards = useMemo(
    () =>
      deckData?.cards.filter((c) => {
        const f = debouncedFilter.toLowerCase();
        return (
          c.name.toLowerCase().includes(f) ||
          c.oracle_text.toLowerCase().includes(f) ||
          c.type.toLowerCase().includes(f)
        );
      }),
    [deckData, debouncedFilter],
  );
  return (
    <div className="flex flex-1 flex-col gap-3">
      <div className="flex flex-row flex-wrap justify-start gap-6">
        {filteredCards &&
          filteredCards.map((card) => {
            return (
              <div key={card.id} className="min-w-72 basis-1/5">
                {viewMode === "text" ? (
                  <HoverableCard cardName={card.name} image={card.image} />
                ) : (
                  <CardImage cardImage={card.image} />
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};
