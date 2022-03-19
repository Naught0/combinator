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
    visible, } = usePopperTooltip({ placement: "top-end" });

  return (
    <div className="combo columns is-gapless is-clickable is-flex is-align-items-center m-0 p-4" ref={setTriggerRef}>
      {visible && <div className="tooltip" ref={setTooltipRef} {...getTooltipProps()}>
        <div className="tooltip-arrow" {...getArrowProps()}></div>
        <div className="content is-marginless is-paddingless">
          <ol>
            {data.s
              .split(".")
              .filter(t => t.trim().length > 0)
              .map((s, idx) => <li key={`${data.d}-${idx}`}>
                {s.split(" ").map((word, idx) => {
                  const matchChar = word.match(/\{(?<val>.+)\}/)?.groups?.val;
                  if (matchChar && Object.keys(manaFontMap).includes(matchChar.toLowerCase())) {
                    console.log(`Found ${matchChar}`);
                    
                    return manaFontMap[matchChar.toLowerCase()];
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