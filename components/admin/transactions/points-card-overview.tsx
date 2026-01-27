'use client'

import { MetricCard } from "@/components/common/metric-card";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import useGetSharedPointsOverview from "@/hooks/query/useGetSharedPointsOverview";
import { extractErrorMessage, formatValue } from "@/lib/helper";
import { Banknote, TrendingDown, TrendingUp, UserPlus, Users } from "lucide-react";

export default function PointsCardOverview() {
  const { data, isPending, error, isError, refetch } = useGetSharedPointsOverview();
  const sharedPointsOverview = data?.data?.data;

  const sharedPointsMetrics = [
    {
      title: "Total Credits",
      value: sharedPointsOverview?.totalCredits ?? 0,
      icon: <TrendingUp className="h-6 w-6 text-white" />,
      bgColor: "bg-white",
      iconBgColor: "bg-black"
    },
    {
      title: "Total Debits",
      value: sharedPointsOverview?.totalDebits ?? 0,
      icon: <TrendingDown className="h-6 w-6 text-white" />,
      bgColor: "bg-white",
      iconBgColor: "bg-black"
    },
    {
      title: "Total Share Money Credit",
      value: formatValue(sharedPointsOverview?.totalShareMoneyCredit, true) ?? 0,
      icon: <Banknote className="h-6 w-6 text-white" />,
      bgColor: "bg-white",
      iconBgColor: "bg-black"
    },
    {
      title: "Total Share Money Debit",
      value: formatValue(sharedPointsOverview?.totalShareMoneyDebit, true) ?? 0,
      icon: <Banknote className="h-6 w-6 text-white" />,
      bgColor: "bg-white",
      iconBgColor: "bg-black"
    },
    {
      title: "Total Send Users",
      value: sharedPointsOverview?.totalSendUsers ?? 0,
      icon: <Users className="h-6 w-6 text-white" />,
      bgColor: "bg-white",
      iconBgColor: "bg-black"
    },
    {
      title: "Total Receive Users",
      value: sharedPointsOverview?.totalReceiveUsers ?? 0,
      icon: <UserPlus className="h-6 w-6 text-white" />,
      bgColor: "bg-white",
      iconBgColor: "bg-black"
    }
  ];

  // Show error state if there's an error
  if (isError) {
    return (
      <div className="mb-8">
        <ErrorState
          title="Error Loading Shared Points Overview"
          message={extractErrorMessage(error) || "Failed to load shared points overview. Please try again."}
          onRetry={refetch}
          retryText="Retry"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-8">
      {sharedPointsMetrics.map((metric, index) => {
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