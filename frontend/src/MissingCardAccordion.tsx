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
      className={`flex basis-1/2 flex-col rounded-lg transition-colors ${expanded ? "bg-[rgba(0,0,0,0.25)]" : "hover:bg-[rgba(0,0,0,0.15)]"} `}
    >
      <div
        className={`flex flex-1 cursor-pointer flex-row items-center gap-3 rounded-md p-5`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="select-none text-base md:text-lg">
          Add{" "}
          <HoverableCard
            cardName={props.cardName}
            classNameOverride={"underline underline-offset-8"}
          />{" "}
          ({props.count})
        </div>
      </div>
      {expanded && <div className="flex flex-col gap-6">{props.children}</div>}
    </div>
  );
};
