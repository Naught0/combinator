import { cn } from "./lib/utils";

interface Props {
  items: React.ReactNode[];
  className?: string;
}
export const MasonryLayout = ({ items, className }: Props) => {
  return (
    <div
      className={cn(
        "masonry w-fit grid-cols-1 gap-3 lg:columns-2 xl:columns-3",
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
