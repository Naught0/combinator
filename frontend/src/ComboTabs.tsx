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
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Layout, LayoutSelect } from "./LayoutSelect";
import { usePersist } from "./UserDeck/hooks/usePersist";
import { MasonryLayout } from "./MasonryLayout";
import { HoverableCard } from "./HoverableCard";
import { replaceManaSymbols } from "./Combo";

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
      <div className="inline-flex flex-wrap gap-2 text-base md:text-lg lg:text-2xl">
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
        <div className="relative max-w-96">
          <Input
            className="pr-8"
            placeholder="Filter combos by keyword, type line, or card name"
            value={filter}
            onChange={({ target }) => setFilter(target.value)}
          />
          {filter && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
              onClick={() => setFilter("")}
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          )}
        </div>
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
    (localStorage.getItem("layout") as Layout) ?? Layout.GRID,
  );
  usePersist({ key: "layout", val: layout });
  const [showImages, setShowImages] = useState(
    (localStorage.getItem("showImages") ?? "true") === "true",
  );
  usePersist({ key: "showImages", val: showImages ? "true" : "false" });

  return (
    <div className="flex flex-col gap-3">
      <div className="inline-flex flex-wrap gap-3 md:justify-start">
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
      {filteredCombos && layout === Layout.GRID && (
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
      {filteredCombos && layout === Layout.LIST && (
        <ComboListView filteredCombos={filteredCombos} deckData={deckData} />
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

function ComboListItem({
  combo,
  cards,
}: {
  combo: AlmostIncluded;
  cards: DeckCard[];
}) {
  const deckCards = combo.uses
    .map((comboCard) => cards.find((c) => c.name === comboCard.card?.name))
    .filter((c) => !!c);

  const prerequisites = combo.otherPrerequisites
    .split(".")
    .filter((p) => p.trim());

  const steps = combo.description.split(".").filter((t) => t.trim().length > 0);

  return (
    <tr className="border-b border-zinc-700 transition-colors hover:bg-zinc-800/30">
      <td className="px-2 py-3 align-top">
        <div className="flex flex-wrap gap-1">
          {deckCards.map((c) => (
            <HoverableCard
              key={c.id}
              cardName={c.name}
              image={c.image}
              className="rounded bg-zinc-800 px-2 py-1 text-sm"
            />
          ))}
        </div>
      </td>
      <td className="px-2 py-3 align-top">
        <ul className="list-disc pl-4 text-sm">
          {prerequisites.map((p, idx) => (
            <li key={idx}>{replaceManaSymbols(p)}</li>
          ))}
        </ul>
      </td>
      <td className="px-2 py-3 align-top">
        <ul className="list-disc pl-4 text-sm">
          {combo.produces.map((produces) => (
            <li key={produces.feature.id}>{produces.feature.name}</li>
          ))}
        </ul>
      </td>
      <td className="px-2 py-3 align-top">
        <div className="text-sm">
          <p className="font-semibold text-zinc-400">Steps</p>
          <ol className="mt-1 list-decimal pl-4">
            {steps.map((s, idx) => (
              <li key={idx}>{replaceManaSymbols(s)}</li>
            ))}
          </ol>
        </div>
      </td>
    </tr>
  );
}

function ComboListView({
  filteredCombos,
  deckData,
}: {
  filteredCombos: AlmostIncluded[];
  deckData: DeckData;
}) {
  return (
    <div className="overflow-x-auto rounded border border-zinc-700 bg-black/40">
      <table className="w-full min-w-[800px] table-fixed">
        <thead>
          <tr className="border-b border-zinc-700 text-left text-sm font-bold text-zinc-400">
            <th className="w-1/4 px-2 py-2">Cards</th>
            <th className="w-1/4 px-2 py-2">Prerequisites</th>
            <th className="w-1/4 px-2 py-2">Results</th>
            <th className="w-1/4 px-2 py-2">Steps</th>
          </tr>
        </thead>
        <tbody>
          {filteredCombos.map((combo) => (
            <ComboListItem
              key={combo.id}
              combo={combo}
              cards={deckData.cards ?? []}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
