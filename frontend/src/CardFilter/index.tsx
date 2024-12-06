import { useMemo, useState } from "react";
import { CardImage } from "../CardImage";
import { HoverableCard } from "../HoverableCard";
import { Dropdown } from "@/Dropdown";
import { SelectItem } from "@/components/ui/select";

type ViewMode = "image" | "text";

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
  const filteredCards = useMemo(
    () =>
      deckData?.cards.filter((c) => {
        const f = filter.toLowerCase();
        return (
          c.name.toLowerCase().includes(f) ||
          c.oracle_text.toLowerCase().includes(f) ||
          c.type.toLowerCase().includes(f)
        );
      }),
    [deckData, filter],
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
