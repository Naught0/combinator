import {
  faChevronDown,
  faChevronRight,
  faMinusSquare,
  faPlusSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode, useState } from "react";

export const MissingCardAccordion = (props: {
  cardName: string;
  count: number;
  children: ReactNode;
}) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={"flex flex-col flex-1"}>
      <div
        className="flex flex-row gap-3 cursor-pointer items-center"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <FontAwesomeIcon
            icon={expanded ? faMinusSquare : faPlusSquare}
            className="text-xl"
          />
        </div>

        <div className="text-lg select-none">
          Add {props.cardName} ({props.count})
        </div>
      </div>
      {expanded && (
        <div className="border-l-width-[3px] border-l border-l-solid border-l-">
          {props.children}
        </div>
      )}
    </div>
  );
};
