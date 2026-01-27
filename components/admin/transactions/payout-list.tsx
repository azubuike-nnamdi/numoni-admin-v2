'use client'

import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { ErrorState } from "@/components/ui/error-state";
import LoadingSpinner from "@/components/ui/loading-spinner";
import useGetPayoutList from "@/hooks/query/useGetPayoutList";
import { usePayoutFilters } from "@/hooks/utils/usePayoutFilters";
import { extractErrorMessage } from "@/lib/helper";
import { Payout } from "@/lib/types";
import { useState } from "react";
import { payoutColumns } from './payout-column';
import PayoutDataSection from './payout-data-section';
import PayoutHeaderSection from './payout-header-section';

export default function PayoutList() {
  const {
    filters,
    debouncedFilters,
    setFilter,
    resetFilters,
    currentPage,
    setCurrentPage,
    showFilters,
    toggleFilters,
  } = usePayoutFilters();

  const [pageSize, setPageSize] = useState(20);

  const { data, isPending, error, isError, refetch } = useGetPayoutList({
    page: currentPage,
    size: pageSize,
    merchantId: debouncedFilters.merchantId.trim() || undefined,
    settlementRefId: debouncedFilters.settlementRefId.trim() || undefined,
    payonusRefId: debouncedFilters.payonusRefId.trim() || undefined,
    status: debouncedFilters.status.trim() || undefined,
    startDate: debouncedFilters.startDate.trim() || undefined,
    endDate: debouncedFilters.endDate.trim() || undefined,
  });

  // Extract payout data from API response
  const apiData = data?.data;
  const pagination = apiData?.pagination;
  const payouts: Payout[] = apiData?.data || [];

  // Get pagination info from API response
  const totalRows = pagination?.totalElements || payouts.length;
  const totalPages = pagination?.totalPages || Math.ceil(totalRows / pageSize);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(0);
  };

  if (isPending) {
    return <LoadingSpinner message="Loading payout records..." />
  }

  if (isError) {
    return <ErrorState title="Error Loading Payout Records" message={extractErrorMessage(error) || "Failed to load payout records. Please try again."} onRetry={refetch} retryText="Retry" />
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mt-8">
      <PayoutHeaderSection
        merchantId={filters.merchantId}
        onMerchantIdChange={(value) => setFilter('merchantId', value)}
        settlementRefId={filters.settlementRefId}
        onSettlementRefIdChange={(value) => setFilter('settlementRefId', value)}
        payonusRefId={filters.payonusRefId}
        onPayonusRefIdChange={(value) => setFilter('payonusRefId', value)}
        status={filters.status}
        onStatusChange={(value) => setFilter('status', value)}
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

      <PayoutDataSection data={payouts} columns={payoutColumns} />

      {payouts?.length > 0 && (
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