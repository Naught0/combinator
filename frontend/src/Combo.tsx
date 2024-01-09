import { usePopperTooltip } from "react-popper-tooltip";
import { manaFontMap } from "./manaFontMap";
import { HoverableCard } from "./HoverableCard";

interface props {
  combo: AlmostIncluded;
  deckData: DeckData;
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

export const Combo = ({ combo }: props) => {
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({ offset: [0, 15], trigger: "click" });

  return (
    <div
      className={`combo is-gapless is-clickable is-flex is-align-items-center m-3 p-3 ${
        visible ? "active" : ""
      }`}
      ref={setTriggerRef}
    >
      {visible && (
        <div className="tooltip" ref={setTooltipRef} {...getTooltipProps()}>
          <div className="columns">
            <div className="column">
              <p className="subtitle has-text-black is-5 mb-1">Prequisites</p>
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
            <div className="column">
              <p className="subtitle has-text-black is-5 mb-1">Steps</p>
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
      <div className="column">
        <div className="tags are-medium">
          {combo.uses.map((used) => {
            return (
              <HoverableCard key={used.card.id} cardName={used.card.name} />
            );
          })}
        </div>
      </div>
      <div className="column">
        <ul>
          {combo.produces.map((produces) => (
            <li key={produces.id} className="list-item">
              {produces.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
