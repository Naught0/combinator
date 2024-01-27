import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { ReactNode, useState } from "react";

export const MissingCardAccordion = (props: {
  cardName: string;
  count: number;
  children: ReactNode;
}) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={"flex flex-col gap-3 flex-1 border-gray-500"}>
      <div
        className="flex flex-row gap-3 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <FontAwesomeIcon
            icon={expanded ? faChevronDown : faChevronRight}
            className="text-xl"
          />
        </div>

        <div className="underline text-lg">
          Add {props.cardName} ({props.count})
        </div>
      </div>
      {expanded && <div>{props.children}</div>}
    </div>
  );
};
