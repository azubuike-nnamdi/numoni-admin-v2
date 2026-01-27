import { MetricCard } from "@/components/common/metric-card";
import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import useGetMerchantRewardPointById from "@/hooks/query/useGetMerchantRewardPointById";
import { extractErrorMessage } from "@/lib/helper";
import { Edit, Store } from "lucide-react";
import MerchantRuleCard from "./merchant-rule-card";
import MerchantRuleTable from "./merchant-rule-table";
import PointAllocationCard from "./point-allocation-card";


export default function MerchantRewardPoints({ merchantId, userId }: { merchantId: string, userId: string | null }) {
  const { data: rewardPointData, isPending: isRewardPointPending, isError: isRewardPointError, error: rewardPointError, refetch } = useGetMerchantRewardPointById({ merchantId });
  const rewardData = rewardPointData?.data?.data;


  const metrics = [
    {
      title: 'Total Points Earned',
      value: rewardData?.totalPointsEarned ?? 0,
      // change: '+55%',
      // changeType: 'positive' as const,
      icon: <Store className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-[#E3EAFD]',
      iconBgColor: 'bg-black'
    },
    {
      title: 'Total Points Redeemed',
      value: rewardData?.totalPointsRedeemed ?? 0,
      icon: <Store className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-[#FFFBDA]',
      iconBgColor: 'bg-black'
    },
    {
      title: 'Point Balance',
      value: rewardData?.pointsBalance ?? 0,
      icon: <Store className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-[#FFFBDA]',
      iconBgColor: 'bg-black'
    },
  ];

  return (
    <main>
      {/* reward overview */}
      <div className="bg-white rounded-lg border border-gray-100 ">
        <h3 className="text-lg font-semibold text-gray-900 p-4 ">Reward Overview</h3>
        <hr />

        <div className="p-4">
          {isRewardPointError ? (
            <ErrorState
              title="Error Loading Reward Points"
              message={extractErrorMessage(rewardPointError) || "Failed to load reward points. Please try again."}
              onRetry={refetch}
              retryText="Retry"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {metrics.map((metric, index) => {
                if (isRewardPointPending) {
                  return (
                    <div key={index} className={`${metric.bgColor} rounded-xl p-6 shadow-none border border-gray-100`}>
                      <div className="flex flex-col h-full">
                        {/* Icon Skeleton */}
                        <div className={`${metric.iconBgColor} p-3 rounded-lg w-12 h-12 flex items-center justify-center`}>
                          <Skeleton className="h-6 w-6 rounded" />
                        </div>

                        {/* Title Skeleton */}
                        <Skeleton className="h-4 w-32 mt-6 mb-3" />

                        {/* Value Skeleton */}
                        <div className="flex items-baseline gap-2 mt-auto">
                          <Skeleton className="h-8 w-24" />
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <MetricCard
                    key={index}
                    title={metric.title}
                    value={metric.value}
                    // change={metric.change}
                    // changeType={metric.changeType}
                    icon={metric.icon}
                    bgColor={metric.bgColor}
                    iconBgColor={metric.iconBgColor}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* reward insights and */}
      <div className="bg-white rounded-lg border border-gray-100 my-4">
        <div className="p-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 ">Reward Insights and Rules</h3>
          <div>
            <Button
              variant={"outline"}
              size="lg"
              className="mr-2 text-theme-dark-green border-none shadow-none">
              <Edit className="h-4 w-4" />
              Edit Section
            </Button>
            <Button variant="outline" size="lg"
              className="text-white border-none shadow-none bg-theme-dark-green">

              Add Rule
            </Button>
          </div>

        </div>
        <hr />
        {/* reward insights and rules table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          <MerchantRuleTable userId={userId} />
          <MerchantRuleCard userId={userId} />
        </div>
      </div>

      {/* points allocation */}
      <div className="bg-white rounded-lg border border-gray-100 my-4">
        <h3 className="text-lg font-semibold text-gray-900 p-4 ">Points Allocation</h3>
        <hr />

        <div className="p-4">
          <PointAllocationCard merchantId={merchantId} />
        </div>
      </div>
    </main>
  );
}