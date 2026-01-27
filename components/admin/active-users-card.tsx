'use client';

import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useGetDashboardInfo from '@/hooks/query/useGetDashboardInfo';
import { getDateRange } from '@/lib/helper';
import { ChartDataPoint, DashboardMetrics, MetricItem } from '@/lib/types';
import { ShoppingCart, Ticket, Users } from 'lucide-react';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import LoadingSpinner from '../ui/loading-spinner';


const chartConfig = {
  users: {
    label: "Active Users",
    color: "#10b981"
  }
};

const getMetrics = (dashboardData: DashboardMetrics | null): MetricItem[] => {
  if (!dashboardData) {
    return [
      { label: 'Customers', value: '0', icon: Users, progress: 0 },
      { label: 'Merchants', value: '0', icon: ShoppingCart, progress: 0 },
      { label: 'Tickets', value: '0', icon: Ticket, progress: 0 }
    ];
  }

  return [
    { label: 'Customers', value: String(dashboardData.customers?.totalCustomers || 0), icon: Users, progress: 75 },
    { label: 'Merchants', value: String(dashboardData.merchants?.totalMerchants || 0), icon: ShoppingCart, progress: 35 },
    { label: 'Tickets', value: String(dashboardData.tickets?.totalTickets || 0), icon: Ticket, progress: 65 }
  ];
};

export default function ActiveUsersCard() {
  // Manage the active tab state internally
  const [activeTab, setActiveTab] = useState('weekly');

  // Get date range based on active tab
  const { fromDate, toDate } = getDateRange(activeTab);

  // Fetch dashboard info based on the active tab
  const { data: dashboardInfo, isPending: dashboardInfoPending } = useGetDashboardInfo({ fromDate, toDate });

  // Transform API data into chart format
  const transformDataForChart = (): ChartDataPoint[] => {
    if (!dashboardInfo?.data?.data) return [];

    const data = dashboardInfo.data.data as DashboardMetrics;

    // Return key metrics from merchants, customers, and tickets
    return [
      // Merchants metrics
      { period: 'Merchant Credit', value: data.merchants?.totalCredit || 0 },
      { period: 'New Merchants', value: data.merchants?.newMerchants || 0 },
      { period: 'Total Sales', value: data.merchants?.totalSales || 0 },
      { period: 'Total PayOut', value: data.merchants?.totalPayOut || 0 },
      { period: 'Total Merchants', value: data.merchants?.totalMerchants || 0 },

      // Customers metrics
      { period: 'Total Load Money', value: data.customers?.totalLoadMoney || 0 },
      { period: 'Total Bonus', value: data.customers?.totalBonus || 0 },
      { period: 'Total Customers', value: data.customers?.totalCustomers || 0 },
      { period: 'Customer Credit', value: data.customers?.totalCredit || 0 },
      { period: 'Active Customers', value: data.customers?.activeCustomers || 0 },
      { period: 'Total Debit', value: data.customers?.totalDebit || 0 },
      { period: 'Total Purchase', value: data.customers?.totalPurchase || 0 },

      // Tickets metrics
      { period: 'Processing Tickets', value: Number(data.tickets?.totalProcessingTickets) || 0 },
      { period: 'Pending Tickets', value: Number(data.tickets?.totalPendingTickets) || 0 },
      { period: 'Completed Tickets', value: Number(data.tickets?.totalCompletedTickets) || 0 },
      { period: 'Total Tickets', value: data.tickets?.totalTickets || 0 },
    ];
  };

  const getCurrentData = (): ChartDataPoint[] => {
    const transformedData = transformDataForChart();
    return transformedData;
  };

  const getXAxisKey = (): string => {
    return 'period';
  };

  if (dashboardInfoPending) {
    return <LoadingSpinner message={`Fetching ${activeTab} records...`} />;
  }

  return (
    <div className="bg-white rounded-xl p-6  border border-gray-100">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Active Users</h3>
            <span className="text-sm text-green-600 font-medium">(+23) than last week</span>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-72 border border-gray-200 rounded-lg">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
              <TabsTrigger value="yearly">Yearly</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value={activeTab} className="mt-0">
            <div className="h-64">
              <ChartContainer config={chartConfig} className="h-full">
                <BarChart data={getCurrentData()}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis
                    dataKey={getXAxisKey()}
                    axisLine={false}
                    tickLine={false}
                    className="text-xs text-gray-500"
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    className="text-xs text-gray-500"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar
                    dataKey="value"
                    fill="var(--color-users)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {getMetrics(dashboardInfo?.data?.data || null).map((metric, index) => (
          <div key={index} className="flex flex-col">
            <div className="flex items-center mb-3">
              <div className="w-6 h-6 bg-theme-dark-green rounded-lg flex items-center justify-center mr-2">
                <metric.icon className="h-3 w-3 text-white" />
              </div>
              <p className="text-sm font-medium text-gray-900">{metric.label}</p>
            </div>
            <div className="w-full">
              <p className="text-xl font-extrabold text-gray-900 mb-2">{metric.value}</p>
              <div className="w-full bg-gray-200 rounded-full h-1">
                <div
                  className="bg-theme-dark-green h-1 rounded-full transition-all duration-300"
                  style={{ width: `${metric.progress}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}