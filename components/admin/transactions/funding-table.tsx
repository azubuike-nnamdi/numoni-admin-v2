'use client'

import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { ErrorState } from "@/components/ui/error-state";
import LoadingSpinner from "@/components/ui/loading-spinner";
import useGetFundingReconciliation from "@/hooks/query/useGetFundingReconciliation";
import { useFundingFilters } from "@/hooks/utils/useFundingFilters";
import { extractErrorMessage } from "@/lib/helper";
import { FundingReconciliation } from "@/lib/types";
import { useState } from "react";
import { fundingColumns } from './funding-column';
import FundingDataSection from './funding-data-section';
import FundingHeaderSection from './funding-header-section';

export default function FundingTable() {
  const {
    filters,
    debouncedFilters,
    setFilter,
    resetFilters,
    currentPage,
    setCurrentPage,
    showFilters,
    toggleFilters,
  } = useFundingFilters();

  const [pageSize, setPageSize] = useState(20);

  const { data, isPending, error, isError, refetch } = useGetFundingReconciliation({
    page: currentPage,
    size: pageSize,
    sessionId: debouncedFilters.sessionId.trim() || undefined,
    providerId: debouncedFilters.providerId.trim() || undefined,
    senderName: debouncedFilters.senderName.trim() || undefined,
    customerId: debouncedFilters.customerId.trim() || undefined,
    startDate: debouncedFilters.startDate.trim() || undefined,
    endDate: debouncedFilters.endDate.trim() || undefined,
  });

  // Extract funding data from API response
  const apiResponse = data?.data;

  // Extract pagination info
  const pagination = apiResponse?.pagination;
  const funding: FundingReconciliation[] = apiResponse?.data || [];

  // Get pagination values from API response
  const totalRows = pagination?.totalElements || funding.length;
  const totalPages = pagination?.totalPages || Math.ceil(totalRows / pageSize);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(0);
  };

  if (isPending) {
    return <LoadingSpinner message="Loading funding records..." />
  }

  if (isError) {
    return <ErrorState title="Error Loading Funding Records" message={extractErrorMessage(error) || "Failed to load funding records. Please try again."} onRetry={refetch} retryText="Retry" />
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mt-8">
      <FundingHeaderSection
        customerId={filters.customerId}
        onCustomerIdChange={(value) => setFilter('customerId', value)}
        sessionId={filters.sessionId}
        onSessionIdChange={(value) => setFilter('sessionId', value)}
        providerId={filters.providerId}
        onProviderIdChange={(value) => setFilter('providerId', value)}
        senderName={filters.senderName}
        onSenderNameChange={(value) => setFilter('senderName', value)}
        startDate={filters.startDate}
        onStartDateChange={(value) => setFilter('startDate', value)}
        endDate={filters.endDate}
        onEndDateChange={(value) => setFilter('endDate', value)}
        dateRangeOption={filters.dateRangeOption}
        onDateRangeOptionChange={(value) => setFilter('dateRangeOption', value)}
        onResetFilter={resetFilters}
        showFilters={showFilters}
        onToggleFilters={toggleFilters}
      />

      <FundingDataSection data={funding} columns={fundingColumns} />

      {funding?.length > 0 && (
        <DataTablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalRows={totalRows}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  )
}