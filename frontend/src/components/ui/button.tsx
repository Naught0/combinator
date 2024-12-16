import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";

const buttonVariants = cva(
  "inline-flex items-center border-zinc-700 justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:ring-offset-zinc-950 focus-visible:ring-zinc-300",
  {
    variants: {
      variant: {
        default: "bg-zinc-950 text-zinc-50 hover:bg-zinc-900/90",
        tab: "bg-zinc-950 text-zinc-50 hover:bg-zinc-950/90 border-none rounded-b-none border-solid border-b-4",
        activeTab:
          "bg-zinc-950 text-zinc-50 hover:bg-zinc-950/90 border-none rounded-b-none border-solid border-b-4 border-blue-600",
        primary:
          "bg-blue-600 text-zinc-50 hover:bg-blue-600/90 border-blue-500 border",
        destructive: "bg-red-500 text-zinc-50 hover:bg-red-500/90",
        outline:
          "border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-900/90 dark:hover:text-zinc-50",
        secondary:
          "bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80 dark:bg-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-700/80",
        ghost:
          "hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-700 dark:hover:text-zinc-50",
        link: "text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        "icon-lg": "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading,
      asChild = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }), "relative")}
        ref={ref}
        disabled={loading || disabled}
        {...props}
      >
        <span className={loading ? "invisible contents" : "visible contents"}>
          {children}
        </span>
        {loading && (
          <FontAwesomeIcon
            icon={faCircleNotch}
            className="absolute m-auto animate-spin"
          />
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
