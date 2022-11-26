import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, ReactNode } from "react";
import "./index.sass";

interface Props {
  title: ReactNode;
  hoverable?: boolean;
  className?: string;
}
export const Dropdown: FC<Props> = ({
  className,
  title,
  hoverable,
  children,
}) => {
  return (
    <>
      <div
        className={`dropdown ${hoverable ? "is-hoverable" : ""} ${
          !!className ? className : ""
        }`}
      >
        <div className="dropdown-trigger">
          <button
            className="button"
            aria-haspopup="true"
            aria-controls="dropdown-menu"
          >
            <span>{title}</span>
            <span className="icon is-small">
              <FontAwesomeIcon icon={faAngleDown} />
            </span>
          </button>
        </div>
        <div className="dropdown-menu" role="menu">
          <div className="dropdown-content">{children}</div>
        </div>
      </div>
    </>
  );
};
