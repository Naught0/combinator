import { Dropdown, DropdownProps } from "@/Dropdown";
import { ReactNode, useState } from "react";
import { useSyncValueDebounced } from "./useSyncValueDebounced";
import { useSearchParams } from "react-router";

type SyncSelectProps = DropdownProps & {
  name: string;
  debounceMs?: number;
  children: ReactNode;
};
export const SyncSelect = ({
  debounceMs = 100,
  children,
  name,
  ...props
}: SyncSelectProps) => {
  const [searchParams] = useSearchParams();
  const [value, setValue] = useState(
    searchParams.get(name) ?? props.defaultValue ?? "",
  );
  useSyncValueDebounced({
    name,
    value,
    debounceMs,
  });
  return (
    <Dropdown {...props} onChange={setValue} value={value}>
      {children}
    </Dropdown>
  );
};
