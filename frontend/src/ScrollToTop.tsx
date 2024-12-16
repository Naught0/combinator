import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "./components/ui/button";

export function ScrollToTop() {
  return (
    <div className="fixed bottom-9 right-9 z-50 opacity-80">
      <Button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        size="icon-lg"
        variant="outline"
      >
        <FontAwesomeIcon icon={faArrowUp} />
      </Button>
    </div>
  );
}
