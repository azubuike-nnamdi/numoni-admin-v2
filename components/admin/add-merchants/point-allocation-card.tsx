"use client";

import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import LoadingSpinner from "@/components/ui/loading-spinner";
import useGetMerchantPointsAllocatedById from "@/hooks/query/useGetMerchantPointsAllocatedById";
import { usePurchasesPagination } from "@/hooks/utils/usePurchasesPagination";
import { extractErrorMessage, formatDateReadable } from "@/lib/helper";
import { PointAllocationApiItem, PointAllocationApiResponse } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { createPointAllocationColumns, PointAllocation } from "./point-allocation-columns";

const ITEMS_PER_PAGE = 20;

export default function PointAllocationCard({ merchantId }: { readonly merchantId: string }) {
  const [currentPage, setCurrentPage] = useState(0);
  const [localAllocations, setLocalAllocations] = useState<Map<string, Partial<PointAllocation>>>(new Map());

  const { data: pointsAllocatedData, isPending: isPointsAllocatedPending, isError: isPointsAllocatedError, error: pointsAllocatedError, refetch } = useGetMerchantPointsAllocatedById({
    merchantId,
    page: currentPage,
    size: ITEMS_PER_PAGE,
  });

  // Extract data from API response
  const apiData = pointsAllocatedData?.data as PointAllocationApiResponse | undefined;
  const pagination = apiData?.pagination;

  // Get pagination info from API response
  const totalRows = pagination?.totalElements || 0;
  const totalPages = pagination?.totalPages || 0;

  // Map API data to PointAllocation format using useMemo
  const allocations = useMemo(() => {
    const apiAllocations = apiData?.data;
    if (!Array.isArray(apiAllocations)) return [];

    return apiAllocations.map((item: PointAllocationApiItem) => {
      const id = item.customerCode || String(Math.random());

      // Format expireDate from ISO string to readable format
      const expiresOn = item.expireDate ? formatDateReadable(item.expireDate) : "N/A";

      const baseAllocation: PointAllocation = {
        id,
        name: item.customerName || "N/A",
        userId: item.customerCode || "#N/A",
        pointBalance: item.pointBalance || 0,
        expiresOn,
        location: item.location || "N/A",
      };

      // Apply local updates if any
      const localUpdate = localAllocations.get(id);
      return localUpdate ? { ...baseAllocation, ...localUpdate } : baseAllocation;
    });
  }, [pointsAllocatedData?.data?.data, localAllocations]);

  const handleEditExpiry = (id: string, data: { expiryDate: Date; reason: string }) => {
    setLocalAllocations(prev => {
      const newMap = new Map(prev);
      newMap.set(id, {
        expiresOn: data.expiryDate.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        })
      });
      return newMap;
    });
    // TODO: Call API to update expiry date
    refetch();
  };

  const handleEditPoints = (id: string, data: { newPoints: number; expiryDate: Date; reason: string }) => {
    setLocalAllocations(prev => {
      const newMap = new Map(prev);
      newMap.set(id, {
        pointBalance: data.newPoints,
        expiresOn: data.expiryDate.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        })
      });
      return newMap;
    });
    // TODO: Call API to update points
    refetch();
  };

  const { startIndex, endIndex, handlePreviousPage, handleNextPage } = usePurchasesPagination(
    currentPage,
    totalRows,
    ITEMS_PER_PAGE,
    totalPages,
    setCurrentPage
  );

  const columns = createPointAllocationColumns({
    onEditExpiry: handleEditExpiry,
    onEditPoints: handleEditPoints,
    currentPage,
    pageSize: ITEMS_PER_PAGE,
  });

  if (isPointsAllocatedPending) {
    return <LoadingSpinner message="Loading points allocated..." />;
  }

  if (isPointsAllocatedError) {
    return (
      <ErrorState
        title="Error Loading Points Allocated"
        message={extractErrorMessage(pointsAllocatedError) || "Failed to load points allocated. Please try again."}
        onRetry={refetch}
        retryText="Retry"
      />
    );
  }

  return (
    <div className="w-full">
      {/* Data Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {allocations.length === 0 ? (
          <EmptyState
            title="No Points Allocated"
            description={apiData?.message || "No points allocation records found for this merchant."}
          />
        ) : (
          <>
            <div className="p-0">
              <DataTable columns={columns} data={allocations} />
            </div>

            {/* Pagination */}
            {totalRows > 0 && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {startIndex + 1}-{Math.min(endIndex, totalRows)} of {totalRows}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage === 0}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm text-gray-600 px-3">
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
          </>
        )}
      </div>
    </div>
  );
}
