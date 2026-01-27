'use client';

import { DataTable } from '@/components/ui/data-table';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import LoadingSpinner from '@/components/ui/loading-spinner';
import useGetMerchantTransactions from '@/hooks/query/useGetMerchantTransactions';
import { extractErrorMessage } from '@/lib/helper';
import { MerchantTransaction } from '@/lib/types';
import { ChevronLeft, ChevronRight, Download, Info, RefreshCw, Search, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { transactionColumns } from './transaction-columns';

export default function MerchantTransactions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // 0-based for server-side pagination
  const itemsPerPage = 20; // Changed to match standard page size

  // Use searchTerm as merchantName filter, pass page (0-based) and size
  const { data, isPending, error, isError, refetch } = useGetMerchantTransactions({
    page: currentPage,
    size: itemsPerPage,
    merchantName: searchTerm.trim() || undefined, // Send search term as merchantName filter
  });

  // Extract transactions data from API response
  const apiData = data?.data?.data;
  const transactions: MerchantTransaction[] = apiData?.pageData || [];
  const totalRows = apiData?.totalRows || 0;
  const totalPages = apiData?.totalPages || 0;

  // Calculate pagination display values
  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalRows);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
  };

  const handleResetFilter = () => {
    setSearchTerm('');
    setCurrentPage(0); // Reset to first page when clearing filters
  };

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  // Show loading state after all hooks
  if (isPending) {
    return <LoadingSpinner />;
  }

  // Show error state
  if (isError) {
    return (
      <ErrorState
        title="Error Loading Transactions"
        message={extractErrorMessage(error) || "Failed to load transactions. Please try again."}
        onRetry={refetch}
        retryText="Retry"
      />
    );
  }

  // Render function for data table content
  const renderDataTableContent = () => {
    if (transactions.length === 0) {
      return (
        <EmptyState
          title="No Transactions Found"
          description="No transactions match your current search criteria. Try adjusting your search terms."
        />
      );
    }

    return <DataTable columns={transactionColumns} data={transactions} />;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Header with Search and Filters */}
      <div className="p-6 border-gray-200">
        <div className="flex items-center justify-between mb-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Reset Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetFilter}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Reset Search
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="p-0">
        {renderDataTableContent()}
      </div>

      {/* Pagination and Row Actions */}
      {transactions.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            {/* Row Count */}
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1}-{endIndex} of {totalRows}
            </div>

            {/* Row Action Icons */}
            <div className="flex items-center gap-4">
              <button
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Download"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Information"
              >
                <Info className="h-4 w-4" />
              </button>
              <button
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 0}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-3 py-1 text-sm text-gray-600">
                Page {currentPage + 1} of {totalPages || 1}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages - 1 || totalPages === 0}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}