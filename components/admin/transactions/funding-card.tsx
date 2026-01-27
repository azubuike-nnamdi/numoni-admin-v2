'use client'

import { MetricCard } from "@/components/common/metric-card";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import useGetFundingOverview from "@/hooks/query/useGetFundingOverview";
import { extractErrorMessage, formatValue } from "@/lib/helper";
import { Banknote, Gift, ShoppingCart, TrendingUp } from "lucide-react";

export default function FundingCard() {
  const { data, isPending, error, isError, refetch } = useGetFundingOverview();
  const fundingOverview = data?.data?.data;

  const fundingMetrics = [
    {
      title: "Total Funding",
      value: formatValue(fundingOverview?.TotalAmountPaid, true) ?? 0,
      icon: <Banknote className="h-6 w-6 text-white" />,
      bgColor: "bg-white",
      iconBgColor: "bg-black"
    },
    {
      title: "Number of Funding",
      value: fundingOverview?.NumberOfFunding ?? 0,
      icon: <ShoppingCart className="h-6 w-6 text-white" />,
      bgColor: "bg-white",
      iconBgColor: "bg-black"
    },
    {
      title: "Total Fees",
      value: formatValue(fundingOverview?.TotalFees, false) ?? 0,
      icon: <TrendingUp className="h-6 w-6 text-white" />,
      bgColor: "bg-white",
      iconBgColor: "bg-black"
    },
    {
      title: "Bonus Issued",
      value: formatValue(fundingOverview?.TotalBonusIssued, true) ?? 0,
      icon: <Gift className="h-6 w-6 text-white" />,
      bgColor: "bg-white",
      iconBgColor: "bg-black"
    }
  ];

  // Show error state if there's an error
  if (isError) {
    return (
      <div className="mb-8">
        <ErrorState
          title="Error Loading Funding Overview"
          message={extractErrorMessage(error) || "Failed to load funding overview. Please try again."}
          onRetry={refetch}
          retryText="Retry"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-8">
      {fundingMetrics.map((metric, index) => {
        // Show skeleton loading state
        if (isPending) {
          return (
            <div key={index} className="bg-white rounded-xl p-4 border border-gray-100">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-32" />
            </div>
          );
        }

        // Show metric card with data
        return (
          <MetricCard
            key={index}
            title={metric.title}
            value={String(metric.value)}
            icon={metric.icon}
            bgColor={metric.bgColor}
            iconBgColor={metric.iconBgColor ?? 'bg-black'}
          />
        );
      })}
    </div>
  );
}