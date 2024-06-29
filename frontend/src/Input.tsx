import { HTMLProps } from "react";
import { twMerge } from "tailwind-merge";

type Props = HTMLProps<HTMLInputElement>;
export const Input = (props: Props) => {
  return (
    <input
      className={twMerge(
        "rounded px-3 py-2 bg-zinc-900 border border-zinc-300",
        props.className,
      )}
      {...props}
    />
  );
};
