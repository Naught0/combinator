import { manaFontMap } from "./manaFontMap";
import { Button } from "./components/ui/button";
import { CardStack } from "./CardStack";
import { useState } from "react";

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

export const Combo = ({
  combo,
  initialExpanded,
  cards,
  showImages = true,
}: props) => {
  const cardNames = cards.map((c) => c.name);
  const [expanded, setExpanded] = useState(initialExpanded);
  const deckCards = combo.uses
    .map((comboCard) => cards.find((c) => c.name === comboCard.card?.name))
    .filter((c) => !!c);
  console.log(JSON.stringify(deckCards, undefined, 2));
  return (
    <div className={`m-3 flex flex-1 basis-full flex-col`}>
      <div
        className={`flex w-full flex-1 flex-col items-center !rounded-b-none`}
      >
        <div className="z-10 flex w-full flex-col gap-3 rounded bg-zinc-900/95 p-6 md:p-8">
          <p className="text-center font-serif text-xl font-bold md:text-left">
            {combo.uses.map((u) => u.card?.name).join(" + ")}
          </p>
          <div className="align-center flex flex-col items-center gap-3 md:flex-row md:items-start md:justify-start md:gap-6">
            <CardStack cards={deckCards} />
            <div className="flex flex-col gap-3">
              <div>
                <p className="font-bold">Result</p>
                <ul>
                  {combo.produces.map((produces) => (
                    <li key={produces.feature.id}>{produces.feature.name}</li>
                  ))}
                </ul>
              </div>

              <div>
                <Button
                  variant={"outline"}
                  onClick={() => setExpanded((prev) => !prev)}
                >
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
