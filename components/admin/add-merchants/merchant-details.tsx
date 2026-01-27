"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useAdjustMerchantBalance } from "@/hooks/mutation/useAdjustMerchantBalance";
import { useAdjustMerchantPoints } from "@/hooks/mutation/useAdjustMerchantPoints";
import { useDeleteMerchant } from "@/hooks/mutation/useDeleteMerchant";
import { useResetMerchantPassword } from "@/hooks/mutation/useResetMerchantPassword";
import useGetMerchantDetailsById from "@/hooks/query/useGetMerchantDetailsById";
import { useUserAuthStore } from "@/stores/user-auth-store";
import { Download } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import AccountInformation from "./account-information";
import AdminControls from "./admin-controls";
import MerchantDescription from "./merchant-description";
import MerchantHeader from "./merchant-header";
import MerchantKyc from "./merchant-kyc";
import MerchantRewardPoints from "./merchant-reward-points";
import MerchantTabs from "./merchant-tabs";
import PersonalInformation from "./personal-information";
import ReviewsSection from "./reviews-section";
import RewardsInformation from "./rewards-information";
import SingleMerchantTransaction from "./single-merchant-transaction";
import SocialMediaLinks from "./social-media-links";

interface MerchantDetailsProps {
  merchantId: string | string[] | undefined;
  userId: string | null;
}

export default function MerchantDetails({ merchantId, userId }: Readonly<MerchantDetailsProps>) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const { data: merchantDetails, isPending: isMerchantDetailsPending } = useGetMerchantDetailsById({ merchantId: merchantId as string });
  const { handleDeleteMerchant, isPending: isDeletePending } = useDeleteMerchant();
  const { handleResetMerchantPassword, isPending: isResetPending } = useResetMerchantPassword();
  const { handleAdjustMerchantPoints, isPending: isAdjustPointsPending, isSuccess } = useAdjustMerchantPoints();
  const { handleAdjustMerchantBalance, isPending: isAdjustBalancePending, isSuccess: isAdjustBalanceSuccess } = useAdjustMerchantBalance();

  const { user } = useUserAuthStore();


  const merchantData = merchantDetails?.data?.data;


  const handleEditPersonalInfo = () => {
    console.log("Edit personal information");
  };

  const handleEditDescription = () => {
    console.log("Edit description");
  };

  // const handleManageCharity = () => {
  //   console.log("Manage charity");
  // };

  // const handleNotifyMerchant = () => {
  //   console.log("Notify merchant");
  // };

  const handleHideReview = (id: string) => {
    console.log("Hide review:", id);
  };

  const handleDeleteReview = (id: string) => {
    console.log("Delete review:", id);
  };

  const handleAdjustPoints = (merchantId: string, walletId: string, walletType: string, points: number, reason: string) => {
    // Check if admin user is available
    if (!user?.id) {
      toast.error("Admin user not found");
      return;
    }

    if (merchantId) {
      handleAdjustMerchantPoints({
        walletId: walletId,
        points: points,
        reason: reason,
        adminId: user.id,
        walletType: walletType
      });
    }
  };

  const handleAdjustBalance = (merchantId: string, walletId: string, walletType: string, balance: number, reason: string) => {
    // Check if admin user is available
    if (!user?.id) {
      toast.error("Admin user not found");
      return;
    }

    if (merchantId) {
      handleAdjustMerchantBalance({
        walletId: walletId,
        balance: balance,
        reason: reason,
        adminId: user.id,
        walletType: walletType
      });
    }
  };

  const handleResetPassword = (data: { newPassword: string; confirmPassword: string }) => {
    if (merchantId) {
      handleResetMerchantPassword({
        id: merchantId as string,
        newPassword: data.newPassword
      });
    }
  };

  const handleDeleteAccount = () => {
    if (merchantId) {
      handleDeleteMerchant(merchantId as string);
    }
  };

  const handleDownloadImage = async () => {
    if (!merchantData?.businessImagePath) return;
    const link = document.createElement('a');
    link.href = merchantData.businessImagePath;
    link.download = `${(merchantData.businessName || 'merchant').replace(/[^a-z0-9]/gi, '-').toLowerCase()}-image.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

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
          level={merchantData?.level}
        />
        <div className="flex items-start gap-4 mb-6">
          {merchantData?.businessImagePath && (
            <div className="relative group cursor-pointer shrink-0" onClick={() => setIsImageDialogOpen(true)}>
              <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg">
                <Image
                  src={merchantData.businessImagePath}
                  alt={merchantData.businessName || "Merchant image"}
                  fill
                  className="object-cover group-hover:opacity-90 transition-opacity"
                  sizes="160px"
                />
                {/* Download button overlay - center */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadImage();
                    }}
                    className="bg-theme-dark-green hover:bg-theme-dark-green/90 text-white shadow-lg rounded-full p-2"
                    size="sm"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Full Screen Image Dialog */}
        <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
          <DialogContent className="max-w-7xl w-full p-0 bg-black" showCloseButton={true}>
            <DialogTitle className="sr-only">Merchant Image Preview</DialogTitle>
            {merchantData?.businessImagePath && (
              <div className="relative w-full h-[90vh] bg-black">
                <Image
                  src={merchantData.businessImagePath}
                  alt={merchantData.businessName || "Full screen merchant image"}
                  fill
                  className="object-contain"
                  unoptimized
                />
                {/* Download button in full screen */}
                <div className="absolute bottom-4 right-4 z-10">
                  <Button
                    type="button"
                    onClick={handleDownloadImage}
                    className="bg-white hover:bg-gray-100 text-gray-900 shadow-lg"
                    size="lg"
                  >
                    <Download className="h-5 w-5 mr-2" />
                    Download Image
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        <MerchantTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PersonalInformation
                {...merchantData}
                merchantId={merchantId}
                onEdit={handleEditPersonalInfo}
              />
              <AccountInformation merchantData={merchantData} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MerchantDescription
                description={merchantData?.description}
                onEdit={handleEditDescription}
                userId={merchantId ? merchantId as string : undefined}
              />

              <RewardsInformation
                wallet={merchantData?.wallet}
                pointType={merchantData?.pointType}
              />
              {/* <EndorsedCharity
                charityCount={merchantData?.charityCount}
                onManage={handleManageCharity}
              /> */}
            </div>

            {/* <ReportsSection
              reportsCompleted={merchantData?.reportsCompleted}
              totalReports={merchantData?.totalReports}
              onNotifyMerchant={handleNotifyMerchant}
              merchantId={merchantId as string}
            /> */}

            <ReviewsSection
              onHideReview={handleHideReview}
              onDeleteReview={handleDeleteReview}
              merchantId={merchantId as string}
            />

            <SocialMediaLinks
              facebook={merchantData?.facebook}
              instagram={merchantData?.instagram}
              twitter={merchantData?.twitter}
              linkedin={merchantData?.linkedin}
              snapchat={merchantData?.snapchat}
              website={merchantData?.website}
              tiktok={merchantData?.tiktok}
            />

            <AdminControls
              onAdjustPoints={handleAdjustPoints}
              onAdjustBalance={handleAdjustBalance}
              onResetPassword={handleResetPassword}
              onDeleteAccount={handleDeleteAccount}
              userName={merchantData?.businessName}
              userId={merchantId ? merchantId as string : undefined}
              businessName={merchantData?.businessName}
              walletId={merchantData?.wallet?.userId}
              isDeletePending={isDeletePending}
              isResetPending={isResetPending}
              isAdjustPointsPending={isAdjustPointsPending}
              isAdjustPointsSuccess={isSuccess}
              isAdjustBalancePending={isAdjustBalancePending}
              isAdjustBalanceSuccess={isAdjustBalanceSuccess}
            />
          </div>
        )}

        {activeTab === "kyc" && (
          <MerchantKyc merchantDetails={merchantData} merchantId={userId ?? ""} />
        )}

        {activeTab === "transactions" && (
          <SingleMerchantTransaction merchantId={merchantId as string} />
        )}

        {activeTab === "rewards" && (
          <MerchantRewardPoints merchantId={merchantId as string} userId={userId} />
        )}
      </div>
    </div>
  );
}