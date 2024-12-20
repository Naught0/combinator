import { BackToSearch } from "@/BackToSearch";
import { Loading } from "@/Loading";
import { getMoxfieldUserData } from "@/services";
import { UserDeckFilters, UserDecksContainer } from "@/UserDeck";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Paginate } from "@/Paginate/Paginate";
import { useDebounce } from "use-debounce";
import { useEffect } from "react";
import { formats } from "@/util/moxfield";

// https://api2.moxfield.com/v2/decks/search?
//showIllegal=true
//authorUserNames=Dionysus
//pageNumber=3
//pageSize=12
//sortType=updated
//sortDirection=descending
//board=mainboard
//filter=test

const formSchema = z.object({
  showIllegal: z.boolean().default(true),
  authorUserNames: z.array(z.string()),
  pageNumber: z.number().min(1, "Page must be >= 1").default(1),
  pageSize: z
    .number()
    .min(12, "Page size must be >= 12")
    .max(50, "Page size must be <= 50")
    .default(12),
  sortType: z.enum(["updated", "created", "name"]).default("updated"),
  sortDirection: z.enum(["ascending", "descending"]).default("descending"),
  board: z.enum(["mainboard", "sideboard"]).default("mainboard"),
  filter: z.string().default(""),
  fmt: z.string(),
});
export type DeckFilterParams = z.infer<typeof formSchema>;

export function MoxfieldUser() {
  const { userName } = useParams<{ userName: string }>();
  let navigate = useNavigate();
  if (!userName) {
    navigate("/404");
    return null;
  }
  const form = useForm<DeckFilterParams>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      board: "mainboard",
      filter: "",
      fmt: "",
      pageNumber: 1,
      pageSize: 12,
      sortType: "updated",
      sortDirection: "descending",
      showIllegal: true,
      authorUserNames: [userName],
    },
  });
  const { pageNumber, ...formValues } = useWatch({ control: form.control });
  const [debouncedParams] = useDebounce(formValues, 500);
  const [debouncedPageNumber] = useDebounce(pageNumber, 50);

  const { data, isLoading } = useQuery<MoxfieldDecksResults, AxiosError>({
    queryKey: [
      "moxfield-decks",
      userName,
      debouncedPageNumber,
      JSON.stringify(debouncedParams),
    ], // TODO: Make this less icky
    queryFn: () =>
      getMoxfieldUserData({
        ...debouncedParams,
        pageNumber: debouncedPageNumber ?? 1,
      }),
  });

  return (
    <div className="flex max-w-screen-2xl flex-col gap-6 md:gap-6">
      <div>
        <BackToSearch />
      </div>
      <FormProvider {...form}>
        <UserDeckFilters formats={formats} />
      </FormProvider>
      {isLoading && <Loading message="Loading decks" />}
      {data && <UserDecksContainer decks={data.data} />}
      {data && (
        <div className="w-full">
          <Paginate
            pageIndex={(pageNumber ?? 1) - 1}
            setIndex={(i) => form.setValue("pageNumber", i + 1)}
            totalPages={data.totalPages}
          />
        </div>
      )}
    </div>
  );
}
