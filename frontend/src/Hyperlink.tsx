import { FC, ReactNode } from "react";

interface Props {
  className?: string;
  children: ReactNode;
  href: string;
}
export const Hyperlink: FC<Props> = ({ className, children, href }) => {
  return (
    <a href={href} rel="noreferrer" target="_blank" className={className}>
      {children}
    </a>
  );
};
