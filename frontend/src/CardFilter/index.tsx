import { useMemo } from "react";
import { CardImage } from "../CardImage";
import { HoverableCard } from "../HoverableCard";
import { Button } from "../components/ui/button";
import { useDebounce } from "use-debounce";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignLeft, faImage } from "@fortawesome/free-solid-svg-icons";
import { determineCardSuperType } from "@/util/mtg";

export type ViewMode = "image" | "text";

export const CardFilter = ({
  filter,
  deckData,
  viewMode,
  setViewMode,
}: {
  filter: string;
  deckData: DeckData;
  viewMode: ViewMode;
  setViewMode: (viewMode: ViewMode) => void;
}) => {
  const [debouncedFilter] = useDebounce(filter, 300);
  const containerClass = `gap-3 ${
    viewMode === "image"
      ? "flex flex-row flex-wrap justify-start"
      : "flex flex-col flex-wrap max-h-96"
  }`;
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
  const groupedCards = useMemo(() => {
    if (!filteredCards) return [];
    const groups = new Map<string, DeckCard[]>();
    for (const card of filteredCards) {
      const key = determineCardSuperType(card.type);
      const group = groups.get(key);
      if (group) {
        group.push(card);
      } else {
        groups.set(key, [card]);
      }
    }
    for (const group of groups.values()) {
      group.sort((a, b) => a.name.localeCompare(b.name));
    }
    return Array.from(groups.entries());
  }, [filteredCards]);
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-bold uppercase text-zinc-300">
          view cards as
        </p>
        <div>
          <Button
            variant={viewMode === "image" ? "primary" : "outline"}
            onClick={() => setViewMode("image")}
            className="rounded-r-none"
          >
            <FontAwesomeIcon icon={faImage} /> Image
          </Button>
          <Button
            variant={viewMode === "text" ? "primary" : "outline"}
            onClick={() => setViewMode("text")}
            className="rounded-l-none"
          >
            <FontAwesomeIcon icon={faAlignLeft} /> Text
          </Button>
        </div>
      </div>
      <div className="grid gap-6">
        {groupedCards.map(([supertype, cards]) => (
          <div key={supertype}>
            <p className="text-md font-bold uppercase text-zinc-300">
              {supertype}
            </p>
            <hr className="mb-3 border-zinc-700" />
            <div className={containerClass}>
              {cards.map((card) => (
                <div key={card.id} className="flex min-w-64 basis-1/5">
                  {viewMode === "text" ? (
                    <HoverableCard cardName={card.name} image={card.image} />
                  ) : (
                    <CardImage cardImage={card.image} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
