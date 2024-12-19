import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";

export const sortDirIconMap = new Map<"ascending" | "descending", ReactNode>([
  // eslint-disable-next-line react/jsx-key
  ["ascending", <FontAwesomeIcon icon={faArrowUp} />],
  // eslint-disable-next-line react/jsx-key
  ["descending", <FontAwesomeIcon icon={faArrowDown} />],
]);
