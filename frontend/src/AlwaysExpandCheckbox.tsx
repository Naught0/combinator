import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useAlwaysExpandSteps } from "./hooks/useStepsExpanded";

export function AlwaysExpandCheckbox() {
  const { alwaysExpandSteps, setAlwaysExpandSteps } = useAlwaysExpandSteps();

  return (
    <div className="flex h-full flex-col gap-2.5 self-start">
      <Label
        htmlFor="alwaysExpandSteps"
        className="text-xs font-bold uppercase text-zinc-300"
      >
        Always expand steps
      </Label>
      <Switch
        id="alwaysExpandSteps"
        checked={alwaysExpandSteps}
        onCheckedChange={setAlwaysExpandSteps}
      />
    </div>
  );
}
