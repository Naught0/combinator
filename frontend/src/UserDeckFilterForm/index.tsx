import { z } from "zod";

const formSchema = z.object({
  showIllegal: z.coerce.boolean().default(true),
  authorUserNames: z.array(z.string()).default([]),
  pageNumber: z.coerce.number().min(1, "Page must be >= 1").default(1),
  pageSize: z.coerce
    .number()
    .min(6, "Page size must be >= 6")
    .max(46, "Page size must be <= 46")
    .default(12),
  sortType: z.coerce.string().default("updated"),
  sortDirection: z.coerce.string().default("descending"),
  board: z.coerce.string().default("mainboard"),
  filter: z.coerce.string().default(""),
  fmt: z.coerce.string().default("any"),
});

export type DeckFilterParams = z.infer<typeof formSchema>;

export const defaultFormValues: Pick<
  DeckFilterParams,
  | "board"
  | "filter"
  | "fmt"
  | "pageNumber"
  | "pageSize"
  | "sortType"
  | "sortDirection"
  | "showIllegal"
> = {
  board: "mainboard",
  filter: "",
  fmt: "any",
  pageNumber: 1,
  pageSize: 12,
  sortType: "updated",
  sortDirection: "descending",
  showIllegal: true,
} as const;
