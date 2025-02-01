import { manaFontMap } from "./manaFontMap";
import { Button } from "./components/ui/button";
import { CardStack } from "./CardStack";
import { useEffect, useState } from "react";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HoverableCard } from "./HoverableCard";

interface props {
  combo: AlmostIncluded;
  initialExpanded?: boolean;
  cards: DeckCard[];
  showImages?: boolean;
}

const replaceManaSymbols = (s: string) => {
  return s
    .replaceAll("}{", "} {")
    .split(" ")
    .map((word, idx) => {
      const toCompare = word.toLowerCase().replaceAll(/[.,]/g, "");
      if (word && Object.keys(manaFontMap).includes(toCompare)) {
        return manaFontMap[toCompare](`${word}-${idx}`);
      }
      return ` ${word} `;
    });
};

function ComboCardHeading({
  card,
  isHoverable,
}: {
  card: DeckCard;
  isHoverable?: boolean;
}) {
  const className =
    "text-center w-full md:w-fit font-serif text-xl font-bold md:text-left";
  return isHoverable ? (
    <HoverableCard
      cardName={card.name}
      image={card.image}
      className={className}
    />
  ) : (
    <p className={className}>{card.name}</p>
  );
}

export const Combo = ({
  combo,
  initialExpanded,
  cards,
  showImages = true,
}: props) => {
  const [expanded, setExpanded] = useState(initialExpanded);
  const deckCards = combo.uses
    .map((comboCard) => cards.find((c) => c.name === comboCard.card?.name))
    .filter((c) => !!c);
  useEffect(() => {
    setExpanded(initialExpanded);
  }, [initialExpanded]);
  return (
    <div
      className={`flex h-full w-full flex-col items-center rounded border border-zinc-700`}
    >
      <div className="z-10 flex w-full flex-col gap-1 rounded bg-zinc-800 p-6">
        {deckCards.map((c, idx) => (
          <div className="inline-flex w-fit items-center gap-2" key={c.id}>
            {idx !== 0 && (
              <FontAwesomeIcon
                icon={faPlus}
                onClick={() => setExpanded(!expanded)}
              />
            )}
            <ComboCardHeading key={c.id} card={c} isHoverable={!showImages} />
          </div>
        ))}
        <div
          className={`flex flex-col flex-wrap items-center justify-start gap-3 md:flex-row md:items-start`}
        >
          {showImages && <CardStack cards={deckCards} />}
          <div className="flex w-full flex-col items-start gap-3">
            <div>
              <p className="font-bold lg:text-lg">Effects</p>
              <ul>
                {combo.produces.map((produces) => (
                  <li key={produces.feature.id}>{produces.feature.name}</li>
                ))}
              </ul>
            </div>
          </div>

          <Button
            className="inline-flex w-full items-center"
            onClick={() => setExpanded((prev) => !prev)}
            size="sm"
            variant="ghost"
          >
            <FontAwesomeIcon icon={expanded ? faMinus : faPlus} />
            {expanded ? "Collapse" : "Expand"}
          </Button>
        </div>
        {expanded && (
          <div className="flex flex-row flex-wrap justify-start rounded-b-md border-t border-t-zinc-600 py-3">
            <div className="flex flex-wrap gap-3 md:flex-row">
              {!!combo.otherPrerequisites.trim() && (
                <div className="flex min-w-72 flex-1 basis-5/12 flex-col">
                  <p className="font-bold">Prerequisites</p>
                  <ul>
                    {combo.otherPrerequisites
                      .split(".")
                      .filter((p) => p)
                      .map((p, idx) => (
                        <li key={`combo-${combo.id}-${p}-${idx}`}>
                          {replaceManaSymbols(p)}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
              <div className="flex min-w-72 flex-1 basis-5/12 flex-col">
                <p className="font-bold">Steps</p>
                <ol>
                  {combo.description
                    .split(".")
                    .filter((t) => t.trim().length > 0)
                    .map((s, idx) => (
                      <li key={`${combo.id}-${idx}`}>
                        {replaceManaSymbols(s)}
                      </li>
                    ))}
                </ol>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
