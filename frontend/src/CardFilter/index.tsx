import { useMemo, useState } from "react";
import { useRecoilValue } from "recoil";
import { deckDataAtom } from "../atoms";
import { HoverableCard } from "../HoverableCard";

type ViewMode = "image" | "text";

export const CardFilter = () => {
  const [filter, setFilter] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("image");
  const [zoomedCardId, setZoomedCardId] = useState("");
  const deckData = useRecoilValue(deckDataAtom);
  const filteredCards = useMemo(
    () =>
      deckData?.cards.filter((c) => {
        const f = filter.toLowerCase();
        return (
          c.name.toLowerCase().includes(f) ||
          c.oracle_text.toLowerCase().includes(f)
        );
      }),
    [deckData, filter],
  );
  return (
    <div className="flex flex-col gap-3 flex-1">
      <input
        value={filter}
        onChange={({ target }) => setFilter(target.value)}
        className="input is-medium"
        placeholder="Filter cards by title and text"
      />

      <div className="flex flex-0">
        <div className="select">
          <select
            value={viewMode}
            onChange={({ target }) => setViewMode(target.value as ViewMode)}
          >
            <option value="image">Images</option>
            <option value="text">Text</option>
          </select>
        </div>
      </div>
      <div className="flex flex-wrap flex-row gap-3 justify-between">
        {filteredCards &&
          filteredCards.map((card) => {
            return (
              card.in_deck && (
                <div className="min-w-72 basis-1/4">
                  <HoverableCard
                    key={card.id}
                    cardName={card.name}
                    display={viewMode}
                  />
                </div>
              )
            );
          })}
      </div>
    </div>
  );
};