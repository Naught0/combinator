import {
  faArrowLeft,
  faSortAmountDown,
  faSortAmountUp,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, ReactNode, useEffect, useMemo, useState } from "react";
import { ComboContainer } from "../ComboContainer";
import { Deck } from "../Deck";
import { IconText } from "../IconText";
import { getComboData } from "../services";
import { useFilteredDeck } from "./hooks/useFilteredDeck";
import { Paginate } from "../Paginate/Paginate";
import { usePaginate } from "../Paginate/hooks/usePaginate";
import { CollapsibleDeckFilters } from "./Filters/CollapsibleDeckFilters";

interface Props {
  decks: Deck[];
}

export enum SortDirection {
  ASC = "asc",
  DESC = "desc",
}

export const sortDirIconMap = new Map<SortDirection, ReactNode>([
  [SortDirection.ASC, <FontAwesomeIcon icon={faSortAmountUp} />],
  [SortDirection.DESC, <FontAwesomeIcon icon={faSortAmountDown} />],
]);

export const UserDecksContainer: FC<Props> = ({ decks }) => {
  const [currentDeck, setCurrentDeck] = useState<Deck>();
  const [deckData, setDeckData] = useState<DeckData>();
  const [loading, setLoading] = useState(false);
  const [titleFilter, setTitleFilter] = useState<string>("");
  const [formatFilter, setFormatFilter] = useState<Format>();
  const [isLegal, setIsLegal] = useState<boolean | null>(null);
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
    isLegal
  });
  const { currentPage, totalPages, pages, canNext, canPrev } = usePaginate({
    data: filteredSortedDecks,
    pageIndex: pageIndex,
    pageSize: pageSize,
  });

  useEffect(() => {
    setPageIndex(0);
  }, [formatFilter, titleFilter]);

  useEffect(() => {
    if (!currentDeck) return;
    setLoading(true);
    (async () => {
      setDeckData(await getComboData(currentDeck.publicUrl));
      setLoading(false);
    })();
  }, [currentDeck]);

  const resetFilter = () => {
    setTitleFilter("");
    setSortBy("createdAtUtc");
    setSortDir(SortDirection.DESC);
  };

  const pagination = useMemo(
    () =>
      totalPages > 1 && !currentDeck ? (
        <div className="container my-2">
          <Paginate
            pageIndex={pageIndex}
            setIndex={setPageIndex}
            next={() => setPageIndex((idx) => (canNext ? idx + 1 : idx))}
            prev={() => setPageIndex((idx) => (canPrev ? idx - 1 : idx))}
            canNext={canNext}
            canPrev={canPrev}
          >
            {pages}
          </Paginate>
        </div>
      ) : null,
    [canNext, canPrev, pageIndex, totalPages, pages, currentDeck]
  );

  return (
    <>
      {!currentDeck && (
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
      {!!currentDeck && (
        <button
          className="button my-3"
          onClick={() => {
            setCurrentDeck(undefined);
            setDeckData(undefined);
          }}
        >
          <span className="icon">
            <FontAwesomeIcon icon={faArrowLeft} />
          </span>
          <span>All decks</span>
        </button>
      )}
      {!currentDeck && (
        <div>
          <div
            className="container is-flex is-flex-wrap-wrap"
            style={{ gap: "0.75rem" }}
          >
            {currentPage?.map((deck) => (
              <Deck
                key={deck.id}
                deck={deck}
                onClick={(deck) => setCurrentDeck(deck)}
              />
            ))}
          </div>
        </div>
      )}
      {pagination}
      {deckData && <ComboContainer {...deckData} />}
      {loading && (
        <div className="my-6">
          <IconText className="is-size-2" icon={faSpinner} spin>
            <span className="ml-5">Loading</span>
          </IconText>
        </div>
      )}
    </>
  );
};
