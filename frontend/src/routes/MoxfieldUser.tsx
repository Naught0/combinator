import { BackToSearch } from "@/BackToSearch";
import { getMoxfieldUserData, getMoxfieldUserExists } from "@/services";
import { UserDeckFilters, UserDecksContainer } from "@/UserDeck";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { FormProvider, useForm } from "react-hook-form";
import { useParams, useSearchParams } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Paginate } from "@/Paginate/Paginate";
import { useDebounce } from "use-debounce";
import { formats } from "@/util/moxfield";
import { useEffect, useMemo, useState } from "react";
import { Error } from "@/Error";
import { Loading } from "@/Loading";
import { useSyncToUrl } from "@/hooks/useSyncToUrl";

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

export function MoxfieldUser() {
  const { userName } = useParams<{ userName: string }>();
  const [searchParams] = useSearchParams();
  const [urlSynced, setUrlSynced] = useState(false);
  useEffect(function populateParams() {
    const res = formSchema
      .partial()
      .safeParse(Object.fromEntries(searchParams));
    if (res.success) {
      form.reset(
        { ...res.data, authorUserNames: [userName] },
        { keepDefaultValues: true },
      );
    }
    setUrlSynced(true);
  }, []);

  const form = useForm<DeckFilterParams>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      board: "mainboard",
      filter: "",
      fmt: "any",
      pageNumber: 1,
      pageSize: 12,
      sortType: "updated",
      sortDirection: "descending",
      showIllegal: true,
      authorUserNames: [userName],
    },
  });
  const { pageNumber, ...formValues } = form.watch();
  const params = useMemo(() => formValues, [JSON.stringify(formValues)]);
  const [debouncedParams] = useDebounce(params, 350);
  const [debouncedPageNumber] = useDebounce(pageNumber, 50);
  const { authorUserNames, ...syncedParams } = debouncedParams;
  useSyncToUrl({ ...syncedParams, pageNumber: debouncedPageNumber ?? 1 });

  const {
    isLoading: existsLoading,
    isSuccess: userNameExists,
    isError: userNameNotFound,
  } = useQuery({
    queryKey: ["moxfield-user-exists", userName],
    queryFn: () => getMoxfieldUserExists(userName!),
    enabled: !!userName,
  });
  const { data, isLoading, isError } = useQuery<
    MoxfieldDecksResults,
    AxiosError
  >({
    queryKey: [
      "moxfield-decks",
      { userName, debouncedPageNumber, debouncedParams },
    ], // TODO: Make this less icky
    queryFn: () =>
      getMoxfieldUserData({
        ...debouncedParams,
        pageNumber: debouncedPageNumber ?? 1,
      }),
    enabled: userNameExists && urlSynced,
  });
  const [totalPages, setTotalPages] = useState(data?.totalPages ?? 1);
  useEffect(() => {
    if (data) {
      setTotalPages(data.totalPages);
    }
  }, [data]);

  if (existsLoading)
    return <Loading size={"lg"} message={`Searching for user on Moxfield`} />;

  if (userNameNotFound) {
    return <Error message={"User not found"} />;
  }

  console.log("RENDER");
  return (
    <div className="flex max-w-screen-2xl flex-col gap-6 md:gap-6">
      <div>
        <BackToSearch />
      </div>
      <FormProvider {...form}>
        <form>
          <UserDeckFilters formats={formats} />
        </form>
      </FormProvider>
      <UserDecksContainer
        pageSize={formValues.pageSize ?? 12}
        decks={data?.data}
        loading={isLoading}
      />
      {isError && (
        <p className="text-xl font-bold md:text-2xl">No decks found</p>
      )}
      <div className="w-full">
        <Paginate
          pageIndex={(pageNumber ?? 1) - 1}
          setIndex={(i) => form.setValue("pageNumber", i + 1)}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
