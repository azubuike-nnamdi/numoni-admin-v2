"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import LoadingSpinner from "@/components/ui/loading-spinner";
import useGetMerchantTransactionDetailsById from "@/hooks/query/useGetMerchantTransactionDetailsById";
import { extractErrorMessage, formatCurrency, formatDateReadable, getStatusColor, getTransactionTypeColor } from "@/lib/helper";
import { IndividualMerchantTransactionDetails } from "@/lib/types";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";



export default function SingleTransactionDetails({ transactionId }: { transactionId: string }) {
  const { data, isPending, error, isError, refetch } = useGetMerchantTransactionDetailsById({ transactionId });
  const router = useRouter();

  if (isPending) {
    return <LoadingSpinner message="Loading transaction details..." />;
  }

  if (isError) {
    return <ErrorState
      title="Error Loading Transaction Details"
      message={extractErrorMessage(error) || "Failed to load transaction details. Please try again."} onRetry={refetch}
      retryText="Retry" />;
  }

  const transactionDetails = data?.data?.data as IndividualMerchantTransactionDetails | undefined;

  if (!transactionDetails) {
    return (
      <EmptyState
        title="No transaction details available."
        description="No transaction details available. Please try again."
        actionButton={
          <Button variant="outline" className="flex items-center gap-2" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        }
      />
    );
  }

  const getTransactionStatusColor = (status: string) => {
    // Map transaction statuses to statuses that getStatusColor understands
    const statusMap: Record<string, string> = {
      'SUCCESSFUL': 'active',
      'FAILED': 'inactive',
      'PENDING': 'pending',
    };
    const mappedStatus = statusMap[status?.toUpperCase()] || status?.toLowerCase();
    return getStatusColor(mappedStatus);
  };

  const leftColumnItems = [
    { label: "Transaction ID", value: transactionDetails.transactionId || '-' },
    { label: "Transaction No", value: transactionDetails.transactionNo || '-' },
    { label: "Type", value: transactionDetails.type || '-' },
    { label: "Transaction Type", value: transactionDetails.trnType || '-' },
    { label: "Amount In", value: formatCurrency(transactionDetails.trnInAmount || 0) },
    { label: "Amount Out", value: formatCurrency(transactionDetails.trnOutAmount || 0) },
    { label: "Fee", value: formatCurrency(transactionDetails.fee || 0) },
    { label: "Status", value: transactionDetails.status || '-' },
  ];

  const rightColumnItems = [
    { label: "Payment Date", value: transactionDetails.paymentDate ? formatDateReadable(transactionDetails.paymentDate) : '-' },
    { label: "Merchant ID", value: transactionDetails.merchantId || '-' },
    { label: "Merchant Name", value: transactionDetails.merchantName || '-' },
    { label: "Branch ID", value: transactionDetails.branchId || '-' },
    { label: "Customer ID", value: transactionDetails.customerId || '-' },
    { label: "Currency", value: transactionDetails.currency || '-' },
  ];


  return (
    <div className="space-y-6">
      <Button variant="outline" className="flex items-center gap-2" onClick={() => router.back()}>
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900">Transaction Details</h3>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-5">
            {leftColumnItems.map((item, index) => (
              <div key={index} className="flex flex-col items-start">
                <span className="text-sm text-gray-500 font-medium">{item.label}:</span>
                {item.label === "Type" ? (
                  <Badge className={`text-xs rounded-full border mt-1 ${getTransactionTypeColor(transactionDetails.type)}`}>
                    {item.value}
                  </Badge>
                ) : item.label === "Status" ? (
                  <Badge className={`text-xs rounded-full border mt-1 ${getTransactionStatusColor(transactionDetails.status)}`}>
                    {item.value}
                  </Badge>
                ) : (
                  <span className="text-sm text-gray-900 font-semibold text-right max-w-[60%]">{item.value}</span>
                )}
              </div>
            ))}
          </div>
          <div className="space-y-5">
            {rightColumnItems.map((item, index) => (
              <div key={index} className="flex flex-col items-start">
                <span className="text-sm text-gray-500 font-medium">{item.label}:</span>
                <span className="text-sm text-gray-900 font-semibold max-w-[90%]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Details Section */}
        {(transactionDetails.bonusDetails || transactionDetails.reportDetails) && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="space-y-4">
              {transactionDetails.bonusDetails && (
                <div className="flex flex-col items-start">
                  <span className="text-sm text-gray-500 font-medium mb-2">Bonus Details:</span>
                  <span className="text-sm text-gray-900 font-semibold max-w-[90%]">{transactionDetails.bonusDetails}</span>
                </div>
              )}
              {transactionDetails.reportDetails && (
                <div className="flex flex-col items-start">
                  <span className="text-sm text-gray-500 font-medium mb-2">Report Details:</span>
                  <span className="text-sm text-gray-900 font-semibold max-w-[90%]">{transactionDetails.reportDetails}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bank/Payment Information Card */}
      <BankPaymentInformation transactionDetails={transactionDetails} />
    </div>
  );
}

// Bank/Payment Information Card Component
function BankPaymentInformation({ transactionDetails }: { transactionDetails: IndividualMerchantTransactionDetails }) {
  const paymentItems = [
    { label: "Pay On Us Account Name", value: transactionDetails.payOnusAccountName || '-' },
    { label: "Pay On Us Account Number", value: transactionDetails.payOnusAccountNumber || '-' },
    { label: "Pay On Us Bank", value: transactionDetails.payOnusBank || '-' },
    { label: "Paid From Account", value: transactionDetails.paidFromAccount || '-' },
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900">Bank/Payment Information</h3>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-5">
          {paymentItems.slice(0, 2).map((item, index) => (
            <div key={index} className="flex flex-col items-start">
              <span className="text-sm text-gray-500 font-medium">{item.label}:</span>
              <span className="text-sm text-gray-900 font-semibold max-w-[90%]">{item.value}</span>
            </div>
          ))}
        </div>
        <div className="space-y-5">
          {paymentItems.slice(2).map((item, index) => (
            <div key={index} className="flex flex-col items-start">
              <span className="text-sm text-gray-500 font-medium">{item.label}:</span>
              <span className="text-sm text-gray-900 font-semibold max-w-[90%]">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}