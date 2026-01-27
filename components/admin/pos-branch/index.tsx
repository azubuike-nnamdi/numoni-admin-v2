'use client';

import SearchInput from "@/components/common/search-input";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { ErrorState } from "@/components/ui/error-state";
import LoadingSpinner from "@/components/ui/loading-spinner";
import useGetAllPos from "@/hooks/query/useGetAllPos";
import { useDebounce } from "@/hooks/utils/useDebounce";
import { useEffect, useState } from "react";
import PosTable from "./pos-table";

export default function PosBranch() {


  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(0);
  }, [debouncedSearchTerm]);


  const { data: posList, isPending: isPosListPending, error: posListError, isError: isPosListError, refetch: refetchPosList } = useGetAllPos({
    page,
    size,
    searchTerm: debouncedSearchTerm,
  });

  const posData = posList?.data?.data?.pageData || [];

  const totalPages = posList?.data?.data?.totalPages || 0;
  const totalRows = posList?.data?.data?.totalItems || 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setSize(newSize);
    setPage(0); // Reset to first page when page size changes
  };

  if (isPosListPending) return <LoadingSpinner message="Loading POS List..." />;

  if (isPosListError) return <ErrorState title="Error Loading POS List" message={posListError?.message || "Failed to load POS list. Please try again."} onRetry={refetchPosList} retryText="Retry" />;

  return (
    <div className="bg-white rounded-lg">

      {/* Header with search and filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col gap-4">
          {/* First Row: Search and Status Filter */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md">
              <SearchInput
                placeholder="Search POS Branch Id or Merchant Id"
                value={searchTerm}
                onChange={setSearchTerm}
              />
            </div>

          </div>

        </div>
      </div>

      <PosTable posData={posData} searchTerm={searchTerm} />


      {posData && posData?.length > 0 && (
        <DataTablePagination
          currentPage={page}
          totalPages={totalPages}
          totalRows={totalRows}
          pageSize={size}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
}