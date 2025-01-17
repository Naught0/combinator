import { defaultFormValues } from "@/UserDeckFilterForm";

export function removeDefaultParams(
  params: URLSearchParams,
  defaults = defaultFormValues,
) {
  for (const [k, v] of Object.entries(defaults)) {
    if (params.get(k) === String(v) || !params.get(k)) {
      params.delete(k);
    }
  }

  return params;
}
