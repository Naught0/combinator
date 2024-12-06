import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode, useState } from "react";
import { CardImage } from "./CardImage";

export const MissingCardAccordion = (props: {
  cardName: string;
  cardImage?: string;
  count: number;
  children: ReactNode;
}) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className={`flex basis-1/2 flex-col rounded-lg transition-colors ${expanded ? "bg-[rgba(0,0,0,0.25)]" : "hover:bg-[rgba(0,0,0,0.15)]"} `}
    >
      <div
        className={`flex flex-1 cursor-pointer flex-row items-center gap-3 rounded-md p-5`}
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <FontAwesomeIcon
            icon={expanded ? faMinus : faPlus}
            className="text-base lg:text-2xl"
          />
        </div>

        {props.cardImage && (
          <div className="w-72">
            <CardImage cardImage={props.cardImage} /> ({props.count})
          </div>
        )}
      </div>
      {expanded && <div className="flex flex-col gap-6">{props.children}</div>}
    </div>
  );
};
