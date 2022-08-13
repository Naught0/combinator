import { usePopperTooltip } from "react-popper-tooltip";
import { manaFontMap } from "./manaFontMap";

interface props {
  data: Combo;
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

export const Combo = ({ data }: props) => {
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({ offset: [0, 15], trigger: "click" });

  return (
    <div
      className={`combo columns is-gapless is-clickable is-flex is-align-items-center m-3 p-3 ${
        visible && "active"
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
                    .map((p) => (
                      <li>{replaceManaSymbols(p, p)}</li>
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
          {data.c.map((card) => (
            <span key={`${data.d}-${card}`} className="tag is-dark">
              {card}
            </span>
          ))}
        </div>
      </div>
      <div className="column">
        <p>{data.r}</p>
      </div>
    </div>
  );
};
