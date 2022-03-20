import { usePopperTooltip } from "react-popper-tooltip";
import { manaFontMap } from "./manaFontMap";

interface props {
  data: Combo;
}
export const Combo = ({ data }: props) => {
  const { getArrowProps,
    getTooltipProps,
    setTooltipRef,
    setTriggerRef,
    visible, } = usePopperTooltip({ offset: [0, 15], trigger: "click" });

  return (
    <div className={`combo columns is-gapless is-clickable is-flex is-align-items-center m-3 p-3 ${visible && 'active'}`} ref={setTriggerRef}>
      {visible && <div className="tooltip" ref={setTooltipRef} {...getTooltipProps()}>
        <div {...getArrowProps()}></div>
        <div className="content is-marginless is-paddingless">
          <ol>
            {data.s
              .split(".")
              .filter(t => t.trim().length > 0)
              .map((s, idx) => <li key={`${data.d}-${idx}`}>
                {s.replaceAll(/[{}]/g, ' ').split(" ").map((word, idx) => {
                  if (word && Object.keys(manaFontMap).includes(word.toLowerCase())) {
                    return manaFontMap[word.toLowerCase()];
                  }
                  return ` ${word} `
                })}
              </li>)
            }
          </ol>
        </div>
      </div>}
      <div className="column">
        <div className="tags are-medium">
          {data.c.map(card => <span key={`${data.d}-${card}`} className="tag is-dark">{card}</span>)}
        </div>
      </div>
      <div className="column">
        <p>{data.r}</p>
      </div>
    </div>
  )
}