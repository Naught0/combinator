import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cn } from "./lib/utils";

export function Loading({
  message,
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 text-xl md:text-3xl",
        className,
      )}
    >
      <FontAwesomeIcon icon={faCircleNotch} className="animate-spin" />
      <span>{message ?? "Loading"}</span>
    </div>
  );
}
