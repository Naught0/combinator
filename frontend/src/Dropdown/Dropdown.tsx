import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { SelectProps } from "@radix-ui/react-select";

export type DropdownProps = {
  placeholder?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  onChange?: (value: string) => void;
  value?: string;
} & SelectProps;

export const Dropdown = ({
  className,
  children,
  onChange,
  placeholder,
  ...props
}: DropdownProps) => {
  return (
    <Select onValueChange={onChange} {...props}>
      <SelectTrigger className={cn("w-fit max-w-48", className)}>
        <SelectValue placeholder={placeholder ?? "Select"} />
      </SelectTrigger>
      <SelectContent>{children}</SelectContent>
    </Select>
  );
};
