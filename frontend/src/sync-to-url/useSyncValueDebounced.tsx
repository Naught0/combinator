import { removeDefaultParams } from "@/UserDeck/hooks/useRemoveDefaultParams";
import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { useDebounce } from "use-debounce";

export function useSyncValueDebounced({
  name,
  value,
  debounceMs,
}: {
  value: string;
  name: string;
  debounceMs: number;
}) {
  const [, setParams] = useSearchParams();
  const [debouncedValue] = useDebounce<string>(value, debounceMs);

  useEffect(
    function sync() {
      setParams(
        (prev) => {
          prev.set(name, value);
          return removeDefaultParams(prev);
        },
        { replace: true },
      );
    },
    [debouncedValue],
  );
  return debouncedValue;
}
