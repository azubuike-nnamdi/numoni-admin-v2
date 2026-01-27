"use client";

import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import useGerReviewsByMerchantId from "@/hooks/query/useGerReviewsByMerchantId";
import { extractErrorMessage } from "@/lib/helper";
import { Bell, Info } from "lucide-react";

interface ReportsSectionProps {
  reportsCompleted: number;
  totalReports: number;
  onNotifyMerchant?: () => void;
  merchantId: string;
}

export default function ReportsSection({
  reportsCompleted,
  totalReports,
  onNotifyMerchant,
  merchantId
}: ReportsSectionProps) {
  const { data: reportsData, isPending: isReportsPending, error, isError, refetch } = useGerReviewsByMerchantId({ merchantId });

  if (isReportsPending) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-6 w-20" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-10 w-36" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <ErrorState
          title="Error Loading Reports"
          message={extractErrorMessage(error) || "Failed to load reports data. Please try again."}
          onRetry={refetch}
          retryText="Retry"
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900">Reports</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>{reportsCompleted}/{totalReports}</span>
            <Info className="h-4 w-4 text-green-600" />
          </div>
        </div>

        <Button
          onClick={onNotifyMerchant}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Bell className="h-4 w-4 mr-2" />
          Notify Merchant
        </Button>
      </div>
    </div>
  );
}
