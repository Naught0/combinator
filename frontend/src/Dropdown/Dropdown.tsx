import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, ReactNode, useState } from "react";
import useOnclickOutside from "react-cool-onclickoutside";
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
  const [isActive, setActive] = useState(false);
  const ref = useOnclickOutside(() => {
    setActive(false);
  });

  return (
    <>
      <div
        className={`dropdown ${hoverable ? "is-hoverable" : ""} ${className ? className : ""
          } ${isActive ? "is-active" : ""}`}
        onClick={() => setActive(!isActive)}
        ref={ref}
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
