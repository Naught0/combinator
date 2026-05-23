import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";

export const alwaysExpandStepsAtom = atomWithStorage<boolean>(
  "alwaysExpandSteps",
  false
);

export function useAlwaysExpandSteps() {
  const [alwaysExpandSteps, setAlwaysExpandSteps] = useAtom(alwaysExpandStepsAtom);
  return { alwaysExpandSteps, setAlwaysExpandSteps };
}
