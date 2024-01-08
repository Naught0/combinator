import {
  faSortAmountDown,
  faSortAmountUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";

export enum SortDirection {
  ASC = "asc",
  DESC = "desc",
}

export const sortDirIconMap = new Map<SortDirection, ReactNode>([
  // eslint-disable-next-line react/jsx-key
  [SortDirection.ASC, <FontAwesomeIcon icon={faSortAmountUp} />],
  // eslint-disable-next-line react/jsx-key
  [SortDirection.DESC, <FontAwesomeIcon icon={faSortAmountDown} />],
]);
