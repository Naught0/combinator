import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "@/components/ui/pagination";
import { useSearchParams } from "react-router";

interface props {
  totalPages: number;
  pageIndex: number;
  setIndex: (n: number) => void;
}

export const Paginate: React.FC<props> = ({
  totalPages,
  pageIndex,
  setIndex,
}) => {
  const [searchparams, setSearchParams] = useSearchParams();
  // Generate page numbers to display
  const generatePageNumbers = () => {
    // If total pages is 7 or less, show all pages
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | null)[] = [];

    // Always show first and last pages
    pages.push(1);

    // Logic for middle pages
    if (pageIndex <= 3) {
      // Close to start
      pages.push(2, 3, 4, null, totalPages);
    } else if (pageIndex >= totalPages - 2) {
      // Close to end
      pages.push(
        null,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      );
    } else {
      // Middle of pagination
      pages.push(
        null,
        pageIndex - 1,
        pageIndex,
        pageIndex + 1,
        null,
        totalPages,
      );
    }

    return pages;
  };
  const pageNumbers = generatePageNumbers();

  return (
    <Pagination>
      <PaginationContent>
        <div className="flex flex-col items-center justify-center md:contents">
          <div className="flex flex-row gap-3">
            <PaginationItem>
              <PaginationPrevious
                onClick={(e) => {
                  e.preventDefault();
                  setIndex(Math.max(0, pageIndex - 1));
                }}
              />
            </PaginationItem>
            <div className="hidden md:contents">
              {pageNumbers.map((page, index) =>
                page === null ? (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={(e) => {
                        e.preventDefault();
                        setIndex(index);
                      }}
                      isActive={page - 1 === pageIndex}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}
            </div>
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setSearchParams((prev) => ({
                    ...prev,
                    pageNumber: (pageIndex + 2).toString(),
                  }))
                }
              />
            </PaginationItem>
          </div>
          <span className="contents text-sm md:hidden">
            Page {pageIndex + 1} / {totalPages}
          </span>
        </div>
      </PaginationContent>
    </Pagination>
  );
};
