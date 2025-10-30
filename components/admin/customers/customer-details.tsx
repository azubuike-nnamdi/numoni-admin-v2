"use client";

import LoadingSpinner from "@/components/ui/loading-spinner";
import { useAdjustCustomerBalance } from "@/hooks/mutation/useAdjustCustomerBalance";
import { useAdjustCustomerPoint } from "@/hooks/mutation/useAdjustCustomerPoint";
import useGetCustomerDetailsById from "@/hooks/query/useGetCustomerDetailsById";
import { useUserAuthStore } from "@/stores/user-auth-store";
import { useState } from "react";
import { toast } from "sonner";
import CustomerHeader from "./customer-header";
import CustomerOverview from "./customer-overview";
import CustomerTransactionById from "./customer-transaction-by-id";
import CustomersTabs from "./customers-tab";

export default function CustomerDetails({ customerId }: { customerId: string }) {
  const [activeTab, setActiveTab] = useState("overview");

  const { data, isPending, error, isError, refetch } = useGetCustomerDetailsById({ customerId });
  const { handleAdjustCustomerPoint, isPending: isAdjustPointsPending, isSuccess: isAdjustPointsSuccess } = useAdjustCustomerPoint();
  const { handleAdjustCustomerBalance, isPending: isAdjustBalancePending, isSuccess: isAdjustBalanceSuccess } = useAdjustCustomerBalance();
  const { user } = useUserAuthStore();

  // console.log(data?.data?.data?.data);
  const customerData = data?.data?.data?.data;

  const handleAdjustPoints = (customerId: string, walletId: string, walletType: string, points: number, reason: string) => {
    // Check if admin user is available
    if (!user?.id) {
      toast.error("Admin user not found");
      return;
    }

    if (customerId) {
      handleAdjustCustomerPoint({
        walletId: walletId,
        points: points,
        reason: reason,
        adminId: user.id,
        walletType: walletType
      });
    }
  };

  const handleAdjustBalance = (customerId: string, walletId: string, walletType: string, balance: number, reason: string) => {
    // Check if admin user is available
    if (!user?.id) {
      toast.error("Admin user not found");
      return;
    }

    if (customerId) {
      handleAdjustCustomerBalance({
        walletId: walletId,
        balance: balance,
        reason: reason,
        adminId: user.id,
        walletType: walletType
      });
    }
  };

  const handleResetPassword = (data: { newPassword: string; confirmPassword: string }) => {
    // TODO: Implement customer password reset
    console.log("Reset customer password:", data);
  };

  const handleDeleteAccount = () => {
    // TODO: Implement customer account deletion
    console.log("Delete customer account");
  };

  if (isPending) {
    return <LoadingSpinner message="Loading customer details..." />;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 p-3">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Customers</h3>
          <p className="text-gray-600 mb-4">
            {error?.message || "There was an error loading the customer data. Please try again."}
          </p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-theme-dark-green text-white rounded-lg hover:bg-theme-dark-green/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  return <div className="min-h-screen bg-gray-50 p-3">
    <div className="max-w-7xl mx-auto">
      <CustomerHeader
        customerName={customerData?.name}
        customerId={customerData?.userId}
        level={data?.data?.level}
      />

      <CustomersTabs activeTab={activeTab} onTabChange={setActiveTab} />


      {activeTab === "overview" && (
        <CustomerOverview
          customerData={customerData}
          onAdjustPoints={handleAdjustPoints}
          onAdjustBalance={handleAdjustBalance}
          onResetPassword={handleResetPassword}
          onDeleteAccount={handleDeleteAccount}
          customerId={customerId}
          isAdjustPointsPending={isAdjustPointsPending}
          isAdjustPointsSuccess={isAdjustPointsSuccess}
          isAdjustBalancePending={isAdjustBalancePending}
          isAdjustBalanceSuccess={isAdjustBalanceSuccess}
        />
      )}

      {activeTab === "transactions" && (
        <CustomerTransactionById customerId={customerId} />
      )}

      {/* {activeTab === "reward-points" && (
        <h2>Reward & Points</h2>
      )} */}
    </div>
  </div>;
}