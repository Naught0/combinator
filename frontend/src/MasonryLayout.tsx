interface Props {
  items: React.ReactNode[];
}
export const MasonryLayout = ({ items }: Props) => {
  return (
    <div className="masonry w-full grid-cols-1 gap-3 md:columns-2 xl:columns-3">
      {items.map((item, index) => (
        <div key={index} className="mb-3 break-inside-avoid rounded-lg">
          {item}
        </div>
      ))}
    </div>
  );
};
