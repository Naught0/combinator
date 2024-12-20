import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dropdown } from "../../Dropdown/Dropdown";
import { sortDirIconMap } from "../util/sort";
import { deckFilters } from "./deckFilters";
import { SelectItem } from "@/components/ui/select";
import { HookInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { DeckFilterParams } from "@/routes/MoxfieldUser";

function Field({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

export const UserDeckFilters = ({
  formats,
}: {
  formats: { value: Format; display: string }[];
}) => {
  const { setValue, control } = useFormContext<DeckFilterParams>();
  const { filter, sortDirection } = useWatch({ control });
  return (
    <div className="flex flex-row flex-wrap gap-3">
      <Field>
        <Label>Deck name</Label>
        <div className="relative w-full">
          <HookInput
            name="filter"
            type="text"
            placeholder="Filter decks by title"
          />

          {!!filter && (
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2"
              onClick={() => {
                setValue("filter", "");
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
        <Controller
          control={control}
          name="fmt"
          render={({ field }) => (
            <Dropdown {...field}>
              {formats.map(({ value, display }) => (
                <SelectItem key={value} value={value}>
                  {display}
                </SelectItem>
              ))}
            </Dropdown>
          )}
        />
      </Field>
      <Field>
        <Label>Show illegal</Label>

        <Controller
          control={control}
          name={"showIllegal"}
          render={({ field: { onChange, value, ...field } }) => (
            <Dropdown {...field} onChange={(v) => onChange(v === "true")}>
              {["true", "false"].map((v) => (
                <SelectItem key={v} value={v}>
                  {v}
                </SelectItem>
              ))}
            </Dropdown>
          )}
        />
      </Field>
      <Field>
        <Label>Sort by</Label>
        <div className="inline-flex">
          <Controller
            control={control}
            name="sortType"
            render={({ field }) => (
              <Dropdown className="rounded-r-none border-r-0" {...field}>
                {deckFilters.map((f) => (
                  <SelectItem key={f.key} value={f.key}>
                    {f.display}
                  </SelectItem>
                ))}
              </Dropdown>
            )}
          />

          <Button
            className="rounded-l-none"
            variant="outline"
            size="icon"
            onClick={() =>
              setValue(
                "sortDirection",
                sortDirection === "ascending" ? "descending" : "ascending",
              )
            }
          >
            <span>{sortDirIconMap.get(sortDirection ?? "descending")}</span>
          </Button>
        </div>
      </Field>
      <Field>
        <Label>Per page</Label>

        <Controller
          control={control}
          name="pageSize"
          render={({ field: { onChange, value, ...field } }) => (
            <Dropdown
              {...field}
              value={value.toString()}
              onChange={(value) => onChange(parseInt(value))}
              defaultValue="12"
            >
              {["6", "12", "24", "46"].map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num}
                </SelectItem>
              ))}
            </Dropdown>
          )}
        />
      </Field>
    </div>
  );
};
