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
    <div className="flex flex-col gap-1">
      <p className="text-xs font-bold uppercase text-zinc-300">
        view combos as
      </p>
      <div>
        <Button
          variant={layout === Layout.GRID ? "primary" : "outline"}
          onClick={() => setLayout(Layout.GRID)}
          className="rounded-r-none"
        >
          <FontAwesomeIcon icon={faBorderAll} /> Grid
        </Button>
        <Button
          variant={layout === Layout.LIST ? "primary" : "outline"}
          onClick={() => setLayout(Layout.LIST)}
          className="rounded-l-none"
        >
          <FontAwesomeIcon icon={faList} /> List
        </Button>
      </div>
    </div>
  );
}
