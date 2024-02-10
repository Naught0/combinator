import { manaFontMap } from "./manaFontMap";
import { HoverableCard } from "./HoverableCard";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

interface props {
  combo: AlmostIncluded;
  deckData: DeckData;
  initialExpanded?: boolean;
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

export const Combo = ({ combo, initialExpanded }: props) => {
  const [expanded, setExpanded] = useState(initialExpanded);
  return (
    <div className={`flex flex-col ${expanded ? "active" : ""} m-3`}>
      <div
        className={`combo !rounded-b-none flex items-center p-3 lg:p-5 cursor-pointer ${
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
        <div className="flex items-center px-3 flex-1 flex-wrap gap-6 lg:gap-10">
          <div className="flex flex-col basis-5/12 flex-1">
            <div className="tags are-medium">
              {combo.uses.map((used) => {
                return (
                  <HoverableCard key={used.card.id} cardName={used.card.name} />
                );
              })}
            </div>
          </div>
          <div className="flex flex-col basis-5/12 flex-1 lg:min-w-72">
            <ul>
              {combo.produces.map((produces) => (
                <li key={produces.id} className="list-item list-disc">
                  {produces.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {expanded && (
        <div className="tooltip p-5 lg:p-6 justify-start border-t border-t-zinc-600 rounded-b-md flex flex-1">
          <div className="flex flex-wrap gap-6 lg:gap-10 justify-between">
            {!!combo.otherPrerequisites.trim() && (
              <div className="flex flex-col lg:min-w-64 basis-5/12">
                <p className="subtitle text-lg mb-1">Prequisites</p>
                <ul>
                  {combo.otherPrerequisites
                    .split(".")
                    .filter((p) => p)
                    .map((p, idx) => (
                      <li
                        className={"list-disc mt-2"}
                        key={`combo-${combo.id}-${p}-${idx}`}
                      >
                        {replaceManaSymbols(p)}
                      </li>
                    ))}
                </ul>
              </div>
            )}
            <div className="flex flex-col md:min-w-72 basis-1/2 flex-1">
              <p className="subtitle is-5 mb-1">Steps</p>
              <ol>
                {combo.description
                  .split(".")
                  .filter((t) => t.trim().length > 0)
                  .map((s, idx) => (
                    <li className={"list-disc mt-2"} key={`${combo.id}-${idx}`}>
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
