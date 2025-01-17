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
      setParams((prev) => {
        prev.set(name, value);
        return removeDefaultParams(convertObjectToParams(prev));
      });
    },
    [debouncedValue],
  );
  return debouncedValue;
}

function convertValueToUrl(value: string | number): string {
  if (typeof value === "number") {
    return value.toString();
  }
  if (value === "Yes") {
    return "true";
  }
  if (value === "No") {
    return "false";
  }
  return value;
}

function convertObjectToParams(params: URLSearchParams) {
  return new URLSearchParams(
    [...params.entries()].map(([k, v]) => [k, convertValueToUrl(v)]),
  );
}
