'use client';

import SearchInput from '@/components/common/search-input';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { DataTablePagination } from '@/components/ui/data-table-pagination';
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { ADMIN_MERCHANTS_ADD_URL } from '@/constant/routes';
import useGetAllMerchants from '@/hooks/query/useGetAllMerchants';
import { Plus, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Merchant, merchantColumns } from './merchant-columns';

export default function ViewMerchants() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // 0-based for server-side pagination
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // Debounce search term - wait 3 seconds after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  // Use debouncedSearchTerm as businessName filter, pass page (0-based) and size
  const { data, isPending, error, isError, refetch } = useGetAllMerchants({
    page: currentPage,
    size: itemsPerPage,
    businessName: debouncedSearchTerm.trim() || undefined, // Send debounced search term as businessName filter
  });

  // Extract merchants data from API response
  const apiData = data?.data?.data;
  const merchants: Merchant[] = apiData?.pageData || [];
  const totalRows = apiData?.totalRows || 0;
  const totalPages = apiData?.totalPages || 0;

  const handleResetFilter = () => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setCurrentPage(0); // Reset to first page when clearing filters
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setItemsPerPage(size);
    setCurrentPage(0); // Reset to first page when page size changes
  };

  // Reset to first page when debounced search term changes
  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearchTerm]);

  // Render function for data table content
  const renderDataTableContent = () => {
    if (merchants.length === 0) {
      return (
        <EmptyState
          title="No Merchants Found"
          description="No merchants match your current search criteria. Try adjusting your search terms."
          actionButton={
            <Link href={ADMIN_MERCHANTS_ADD_URL}>
              <Button className="flex items-center gap-2 bg-theme-dark-green hover:bg-theme-dark-green/90 text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer">
                <Plus className="h-5 w-5" />
                Add Merchants
              </Button>
            </Link>
          }
        />
      );
    }

    return <DataTable columns={merchantColumns} data={merchants} />;
  };

  // Show loading state
  if (isPending) {
    return (
      <LoadingSpinner message="Loading All Merchants..." />
    );
  }

  // Show error state
  if (isError) {
    return (
      <ErrorState
        title="Error Loading Merchants"
        message={error?.message || "Failed to load merchants. Please try again."}
        retryText="Try Again"
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Header with Search and Filters */}
      <div className="p-6  border-gray-200">
        <div className="flex items-center justify-between mb-4">
          {/* Search Input */}
          <SearchInput
            placeholder="Search by name, email, or category..."
            value={searchTerm}
            onChange={setSearchTerm}
          />

          {/* Filter Buttons */}
          <div className="flex items-center gap-3">
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
      {merchants.length > 0 && (
        <DataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalRows={totalRows}
          pageSize={itemsPerPage}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
}