import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router";
import { CardFilter, ViewMode } from "./CardFilter";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { useFilteredCombos } from "./hooks/useComboData";
import { Loading } from "./Loading";
import { getComboData } from "./services";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Combos } from "./Combos";
import { GroupedCombos } from "./GroupedCombos";
import { ListControls } from "./ListControls";
import { useState } from "react";

export function ComboTabs({ deckData }: { deckData: DeckData }) {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "combos";
  
  const getTabLink = (tab: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("tab", tab);
    return `?${params.toString()}`;
  };

  const { data: allCombos, isLoading } = useQuery({
    queryKey: ["combo-data", { source: deckData.source, id: deckData.id }],
    queryFn: async () => {
      const d = await getComboData({
        commanders: [],
        main: deckData!.cards.map((c) => ({ card: c.name, quantity: 1 })),
      });
      return d;
    },
  });

  const comboData =
    activeTab === "add-1" ? allCombos?.almostIncluded : allCombos?.included;
  const { filter, setFilter, filteredCombos, groupedByMissing } =
    useFilteredCombos({
      deckData,
      combos: comboData ?? [],
    });
  const noCombos = !comboData?.length;
  const noFilteredCombos = filteredCombos.length < 1;
  const [searchViewMode, setSearchViewMode] = useState<ViewMode>(
    (localStorage.getItem("cardViewMode") as ViewMode) ?? "text",
  );

  if (isLoading) {
    return <Loading size="lg" message="Loading combos" />;
  }

  return (
    <div className="flex flex-col">
      <div className="grid">
        <div className="inline-flex flex-wrap gap-2">
          <Link to={getTabLink("combos")} replace>
            <Button
              variant={activeTab === "combos" ? "activeTab" : "tab"}
              size="tab"
              className="inline-flex items-start"
            >
              Combos
              <span className="align-super text-sm">
                {allCombos?.included?.length ?? 0}
              </span>
            </Button>
          </Link>
          {(allCombos?.almostIncluded?.length ?? -1) > 0 && (
            <Link to={getTabLink("add-1")} replace>
              <Button
                size="tab"
                variant={activeTab === "add-1" ? "activeTab" : "tab"}
                className="inline-flex items-start"
              >
                Add 1
                <span className="align-super text-sm">
                  {allCombos?.almostIncluded.length}
                </span>
              </Button>
            </Link>
          )}
          <Link to={getTabLink("search")} replace>
            <Button
              size="tab"
              variant={activeTab === "search" ? "activeTab" : "tab"}
            >
              Cards <FontAwesomeIcon icon={faMagnifyingGlass} />
            </Button>
          </Link>
        </div>
        <hr className="border-zinc-700" />
      </div>
      <div className={"flex flex-col gap-6"}>
        <div className="flex flex-col gap-3 rounded-b-lg border border-zinc-700 bg-zinc-800 px-4 py-6">
          {(activeTab === "combos" || activeTab === "add-1") && (
            <ListControls />
          )}
          <div className="relative sm:max-w-lg">
            <Input
              className="pr-8"
              placeholder="search by keyword, type line, or card name"
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
        </div>
        {activeTab === "combos" && (
          <Combos
            noCombos={noCombos}
            filter={filter}
            noFilteredCombos={noFilteredCombos}
            deckData={deckData}
            filteredCombos={filteredCombos}
          />
        )}

        {activeTab === "add-1" && groupedByMissing && (
          <GroupedCombos data={groupedByMissing} cards={deckData.cards} />
        )}
        {activeTab === "search" && deckData && (
          <CardFilter
            viewMode={searchViewMode}
            setViewMode={setSearchViewMode}
            deckData={deckData}
            filter={filter}
          />
        )}
      </div>
    </div>
  );
}
