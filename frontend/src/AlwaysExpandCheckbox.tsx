import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAlwaysExpandSteps } from "./hooks/useStepsExpanded";

export function AlwaysExpandCheckbox() {
  const { alwaysExpandSteps, setAlwaysExpandSteps } = useAlwaysExpandSteps();

  return (
    <div className="flex h-full min-h-16 flex-col items-start justify-start gap-2">
      <div>
        <Label
          htmlFor="alwaysExpandSteps"
          className="text-xs font-bold uppercase text-zinc-400"
        >
          Always expand steps
        </Label>
      </div>
      <div>
        <Switch
          id="alwaysExpandSteps"
          checked={alwaysExpandSteps}
          onCheckedChange={setAlwaysExpandSteps}
        />
      </div>
    </div>
  );
}
