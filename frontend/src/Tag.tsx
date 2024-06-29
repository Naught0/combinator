import { forwardRef, PropsWithChildren } from "react";

type BaseProps = PropsWithChildren;
interface Props extends BaseProps {}
export const Tag = forwardRef<HTMLDivElement, Props>((props, ref) => {
  return (
    <div
      className="inline px-2 py-1 bg-zinc-300 text-black rounded text-sm lg:text-base"
      ref={ref}
    >
      {props.children}
    </div>
  );
});
