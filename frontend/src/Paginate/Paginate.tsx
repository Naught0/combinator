import { FC } from "react";

/* eslint-disable jsx-a11y/anchor-is-valid */

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
    <nav className="pagination is-small">
      <a
        className={`pagination-previous ${!canPrev ? "is-disabled" : ""}`}
        onClick={prev}
      >
        Prev
      </a>
      <a
        className={`pagination-next ${!canNext ? "is-disabled" : ""}`}
        onClick={next}
      >
        Next
      </a>
      <ul className="pagination-list">
        {[...Array(children.length).keys()].map((idx) => (
          <li>
            <a
              className={`pagination-link ${
                pageIndex === idx ? "is-current" : ""
              }`}
              onClick={() => setIndex(idx)}
            >
              {idx + 1}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};
