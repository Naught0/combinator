import React, { PropsWithChildren } from "react";

export function TabContainer({ children }: PropsWithChildren) {
  return <article className="flex w-full flex-col gap-3">{children}</article>;
}
