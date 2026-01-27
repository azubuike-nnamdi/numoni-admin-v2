"use client";

import SearchInput from "@/components/common/search-input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { ErrorState } from "@/components/ui/error-state";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useGetDealList from "@/hooks/query/useGetDealList";
import { useDebounce } from "@/hooks/utils/useDebounce";
import { DealData } from "@/lib/types";
import { format } from "date-fns";
import { Calendar as CalendarIcon, RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";
import DealsTableContent from "./deals-table-content";

export default function AllDealsData() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(20);

  // Debounce search term to avoid too many API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(0);
  }, [debouncedSearchTerm, statusFilter, startDate, endDate]);

  // Map status filter to API format
  const apiStatus = statusFilter === "all" ? undefined : statusFilter.toUpperCase();

  // Format dates to dd-MM-yyyy for API
  const formattedStartDate = startDate ? format(startDate, "dd-MM-yyyy") : undefined;
  const formattedEndDate = endDate ? format(endDate, "dd-MM-yyyy") : undefined;

  const { data, isPending, isError, error, refetch } = useGetDealList({
    page,
    size,
    dealName: debouncedSearchTerm || undefined,
    status: apiStatus,
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  });

  // Extract pagination data from API response
  const apiResponse = data?.data?.data;
  const dealsData = apiResponse?.pageData as DealData[] | undefined;
  const totalRows = apiResponse?.totalRows || 0;
  const totalPages = apiResponse?.totalPages || 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setSize(newSize);
    setPage(0);
  };

  const handleResetFilter = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setStartDate(null);
    setEndDate(null);
    setPage(0);
  };

  // Show loading state
  if (isPending) {
    return <LoadingSpinner message="Loading Deals and Promo..." />;
  }

  // Show error state
  if (isError) {
    return (
      <div className="bg-white rounded-lg">
        <div className="p-6">
          <ErrorState
            title="Error Loading Deals"
            message={error?.message || "Failed to load deals. Please try again."}
            onRetry={refetch}
            retryText="Try Again"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg">
      {/* Header with search and filters */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col gap-4">
          {/* First Row: Search and Status Filter */}
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex-1 max-w-md">
              <SearchInput
                placeholder="Search deals, merchants, or categories..."
                value={searchTerm}
                onChange={setSearchTerm}
              />
            </div>

            {/* Second Row: Date Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {/* Date Range Filters */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full sm:w-[180px] justify-start text-left font-normal h-10"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "dd/MM/yyyy") : "Select start date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate || undefined}
                        onSelect={(date) => setStartDate(date || null)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full sm:w-[180px] justify-start text-left font-normal h-10"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "dd/MM/yyyy") : "Select end date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate || undefined}
                        onSelect={(date) => setEndDate(date || null)}
                        disabled={(date) => startDate ? date < startDate : false}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="hidden">Hidden</option>
                <option value="pending">Pending</option>
                <option value="open">Open</option>
              </select>

              <Button
                variant="outline"
                size="sm"
                onClick={handleResetFilter}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Filter
              </Button>
            </div>
          </div>


        </div>
      </div>

      {/* Data Table */}
      <DealsTableContent
        dealsData={dealsData}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
      />

      {/* Pagination Controls */}
      {dealsData && dealsData?.length > 0 && (
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