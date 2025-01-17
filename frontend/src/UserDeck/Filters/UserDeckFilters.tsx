import { sortDirIconMap } from "../util/sort";
import { deckFilters } from "./deckFilters";
import { SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { defaultFormValues } from "@/UserDeckFilterForm";
import { SyncInput } from "@/sync-to-url/SyncInput";
import { SyncSelect } from "@/sync-to-url/SyncSelect";
import { useSearchParams } from "react-router";
import { removeDefaultParams } from "../hooks/useRemoveDefaultParams";

function Field({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

export const UserDeckFilters = ({
  formats,
}: {
  formats: { value: Format; display: string }[];
}) => {
  const [params, setParams] = useSearchParams();
  const sortDirection =
    params.get("sortDirection") ?? defaultFormValues.sortDirection;

  return (
    <div className="flex flex-row flex-wrap gap-3">
      <Field>
        <Label>Deck name</Label>
        <div className="relative w-full">
          <SyncInput
            name="filter"
            placeholder="Filter decks by title"
            debounceMs={500}
          />
        </div>
      </Field>
      <div className="flex basis-full md:hidden"></div>
      <Field>
        <Label>Format</Label>
        <SyncSelect name="fmt" defaultValue={defaultFormValues.fmt}>
          {formats.map(({ value, display }) => (
            <SelectItem key={value} value={value}>
              {display}
            </SelectItem>
          ))}
        </SyncSelect>
      </Field>
      <Field>
        <Label>Show illegal</Label>
        <SyncSelect
          name={"showIllegal"}
          defaultValue={defaultFormValues.showIllegal ? "Yes" : "No"}
        >
          {["Yes", "No"].map((v) => (
            <SelectItem key={v} value={v}>
              {v}
            </SelectItem>
          ))}
        </SyncSelect>
      </Field>
      <Field>
        <Label>Sort by</Label>
        <div className="inline-flex">
          <SyncSelect
            className="rounded-r-none border-r-0"
            name="sortType"
            defaultValue={defaultFormValues.sortType}
          >
            {deckFilters.map((f) => (
              <SelectItem key={f.key} value={f.key}>
                {f.display}
              </SelectItem>
            ))}
          </SyncSelect>

          <Button
            className="rounded-l-none"
            variant="outline"
            size="icon"
            onClick={(e) => {
              e.preventDefault();
              setParams((prev) => {
                prev.set(
                  "sortDirection",
                  sortDirection === "ascending" ? "descending" : "ascending",
                );
                return removeDefaultParams(prev);
              });
            }}
          >
            <span>{sortDirIconMap.get(sortDirection)}</span>
          </Button>
        </div>
      </Field>
      <Field>
        <Label>Per page</Label>
        <SyncSelect
          name="pageSize"
          defaultValue={defaultFormValues.pageSize.toString()}
        >
          {["6", "12", "24", "46"].map((num) => (
            <SelectItem key={num} value={num}>
              {num}
            </SelectItem>
          ))}
        </SyncSelect>
      </Field>
    </div>
  );
};
