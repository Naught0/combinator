import { faArrowLeft, faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useEffect, useMemo, useState } from "react";
import { ComboContainer } from "../ComboContainer";
import { Deck } from "../Deck";
import { IconText } from "../IconText";
import { useFilteredDeck } from "./hooks/useFilteredDeck";
import { Paginate } from "../Paginate/Paginate";
import { usePaginate } from "../Paginate/hooks/usePaginate";
import { CollapsibleDeckFilters } from "./Filters/CollapsibleDeckFilters";
import { SortDirection } from "./util/sort";

interface Props {
  decks: Deck[];
}

export type YesNoAny = "yes" | "no" | "any";

enum View {
  DECKS,
  COMBO,
}

export const UserDecksContainer: FC<Props> = ({ decks }) => {
  const [currentDeck, setCurrentDeck] = useState<Deck>();
  const [titleFilter, setTitleFilter] = useState<string>("");
  const [formatFilter, setFormatFilter] = useState<Format>("any");
  const [isLegal, setIsLegal] = useState<YesNoAny>("any");
  const [sortBy, setSortBy] = useState<keyof Deck>("createdAtUtc");
  const [sortDir, setSortDir] = useState<SortDirection>(SortDirection.DESC);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(0);
  const [view, setView] = useState<View>(View.DECKS);
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

  const setDeck = async (deck: Deck) => {
    setCurrentDeck(deck);
    setView(View.COMBO);
  };

  const safelyChangePageIndex = (n: number) => {
    if (n < 0) return setPageIndex(0);
    if (n > totalPages - 1) return setPageIndex(totalPages - 1);
    setPageIndex(n);
  };

  return (
    <>
      {view === View.DECKS && (
        <CollapsibleDeckFilters
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
      )}
      {view === View.COMBO && (
        <button className="button my-3" onClick={() => setView(View.DECKS)}>
          <FontAwesomeIcon icon={faArrowLeft} />

          <span>All decks</span>
        </button>
      )}
      {view === View.DECKS && (
        <div>
          <div
            className="wrap grid grid-cols-1 gap-3 md:grid-cols-2"
            style={{ gap: "0.75rem" }}
          >
            {currentPage?.map((deck) => (
              <Deck key={deck.id} deck={deck} onClick={setDeck} />
            ))}
          </div>
        </div>
      )}
      <Paginate
        pageIndex={pageIndex}
        setIndex={safelyChangePageIndex}
        totalPages={pages.length}
      />
    </>
  );
};
