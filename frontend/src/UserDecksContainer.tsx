import {
  faArrowLeft,
  faSpinner,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC, useEffect, useMemo, useState } from "react";
import { ComboContainer } from "./ComboContainer";
import { Deck } from "./Deck";
import { IconText } from "./IconText";
import { getComboData } from "./services";
import { UserDeckFilters } from "./UserDeckFilters";
interface Props {
  decks: Deck[];
}
export const UserDecksContainer: FC<Props> = ({ decks }) => {
  const [currentDeck, setCurrentDeck] = useState<Deck>();
  const [deckData, setDeckData] = useState<DeckData>();
  const [loading, setLoading] = useState(false);
  const [titleFilter, setTitleFilter] = useState<string>("");

  useEffect(() => {
    if (!currentDeck) return;
    setLoading(true);
    (async () => {
      setDeckData(await getComboData(currentDeck.publicUrl));
      setLoading(false);
    })();
  }, [currentDeck]);
  return (
    <>
      {!currentDeck && (
        <UserDeckFilters
          titleFilter={titleFilter}
          setTitleFilter={(s) => setTitleFilter(s)}
          resetFilters={() => {}}
          setFormatFilter={() => {}}
          setSortBy={() => {}}
          setSortDir={() => {}}
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
          decks.map((deck) => (
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
