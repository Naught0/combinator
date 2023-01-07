import { FC, useState } from "react";
import { UserDeckFilters, UserDeckFilterProps } from "./UserDeckFilters";
import "./index.sass";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";

export const CollapsibleDeckFilters: FC<UserDeckFilterProps> = (props) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  return (
    <div className={`collapsible-deck-filter`}>
      <div style={{ display: isCollapsed ? "none" : "flex" }}>
        <UserDeckFilters {...props} />
      </div>
      <div className="control my-3 is-fullwidth" style={{width: "100%"}}>
        <button
          className="is-text"
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{ width: "95%" }}
        >
          <span className="icon">
            <FontAwesomeIcon icon={isCollapsed ? faPlus : faMinus} />
          </span>
          <span>{isCollapsed ? "show filters" : "collapse filters"}</span>
        </button>
      </div>
    </div>
  );
};
