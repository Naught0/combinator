import { PropsWithChildren } from "react";

export function TabContainer({ children }: PropsWithChildren) {
  return <article className="flex flex-col gap-3">{children}</article>;
}
