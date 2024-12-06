import { useMemo, useState } from "react";
import { CardFilter } from "./CardFilter";
import { Combo } from "./Combo";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { useFilteredCombos } from "./hooks/useComboData";
import { Hyperlink } from "./Hyperlink";
import { MissingCardAccordion } from "./MissingCardAccordion";
import { useQuery } from "@tanstack/react-query";
import { getComboData } from "./services";
import { Loading } from "./Loading";

enum Tab {
  COMBOS,
  ALMOST_INCLUDED,
  CARD_SEARCH,
}

export function ComboTabs({ deckData }: { deckData: DeckData }) {
  const { data: allCombos, isLoading: isLoading } = useQuery({
    queryKey: ["combo-data", { source: deckData.source, id: deckData.id }],
    queryFn: async () => {
      const d = await getComboData({
        commanders: [],
        main: deckData!.cards.map((c) => ({ card: c.name, quantity: 1 })),
      });
      return d;
    },
  });
  const cardNames = deckData.cards.map((c) => c.name);
  const [tab, setTab] = useState<Tab>(Tab.COMBOS);
  const comboData = useMemo(
    () =>
      tab === Tab.ALMOST_INCLUDED
        ? allCombos?.almostIncluded
        : allCombos?.included,
    [allCombos, tab],
  );
  const { filter, setFilter, filteredCombos, groupedByMissing } =
    useFilteredCombos({
      deckData,
      combos: comboData ?? [],
    });
  const noCombos = !comboData?.length;
  const noFilteredCombos = filteredCombos.length < 1;
  const showGroups = !!(tab === Tab.ALMOST_INCLUDED && groupedByMissing);

  if (isLoading) {
    return <Loading size="lg" message="Loading combos" />;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="inline-flex gap-1 text-base md:text-lg lg:text-2xl">
        <Button
          variant={tab === Tab.COMBOS ? "activeTab" : "tab"}
          onClick={() => setTab(Tab.COMBOS)}
        >
          Combos &ndash;
          <span className="text-sm">({allCombos?.included?.length ?? 0})</span>
        </Button>
        {(allCombos?.almostIncluded?.length ?? -1) > 0 && (
          <Button
            variant={tab === Tab.ALMOST_INCLUDED ? "activeTab" : "tab"}
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
            variant={tab === Tab.CARD_SEARCH ? "activeTab" : "tab"}
            onClick={() => setTab(Tab.CARD_SEARCH)}
          >
            Search Cards
          </Button>
        )}
      </div>
      <div className={"flex flex-1 flex-col gap-6"}>
        <Input
          className="max-w-96"
          placeholder="Filter combos by keyword, type line, or card name"
          value={filter}
          onChange={({ target }) => setFilter(target.value)}
        />
        {(tab === Tab.ALMOST_INCLUDED || tab === Tab.COMBOS) && (
          <Combos
            noCombos={noCombos}
            showGroups={showGroups}
            filter={filter}
            noFilteredCombos={noFilteredCombos}
            groupedByMissing={groupedByMissing}
            cardNames={cardNames}
            deckData={deckData}
            filteredCombos={filteredCombos}
          />
        )}
        {tab === Tab.CARD_SEARCH && deckData && (
          <CardFilter deckData={deckData} filter={filter} />
        )}
      </div>
    </div>
  );
}

function Combos({
  noCombos,
  showGroups,
  filter,
  noFilteredCombos,
  groupedByMissing,
  cardNames,
  deckData,
  filteredCombos,
}: {
  noCombos: boolean;
  showGroups?: boolean;
  filter: string;
  noFilteredCombos: boolean;
  groupedByMissing?: Record<string, AlmostIncluded[]>;
  cardNames: string[];
  deckData: DeckData;
  filteredCombos: AlmostIncluded[];
}) {
  return (
    <div className="flex flex-col">
      {noCombos && (
        <h1 className="text-2xl">
          💡 Pro Tip: Try adding some{" "}
          <Hyperlink href="https://commanderspellbook.com/">combos</Hyperlink>{" "}
          to your list
        </h1>
      )}
      {!!filter && noFilteredCombos && (
        <h1 className="mt-6 text-2xl">❌ No combos matching search</h1>
      )}
      {showGroups && groupedByMissing ? (
        <div className="flex flex-col gap-3">
          <GroupedCombos cardNames={cardNames} data={groupedByMissing} />
        </div>
      ) : (
        filteredCombos &&
        filteredCombos.map((c) => {
          return (
            <Combo
              cardNames={deckData.cards.map((c) => c.name) ?? []}
              key={c.id}
              combo={c}
            />
          );
        })
      )}
    </div>
  );
}

function GroupedCombos(props: {
  data: Record<string, AlmostIncluded[]>;
  cardNames: string[];
}) {
  return Object.entries(props.data)
    .sort(([, combosA], [, combosB]) => combosB.length - combosA.length)
    .map(([cardName, combos]) => (
      <MissingCardAccordion
        cardName={cardName}
        key={cardName}
        count={combos.length}
      >
        <div className="p-3">
          {combos.map((combo) => (
            <Combo key={combo.id} cardNames={props.cardNames} combo={combo} />
          ))}
        </div>
      </MissingCardAccordion>
    ));
}
