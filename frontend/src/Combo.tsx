import { manaFontMap } from "./manaFontMap";
import { HoverableCard } from "./HoverableCard";
import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Button } from "./components/ui/button";

interface props {
  combo: AlmostIncluded;
  initialExpanded?: boolean;
  cards: DeckCard[];
  showImages?: boolean;
}

const BASE_MARGIN = 150;

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

export const Combo = ({
  combo,
  initialExpanded,
  cards,
  showImages = true,
}: props) => {
  const cardNames = cards.map((c) => c.name);
  const [expanded, setExpanded] = useState(initialExpanded);

  return (
    <div className={`m-3 flex flex-1 basis-full flex-col`}>
      <div
        className={`flex w-full flex-1 flex-col items-center !rounded-b-none`}
      >
        <div className="z-10 flex w-full flex-col gap-3 rounded bg-zinc-900/95 px-6 py-4 md:px-10 md:py-6">
          <p className="font-serif text-lg font-bold md:text-xl">
            {combo.uses.map((u) => u.card?.name).join(" + ")}
          </p>
          <div className="flex flex-col items-start justify-start gap-3 md:flex-row md:items-center md:gap-6">
            {showImages && (
              <div className="flex">
                {combo.uses
                  .filter((used) => !!used.card)
                  .map((used, index) => {
                    const card = cards.find((c) => c.name === used.card?.name);
                    if (!card) return null;

                    const overlapMargin = Math.min(
                      -BASE_MARGIN, // Minimum overlap
                      -(
                        (BASE_MARGIN * (combo.uses.length - 1)) /
                        (combo.uses.length / 1.9)
                      ), // Adjust for fit
                    );

                    return (
                      <img
                        key={card.id}
                        className="w-64 max-w-fit rounded-2xl transition-shadow hover:z-20 hover:shadow-lg hover:shadow-zinc-950 md:w-64 lg:w-64 xl:w-72"
                        src={card.image}
                        alt={card.id}
                        style={{
                          marginRight:
                            index + 1 === combo.uses.length
                              ? ""
                              : overlapMargin,
                        }}
                      />
                    );
                  })}
              </div>
            )}
            <div>
              <p className="font-bold">Result</p>
              <ul>
                {combo.produces.map((produces) => (
                  <li key={produces.feature.id}>{produces.feature.name}</li>
                ))}
              </ul>

              <div>
                <Button onClick={() => setExpanded((prev) => !prev)}>
                  Expand
                </Button>
              </div>
            </div>
          </div>
          {expanded && (
            <div className="flex flex-1 flex-wrap justify-start rounded-b-md border-t border-t-zinc-600 py-3">
              <div className="flex flex-col justify-between gap-6 md:flex-row lg:gap-10">
                {!!combo.otherPrerequisites.trim() && (
                  <div className="flex min-w-72 basis-5/12 flex-col">
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
    </div>
  );
};
