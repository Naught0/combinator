import { FC, ReactNode, useMemo } from "react";
import ReactPaginate from "react-paginate";
/* eslint-disable jsx-a11y/anchor-is-valid */

const MAX_PAGES_DISPLAY = 6;

const PaginateEllipsis = () => {
  return (
    <li>
      <span className="pagination-ellipsis">&hellip;</span>
    </li>
  );
};

interface PaginateLinkProps {
  index: number;
  currentIndex: number;
  onClick: (idx: number) => void;
}
const PaginateLink: FC<PaginateLinkProps> = ({
  index,
  currentIndex,
  onClick,
}) => {
  return (
    <li>
      <a
        className={`pagination-link ${
          index === currentIndex ? "is-current" : ""
        }`}
        onClick={() => onClick(index)}
      >
        {index + 1}
      </a>
    </li>
  );
};

interface props {
  children: any[];
  pageIndex: number;
  canPrev: boolean;
  canNext: boolean;
  setIndex: (idx: number) => void;
  next: () => void;
  prev: () => void;
}

export const Paginate: FC<props> = ({
  children,
  pageIndex,
  canNext,
  canPrev,
  setIndex,
  prev,
  next,
}) => {
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
