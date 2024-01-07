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
import { getDeckData } from "../services";
import { useFilteredDeck } from "./hooks/useFilteredDeck";
import { Paginate } from "../Paginate/Paginate";
import { usePaginate } from "../Paginate/hooks/usePaginate";
import { CollapsibleDeckFilters } from "./Filters/CollapsibleDeckFilters";
import { useRecoilState, useRecoilValue } from "recoil";
import { comboDataAtom, deckDataAtom } from "../atoms";

interface Props {
  decks: Deck[];
}

export enum SortDirection {
  ASC = "asc",
  DESC = "desc",
}

enum View {
  DECKS,
  COMBO,
}

export const sortDirIconMap = new Map<SortDirection, ReactNode>([
  // eslint-disable-next-line react/jsx-key
  [SortDirection.ASC, <FontAwesomeIcon icon={faSortAmountUp} />],
  // eslint-disable-next-line react/jsx-key
  [SortDirection.DESC, <FontAwesomeIcon icon={faSortAmountDown} />],
]);

export const UserDecksContainer: FC<Props> = ({ decks }) => {
  const [currentDeck, setCurrentDeck] = useState<Deck>();
  const [deckData, setDeckData] = useRecoilState(deckDataAtom);
  const comboData = useRecoilValue(comboDataAtom);
  const [loading, setLoading] = useState(false);
  const [titleFilter, setTitleFilter] = useState<string>("");
  const [formatFilter, setFormatFilter] = useState<Format>();
  const [isLegal, setIsLegal] = useState<boolean | null>(null);
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

  useEffect(() => {
    if (!currentDeck) return;
    setLoading(true);
    (async () => {
      const data = await getDeckData(currentDeck.publicUrl);
      setDeckData(data);
      setLoading(false);
    })();
  }, [currentDeck, setDeckData]);

  const resetFilter = () => {
    setTitleFilter("");
    setSortBy("createdAtUtc");
    setSortDir(SortDirection.DESC);
  };

  const setDeck = (deck: Deck) => {
    setCurrentDeck(deck);
    setView(View.COMBO);
  };

  const clearDecks = () => {
    setView(View.DECKS);
    setCurrentDeck(undefined);
    setDeckData(undefined);
  };

  const safelyChangePageIndex = (n: number) => {
    if (n < 0) return setPageIndex(0);
    if (n > totalPages - 1) return setPageIndex(totalPages - 1);
    setPageIndex(n);
  };

  const pagination = useMemo(
    () =>
      totalPages > 1 && !currentDeck ? (
        <div className="container my-2">
          <Paginate pageIndex={pageIndex} setIndex={safelyChangePageIndex}>
            {pages}
          </Paginate>
        </div>
      ) : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageIndex, totalPages, pages, currentDeck],
  );

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
        <button className="button my-3" onClick={clearDecks}>
          <span className="icon">
            <FontAwesomeIcon icon={faArrowLeft} />
          </span>
          <span>All decks</span>
        </button>
      )}
      {view === View.DECKS && (
        <div>
          <div
            className="container is-flex is-flex-wrap-wrap"
            style={{ gap: "0.75rem" }}
          >
            {currentPage?.map((deck) => (
              <Deck key={deck.id} deck={deck} onClick={setDeck} />
            ))}
          </div>
        </div>
      )}
      {pagination}
      {view === View.COMBO && currentDeck && deckData && comboData && (
        <ComboContainer deckData={deckData} comboData={comboData} />
      )}
      {view === View.COMBO && loading && (
        <div className="my-6">
          <IconText className="is-size-2" icon={faSpinner} spin>
            <span className="ml-5">Loading</span>
          </IconText>
        </div>
      )}
    </>
  );
};
