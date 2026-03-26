import { manaFontMap } from "./manaFontMap";
import { Button } from "./components/ui/button";
import { CardStack } from "./CardStack";
import { useEffect, useState } from "react";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { HoverableCard } from "./HoverableCard";
import { cardNameToImageSrc } from "./services/scryfall";

interface props {
  combo: AlmostIncluded;
  initialExpanded?: boolean;
  cards: DeckCard[];
  showImages?: boolean;
  missingCard?: string;
}

export const replaceManaSymbols = (s: string) => {
  return s
    .replaceAll("}{", "} {")
    .split(" ")
    .map((word, idx) => {
      const toCompare = word.toLowerCase().replaceAll(/[.,:]/g, "");
      if (word && Object.keys(manaFontMap).includes(toCompare)) {
        return manaFontMap[toCompare](`${toCompare}-${idx}`);
      }
      return ` ${word} `;
    });
};

function ComboCardHeading({
  card,
  isHoverable,
}: {
  card: Partial<DeckCard> & { name: string };
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
  missingCard,
}: props) => {
  const [expanded, setExpanded] = useState(initialExpanded);
  const deckCards = combo.uses
    .map((comboCard) => cards.find((c) => c.name === comboCard.card?.name))
    .filter((c) => !!c);
  useEffect(() => {
    setExpanded(initialExpanded);
  }, [initialExpanded]);
  return (
    <div className="z-10 flex max-w-[500px] flex-col gap-1 rounded border border-zinc-600 bg-zinc-800 p-6 text-sm sm:min-w-96 sm:text-base">
      {missingCard && (
        <ComboCardHeading
          card={{ name: missingCard }}
          isHoverable={!showImages}
        />
      )}
      {deckCards.map((c, idx) => (
        <div className="inline-flex w-fit items-center gap-2" key={c.id}>
          {(idx !== 0 || !!missingCard) && (
            <FontAwesomeIcon
              icon={faPlus}
              onClick={() => setExpanded(!expanded)}
            />
          )}
          <ComboCardHeading key={c.id} card={c} isHoverable={!showImages} />
        </div>
      ))}
      <div
        className={`flex flex-col flex-wrap items-center justify-start gap-3 md:flex-col md:items-start`}
      >
        {showImages && (
          <CardStack
            cards={[
              missingCard
                ? {
                    id: "missing-card",
                    image: cardNameToImageSrc(missingCard),
                    name: missingCard ?? "",
                    oracle_text: "",
                    type: "",
                  }
                : null,
              ...deckCards,
            ].filter((c) => !!c)}
          />
        )}
        <div className="flex w-full flex-col items-start gap-3">
          <div>
            <p className="text-base font-bold md:text-lg">Effects</p>
            <ul className="list">
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
          <div className="grid gap-2">
            {!!combo.otherPrerequisites.trim() && (
              <div className="flex flex-1 basis-5/12 flex-col sm:min-w-72">
                <p className="text-base font-bold md:text-lg">Prerequisites</p>
                <ul className="list">
                  {combo.otherPrerequisites
                    .split(".")
                    .filter((p) => p.trim())
                    .map((p, idx) => (
                      <li key={`combo-${combo.id}-${p}-${idx}`}>
                        {replaceManaSymbols(p)}
                      </li>
                    ))}
                </ul>
              </div>
            )}
            <div className="flex flex-1 basis-5/12 flex-col sm:min-w-72">
              <p className="text-base font-bold md:text-lg">Steps</p>
              <ol className="list">
                {combo.description
                  .split(".")
                  .filter((t) => t.trim().length > 0)
                  .map((s, idx) => (
                    <li key={`${combo.id}-${idx}`}>{replaceManaSymbols(s)}</li>
                  ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
