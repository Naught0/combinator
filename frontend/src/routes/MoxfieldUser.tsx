import { BackToSearch } from "@/BackToSearch";
import { getMoxfieldUserData, getMoxfieldUserExists } from "@/services";
import { UserDeckFilters, UserDecksContainer } from "@/UserDeck";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useParams, useSearchParams } from "react-router";
import { Paginate } from "@/Paginate/Paginate";
import { useEffect, useState } from "react";
import { Error } from "@/Error";
import { Loading } from "@/Loading";
import { removeDefaultParams } from "@/UserDeck/hooks/useRemoveDefaultParams";
import { formats } from "@/util/moxfield";

export function MoxfieldUser() {
  const { userName } = useParams<{ userName: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

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
      {
        userName,
        searchParams: removeDefaultParams(
          new URLSearchParams(Object.fromEntries(searchParams)),
        ).toString(),
      },
    ], // TODO: Make this less icky
    queryFn: () =>
      getMoxfieldUserData({
        ...Object.fromEntries(searchParams),
        authorUserNames: [userName!],
      }),
    enabled: userNameExists,
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

  return (
    <div className="flex max-w-screen-2xl flex-col gap-6 md:gap-6">
      <div>
        <BackToSearch />
      </div>
      {userName && <UserDeckFilters formats={formats} />}
      <UserDecksContainer
        pageSize={parseInt(searchParams.get("pageSize") || "12")}
        decks={data?.data}
        loading={isLoading}
      />
      {isError && (
        <p className="text-xl font-bold md:text-2xl">No decks found</p>
      )}
      <div className="w-full">
        <Paginate
          pageIndex={(data?.pageNumber ?? 1) - 1}
          setIndex={(i) =>
            setSearchParams((prev) => {
              const pageNumber = i + 1;
              prev.set("pageNumber", String(pageNumber));
              return prev;
            })
          }
          totalPages={totalPages}
        />
      </div>
    </div>
  );
}
