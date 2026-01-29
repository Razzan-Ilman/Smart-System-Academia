import React from 'react';
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const renderPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages.map((page) => (
            <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-10 h-10 flex items-center justify-center rounded-full font-bold transition-all duration-200 ${currentPage === page
                        ? "bg-[#3b82f6] text-white shadow-md border-transparent scale-105"
                        : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:border-blue-200"
                    }`}
            >
                {page}
            </button>
        ));
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-8 py-4">
            <button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
                <LeftOutlined style={{ fontSize: '12px' }} />
            </button>

            <div className="flex items-center gap-2">
                {renderPageNumbers()}
            </div>

            <button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
                <RightOutlined style={{ fontSize: '12px' }} />
            </button>
        </div>
    );
};

export default Pagination;
