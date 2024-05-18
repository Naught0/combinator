import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode, useState } from "react";
import { HoverableCard } from "./HoverableCard";

export const MissingCardAccordion = (props: {
  cardName: string;
  count: number;
  children: ReactNode;
}) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className={`flex basis-1/2 flex-col transition-colors
${expanded ? "bg-[rgba(0,0,0,0.25)]" : "hover:bg-[rgba(0,0,0,0.15)]"}
      `}
    >
      <div
        className={`flex flex-1 flex-row gap-3 p-5 cursor-pointer rounded-md items-center`}
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <FontAwesomeIcon
            icon={expanded ? faMinus : faPlus}
            className="text-base lg:text-2xl"
          />
        </div>

        <div className="text-base md:text-lg lg:text-2xl select-none">
          Add{" "}
          <HoverableCard
            cardName={props.cardName}
            classNameOverride={"underline underline-offset-8"}
          />{" "}
          ({props.count})
        </div>
      </div>
      {expanded && <div className="flex flex-col">{props.children}</div>}
    </div>
  );
};
