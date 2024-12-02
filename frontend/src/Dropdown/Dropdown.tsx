import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";

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
      <SelectTrigger className={"w-fit max-w-48"}>
        <SelectValue placeholder={props.title ?? "Select"} />
      </SelectTrigger>
      <SelectContent>{props.children}</SelectContent>
    </Select>
  );
};
