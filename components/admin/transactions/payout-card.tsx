'use client'

import { MetricCard } from "@/components/common/metric-card";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import useGetSettlementOverview from "@/hooks/query/useGetSettlementOverview";
import { extractErrorMessage, formatValue } from "@/lib/helper";
import { Banknote, CircleX, Clock, TrendingUp } from "lucide-react";

export function PayoutCard() {
  const { data, isPending, error, isError, refetch } = useGetSettlementOverview();
  const settlementOverview = data?.data?.data;

  const settlementMetrics = [
    {
      title: 'Total Commission Payout',
      value: formatValue(settlementOverview?.TotalCommissionPayout ?? 0, true),
      icon: <Banknote className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-white',
      iconBgColor: 'bg-black'
    },
    {
      title: 'Total Fees',
      value: formatValue(settlementOverview?.TotalFees ?? 0, true),
      icon: <TrendingUp className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-white',
      iconBgColor: 'bg-black'
    },
    {
      title: 'Commission Payout Count',
      value: settlementOverview?.countofCommissionPayout ?? 0,
      icon: <Banknote className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-white',
      iconBgColor: 'bg-black'
    },
    {
      title: 'Total Merchant Payout',
      value: formatValue(settlementOverview?.TotalMerchantPayout ?? 0, true),
      icon: <Banknote className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-white',
      iconBgColor: 'bg-black'
    },
    {
      title: 'Merchant Payout Count',
      value: settlementOverview?.countofMerchantPayout ?? 0,
      icon: <Banknote className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-white',
      iconBgColor: 'bg-black'
    },
    {
      title: 'Pending Payout',
      value: settlementOverview?.PendingPayout ?? 0,
      icon: <Clock className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-white',
      iconBgColor: 'bg-black'
    },
    {
      title: 'Failed Payout',
      value: settlementOverview?.FailedPayoutCount ?? 0,
      icon: <CircleX className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-white',
      iconBgColor: 'bg-black'
    }
  ]

  // Show error state if there's an error
  if (isError) {
    return (
      <main>
        <ErrorState
          title="Error Loading Settlement Overview"
          message={extractErrorMessage(error) || "Failed to load settlement overview. Please try again."}
          onRetry={refetch}
          retryText="Retry"
        />
      </main>
    );
  }

  return (
    <main>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
        {settlementMetrics.map((metric, index) => {
          if (isPending) {
            return (
              <div key={index} className="bg-white rounded-xl p-4 border border-gray-100">
                <Skeleton className="h-4 w-24 mb-3" />
                <Skeleton className="h-8 w-32" />
              </div>
            );
          }

          return (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              // change={metric.change}
              icon={metric.icon}
              bgColor={metric?.bgColor ?? 'bg-white'}
              iconBgColor={metric.iconBgColor ?? 'bg-black'}
            />
          );
        })}
      </div>
    </main>
  )
}