export const CardImage = (props: { cardImage: string }) => {
  return (
    <img src={props.cardImage} className="w-full rounded-2xl" loading="lazy" />
  );
};
