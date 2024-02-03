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
      <div className={"flex flex-row justify-start items-enter"}>
        <div
          className={`combo px-5 py-5 cursor-pointer ${expanded ? "active" : ""
            } flex items-center px-3 justify-between flex-grow gap-6`}
          onClick={() => setExpanded(!expanded)}
        >
          <FontAwesomeIcon
            className="text-lg"
            icon={expanded ? faMinus : faPlus}
          />
          <div className="flex flex-col basis-1/2">
            <div className="tags are-medium">
              {combo.uses.map((used) => {
                return (
                  <HoverableCard key={used.card.id} cardName={used.card.name} />
                );
              })}
            </div>
          </div>
          <div className="flex flex-col basis-1/2">
            <ul className="list-['-']">
              {combo.produces.map((produces) => (
                <li key={produces.id} className="list-item">
                  {produces.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {expanded && (
        <div className="tooltip mt-[-10px] pl-6">
          <div className="flex flex-row justify-evenly gap-3 max-w-3xl">
            {!!combo.otherPrerequisites.trim() && (
              <div className="flex flex-col basis-1/2 flex-1">
                <p className="subtitle text-lg mb-1">Prequisites</p>
                <div className="content is-marginless is-paddingless">
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
              </div>
            )}
            <div className="flex flex-col basis-1/2 flex-1">
              <p className="subtitle is-5 mb-1">Steps</p>
              <div className="content is-marginless is-paddingless">
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
        </div>
      )}
    </div>
  );
};
