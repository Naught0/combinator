import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "./components/ui/button";

export function ScrollToTop() {
  return (
    <div className="fixed bottom-10 z-50 m-auto w-full max-w-screen-2xl">
      <div className="absolute bottom-9 right-9 z-50 opacity-90">
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          size="icon-lg"
          className="rounded-full"
          variant="outline"
        >
          <FontAwesomeIcon icon={faArrowUp} />
        </Button>
      </div>
    </div>
  );
}
