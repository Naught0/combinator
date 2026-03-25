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
    <div className="inline-flex flex-wrap items-end gap-3">
      <div className="hidden md:block">
        <LayoutSelect layout={layout} setLayout={setLayout} />
      </div>
      {layout === Layout.LIST && (
        <div className="inline-flex items-center">
          <div className="relative bottom-0 top-0 h-full w-0.5 bg-zinc-400" />
          <AlwaysExpandCheckbox />
        </div>
      )}
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
