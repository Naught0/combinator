import { Input, InputProps } from "@/components/ui/input";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { useSearchParams } from "react-router";
import { useSyncValueDebounced } from "./useSyncValueDebounced";
import { cn } from "@/lib/utils";

export function SyncInput({
  debounceMs = 100,
  ...props
}: InputProps & { name: string; debounceMs?: number }) {
  const [searchParams] = useSearchParams();
  const [value, setValue] = useState(searchParams.get(props.name) ?? "");
  useSyncValueDebounced({ name: props.name, debounceMs, value });

  return (
    <div className="relative w-full">
      <Input
        {...props}
        className={cn("pr-8", props.className)}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      {!!value && (
        <button
          className="absolute right-2 top-1/2 -translate-y-1/2"
          onClick={() => {
            setValue("");
          }}
        >
          <FontAwesomeIcon icon={faXmarkCircle} />
        </button>
      )}
    </div>
  );
}
