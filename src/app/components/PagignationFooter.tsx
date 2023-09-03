import React from "react";

interface PaginationFooterProps {
  currentPage: number;
  totalPages: number;
  limit: number;
  onPageChange: (newPage: number) => void;
  onlimitChange: (newlimit: number) => void;
}

const PaginationFooter: React.FC<PaginationFooterProps> = ({
  currentPage,
  totalPages,
  limit,
  onPageChange,
  onlimitChange,
}) => {
  const handlePrevPageClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPageClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className=" space-x-4 bottom-0 fixed w-full flex items-center justify-end p-5">
      <div>
        Rows per page:
        <select
          value={limit}
          onChange={(e) => onlimitChange(parseInt(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
      </div>

      <div>
        {`${(currentPage - 1) * limit + 1} - ${Math.min(
          currentPage * limit,
          totalPages * limit
        )} of ${totalPages * limit}`}
      </div>

      <div className=" bg-amber-300 space-x-2 gap-2 p-2 ">
        <button onClick={handlePrevPageClick} disabled={currentPage === 1}>
          &lt;
        </button>
        <button
          onClick={handleNextPageClick}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default PaginationFooter;
