import * as React from "react";

import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const inputVariants = cva(
  "flex h-10 w-full rounded-md  bg-white px-3 py-2 ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-zinc-950 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:file:text-zinc-50 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300",
  {
    variants: {
      variant: {
        default: "dark:border-zinc-700",
        error: "border-red-400/90 border border-solid",
        homepage: "text-lg py-6 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export type InputProps = React.ComponentProps<"input"> &
  VariantProps<typeof inputVariants>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, name, variant, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant }), className)}
        {...props}
        ref={ref}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
