import { atomWithStorage } from "jotai/utils";
import { useAtom } from "jotai";
import { Layout, LayoutSelect } from "./LayoutSelect";
import { AlwaysExpandCheckbox } from "./AlwaysExpandCheckbox";
import { Button } from "./components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEyeSlash,
  faImages,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Separator } from "@radix-ui/react-select";

export const expandAllAtom = atomWithStorage<boolean>("expandAll", false);
export const showImagesAtom = atomWithStorage<boolean>("showImages", true);
export const layoutAtom = atomWithStorage<Layout>("layout", Layout.GRID);

function useExpandAll() {
  const [expandAll, setExpandAll] = useAtom(expandAllAtom);
  return { expandAll, setExpandAll };
}

function useShowImages() {
  const [showImages, setShowImages] = useAtom(showImagesAtom);
  return { showImages, setShowImages };
}

function useLayout() {
  const [layout, setLayout] = useAtom(layoutAtom);
  return { layout, setLayout };
}

export function ListControls() {
  const { expandAll, setExpandAll } = useExpandAll();
  const { showImages, setShowImages } = useShowImages();
  const { layout, setLayout } = useLayout();

  return (
    <div className={`inline-flex flex-wrap items-end gap-3`}>
      <LayoutSelect layout={layout} setLayout={setLayout} />
      <Separator className="h-14 w-[1px] bg-zinc-500" />
      {layout === Layout.LIST && <AlwaysExpandCheckbox />}
      {layout === Layout.GRID && (
        <>
          <Button
            className="inline-flex w-fit items-center"
            onClick={() => setExpandAll(!expandAll)}
          >
            <FontAwesomeIcon icon={expandAll ? faMinus : faPlus} />
            <span>{expandAll ? "Collapse" : "Expand"} all</span>
          </Button>
          <Button
            className="inline-flex items-center"
            onClick={() => setShowImages(!showImages)}
          >
            <FontAwesomeIcon icon={showImages ? faEyeSlash : faImages} />
            {showImages ? "Hide" : "Show"} images
          </Button>
        </>
      )}
    </div>
  );
}

export { useExpandAll, useShowImages, useLayout };
