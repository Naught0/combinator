import { cn } from "@/lib/utils";

export function MoxfieldLogo({
  className,
  ...props
}: React.ComponentProps<"img">) {
  return (
    <img
      src="/moxfield-icon.png"
      className={cn("size-5 select-none", className)}
      {...props}
    />
  );
}
