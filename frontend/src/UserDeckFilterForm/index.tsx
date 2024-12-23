import { UserDeckFilters } from "@/UserDeck/Filters/UserDeckFilters";
import { formats } from "@/util/moxfield";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { useSearchParams } from "react-router";
import { z } from "zod";

const formSchema = z.object({
  showIllegal: z.coerce.boolean().default(true),
  authorUserNames: z.array(z.string()).default([]),
  pageNumber: z.coerce.number().min(1, "Page must be >= 1").default(1),
  pageSize: z.coerce
    .number()
    .min(6, "Page size must be >= 12")
    .max(46, "Page size must be <= 50")
    .default(12),
  sortType: z.coerce.string().default("updated"),
  sortDirection: z.coerce.string().default("descending"),
  board: z.coerce.string().default("mainboard"),
  filter: z.coerce.string().default(""),
  fmt: z.coerce.string().default("any"),
});

export type DeckFilterParams = z.infer<typeof formSchema>;

export const defaultFormValues = {
  board: "mainboard",
  filter: "",
  fmt: "any",
  pageNumber: 1,
  pageSize: 24,
  sortType: "updated",
  sortDirection: "descending",
  showIllegal: true,
} as const;

export function UserDeckFilterForm({ userName }: { userName: string }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultValues = {
    ...defaultFormValues,
    authorUserNames: [userName],
  };
  const form = useForm<DeckFilterParams>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });
  useEffect(function loadSearchParams() {
    form.reset(formSchema.optional().safeParse(searchParams).data ?? {}, {
      keepDefaultValues: true,
    });
  }, []);

  function handleSubmit(data: DeckFilterParams) {
    const nonDefaultParams = Object.fromEntries(
      Object.entries(data)
        .map(([k, v]) => {
          if (v === defaultFormValues[k as keyof typeof defaultFormValues])
            return [k, null];
          return [k, v];
        })
        .filter(([k, v]) => !shouldRemoveFromParams(k, v)),
    ) as DeckFilterParams;
    const params = Object.fromEntries(
      Object.entries(nonDefaultParams).map(([k, v]) => {
        if (Array.isArray(v)) return [k, v.join(",")];
        return [k, String(v)];
      }),
    );
    setSearchParams(params);
  }

  return (
    <FormProvider {...form}>
      <form
        onChange={form.handleSubmit(handleSubmit, console.error)}
        onSubmit={form.handleSubmit(handleSubmit, console.error)}
      >
        <UserDeckFilters formats={formats} />
      </form>
    </FormProvider>
  );
}

// TODO: BAD ANY BAD
function shouldRemoveFromParams(key: any, value: any) {
  if (
    ["", null, undefined].includes(value) ||
    value === defaultFormValues[key as keyof typeof defaultFormValues] ||
    key === "authorUserNames"
  )
    return true;

  return false;
}

export function combineWithDefaultParams(params: Record<string, any>) {
  return {
    ...defaultFormValues,
    ...params,
  };
}
