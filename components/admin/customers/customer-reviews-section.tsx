"use client";

import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import useGetCustomerReviewsById from "@/hooks/query/useGetCustomerReviesById";
import { extractErrorMessage } from "@/lib/helper";
import { useState } from "react";
import CustomerReviewTable from "./customer-review-table";

interface CustomerReviewsSectionProps {
  customerId: string;
  onHideReview?: (id: string) => void;
  onDeleteReview?: (id: string) => void;
}

export default function CustomerReviewsSection({
  customerId,
  onHideReview,
  onDeleteReview
}: CustomerReviewsSectionProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  const { data: reviewsData, isPending: isReviewsPending, error, isError, refetch } = useGetCustomerReviewsById({
    customerId,
    page: currentPage,
    size: itemsPerPage,
    sort: ["createdDt,desc"]
  });

  const reviews = reviewsData?.data?.data?.pageData || reviewsData?.data?.data || [];
  const totalRows = reviewsData?.data?.data?.totalRows || reviews.length;
  const totalPages = reviewsData?.data?.data?.totalPages || Math.ceil(totalRows / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isReviewsPending) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <Skeleton className="h-7 w-24 mb-4" />
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <ErrorState
          title="Error Loading Reviews"
          message={extractErrorMessage(error) || "Failed to load reviews. Please try again."}
          onRetry={refetch}
          retryText="Retry"
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Reviews</h3>
      {reviews.length > 0 ? (
        <CustomerReviewTable
          reviews={reviews}
          currentPage={currentPage}
          pageSize={itemsPerPage}
          totalRows={totalRows}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      ) : (
        <EmptyState
          title="No Reviews Available"
          description="This customer hasn't submitted any reviews yet."
        />
      )}
    </div>
  );
}
