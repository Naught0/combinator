import chunk from "lodash.chunk";

interface props<T> {
  data: T[];
  pageSize?: number;
  pageIndex: number;
}
export const usePaginate = <T>({
  data,
  pageIndex = 0,
  pageSize = 15,
}: props<T>) => {
  const pages = chunk(data, pageSize);
  return {
    currentPage: pages[pageIndex],
    pages: pages,
    totalPages: pages.length,
  };
};
