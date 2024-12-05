import { cn } from "./lib/utils";
import { PuffLoader } from "react-spinners";

type Size = "sm" | "md" | "lg";
export function Loading({
  message,
  className,
  size = "md",
}: {
  message?: string;
  className?: string;
  size?: Size;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 text-2xl md:text-4xl",
        getTextClassName(size),
        className,
      )}
    >
      <span className="md:hidden">
        <PuffLoader color="white" size={getSpinnerSize(size)[0]} />
      </span>
      <span className="hidden md:inline">
        <PuffLoader color="white" size={getSpinnerSize(size)[1]} />
      </span>

      <span>{message ?? "Loading"}</span>
    </div>
  );
}

function getSpinnerSize(size: Size) {
  switch (size) {
    case "sm":
      return [30, 35];
    case "md":
      return [40, 50];
    case "lg":
      return [40, 60];
  }
}

function getTextClassName(size: Size) {
  switch (size) {
    case "sm":
      return "text-sm md:text-base";
    case "md":
      return "text-lg md:text-2xl";
    case "lg":
      return "text-2xl md:text-4xl";
  }
}
