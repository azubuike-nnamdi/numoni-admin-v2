"use client";

import { Badge } from "@/components/ui/badge";
import { formatDateReadable, getAccountStatusColor } from "@/lib/helper";
import { InfoItem, MerchantDetailsResponse } from "@/lib/types";
import { CheckCircle, Star, User } from "lucide-react";


export default function AccountInformation({
  merchantData
}: { readonly merchantData: MerchantDetailsResponse }) {

  const leftColumnItems: InfoItem[] = [
    { label: "Registration Date", value: formatDateReadable(merchantData?.registrationDate || "N/A") },
    { label: "Account type", value: "Merchant", icon: User },
    { label: "Identity type", value: merchantData?.identificationType || "N/A" },
    { label: "Business Number", value: merchantData?.businessReqNo || "N/A" },
    { label: "KYC Status", value: merchantData?.kycStatus || "N/A", isBadge: true },
  ];

  const rightColumnItems: InfoItem[] = [
    { label: "Last Login", value: merchantData?.lastLogin ? formatDateReadable(merchantData.lastLogin) : "N/A" },
    { label: "Account Status", value: merchantData?.status || "N/A", isBadge: true },
    { label: "Identity Number", value: merchantData?.identificationTypeNumber || "N/A" },
    { label: "Minimum Threshold", value: merchantData?.minimumThreshold || "N/A" },
    { label: "Approved Status", value: merchantData?.approvalStatus || "N/A", isBadge: true },

  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="mb-6 pb-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">Account Information</h3>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-5">
          {leftColumnItems.map((item, index) => (
            <div key={index} className="flex flex-col items-start">
              <span className="text-sm text-gray-500 font-medium">{item.label}:</span>
              <div className="flex items-center gap-2 mt-1">
                {item.icon && <item.icon className="h-4 w-4 text-gray-500" />}
                {item.isBadge ? (
                  <Badge className={getAccountStatusColor(item.value)}>
                    {item.value === "Verified" && <CheckCircle className="h-3 w-3 mr-1" />}
                    {item.value}
                  </Badge>
                ) : (
                  <span className="text-sm text-gray-900 font-semibold max-w-[90%]">{item.value}</span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-5">
          {rightColumnItems.map((item, index) => (
            <div key={index} className="flex flex-col items-start">
              <span className="text-sm text-gray-500 font-medium">{item.label}:</span>
              <div className="flex items-center gap-2 mt-1">
                {item.icon && <item.icon className="h-4 w-4 text-gray-500" />}
                {item.isBadge ? (
                  <Badge className={getAccountStatusColor(item.value)}>
                    {item.value === "Verified" && <CheckCircle className="h-3 w-3 mr-1" />}
                    {item.value}
                  </Badge>
                ) : (
                  <span className="text-sm text-gray-900 font-semibold">{item.value}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews section */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex flex-col items-start">
          <span className="text-sm text-gray-500 font-medium mb-2">Reviews:</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-900 font-semibold">
                  {merchantData?.reviewAvg?.toFixed(1) || "0.0"}
                </span>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              ({merchantData?.reviewCount || 0} {merchantData?.reviewCount === 1 ? "review" : "reviews"})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
