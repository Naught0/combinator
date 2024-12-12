import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FC } from "react";
import { Dropdown } from "../../Dropdown/Dropdown";
import { dumbTitalize } from "../../util";
import { SortDirection, sortDirIconMap } from "../util/sort";
import {
  deckFilters,
  deckLegalities,
  uniqueDeckFormatMap,
} from "./deckFilters";
import { SelectItem } from "@/components/ui/select";
import { YesNoAny } from "../UserDecksContainer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export interface UserDeckFilterProps {
  setSortBy: (k: keyof Deck) => void;
  setSortDir: (k: SortDirection) => void;
  setFormatFilter: (key: Format) => void;
  resetFilters: () => void;
  setTitleFilter: (s: string) => void;
  setPageSize: (size: number) => void;
  setIsLegal: (isLegal: YesNoAny) => void;
  formats: Format[];
  formatFilter?: Format;
  titleFilter?: string;
  pageSize: number;
  sortDirection: SortDirection;
  sortBy: string;
  isLegal: YesNoAny;
}

function Field({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

export const UserDeckFilters: FC<UserDeckFilterProps> = ({
  titleFilter,
  sortDirection,
  sortBy,
  formatFilter,
  pageSize,
  formats,
  isLegal,
  setSortBy,
  setTitleFilter,
  setFormatFilter,
  setSortDir,
  setPageSize,
  setIsLegal,
}) => {
  return (
    <div className="flex flex-row flex-wrap gap-2">
      <Field>
        <Label>Deck name</Label>
        <div className="relative w-full">
          <Input
            name="deck-filter"
            type="text"
            placeholder="Filter decks by title"
            value={titleFilter}
            onInput={(e) =>
              setTitleFilter((e.target as HTMLInputElement).value)
            }
          />
          {!!titleFilter && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => {
                setTitleFilter("");
              }}
            >
              <FontAwesomeIcon icon={faXmarkCircle} />
            </button>
          )}
        </div>
      </Field>
      <div className="flex basis-full md:hidden"></div>
      <Field>
        <Label>Format</Label>
        <Dropdown
          placeholder={
            formatFilter
              ? uniqueDeckFormatMap.get(formatFilter) ||
                dumbTitalize({ text: formatFilter })
              : "Any"
          }
          onChange={(value) => setFormatFilter(value as Format)}
        >
          <SelectItem value={"any"}>Any</SelectItem>
          {formats.map((text) => (
            <SelectItem key={text} value={text}>
              {uniqueDeckFormatMap.get(text) || dumbTitalize({ text })}
            </SelectItem>
          ))}
        </Dropdown>
      </Field>
      <Field>
        <Label>Legality</Label>
        <Dropdown
          placeholder={
            <span
              className={
                deckLegalities.find((l) => l.value === isLegal)?.className
              }
            >
              {deckLegalities.find((l) => l.value === isLegal)?.display}
            </span>
          }
          onChange={(value) => {
            setIsLegal(value as YesNoAny);
          }}
        >
          {deckLegalities.map(
            (legality) =>
              legality && (
                <SelectItem key={legality.display} value={legality.value}>
                  {legality.display}
                </SelectItem>
              ),
          )}
        </Dropdown>
      </Field>
      <Field>
        <Label>Sort by</Label>
        <div className="inline-flex">
          <Dropdown
            placeholder={`${deckFilters.find((f) => f.key === sortBy)?.display}`}
            onChange={(value) => setSortBy(value as keyof Deck)}
            className="rounded-r-none border-r-0"
          >
            {deckFilters.map((f) => (
              <SelectItem key={f.key} value={f.display}>
                {f.display}
              </SelectItem>
            ))}
          </Dropdown>
          <Button
            className="rounded-l-none"
            variant="outline"
            onClick={() =>
              setSortDir(
                sortDirection === SortDirection.ASC
                  ? SortDirection.DESC
                  : SortDirection.ASC,
              )
            }
          >
            <span>{sortDirIconMap.get(sortDirection)}</span>
          </Button>
        </div>
      </Field>
      <Field>
        <Label>Per page</Label>
        <Dropdown
          placeholder={pageSize}
          onChange={(value) => setPageSize(parseInt(value))}
        >
          {[5, 10, 20, 50, 100].map((num) => (
            <SelectItem key={num} value={num.toString()}>
              {num}
            </SelectItem>
          ))}
        </Dropdown>
      </Field>
    </div>
  );
};
