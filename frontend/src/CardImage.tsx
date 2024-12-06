export const CardImage = (props: { cardImage: string }) => {
  return (
    <div className="!rounded-2xl bg-transparent">
      <img
        src={props.cardImage}
        className="w-full rounded-2xl"
        loading="lazy"
      />
    </div>
  );
};
