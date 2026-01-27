'use client';

import { MetricCard } from "@/components/common/metric-card";
import { Skeleton } from "@/components/ui/skeleton";
import useGetSignUpBonusStats from "@/hooks/query/useGetSignUpBonusStats";
import { formatValue } from "@/lib/helper";
import { Gift, User } from "lucide-react";
import ViewAllSignUpRequest from "./view-all-sign-up-request";

export default function Bonuses() {
  const { data, isPending, isError } = useGetSignUpBonusStats();


  const signUpBonusStats = data?.data?.data;

  const metrics = [
    {
      title: 'Total Amount Credited',
      value: formatValue(signUpBonusStats?.totalAmountCredited),
      icon: <Gift className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-[#E3EAFD]',
      iconBgColor: 'bg-black'
    },
    {
      title: 'Total User Received',
      value: formatValue(signUpBonusStats?.totalUsersReceived),
      icon: <User className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-[#FFDADC]',
      iconBgColor: 'bg-black'
    }
  ]

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => {
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
              value={isError ? 'Error' : metric.value}
              icon={metric.icon}
              bgColor={metric.bgColor}
              iconBgColor={metric.iconBgColor}
            />
          );
        })}
      </div>

      <ViewAllSignUpRequest />
    </div>
  )
}