'use client'

import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { ErrorState } from "@/components/ui/error-state";
import LoadingSpinner from "@/components/ui/loading-spinner";
import useGetAdminPurchases from "@/hooks/query/useGetAdminPurchases";
import { usePurchasesFilters } from "@/hooks/utils/usePurchasesFilters";
import { extractErrorMessage } from "@/lib/helper";
import { useState } from "react";
import { PurchaseData, purchasesColumns } from './purchases-columns';
import PurchasesDataSection from './purchases-data-section';
import PurchasesHeaderSection from './purchases-header-section';

export function PurchasesTable() {
  const {
    filters,
    debouncedFilters,
    setFilter,
    resetFilters,
    currentPage,
    setCurrentPage,
    showFilters,
    toggleFilters,
  } = usePurchasesFilters();

  const [pageSize, setPageSize] = useState(20);

  const { data, isPending, error, isError, refetch } = useGetAdminPurchases({
    page: currentPage,
    size: pageSize,
    customerName: debouncedFilters.customerName.trim() || undefined,
    dealName: debouncedFilters.dealName.trim() || undefined,
    transactionId: debouncedFilters.transactionId.trim() || undefined,
    dealId: debouncedFilters.dealId.trim() || undefined,
    purchaseId: debouncedFilters.purchaseId.trim() || undefined,
    startDate: debouncedFilters.startDate.trim() || undefined,
    endDate: debouncedFilters.endDate.trim() || undefined,
  });

  // Extract purchase data from API response
  const apiData = data?.data;
  const pagination = apiData?.pagination;
  const purchases: PurchaseData[] = apiData?.data || [];

  const totalRows = pagination?.totalElements || purchases.length;
  const totalPages = pagination?.totalPages || Math.ceil(totalRows / pageSize);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(0);
  };

  if (isPending) {
    return <LoadingSpinner message="Loading purchases..." />
  }

  if (isError) {
    return <ErrorState title="Error Loading Purchases" message={extractErrorMessage(error) || "Failed to load purchases. Please try again."} onRetry={refetch} retryText="Retry" />
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mt-8">
      <PurchasesHeaderSection
        customerName={filters.customerName}
        onCustomerNameChange={(value) => setFilter('customerName', value)}
        dealName={filters.dealName}
        onDealNameChange={(value) => setFilter('dealName', value)}
        transactionId={filters.transactionId}
        onTransactionIdChange={(value) => setFilter('transactionId', value)}
        dealId={filters.dealId}
        onDealIdChange={(value) => setFilter('dealId', value)}
        purchaseId={filters.purchaseId}
        onPurchaseIdChange={(value) => setFilter('purchaseId', value)}
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

      <PurchasesDataSection data={purchases} columns={purchasesColumns} />

      {purchases?.length > 0 && (
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