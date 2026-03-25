import { useState } from "react";
import { HoverableCard } from "./HoverableCard";
import { replaceManaSymbols } from "./Combo";
import { useAlwaysExpandSteps } from "./hooks/useStepsExpanded";
import { cn } from "./lib/utils";

export function ComboTable({
  combos,
  cards,
  missingCard,
  className,
}: {
  combos: AlmostIncluded[];
  cards: DeckCard[];
  missingCard?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-x-auto rounded border border-zinc-700 bg-zinc-900",
        className,
      )}
    >
      <table className="w-full table-fixed">
        <thead className="sticky top-0 z-10 bg-zinc-950">
          <tr className="border-b border-zinc-700 text-left font-serif text-sm font-bold uppercase text-zinc-300">
            {["Cards", "Prerequisites", "Results", "Steps"].map((h) => (
              <th key={h} className="px-2 py-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {combos.map((combo) => (
            <ComboListItem
              key={combo.id}
              combo={combo}
              cards={cards}
              missingCard={missingCard}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ComboListItem({
  combo,
  cards,
  missingCard,
}: {
  combo: AlmostIncluded;
  cards: DeckCard[];
  missingCard?: string;
}) {
  const { alwaysExpandSteps } = useAlwaysExpandSteps();
  const [isOpen, setIsOpen] = useState(alwaysExpandSteps);

  // Sync with prop changes
  if (alwaysExpandSteps !== isOpen) {
    setIsOpen(alwaysExpandSteps);
  }

  const deckCards = combo.uses
    .map((comboCard) => cards.find((c) => c.name === comboCard.card?.name))
    .filter((c) => !!c);

  const prerequisites = combo.otherPrerequisites
    .split(".")
    .filter((p) => p.trim());

  const steps = combo.description.split(".").filter((t) => t.trim().length > 0);

  return (
    <tr className="border-b border-zinc-700 bg-zinc-800 transition-colors odd:bg-zinc-800/70 hover:bg-zinc-700/50">
      <td className="px-2 py-3 align-top">
        <div className="flex flex-wrap gap-2">
          {deckCards.map((c) => (
            <HoverableCard
              key={c.id}
              cardName={c.name}
              image={c.image}
              className="inline-flex items-center rounded border border-zinc-500 bg-zinc-700 px-2 py-1 text-sm text-zinc-50"
            />
          ))}
          {missingCard && (
            <HoverableCard
              cardName={missingCard}
              className="rounded border-2 border-hit-pink-300/60 bg-hit-pink-300/5 px-2 py-1 text-sm text-orange-100"
            />
          )}
        </div>
      </td>
      <td className="px-2 py-3 align-top">
        <ul className="list-disc pl-4 text-sm">
          {prerequisites.map((p, idx) => (
            <li className="mb-1.5" key={idx}>
              {replaceManaSymbols(p)}
            </li>
          ))}
        </ul>
      </td>
      <td className="px-2 py-3 align-top">
        <ul className="list-disc pl-4 text-sm">
          {combo.produces.map((produces) => (
            <li className="mb-1.5" key={produces.feature.id}>
              {produces.feature.name}
            </li>
          ))}
        </ul>
      </td>
      <td className="px-2 py-3 align-top">
        <details
          open={isOpen}
          onToggle={(e) => setIsOpen(e.currentTarget.open)}
        >
          <summary className="cursor-pointer rounded border border-zinc-600 px-2 py-1 text-sm hover:border-zinc-400">
            {steps.length} steps
          </summary>
          <ol className="mt-2 list-decimal pl-4 text-sm">
            {steps.map((s, idx) => (
              <li className="mb-1.5" key={idx}>
                {replaceManaSymbols(s)}
              </li>
            ))}
          </ol>
        </details>
      </td>
    </tr>
  );
}
