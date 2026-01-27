"use client";

import { ErrorState } from "@/components/ui/error-state";
import LoadingSpinner from "@/components/ui/loading-spinner";
import RuleCard from "@/components/ui/rule-card";
import useGetMerchantRewardById from "@/hooks/query/useGetMerchantRewardById";
import { extractErrorMessage, formatNumberWithCommas, formatRewardType } from "@/lib/helper";
import { RewardRuleApiResponse } from "@/lib/types";

export default function MerchantRuleCard({ userId }: { userId: string | null }) {
  const { data: rewardData, isPending: isRewardPending, isError: isRewardError, error: rewardError, refetch } = useGetMerchantRewardById({ userId });

  const apiResponse = rewardData?.data as RewardRuleApiResponse | undefined;

  if (isRewardPending) {
    return <LoadingSpinner message="Loading reward rules..." />;
  }

  if (isRewardError) {
    return (
      <ErrorState
        title="Error Loading Reward Rules"
        message={extractErrorMessage(rewardError) || "Failed to load reward rules. Please try again."}
        onRetry={refetch}
        retryText="Retry"
      />
    );
  }

  const ruleCards = [
    {
      title: "Percentage Deduction per transaction",
      value: `${apiResponse?.data?.PercentageDeductionpertransaction ?? 0}% (System)`,
      tooltip: "The percentage of each transaction that is deducted for the reward system"
    },
    {
      title: "How customer earn points",
      value: formatRewardType(apiResponse?.data?.rewardType ?? "N/A"),
      tooltip: "Customers earn points based on a percentage of their transaction amount"
    },
    {
      title: "How customer receive points",
      value: apiResponse?.data?.distributionType ?? "N/A",
      tooltip: "Points are credited to customer accounts immediately after transaction completion"
    },
    {
      title: "Reward Point Cap",
      value: formatNumberWithCommas(apiResponse?.data?.rewardCap ?? 0),
      tooltip: "Maximum number of points a customer can earn per transaction"
    },
    {
      title: "Milestone Target",
      value: formatNumberWithCommas(apiResponse?.data?.milestoneTarget ?? 0),
      tooltip: "Maximum number of reward points this brand can give out within a period"
    }
  ];

  return (
    <div className="space-y-4">
      {ruleCards.map((card, index) => (
        <RuleCard
          key={index}
          title={card.title}
          value={card.value}
          tooltip={card.tooltip}
        />
      ))}
    </div>
  );
}