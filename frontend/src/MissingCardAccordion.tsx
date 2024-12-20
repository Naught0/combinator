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
      className={`flex flex-col gap-2 rounded-md bg-zinc-950 ${expanded ? "pb-3 md:col-span-2 xl:col-span-3" : ""}`}
    >
      <button
        className={`flex border-collapse cursor-pointer flex-row items-center gap-3 rounded-md border border-zinc-700 bg-zinc-800 p-3 px-5`}
        onClick={() => setExpanded(!expanded)}
      >
        <span className="flex items-center justify-center gap-1 align-middle font-serif text-base md:text-xl">
          Add{" "}
          <HoverableCard
            cardName={props.cardName}
            className={"font-black text-orange-200 md:text-xl"}
          />{" "}
          ({props.count})
        </span>
      </button>
      {expanded && (
        <div className="flex flex-row flex-wrap gap-3 px-3">
          {props.children}
        </div>
      )}
    </div>
  );
};
