import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "./components/ui/button";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { ReactNode } from "react";
import { useNavigate } from "react-router";

export function BackToSearch(props: { label?: ReactNode }) {
  let navigate = useNavigate();
  return (
    <div>
      <Button onClick={() => navigate("/")} variant={"default"}>
        {props.label || "New search"}
        <FontAwesomeIcon icon={faArrowRight} />
      </Button>
    </div>
  );
}
