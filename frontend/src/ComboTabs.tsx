import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { CardFilter } from "./CardFilter";
import { Combo } from "./Combo";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { useFilteredCombos } from "./hooks/useComboData";
import { Hyperlink } from "./Hyperlink";
import { Loading } from "./Loading";
import { MissingCardAccordion } from "./MissingCardAccordion";
import { getComboData } from "./services";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEyeSlash,
  faImages,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Layout, LayoutSelect } from "./LayoutSelect";
import { usePersist } from "./UserDeck/hooks/usePersist";
import { MasonryLayout } from "./MasonryLayout";

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
      <div className="inline-flex flex-wrap gap-1 text-base md:text-lg lg:text-2xl">
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
      <div className={"flex flex-1 flex-col gap-3"}>
        <Input
          className="max-w-96"
          placeholder="Filter combos by keyword, type line, or card name"
          value={filter}
          onChange={({ target }) => setFilter(target.value)}
        />
        {tab === Tab.COMBOS && (
          <Combos
            noCombos={noCombos}
            showGroups={showGroups}
            filter={filter}
            noFilteredCombos={noFilteredCombos}
            groupedByMissing={groupedByMissing}
            deckData={deckData}
            filteredCombos={filteredCombos}
          />
        )}
        {tab === Tab.ALMOST_INCLUDED && groupedByMissing && (
          <GroupedCombos data={groupedByMissing} cards={deckData.cards} />
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
  filter,
  noFilteredCombos,
  deckData,
  filteredCombos,
}: {
  noCombos: boolean;
  showGroups?: boolean;
  filter: string;
  noFilteredCombos: boolean;
  groupedByMissing?: Record<string, AlmostIncluded[]>;
  deckData: DeckData;
  filteredCombos: AlmostIncluded[];
}) {
  const [expandAll, setExpandAll] = useState(
    (localStorage.getItem("expandAll") ?? "false") === "true",
  );
  usePersist({ key: "expandAll", val: expandAll ? "true" : "false" });
  const [layout, setLayout] = useState<Layout>(
    (localStorage.getItem("layout") as Layout) ?? Layout.LIST,
  );
  usePersist({ key: "layout", val: layout });
  const [showImages, setShowImages] = useState(
    (localStorage.getItem("showImages") ?? "true") === "true",
  );
  usePersist({ key: "showImages", val: showImages ? "true" : "false" });

  return (
    <div className="flex flex-col gap-3">
      <div className="inline-flex flex-wrap justify-center gap-3 md:justify-start">
        <div className="hidden md:block">
          <LayoutSelect layout={layout} setLayout={setLayout} />
        </div>
        <Button
          className="inline-flex w-fit items-center"
          onClick={() => setExpandAll((expand) => !expand)}
        >
          <FontAwesomeIcon icon={expandAll ? faMinus : faPlus} />
          <span>{expandAll ? "Collapse" : "Expand"} all</span>
        </Button>
        <Button
          className="inline-flex items-center"
          onClick={() => setShowImages((show) => !show)}
        >
          <FontAwesomeIcon icon={showImages ? faEyeSlash : faImages} />
          {showImages ? "Hide" : "Show"} images
        </Button>
      </div>
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
      {filteredCombos && (
        <MasonryLayout
          items={filteredCombos.map((c) => {
            return (
              <Combo
                showImages={showImages}
                initialExpanded={expandAll}
                cards={deckData.cards ?? []}
                key={c.id}
                combo={c}
              />
            );
          })}
        />
      )}
    </div>
  );
}

function GroupedCombos({
  data,
  cards,
}: {
  data: Record<string, AlmostIncluded[]>;
  cards: DeckCard[];
}) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {Object.entries(data)
        .sort(([, combosA], [, combosB]) => combosB.length - combosA.length)
        .map(([cardName, combos]) => {
          const items = combos.map((c) => {
            return (
              <Combo
                showImages={false}
                initialExpanded={false}
                cards={cards}
                key={c.id}
                combo={c}
              />
            );
          });

          return (
            <MissingCardAccordion
              cardName={cardName}
              key={cardName}
              count={combos.length}
            >
              {combos.length > 3 ? (
                <MasonryLayout items={items} />
              ) : (
                <div className="flex w-full flex-wrap gap-3">
                  {items.map((i) => (
                    <div className="w-5/12 min-w-80 flex-1" key={i.key}>
                      {i}
                    </div>
                  ))}
                </div>
              )}
            </MissingCardAccordion>
          );
        })}
    </div>
  );
}
