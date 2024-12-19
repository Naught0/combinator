import * as React from "react";

import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";
import { useFormContext } from "react-hook-form";
import { ConnectForm } from "../form/connect";

const inputVariants = cva(
  "flex h-10 w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-zinc-950 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-950 dark:ring-offset-zinc-950 dark:file:text-zinc-50 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300 md:text-sm",
  {
    variants: {
      variant: {
        default: "dark:border-zinc-700",
        error: "border-red-400/90 border border-solid",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const Input = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & VariantProps<typeof inputVariants>
>(({ className, type, name, variant, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(inputVariants({ variant }), className)}
      {...props}
      ref={ref}
    />
  );
});
Input.displayName = "Input";

const HookInput = ({
  className,
  type,
  name,
  variant,
  ...props
}: React.ComponentProps<"input"> & { name: string } & VariantProps<
    typeof inputVariants
  >) => {
  const { register } = useFormContext();
  return (
    <input
      type={type}
      className={cn(inputVariants({ variant }), className)}
      {...register(name)}
      {...props}
    />
  );
};

export { Input, HookInput };
