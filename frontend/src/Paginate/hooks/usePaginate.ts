import chunk from "lodash.chunk";

interface props {
  data: any[];
  pageSize?: number;
  pageIndex: number;
}
export const usePaginate = ({ data, pageIndex = 0, pageSize = 15 }: props) => {
  const pages = chunk(data, pageSize);
  return {
    currentPage: pages[pageIndex],
    pages: pages,
    totalPages: pages.length,
  };
};
