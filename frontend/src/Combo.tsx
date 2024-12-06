import { manaFontMap } from "./manaFontMap";
import { HoverableCard } from "./HoverableCard";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

interface props {
  combo: AlmostIncluded;
  initialExpanded?: boolean;
  cardNames: string[];
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

export const Combo = ({ combo, initialExpanded, cardNames }: props) => {
  const [expanded, setExpanded] = useState(initialExpanded);
  return (
    <div className={`flex flex-col ${expanded ? "active col-span-2" : ""} m-3`}>
      <div
        className={`combo flex cursor-pointer items-center !rounded-b-none p-3 lg:p-5 ${
          expanded ? "active" : ""
        }`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="w-8 flex-grow-0">
          <FontAwesomeIcon
            className="text-lg"
            icon={expanded ? faMinus : faPlus}
          />
        </div>
        <div className="flex flex-1 flex-wrap items-center gap-6 px-3 lg:gap-10">
          <div className="flex flex-1 basis-5/12 flex-col">
            <div className="tags are-medium">
              {combo.uses
                .filter((used) => !!used.card)
                .map((used) => {
                  const card = used.card as Card;
                  return (
                    <HoverableCard
                      key={card.id}
                      cardName={card.name}
                      inDeck={cardNames.includes(card.name)}
                    />
                  );
                })}
            </div>
          </div>
          <div className="flex flex-1 basis-5/12 flex-col lg:min-w-72">
            <ul>
              {combo.produces.map((produces) => (
                <li key={produces.feature.id} className="list-item list-disc">
                  {produces.feature.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {expanded && (
        <div className="tooltip flex flex-1 justify-start rounded-b-md border-t border-t-zinc-600 p-5 lg:p-6">
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
