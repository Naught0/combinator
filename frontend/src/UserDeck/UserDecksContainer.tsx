import { FC, useEffect, useMemo, useState } from "react";
import { Deck } from "../Deck";
import { Paginate } from "../Paginate/Paginate";
import { usePaginate } from "../Paginate/hooks/usePaginate";
import { UserDeckFilters } from "./Filters/UserDeckFilters";
import { useFilteredDeck } from "./hooks/useFilteredDeck";
import { SortDirection } from "./util/sort";
import { BackToSearch } from "@/BackToSearch";

interface Props {
  decks: Deck[];
}

export type YesNoAny = "yes" | "no" | "any";

export const UserDecksContainer: FC<Props> = ({ decks }) => {
  const [titleFilter, setTitleFilter] = useState<string>("");
  const [formatFilter, setFormatFilter] = useState<Format>("any");
  const [isLegal, setIsLegal] = useState<YesNoAny>("any");
  const [sortBy, setSortBy] = useState<keyof Deck>("createdAtUtc");
  const [sortDir, setSortDir] = useState<SortDirection>(SortDirection.DESC);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const availableDeckFormats = useMemo(() => {
    const formats = [...new Set(decks.map((d) => d.format))];
    formats.sort();

    return formats;
  }, [decks]);
  const filteredSortedDecks = useFilteredDeck({
    decks,
    sortBy,
    sortDir,
    titleFilter,
    formatFilter,
    isLegal,
  });
  const { currentPage, totalPages, pages } = usePaginate({
    data: filteredSortedDecks,
    pageIndex: pageIndex,
    pageSize: pageSize,
  });
  useEffect(() => {
    setPageIndex(0);
  }, [formatFilter, titleFilter, pageSize]);

  const resetFilter = () => {
    setTitleFilter("");
    setSortBy("createdAtUtc");
    setSortDir(SortDirection.DESC);
  };

  const safelyChangePageIndex = (n: number) => {
    if (n < 0) return setPageIndex(0);
    if (n > totalPages - 1) return setPageIndex(totalPages - 1);
    setPageIndex(n);
  };

  return (
    <div className="flex max-w-screen-2xl flex-col gap-6 md:gap-6">
      <div>
        <BackToSearch />
      </div>
      <UserDeckFilters
        titleFilter={titleFilter}
        sortDirection={sortDir}
        sortBy={sortBy}
        pageSize={pageSize}
        formatFilter={formatFilter}
        formats={availableDeckFormats}
        setPageSize={setPageSize}
        setTitleFilter={setTitleFilter}
        resetFilters={resetFilter}
        setFormatFilter={setFormatFilter}
        setSortBy={setSortBy}
        setSortDir={setSortDir}
        isLegal={isLegal}
        setIsLegal={setIsLegal}
      />
      <div className="wrap grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
        {currentPage?.map((deck) => <Deck key={deck.id} deck={deck} />)}
      </div>
      <div className="w-full">
        <Paginate
          pageIndex={pageIndex}
          setIndex={safelyChangePageIndex}
          totalPages={pages.length}
        />
      </div>
    </div>
  );
};
