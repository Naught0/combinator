import { usePopperTooltip } from "react-popper-tooltip";
import { manaFontMap } from "./manaFontMap";
import { useSetRecoilState } from "recoil";
import { hoveredCard } from "./atoms";

interface props {
  data: Combo;
  cards: CardsWithImages;
}

const replaceManaSymbols = (uniqueKey: string | number, s: string) => {
  return s
    .replaceAll("}{", "} {")
    .split(" ")
    .map((word, idx) => {
      const toCompare = word.toLowerCase().replaceAll(/[.,]/g, "");
      if (word && Object.keys(manaFontMap).includes(toCompare)) {
        return manaFontMap[toCompare](`${uniqueKey}-${idx}-${word}`);
      }
      return ` ${word} `;
    });
};

export const Combo = ({ data, cards }: props) => {
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
                  {data.p
                    .split(".")
                    .filter((p) => p)
                    .map((p, idx) => (
                      <li key={`combo-${data.d}-${p}-${idx}`}>
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
                  {data.s
                    .split(".")
                    .filter((t) => t.trim().length > 0)
                    .map((s, idx) => (
                      <li key={`${data.d}-${idx}`}>
                        {replaceManaSymbols(data.d, s)}
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
          {data.c.map((card) => {
            return (
              <span
                key={`${data.d}-${card}`}
                className={`tag is-clickable ${
                  Object.keys(cards).includes(card) ? "is-dark" : "is-danger"
                }`}
                onMouseOver={() => setCurrentCardUrl(cards[card])}
                onClick={() => setCurrentCardUrl(cards[card])}
                onMouseOut={() => setCurrentCardUrl("")}
              >
                {card}
              </span>
            );
          })}
        </div>
      </div>
      <div className="column">
        <p>{data.r}</p>
      </div>
    </div>
  );
};
