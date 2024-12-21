import { useEffect } from "react";
import { useSearchParams } from "react-router";

export function useSyncToUrl(
  values: Record<string, string | number | boolean | string[]>,
) {
  const [, setSearchParams] = useSearchParams();
  console.log(JSON.stringify(values));
  useEffect(
    function syncToUrl() {
      setSearchParams((prev) => ({ ...prev, ...values }), { replace: true });
    },
    [JSON.stringify(values)],
  );
}
