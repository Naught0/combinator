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
import { UserDeckFilters } from "./Filters/UserDeckFilters";
import { sortAndFilterUserDecks } from "../util";
import { useFilteredDeck } from "./hooks/useFilteredDeck";

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
  const [formatFilter, setFormatFilter] = useState<Legality>();
  const [sortBy, setSortBy] = useState<keyof Deck>("createdAtUtc");
  const [sortDir, setSortDir] = useState<SortDirection>(SortDirection.DESC);
  const filteredSortedDecks = useFilteredDeck({
    decks,
    sortBy,
    sortDir,
    titleFilter,
    formatFilter,
  });

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

  return (
    <>
      {!currentDeck && (
        <UserDeckFilters
          titleFilter={titleFilter}
          sortDirection={sortDir}
          sortBy={sortBy}
          setTitleFilter={(s) => setTitleFilter(s)}
          resetFilters={resetFilter}
          setFormatFilter={setFormatFilter}
          setSortBy={setSortBy}
          setSortDir={setSortDir}
        />
      )}
      {!!currentDeck && (
        <button
          className="button"
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
      <div
        className="container is-flex is-flex-wrap-wrap"
        style={{ gap: "0.75rem" }}
      >
        {!currentDeck &&
          filteredSortedDecks.map((deck) => (
            <Deck
              key={deck.id}
              deck={deck}
              onClick={(deck) => setCurrentDeck(deck)}
            />
          ))}
      </div>
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
