'use client'

import { DataTablePagination } from "@/components/ui/data-table-pagination";
import { ErrorState } from "@/components/ui/error-state";
import LoadingSpinner from "@/components/ui/loading-spinner";
import useGetCustomerSharedPoint from "@/hooks/query/useGetCustomerSharedPoint";
import { extractErrorMessage } from "@/lib/helper";
import { useState } from "react";
import { PointsTransactionData, pointsColumns } from './points-columns';
import PointsDataSection from './points-data-section';

export default function PointsTable() {
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);

  const { data, isPending, error, isError, refetch } = useGetCustomerSharedPoint({
    page: currentPage,
    size: pageSize,
  });

  // Extract points data from API response
  const apiData = data?.data?.data;
  const points: PointsTransactionData[] = apiData?.pageData || [];
  const totalRows = apiData?.totalElements || points.length;
  const totalPages = apiData?.totalPages || Math.ceil(totalRows / pageSize);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(0);
  };

  if (isPending) {
    return <LoadingSpinner message="Loading customer shared points..." />;
  }

  if (isError) {
    return (
      <ErrorState
        title="Error Loading Customer Shared Points"
        message={extractErrorMessage(error) || "Failed to load customer shared points. Please try again."}
        onRetry={refetch}
        retryText="Retry"
      />
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden mt-8">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">Points Transactions</h1>
      </div>

      <PointsDataSection data={points} columns={pointsColumns} />

      {points?.length > 0 && (
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
  );
}