"use client";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useGetMerchantRewardById from "@/hooks/query/useGetMerchantRewardById";
import { extractErrorMessage } from "@/lib/helper";
import { MerchantRewardRule, RewardData, RewardRuleApiItem, RewardRuleApiResponse } from "@/lib/types";
import { useMemo } from "react";



export default function MerchantRuleTable({ userId }: { userId: string | null }) {
  const { data: rewardData, isPending: isRewardPending, isError: isRewardError, error: rewardError, refetch } = useGetMerchantRewardById({ userId });

  // Extract data from API response
  // rewardData is the axios response, so rewardData?.data is the API response object
  const apiResponse = rewardData?.data as RewardRuleApiResponse | undefined;
  const rewardDataInner = apiResponse?.data as RewardData | undefined;
  const apiRules = Array.isArray(rewardDataInner?.rules) ? rewardDataInner.rules : [];

  // Map API data to RewardRule format
  const rewardRules = useMemo(() => {
    if (!Array.isArray(apiRules)) return [];

    return apiRules.map((item: RewardRuleApiItem, index: number): MerchantRewardRule => ({
      id: String(index + 1),
      minSpend: item.minSpend ?? 0,
      maxSpend: item.maxSpend ?? 0,
      rewardValue: item.rewardValue ?? 0,
    }));
  }, [apiRules]);

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

  if (rewardRules.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <EmptyState
          title="No Reward Rules"
          description={apiResponse?.message || "No reward rules found for this merchant."}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Table */}
      <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
        <Table>
          <TableHeader className="sticky top-0 bg-gray-50 z-10">
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-900">Min Spend</TableHead>
              <TableHead className="font-semibold text-gray-900">Max Spend</TableHead>
              <TableHead className="font-semibold text-gray-900">Reward Percentage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rewardRules.map((rule) => (
              <TableRow key={rule.id} className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-900">
                  {rule.minSpend}
                </TableCell>
                <TableCell className="text-gray-900">
                  {rule.maxSpend}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {rule.rewardValue}%
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}