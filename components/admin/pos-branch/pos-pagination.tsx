"use client";

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PosPaginationProps {
  startIndex: number;
  endIndex: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export default function PosBranchPagination({
  startIndex,
  endIndex,
  totalItems,
  currentPage,
  totalPages,
  onPreviousPage,
  onNextPage
}: PosPaginationProps) {
  return (
    <div className="p-4 border-t border-gray-200 bg-gray-50">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems}
        </div>

        <div className="flex items-center justify-center gap-2">
          <button
            onClick={onPreviousPage}
            disabled={currentPage === 1}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm text-gray-600 px-3 whitespace-nowrap">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            onClick={onNextPage}
            disabled={currentPage >= totalPages || totalPages === 0}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

