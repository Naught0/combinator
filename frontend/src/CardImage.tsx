export const CardImage = (props: { cardImage: string }) => {
  return (
    <div className="bg-transparent !rounded-2xl">
      <img src={props.cardImage} className="rounded-2xl w-full" />
    </div>
  );
};
