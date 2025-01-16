import { defaultFormValues } from "@/UserDeckFilterForm";
import { useEffect } from "react";
import { useSearchParams } from "react-router";

export function removeDefaultParams(
  params: URLSearchParams,
  defaults = defaultFormValues,
) {
  for (const [k, v] of Object.entries(defaults)) {
    if (params.get(k) === v) {
      console.log("Checking", k);
      console.log("Deleting", k, v);
      params.delete(k);
    }
  }

  return params;
}
export function useRemoveDefaultParams(defaultValues = defaultFormValues) {
  const [params, setParams] = useSearchParams();
  useEffect(
    function removeDefaults() {
      setParams((prev) => removeDefaultParams(prev, defaultValues));
    },
    [params.toString()],
  );
}
