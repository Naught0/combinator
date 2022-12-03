import { FC, ReactNode } from "react";
import ReactPaginate from "react-paginate";
/* eslint-disable jsx-a11y/anchor-is-valid */

interface props {
  children: ReactNode[];
  pageIndex: number;
  setIndex: (n: number) => void;
}

export const Paginate: FC<props> = ({ children, pageIndex, setIndex }) => {
  return (
    <nav className="pagination is-left my-3">
      <ReactPaginate
        pageCount={children.length}
        activeLinkClassName="is-current"
        pageLinkClassName="pagination-link"
        nextLinkClassName="pagination-next"
        breakLinkClassName="pagination-ellipsis"
        previousLinkClassName="pagination-previous"
        disabledLinkClassName="is-disabled"
        forcePage={pageIndex}
        className="pagination-list"
        onClick={({ nextSelectedPage }) =>
          void (nextSelectedPage && setIndex(nextSelectedPage))
        }
      />
    </nav>
  );
};
