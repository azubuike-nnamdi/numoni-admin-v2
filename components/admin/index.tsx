'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { useGeneratePayOnUsToken } from '@/hooks/mutation/useGeneratePayOnUsToken';
import useGetAllDashboardDetails from '@/hooks/query/useGetAllDashboardDetails';
import { extractErrorMessage, formatValue } from '@/lib/helper';
import { Clock, Gift, Star, Store, Ticket, TrendingUp, Users, Wallet } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { MetricCard } from '../common/metric-card';
import ActiveUsersCard from './active-users-card';
import MostSupportedCharity from './most-supported-charity';
import TopPerformingMerchant from './top-performing-merchant';


export default function Admin() {
  const { handleGeneratePayOnUsToken } = useGeneratePayOnUsToken();
  const hasGeneratedPayOnUsToken = useRef(false);

  const { data: dashboardDetails, isPending: dashboardDetailsPending, error: dashboardDetailsError } = useGetAllDashboardDetails();
  const dashboardDetailsData = dashboardDetails?.data?.data;

  useEffect(() => {
    if (!hasGeneratedPayOnUsToken.current) {
      handleGeneratePayOnUsToken();
      hasGeneratedPayOnUsToken.current = true;
    }
  }, [handleGeneratePayOnUsToken]);

  const metrics = [
    {
      title: 'Total Customers',
      value: formatValue(dashboardDetailsData?.totalCustomers),
      changeType: 'positive' as const,
      icon: <Users className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-[#E3EAFD]',
      iconBgColor: 'bg-black'
    },
    {
      title: 'Total Merchants',
      value: formatValue(dashboardDetailsData?.totalMerchants),
      changeType: 'positive' as const,
      icon: <Store className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-[#DFFDDB]',
      iconBgColor: 'bg-black'
    },
    {
      title: 'Total NuMoni Points Top Up',
      value: formatValue(dashboardDetailsData?.TotalnuMoniPointTopup, true),
      changeType: 'positive' as const,
      icon: <Wallet className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-[#E3EAFD]',
      iconBgColor: 'bg-black'
    },
    {
      title: 'Total Brand Points Issued',
      value: formatValue(dashboardDetailsData?.totalBrandPointIssued, true),
      changeType: 'positive' as const,
      icon: <Star className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-[#FFFBDA]',
      iconBgColor: 'bg-black'
    },
    {
      title: 'Total Brand Points Redeemed',
      value: formatValue(dashboardDetailsData?.totalBrandPointRedeemed, true),
      changeType: 'positive' as const,
      icon: <Gift className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-[#FFFBDA]',
      iconBgColor: 'bg-black'
    },
    {
      title: 'Total NuMoni Points Spent',
      value: formatValue(dashboardDetailsData?.totalnuMoniPointsSpent, true),
      changeType: 'positive' as const,
      icon: <TrendingUp className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-[#DFFDDB]',
      iconBgColor: 'bg-black'
    },
    {
      title: 'Total NuMoni Bonus Given',
      value: formatValue(dashboardDetailsData?.TotalnuMoniBonusGiven, true),
      changeType: 'positive' as const,
      icon: <Gift className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-[#E3EAFD]',
      iconBgColor: 'bg-black'
    },
    {
      title: 'Total NuMoni Pending Points',
      value: formatValue(dashboardDetailsData?.totalnumoniPendingPoints, true),
      changeType: 'positive' as const,
      icon: <Clock className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-[#FFDADC]',
      iconBgColor: 'bg-black'
    },
    {
      title: 'Total Brand Points Pending',
      value: formatValue(dashboardDetailsData?.totalBrandPointPending, true),
      changeType: 'positive' as const,
      icon: <Clock className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-[#FFDADC]',
      iconBgColor: 'bg-black'
    },
    {
      title: 'Total Tickets',
      value: formatValue(dashboardDetailsData?.totalTickets),
      changeType: 'positive' as const,
      icon: <Ticket className="h-6 w-6 text-gray-200" />,
      bgColor: 'bg-[#FFDADC]',
      iconBgColor: 'bg-black'
    }
  ];

  return (
    <div className="p-3">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of your platform metrics and performance</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {metrics.map((metric, index) => {
          if (dashboardDetailsPending) {
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
              value={dashboardDetailsError ? extractErrorMessage(dashboardDetailsError) : metric.value}
              // change={metric.change}
              changeType={metric.changeType}
              icon={metric.icon}
              bgColor={metric.bgColor}
              iconBgColor={metric.iconBgColor}
            />
          );
        })}
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 my-4'>
        <ActiveUsersCard />
        <div className="flex flex-col gap-6">
          <TopPerformingMerchant />
          <MostSupportedCharity />
        </div>
      </div>
    </div>
  );
}