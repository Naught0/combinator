import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { ReactNode } from "react";
import { Link } from "react-router";

export function BackToSearch(props: { label?: ReactNode }) {
  return (
    <Link to="/" className="inline-flex items-center gap-2 text-base">
      <FontAwesomeIcon icon={faArrowLeft} />
      {props.label || "New search"}
    </Link>
  );
}
