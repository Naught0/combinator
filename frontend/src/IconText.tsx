import { IconDefinition } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";

interface Props {
  className?: string;
  spin?: boolean;
  icon: IconDefinition;
}
export const IconText: FC<Props> = ({ icon, className, spin, children }) => {
  return (
    <span className={`icon-text ${className ? className : ""}`}>
      <span className="icon">
        <FontAwesomeIcon icon={icon} spin={spin} />
      </span>
      <span>{children}</span>
    </span>
  );
};
