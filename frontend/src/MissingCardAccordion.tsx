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
      className={`flex basis-1/2 flex-col rounded-lg transition-colors p-5 ${
        expanded ? "bg-[rgba(0,0,0,0.25)]" : "hover:bg-[rgba(0,0,0,0.15)]"
      }`}
    >
      <div
        className="flex flex-row gap-3 cursor-pointer items-center"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <FontAwesomeIcon
            icon={expanded ? faMinus : faPlus}
            className="text-2xl"
          />
        </div>

        <div className="text-2xl select-none">
          Add{" "}
          <HoverableCard
            cardName={props.cardName}
            classNameOverride={"underline"}
          />{" "}
          ({props.count})
        </div>
      </div>
      {expanded && <div className=" flex flex-col gap-6">{props.children}</div>}
    </div>
  );
};
