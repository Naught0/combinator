import { FC, ReactNode } from "react";
import ReactPaginate from "react-paginate";

interface props {
  children: ReactNode[];
  pageIndex: number;
  setIndex: (n: number) => void;
}

export const Paginate: FC<props> = ({ children, pageIndex, setIndex }) => {
  return (
    <nav
      className="pagination is-left my-3 is-flex is-justify-content-flex-end"
      style={{ width: "100%" }}
    >
      <ReactPaginate
        pageCount={children.length}
        activeLinkClassName="is-current"
        pageLinkClassName="pagination-link"
        breakLinkClassName="pagination-ellipsis"
        nextLinkClassName="is-hidden"
        previousLinkClassName="is-hidden"
        disabledLinkClassName="is-disabled"
        forcePage={pageIndex}
        className="pagination-list"
        onClick={({ nextSelectedPage }) =>
          void (
            typeof nextSelectedPage === "number" && setIndex(nextSelectedPage)
          )
        }
      />
      <div
        className="mr-2"
        style={{ height: "100%", display: "flex", gap: "0.33rem" }}
      >
        <div>
          <button className="button" onClick={() => setIndex(pageIndex - 1)}>
            prev
          </button>
        </div>
        <div>
          <button className="button" onClick={() => setIndex(pageIndex + 1)}>
            next
          </button>
        </div>
      </div>
    </nav>
  );
};
