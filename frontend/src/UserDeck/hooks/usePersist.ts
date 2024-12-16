import { useEffect } from "react";
import { useDebounce } from "use-debounce";

export function usePersist({ val, key }: { key: string; val: string }) {
  const [debounced] = useDebounce(val, 500);
  useEffect(
    function persist() {
      localStorage.setItem(key, debounced);
    },
    [debounced],
  );
}
