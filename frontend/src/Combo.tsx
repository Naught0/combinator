import { usePopperTooltip } from "react-popper-tooltip";
import { manaFontMap } from "./manaFontMap";
import { useSetRecoilState } from "recoil";
import { hoveredCard } from "./atoms";

interface props {
  combo: Combo;
  deckData: DeckData;
}

const replaceManaSymbols = (uniqueKey: string | number, s: string) => {
  return s
    .replaceAll("}{", "} {")
    .split(" ")
    .map((word, idx) => {
      const toCompare = word.toLowerCase().replaceAll(/[.,]/g, "");
      if (word && Object.keys(manaFontMap).includes(toCompare)) {
        return manaFontMap[toCompare];
      }
      return ` ${word} `;
    });
};

export const Combo = ({ combo, deckData }: props) => {
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({ offset: [0, 15], trigger: "click" });
  const setCurrentCardUrl = useSetRecoilState(hoveredCard);

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
                  {combo.p
                    .split(".")
                    .filter((p) => p)
                    .map((p, idx) => (
                      <li key={`combo-${combo.d}-${p}-${idx}`}>
                        {replaceManaSymbols(p, p)}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
            <div className="column">
              <p className="subtitle has-text-black is-5 mb-1">Steps</p>
              <div className="content is-marginless is-paddingless">
                <ol>
                  {combo.s
                    .split(".")
                    .filter((t) => t.trim().length > 0)
                    .map((s, idx) => (
                      <li key={`${combo.d}-${idx}`}>
                        {replaceManaSymbols(combo.d, s)}
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
          {combo.c.map((card) => {
            return (
              <span
                key={`${combo.d}-${card}`}
                className={`tag is-clickable ${
                  deckData.cards.includes(card) ? "is-dark" : "is-danger"
                }`}
                onMouseOver={() => setCurrentCardUrl(deckData.cardImages[card])}
                onClick={() => setCurrentCardUrl(deckData.cardImages[card])}
                onMouseOut={() => setCurrentCardUrl("")}
              >
                {card}
              </span>
            );
          })}
        </div>
      </div>
      <div className="column">
        <p>{combo.r}</p>
      </div>
    </div>
  );
};
