import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Props {
  title?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  onChange?: (value: string) => void;
  value?: string;
}
export const Dropdown = (props: Props) => {
  return (
    <Select onValueChange={props.onChange}>
      <SelectTrigger className={cn("w-fit max-w-48", props.className)}>
        <SelectValue placeholder={props.title ?? "Select"} />
      </SelectTrigger>
      <SelectContent>{props.children}</SelectContent>
    </Select>
  );
};
