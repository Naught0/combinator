import { cn } from "./lib/utils";

interface Props {
  items: React.ReactNode[];
  className?: string;
  wide?: boolean;
}
export const MasonryLayout = ({ items, className, wide = true }: Props) => {
  return (
    <div
      className={cn(
        "masonry mx-auto w-fit columns-1 gap-3 lg:columns-2",
        wide ? "xl:columns-3" : "",
        className,
      )}
    >
      {items.map((item, index) => (
        <div key={index} className="mb-3 break-inside-avoid rounded-lg">
          {item}
        </div>
      ))}
    </div>
  );
};
