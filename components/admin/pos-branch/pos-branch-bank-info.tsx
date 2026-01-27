'use client';

import { FormCombobox } from '@/components/ui/form-combobox';
import { FormInputTopLabel } from '@/components/ui/form-input';
import { LoadingModal } from '@/components/ui/loading-modal';
import { useVerifyBankName } from '@/hooks/mutation/useVerifyBankName';
import useGetBanks from '@/hooks/query/useGetBanks';
import { PosBranchFormData } from '@/lib/schemas/pos-branch-schema';
import { Bank } from '@/lib/types';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Control, UseFormSetValue, useWatch } from 'react-hook-form';

interface PosBranchBankInfoProps {
  control: Control<PosBranchFormData>;
  setValue: UseFormSetValue<PosBranchFormData>;
}

export default function PosBranchBankInfo({ control, setValue }: PosBranchBankInfoProps) {
  const { data: banks, isPending: isBanksPending } = useGetBanks();
  const { handleVerifyBankName, isPending: isVerifyingBankName, isSuccess: isVerifiedBankName, accountName: accountNameBankName, data: verifiedBankData } = useVerifyBankName();

  const [isAccountValid, setIsAccountValid] = useState<boolean>(false);
  const hasVerified = useRef<string>("");
  const verificationTimeout = useRef<NodeJS.Timeout | null>(null);

  // Transform banks data for combobox
  const bankOptions = useMemo(() => {
    const allBanks = Array.isArray(banks?.data)
      ? banks.data
      : banks?.data?.data;
    if (!allBanks || !Array.isArray(allBanks)) return [];
    return allBanks.map((bank: Bank) => ({
      value: bank.code,
      label: bank.name,
    }));
  }, [banks]);

  // Watch form values for bank verification
  const selectedBank = useWatch({ control, name: "bankCode" });
  const accountNumber = useWatch({ control, name: "bankAccountNumber" });

  // Verify account when both bank and account number are provided
  useEffect(() => {
    if (verificationTimeout.current) {
      clearTimeout(verificationTimeout.current);
    }

    if (selectedBank && accountNumber && accountNumber.length >= 10) {
      const verificationKey = `${selectedBank}-${accountNumber}`;
      if (hasVerified.current !== verificationKey && !isVerifyingBankName) {
        verificationTimeout.current = setTimeout(() => {
          const verifyPayload = {
            institutionCode: selectedBank,
            accountNumber: accountNumber,
          };
          hasVerified.current = verificationKey;
          handleVerifyBankName(verifyPayload);
        }, 500);
      }
    } else {
      setIsAccountValid(false);
      hasVerified.current = "";
    }

    return () => {
      if (verificationTimeout.current) {
        clearTimeout(verificationTimeout.current);
      }
    };
  }, [selectedBank, accountNumber, handleVerifyBankName, isVerifyingBankName]);

  // Handle verification success
  useEffect(() => {
    if (isVerifiedBankName && accountNameBankName) {
      // console.log("Verified Bank Result:", verifiedBankData);
      setIsAccountValid(true);
      setValue("accountName", accountNameBankName);
    } else if (!isVerifyingBankName && accountNumber && accountNumber.length >= 10) {
      setIsAccountValid(false);
      setValue("accountName", "");
    }
  }, [isVerifiedBankName, accountNameBankName, isVerifyingBankName, accountNumber, setValue, verifiedBankData]);

  return (
    <>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Bank Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormCombobox
            control={control}
            name="bankCode"
            label="Select Bank"
            options={bankOptions}
            placeholder={isBanksPending ? "Loading banks..." : "Search and select a bank..."}
            searchPlaceholder="Search banks..."
            emptyMessage="No bank found."
            disabled={isBanksPending}
            required
          />

          <FormInputTopLabel
            control={control}
            name="bankAccountNumber"
            label="Account Information"
            placeholder="Enter account number"
            required
          />
        </div>

        {/* Account Verification Status */}
        {accountNumber && accountNumber.length >= 10 && !isVerifyingBankName && (
          <div className="mt-4">
            {isAccountValid && accountNameBankName && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-800">Account Verified</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  Account Name: <span className="font-semibold">{accountNameBankName}</span>
                </p>
              </div>
            )}

            {!isAccountValid && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium text-red-800">Account Verification Failed</span>
                </div>
                <p className="text-sm text-red-700 mt-1">
                  Please check your account number and try again.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Loading Modal for Bank Verification */}
      <LoadingModal
        isOpen={isVerifyingBankName}
        title="Verifying Account"
        message="We're verifying your bank account details. This may take a few seconds."
        description="Please do not close this window while verification is in progress."
      />
    </>
  );
}

