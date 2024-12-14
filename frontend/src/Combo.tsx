import { manaFontMap } from "./manaFontMap";
import { HoverableCard } from "./HoverableCard";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Button } from "./components/ui/button";

interface props {
  combo: AlmostIncluded;
  initialExpanded?: boolean;
  cards: DeckCard[];
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

export const Combo = ({ combo, initialExpanded, cards }: props) => {
  const cardNames = cards.map((c) => c.name);
  const [expanded, setExpanded] = useState(initialExpanded);
  return (
    <div className={`flex flex-col ${expanded ? "active col-span-2" : ""} m-3`}>
      <div
        className={`flex flex-col items-center !rounded-b-none p-3 lg:p-5 ${
          expanded ? "active" : ""
        }`}
      >
        <div className="relative flex basis-1/2 flex-row">
          {combo.uses
            .filter((used) => !!used.card)
            .map((used, index) => {
              const card = cards.find((c) => c.name === used.card?.name);
              if (!card) return null;
              return (
                <img
                  key={card.id}
                  className={`max-w-fit ${index + 1 === combo.uses.length ? "" : "-mr-32"} w-full rounded-2xl transition-shadow hover:z-20 hover:shadow-lg hover:shadow-zinc-950 md:w-72`}
                  src={card.image}
                  alt={card.id}
                />
              );
            })}
          <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-zinc-950 to-transparent"></div>
        </div>
        <div className="z-10 -mt-44 flex w-full flex-col gap-3 rounded bg-zinc-900/90 px-3 py-2 md:px-6 md:py-4 lg:min-w-72">
          <p className="font-serif text-lg font-bold md:text-xl">
            {combo.uses.map((u) => u.card?.name).join(" + ")}
          </p>
          <p className="font-bold">Result</p>
          <div>
            <ul className="list-inside">
              {combo.produces.map((produces) => (
                <li key={produces.feature.id} className="list-item list-disc">
                  {produces.feature.name}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Button onClick={() => setExpanded((prev) => !prev)}>Expand</Button>
          </div>
        </div>
      </div>
      {expanded && (
        <div className="flex flex-1 justify-start rounded-b-md border-t border-t-zinc-600 p-5 lg:p-6">
          <div className="flex flex-wrap justify-between gap-6 lg:gap-10">
            {!!combo.otherPrerequisites.trim() && (
              <div className="flex basis-5/12 flex-col lg:min-w-64">
                <p className="subtitle mb-1 text-lg">Prequisites</p>
                <ul>
                  {combo.otherPrerequisites
                    .split(".")
                    .filter((p) => p)
                    .map((p, idx) => (
                      <li
                        className={"mt-2 list-disc"}
                        key={`combo-${combo.id}-${p}-${idx}`}
                      >
                        {replaceManaSymbols(p)}
                      </li>
                    ))}
                </ul>
              </div>
            )}
            <div className="flex flex-1 basis-1/2 flex-col md:min-w-72">
              <p className="subtitle is-5 mb-1">Steps</p>
              <ol>
                {combo.description
                  .split(".")
                  .filter((t) => t.trim().length > 0)
                  .map((s, idx) => (
                    <li className={"mt-2 list-disc"} key={`${combo.id}-${idx}`}>
                      {replaceManaSymbols(s)}
                    </li>
                  ))}
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
