"use client";

import LoadingSpinner from "@/components/ui/loading-spinner";
import { mockMerchantData } from "@/data";
import useGetMerchantDetailsById from "@/hooks/query/useGetMerchantDetailsById";
import { useState } from "react";
import AccountInformation from "./account-information";
import AdminControls from "./admin-controls";
import EndorsedCharity from "./endorsed-charity";
import MerchantDescription from "./merchant-description";
import MerchantHeader from "./merchant-header";
import MerchantTabs from "./merchant-tabs";
import PersonalInformation from "./personal-information";
import ReportsSection from "./reports-section";
import ReviewsSection from "./reviews-section";

interface MerchantDetailsProps {
  merchantId: string | string[] | undefined;
}

export default function MerchantDetails({ merchantId }: MerchantDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const { data: merchantDetails, isPending: isMerchantDetailsPending } = useGetMerchantDetailsById({ merchantId: merchantId as string });

  console.log('merchantDetails', merchantDetails?.data?.data);
  const merchantData = merchantDetails?.data?.data;

  console.log('merchantId', merchantId);

  const handleEditPersonalInfo = () => {
    console.log("Edit personal information");
  };

  const handleEditDescription = () => {
    console.log("Edit description");
  };

  const handleManageCharity = () => {
    console.log("Manage charity");
  };

  const handleNotifyMerchant = () => {
    console.log("Notify merchant");
  };

  const handleHideReview = (id: string) => {
    console.log("Hide review:", id);
  };

  const handleDeleteReview = (id: string) => {
    console.log("Delete review:", id);
  };

  const handleAdjustPoints = () => {
    console.log("Adjust points");
  };

  const handleAdjustBalance = () => {
    console.log("Adjust balance");
  };

  const handleResetPassword = () => {
    console.log("Reset password");
  };

  const handleDeleteAccount = () => {
    console.log("Delete account");
  };

  if (isMerchantDetailsPending) {
    return <LoadingSpinner message="Loading merchant details..." />
  }
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <MerchantHeader
          merchantName={merchantData?.businessName}
          userId={merchantData?.merchantId}
          level={mockMerchantData.level}
        />

        <MerchantTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PersonalInformation
                {...merchantData}
                onEdit={handleEditPersonalInfo}
              />
              <AccountInformation {...mockMerchantData.accountInfo} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MerchantDescription
                description={merchantData?.businessDescription}
                onEdit={handleEditDescription}
              />
              <EndorsedCharity
                charityCount={merchantData?.charityCount}
                onManage={handleManageCharity}
              />
            </div>

            <ReportsSection
              reportsCompleted={merchantData?.reportsCompleted}
              totalReports={merchantData?.totalReports}
              onNotifyMerchant={handleNotifyMerchant}
            />

            <ReviewsSection
              reviews={mockMerchantData.reviews}
              onHideReview={handleHideReview}
              onDeleteReview={handleDeleteReview}
            />

            <AdminControls
              onAdjustPoints={handleAdjustPoints}
              onAdjustBalance={handleAdjustBalance}
              onResetPassword={handleResetPassword}
              onDeleteAccount={handleDeleteAccount}
            />
          </div>
        )}

        {activeTab === "kyc" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">KYC Information</h3>
            <p className="text-gray-600">KYC details will be displayed here.</p>
          </div>
        )}

        {activeTab === "transactions" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Transactions</h3>
            <p className="text-gray-600">Transaction history will be displayed here.</p>
          </div>
        )}

        {activeTab === "rewards" && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reward & Points</h3>
            <p className="text-gray-600">Reward and points information will be displayed here.</p>
          </div>
        )}
      </div>
    </div>
  );
}