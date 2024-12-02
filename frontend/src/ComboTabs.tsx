import { useMemo, useState } from "react";
import { Combo } from "./Combo";
import { Hyperlink } from "./Hyperlink";
import { MissingCardAccordion } from "./MissingCardAccordion";
import { useFilteredCombos } from "./hooks/useComboData";
import { CardFilter } from "./CardFilter";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Loading } from "./Loading";

enum Tab {
  COMBOS,
  ALMOST_INCLUDED,
  CARD_SEARCH,
}

export function ComboTabs({
  allCombos,
  deckData,
  cardNames,
  loading,
}: {
  allCombos?: Results;
  deckData?: DeckData;
  cardNames?: string[];
  loading?: boolean;
}) {
  const [tab, setTab] = useState<Tab>(Tab.COMBOS);
  const cardNamesFallback = deckData?.cards.map((c) => c.name);
  const comboData = useMemo(
    () =>
      tab === Tab.ALMOST_INCLUDED
        ? allCombos?.almostIncluded
        : allCombos?.included,
    [allCombos, tab],
  );
  const { filter, setFilter, filteredCombos, groupedByMissing } =
    useFilteredCombos({
      combos: comboData ?? [],
    });
  const noCombos = !loading && !comboData?.length;
  const noCombosFound = !noCombos && filteredCombos.length < 1;
  const showGroups =
    tab === Tab.ALMOST_INCLUDED && deckData && groupedByMissing;

  return (
    <div className="flex flex-col gap-3">
      <div className="inline-flex gap-1 text-base md:text-lg lg:text-2xl">
        <Button
          variant={tab === Tab.COMBOS ? "primary" : "default"}
          onClick={() => setTab(Tab.COMBOS)}
        >
          Combos &ndash;&nbsp;
          <span className="text-sm">({allCombos?.included?.length ?? 0})</span>
        </Button>
        {(allCombos?.almostIncluded?.length ?? -1) > 0 && (
          <Button
            variant={tab === Tab.ALMOST_INCLUDED ? "primary" : "default"}
            onClick={() => setTab(Tab.ALMOST_INCLUDED)}
          >
            Add 1 &ndash;&nbsp;
            <span className="text-sm">
              ({allCombos?.almostIncluded.length})
            </span>
          </Button>
        )}
        {deckData && (
          <Button
            variant={tab === Tab.CARD_SEARCH ? "primary" : "outline"}
            onClick={() => setTab(Tab.CARD_SEARCH)}
          >
            Search Cards
          </Button>
        )}
      </div>
      <div className={"flex flex-1 flex-col gap-6"}>
        <Input
          className="max-w-96"
          placeholder="Filter combos by keyword or card name"
          value={filter}
          onChange={({ target }) => setFilter(target.value)}
        />

        {loading && !allCombos && <Loading message="Loading combos" />}
        {noCombos && (
          <h1 className="text-2xl">
            💡 Pro Tip: Try adding some{" "}
            <Hyperlink href="https://commanderspellbook.com/">combos</Hyperlink>{" "}
            to your list
          </h1>
        )}
        {noCombosFound && (
          <h1 className="mt-6 text-2xl">❌ No combos matching search</h1>
        )}
        {showGroups ? (
          <div className="flex flex-col gap-2">
            {Object.entries(groupedByMissing)
              .sort(
                ([, combosA], [, combosB]) => combosB.length - combosA.length,
              )
              .map(([cardName, combos]) => (
                <MissingCardAccordion
                  cardName={cardName}
                  key={cardName}
                  count={combos.length}
                >
                  <div className="p-3">
                    {combos.map((combo) => (
                      <Combo
                        key={combo.id}
                        cardNames={cardNames ?? cardNamesFallback ?? []}
                        combo={combo}
                      />
                    ))}
                  </div>
                </MissingCardAccordion>
              ))}
          </div>
        ) : (
          filteredCombos &&
          filteredCombos.map((c) => {
            return (
              <Combo
                cardNames={cardNames ?? cardNamesFallback ?? []}
                key={c.id}
                combo={c}
              />
            );
          })
        )}
        {tab === Tab.CARD_SEARCH && deckData && (
          <CardFilter deckData={deckData} filter={filter} />
        )}
      </div>
    </div>
  );
}
