'use client'
import { MetricCard } from "@/components/common/metric-card";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import useGetPurchaseOverview from "@/hooks/query/useGetPurchaseOverview";
import { extractErrorMessage, formatValue } from "@/lib/helper";
import { Banknote, CheckCircle, Clock, Gift, ShoppingCart, StoreIcon, TrendingUp } from "lucide-react";
import { PurchasesTable } from "./purchases-table";

export function PurchaseOverview() {
  const { isPending, data, error, isError, refetch } = useGetPurchaseOverview();

  const purchaseOverview = data?.data?.data;


  const purchaseMetrics = [
    {
      title: 'Merchant Patronised',
      value: purchaseOverview?.merchantPatronised ?? 0,
      icon: <StoreIcon className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-[#E3EAFD]',
      iconBgColor: 'bg-black'
    },
    {
      title: 'Total Point Earned',
      value: formatValue(purchaseOverview?.totalPointEarned, true) ?? 0,
      icon: <TrendingUp className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-[#DFFDDB]',
      iconBgColor: 'bg-black'
    },
    {
      title: 'Number of Purchase',
      value: purchaseOverview?.numberofPurchase ?? 0,
      icon: <ShoppingCart className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-[#E3EAFD]',
      iconBgColor: 'bg-black'
    },
    {
      title: 'Total Purchase',
      value: formatValue(purchaseOverview?.totalPurchase, true) ?? 0,
      icon: <Banknote className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-[#DFFDDB]',
      iconBgColor: 'bg-black'
    },
    {
      title: 'Pending Payout',
      value: formatValue(purchaseOverview?.PendingPayout, true) ?? 0,
      icon: <Clock className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-[#E3EAFD]',
      iconBgColor: 'bg-black'
    },
    {
      title: 'Total Point Redeemed',
      value: formatValue(purchaseOverview?.totalPointRedeemed, true) ?? 0,
      icon: <Gift className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-[#DFFDDB]',
      iconBgColor: 'bg-black'
    },
    {
      title: 'Number of Settled',
      value: purchaseOverview?.Settled ?? 0,
      icon: <CheckCircle className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-[#E3EAFD]',
    }
  ]
  return (
    <section>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Purchases Overview</h1>
        <p className="text-gray-600">Overview of your platform metrics and performance</p>
      </div>

      {/* Purchase Metrics */}
      {isError ? (
        <ErrorState
          title="Error Loading Purchase Overview"
          message={extractErrorMessage(error) || "Failed to load purchase overview. Please try again."}
          onRetry={refetch}
          retryText="Retry"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
          {purchaseMetrics.map((metric, index) => {
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
                bgColor={metric.bgColor}
                iconBgColor={metric.iconBgColor ?? 'bg-black'}
              />
            );
          })}
        </div>
      )}

      {/* Purchases Table */}
      <PurchasesTable />
    </section>
  )
}