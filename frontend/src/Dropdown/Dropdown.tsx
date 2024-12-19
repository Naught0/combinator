import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Props {
  placeholder?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  onChange?: (value: string) => void;
  value?: string;
}

export const Dropdown = React.forwardRef<typeof Select, Props>(
  ({ className, children, onChange, placeholder, ...props }, ref) => {
    return (
      <Select onValueChange={onChange} {...props}>
        <SelectTrigger className={cn("w-fit max-w-48", className)}>
          <SelectValue placeholder={placeholder ?? "Select"} />
        </SelectTrigger>
        <SelectContent>{children}</SelectContent>
      </Select>
    );
  },
);
