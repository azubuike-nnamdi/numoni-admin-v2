'use client';

import { DataTable } from '@/components/ui/data-table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import LoadingSpinner from '@/components/ui/loading-spinner';
import useGetCustomersTransactions from '@/hooks/query/useGetCustomersTransactions';
import { useDebounce } from '@/hooks/utils/useDebounce';
import { extractErrorMessage } from '@/lib/helper';
import { CustomerTransaction } from '@/lib/types';
import { ChevronDown, ChevronLeft, ChevronRight, Download, Info, RefreshCw, Search, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { customerTransactionColumns } from './transaction-columns';

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [orderStatus, setOrderStatus] = useState('');

  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  const { data, isPending, error, isError, refetch } = useGetCustomersTransactions({
    customerName: debouncedSearchTerm.trim() || undefined,
    transactionType: orderStatus || undefined,
    page: currentPage - 1,
    size: 30, // Standard page size
  });
  const apiData = data?.data?.data;

  const itemsPerPage = 30;

  // Use transactions directly from API
  const transactions: CustomerTransaction[] = apiData?.pageData || [];
  const totalPages = apiData?.totalPages || 1;
  const totalRows = apiData?.totalRows || 0;

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handleResetFilter = () => {
    setOrderStatus('');
    setSearchTerm('');
  };

  // Reset to first page when debounced search term or order status changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, orderStatus]);

  // Transaction type options for the dropdown
  const transactionTypeOptions = [
    { value: 'PURCHASE', label: 'Purchase' },
    { value: 'LOAD_MONEY', label: 'Load Money' },
    { value: 'SHARE_MONEY_DEBIT', label: 'Share Money Debit' },
    { value: 'SHARE_MONEY_CREDIT', label: 'Share Money Credit' },
    { value: 'BONUS', label: 'Bonus' },
  ];

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
          description="No transactions match your current search or filter criteria. Try adjusting your search terms or filters."
        />
      );
    }

    return <DataTable columns={customerTransactionColumns} data={transactions} />;
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
              placeholder="Search by customer name"
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

          {/* Filter Buttons */}
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  {orderStatus ? transactionTypeOptions.find(opt => opt.value === orderStatus)?.label : 'Order Status'}
                  <ChevronDown className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => setOrderStatus('')}
                  className="cursor-pointer"
                >
                  All Types
                </DropdownMenuItem>
                {transactionTypeOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => setOrderStatus(option.value)}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <button
              onClick={handleResetFilter}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Reset Filter
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
              Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalRows)} of {totalRows}
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
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
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