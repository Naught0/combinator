import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "./components/ui/button";
import { faBorderAll, faList } from "@fortawesome/free-solid-svg-icons";

export enum Layout {
  GRID = "grid",
  LIST = "list",
}

export function LayoutSelect({
  layout,
  setLayout,
}: {
  layout: Layout;
  setLayout: (layout: Layout) => void;
}) {
  return (
    <div className="inline-flex">
      <Button
        variant={layout === Layout.GRID ? "primary" : "outline"}
        size="icon"
        onClick={() => setLayout(Layout.GRID)}
        className="rounded-r-none"
      >
        <FontAwesomeIcon icon={faBorderAll} />
      </Button>
      <Button
        variant={layout === Layout.LIST ? "primary" : "outline"}
        onClick={() => setLayout(Layout.LIST)}
        size="icon"
        className="rounded-l-none"
      >
        <FontAwesomeIcon icon={faList} />
      </Button>
    </div>
  );
}
