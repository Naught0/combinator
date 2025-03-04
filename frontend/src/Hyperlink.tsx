import { FC, HTMLProps, ReactNode } from "react";

interface Props {
  className?: string;
  children: ReactNode;
  href: string;
}
export const Hyperlink: FC<Props & HTMLProps<HTMLAnchorElement>> = ({
  className,
  children,
  href,
  target = "_blank",
  rel = "noreferrer",
  ...props
}) => {
  return (
    <a href={href} rel={rel} target={target} className={className} {...props}>
      {children}
    </a>
  );
};
