import { faArrowLeft, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useEffect, useMemo, useState } from "react";
import { ComboContainer } from "./ComboContainer";
import { Deck } from "./Deck";
import { IconText } from "./IconText";
import { getComboData } from "./services";
import { UserDeckFilters } from "./UserDeckFilters";
import { sortAndFilterUserDecks } from "./util";

interface Props {
  decks: Deck[];
}

export enum SortDirection {
  ASC = "asc",
  DESC = "desc",
}

export const UserDecksContainer: FC<Props> = ({ decks }) => {
  const [currentDeck, setCurrentDeck] = useState<Deck>();
  const [deckData, setDeckData] = useState<DeckData>();
  const [loading, setLoading] = useState(false);
  const [titleFilter, setTitleFilter] = useState<string>("");
  const [formatFilter, setFormatFilter] = useState<string>("");
  const [sortBy, setSortBy] = useState<keyof Deck>("createdAtUtc");
  const [sortDir, setSortDir] = useState<SortDirection>(SortDirection.DESC);

  const filteredSortedDecks = useMemo<Deck[]>(() => {
    return sortAndFilterUserDecks(
      decks,
      titleFilter,
      formatFilter,
      sortDir,
      sortBy
    );
  }, [decks, titleFilter, formatFilter, sortDir, sortBy]);

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
  };

  return (
    <>
      {!currentDeck && (
        <UserDeckFilters
          titleFilter={titleFilter}
          setTitleFilter={(s) => setTitleFilter(s)}
          resetFilters={() => {}}
          setFormatFilter={() => {}}
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
