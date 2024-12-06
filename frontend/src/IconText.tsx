import { IconDefinition } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, ReactNode } from "react";

interface Props {
  className?: string;
  spin?: boolean;
  icon: IconDefinition;
  children: ReactNode;
}
export const IconText: FC<Props> = ({ icon, className, spin, children }) => {
  return (
    <span
      className={`inline-flex items-center gap-1 ${className ? className : ""}`}
    >
      <span className="icon">
        <FontAwesomeIcon icon={icon} className={spin ? "animate-spin" : ""} />
      </span>
      <span>{children}</span>
    </span>
  );
};
