import { FC } from "react";
import { Deck } from "../Deck";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  decks?: Deck[];
  loading?: boolean;
  pageSize: number;
}

export const UserDecksContainer: FC<Props> = ({ decks, loading, pageSize }) => {
  return (
    <div className="wrap grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
      {loading ? (
        <Loading pageSize={pageSize} />
      ) : (
        decks?.map((deck) => <Deck key={deck.id} deck={deck} />)
      )}
    </div>
  );
};

function Loading({ pageSize }: { pageSize: number }) {
  return [...Array(pageSize).keys()].map(() => (
    <Skeleton className="flex min-h-32 w-full flex-1" />
  ));
}
