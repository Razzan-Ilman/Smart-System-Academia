
import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number | ((prev: number) => number)) => void;
}

const Pagination: React.FC<PaginationProps> = ({ 
    currentPage, 
    totalPages, 
    onPageChange 
}) => {
  const handlePrevious = () => onPageChange((p) => p - 1);
  const handleNext = () => onPageChange((p) => p + 1);

  return (
    <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
      <PaginationButton
        onClick={handlePrevious}
        disabled={currentPage === 1}
        label="Prev"
      />
      
      {Array.from({ length: totalPages }, (_, index) => {
        const pageNumber = index + 1;
        return (
          <PageNumberButton
            key={pageNumber}
            pageNumber={pageNumber}
            isActive={currentPage === pageNumber}
            onClick={() => onPageChange(pageNumber)}
          />
        );
      })}
      
      <PaginationButton
        onClick={handleNext}
        disabled={currentPage === totalPages}
        label="Next"
      />
    </div>
  );
};

interface PaginationButtonProps {
  onClick: () => void;
  disabled: boolean;
  label: string;
}

const PaginationButton: React.FC<PaginationButtonProps> = ({ 
  onClick, 
  disabled, 
  label 
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50 hover:bg-gray-300 disabled:hover:bg-gray-200 transition"
  >
    {label}
  </button>
);

interface PageNumberButtonProps {
  pageNumber: number;
  isActive: boolean;
  onClick: () => void;
}

const PageNumberButton: React.FC<PageNumberButtonProps> = ({ 
  pageNumber, 
  isActive, 
  onClick 
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-lg transition ${
      isActive 
        ? 'bg-purple-600 text-white' 
        : 'bg-gray-200 hover:bg-gray-300'
    }`}
  >
    {pageNumber}
  </button>
);

export default Pagination;