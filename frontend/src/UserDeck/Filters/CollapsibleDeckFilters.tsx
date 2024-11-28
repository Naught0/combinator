import { FC, useState } from "react";
import { UserDeckFilters, UserDeckFilterProps } from "./UserDeckFilters";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@/components/ui/button";

export const CollapsibleDeckFilters: FC<UserDeckFilterProps> = (props) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <div className="flex flex-col gap-3">
      <div className="w-full">
        <Button onClick={() => setIsCollapsed(!isCollapsed)}>
          <span className="icon">
            <FontAwesomeIcon icon={isCollapsed ? faPlus : faMinus} />
          </span>
          <span>{isCollapsed ? "show filters" : "collapse filters"}</span>
        </Button>
      </div>
      <div style={{ display: isCollapsed ? "none" : "flex" }}>
        <UserDeckFilters {...props} />
      </div>
    </div>
  );
};
