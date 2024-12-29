import { useEffect } from "react";
import { useSearchParams } from "react-router";
import { useDebounce } from "use-debounce";

export function useSyncValueDebounced({
  name,
  value,
  debounceMs,
  defaultValue,
}: {
  value: string;
  name: string;
  debounceMs: number;
  defaultValue?: string;
}) {
  const [, setParams] = useSearchParams();
  const [debouncedValue] = useDebounce<string>(value, debounceMs);

  useEffect(
    function sync() {
      if (!value || value === defaultValue) {
        setParams((prev) => {
          prev.delete(name);
          return prev;
        });
      } else {
        setParams((prev) => {
          prev.set(name, value);
          return prev;
        });
      }
    },
    [debouncedValue],
  );
  return debouncedValue;
}
