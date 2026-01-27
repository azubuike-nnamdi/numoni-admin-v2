/**
 * UpdatePOSDialog Component
 * 
 * A dialog component for editing POS (Point of Sale) information including:
 * - POS details (name, location, address)
 * - Bank information (bank selection, account number, account holder name)
 * - Real-time bank account verification when account number is edited
 * 
 * Features:
 * - Pre-populates form with existing POS data
 * - Validates bank account via API when user edits account number
 * - Auto-fills account holder name on successful verification
 * - Shows verification status (success/failure) to user
 * - Prevents verification on initial mount/page load
 */

'use client';

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { FormCombobox } from "@/components/ui/form-combobox";
import { FormInputTopLabel } from "@/components/ui/form-input";
import { LoadingModal } from "@/components/ui/loading-modal";
import { useUpdatePos } from "@/hooks/mutation/useUpdatePos";
import { useVerifyBankName } from "@/hooks/mutation/useVerifyBankName";
import useGetBanks from "@/hooks/query/useGetBanks";
import { Bank, PosData, UpdatePosPayload } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

// ============================================================================
// FORM VALIDATION SCHEMA
// ============================================================================

/**
 * Zod schema for form validation
 * Defines required and optional fields with validation rules
 */
const updatePosSchema = z.object({
  posName: z.string().min(1, "POS name is required"),
  location: z.string().optional(),
  address: z.string().optional(),
  bankCode: z.string().min(1, "Bank is required"),
  accountNo: z.string().min(1, "Account number is required"),
  accountHolderName: z.string().min(1, "Account holder name is required"),
  bankTransferCode: z.string().optional(),
});

type UpdatePosFormData = z.infer<typeof updatePosSchema>;

// ============================================================================
// COMPONENT PROPS INTERFACE
// ============================================================================

interface UpdatePOSDialogProps {
  isOpen: boolean;
  onClose: () => void;
  pos: PosData;
}

export default function UpdatePOSDialog({
  isOpen,
  onClose,
  pos,
}: UpdatePOSDialogProps) {
  // ============================================================================
  // HOOKS & API CALLS
  // ============================================================================

  // Mutation hook for updating POS data
  const { handleUpdatePos, isPending, isSuccess } = useUpdatePos();

  // Query hook for fetching banks list
  const { data: banks, isPending: isBanksPending } = useGetBanks();

  // Mutation hook for verifying bank account name
  const {
    handleVerifyBankName,
    isPending: isVerifyingBankName,
    isSuccess: isVerifiedBankName,
    accountName: accountNameBankName
  } = useVerifyBankName();

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  /**
   * Tracks whether the bank account verification was successful
   * Used to display success/error messages
   */
  const [isAccountValid, setIsAccountValid] = useState<boolean>(false);

  /**
   * Tracks whether bank verification API has been called
   * Used to conditionally show error messages (only after verification attempt)
   */
  const [verificationAttempted, setVerificationAttempted] = useState<boolean>(false);

  // ============================================================================
  // REFS FOR TRACKING STATE
  // ============================================================================

  /**
   * Stores the verification key (bankCode-accountNumber) to prevent duplicate verifications
   * Format: "bankCode-accountNumber"
   */
  const hasVerified = useRef<string>("");

  /**
   * Stores the timeout ID for debouncing verification API calls
   * Prevents excessive API calls when user is typing
   */
  const verificationTimeout = useRef<NodeJS.Timeout | null>(null);

  /**
   * Stores the initial bank code when dialog opens
   * Used to detect if user has changed the bank selection
   */
  const initialBankCode = useRef<string>("");

  /**
   * Stores the initial account number when dialog opens
   * Used to detect if user has changed the account number
   */
  const initialAccountNo = useRef<string>("");

  /**
   * Tracks if the form is still being initialized
   * Prevents verification from triggering during form reset
   */
  const isInitializing = useRef<boolean>(true);

  // ============================================================================
  // DATA TRANSFORMATION
  // ============================================================================

  /**
   * Transforms banks API response into format required by FormCombobox
   * Handles different API response structures (array or nested data)
   */
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

  // ============================================================================
  // FORM SETUP
  // ============================================================================

  /**
   * React Hook Form setup with Zod validation
   * Pre-populates form with existing POS data
   */
  const form = useForm<UpdatePosFormData>({
    resolver: zodResolver(updatePosSchema),
    defaultValues: {
      posName: pos.posName || "",
      location: pos.location || "",
      address: pos.address || "",
      bankCode: pos.bankCode || "",
      accountNo: pos.accountNo || "",
      accountHolderName: pos.accountHolderName || "",
      bankTransferCode: pos.bankCode || "",
    },
  });

  const { control, setValue } = form;

  /**
   * Watch form values for bank verification
   * These values trigger verification when they change
   */
  const selectedBank = useWatch({ control, name: "bankCode" });
  const accountNumber = useWatch({ control, name: "accountNo" });

  // ============================================================================
  // EFFECT: FORM INITIALIZATION
  // ============================================================================

  /**
   * Initializes form when dialog opens or POS data changes
   * - Stores initial values to detect user changes
   * - Resets form with POS data
   * - Resets verification state
   * - Prevents verification during initialization
   */
  useEffect(() => {
    if (pos && isOpen) {
      const initialBank = pos.bankCode || "";
      const initialAccount = pos.accountNo || "";

      // Store initial values for change detection
      initialBankCode.current = initialBank;
      initialAccountNo.current = initialAccount;

      // Set initialization flags
      isInitializing.current = true;

      // Reset form with POS data
      form.reset({
        posName: pos.posName || "",
        location: pos.location || "",
        address: pos.address || "",
        bankCode: initialBank,
        accountNo: initialAccount,
        accountHolderName: pos.accountHolderName || "",
        bankTransferCode: initialBank || "",
      });

      // Reset verification state when dialog opens
      setIsAccountValid(false);
      setVerificationAttempted(false);
      hasVerified.current = "";

      // Mark initialization as complete after a brief delay
      // This prevents verification from triggering during form reset
      setTimeout(() => {
        isInitializing.current = false;
      }, 100);
    }
  }, [pos, isOpen, form]);

  // ============================================================================
  // EFFECT: BANK ACCOUNT VERIFICATION
  // ============================================================================

  /**
   * Triggers bank account verification when there's any change on the modal
   * 
   * Conditions for verification:
   * 1. Form initialization is complete
   * 2. Account number is at least 10 digits
   * 3. Bank is selected
   * 4. Not already verifying the same bank-account combination
   * 
   * Uses debouncing (500ms) to prevent excessive API calls while typing
   * Always triggers verification when bank code or account number changes
   */
  useEffect(() => {
    // Early return: Don't verify during initialization
    if (isInitializing.current) {
      return;
    }

    // Clear any pending verification timeout
    if (verificationTimeout.current) {
      clearTimeout(verificationTimeout.current);
    }

    // Reset verification state when bank code changes (to allow re-verification with new bank)
    const currentVerificationKey = `${selectedBank}-${accountNumber}`;
    if (hasVerified.current && hasVerified.current !== currentVerificationKey) {
      setIsAccountValid(false);
      setVerificationAttempted(false);
      hasVerified.current = "";
    }

    // Verify account if all conditions are met
    if (selectedBank && accountNumber && accountNumber.length >= 10) {
      const verificationKey = `${selectedBank}-${accountNumber}`;

      // Only verify if we haven't verified this combination yet and not currently verifying
      if (hasVerified.current !== verificationKey && !isVerifyingBankName) {
        // Debounce verification by 500ms
        verificationTimeout.current = setTimeout(() => {
          const verifyPayload = {
            institutionCode: selectedBank,
            accountNumber: accountNumber,
          };

          // Mark as verified and set attempt flag
          hasVerified.current = verificationKey;
          setVerificationAttempted(true);

          // Call verification API
          handleVerifyBankName(verifyPayload);
        }, 500);
      }
    } else if (!selectedBank || !accountNumber || accountNumber.length < 10) {
      // If required fields are missing, reset verification state
      setIsAccountValid(false);
      setVerificationAttempted(false);
      hasVerified.current = "";
    }

    // Cleanup: Clear timeout on unmount or dependency change
    return () => {
      if (verificationTimeout.current) {
        clearTimeout(verificationTimeout.current);
      }
    };
  }, [selectedBank, accountNumber, handleVerifyBankName, isVerifyingBankName]);

  // ============================================================================
  // EFFECT: HANDLE VERIFICATION RESPONSE
  // ============================================================================

  /**
   * Processes verification API response
   * - On success: Sets account as valid and auto-fills account holder name
   * - On failure: Marks account as invalid and clears account name (if auto-filled)
   * - Preserves manually entered account names
   */
  useEffect(() => {
    // Success case: Verification succeeded and account name was returned
    if (isVerifiedBankName && accountNameBankName) {
      setIsAccountValid(true);
      // Auto-fill account holder name from verification response
      setValue("accountHolderName", accountNameBankName);
      // Update bankTransferCode with the bankCode value
      if (selectedBank) {
        setValue("bankTransferCode", selectedBank);
      }

      // Log verified bank data
      // const currentFormData = form.getValues();
      // console.log("✅ Bank Verification Success - Verified Data:", {
      //   bankCode: selectedBank,
      //   accountNumber: accountNumber,
      //   accountName: accountNameBankName,
      //   bankName: bankOptions.find(b => b.value === selectedBank)?.label || "Unknown",
      //   formData: {
      //     bankCode: currentFormData.bankCode,
      //     accountNo: currentFormData.accountNo,
      //     accountHolderName: currentFormData.accountHolderName,
      //   },
      //   originalData: {
      //     bankCode: pos.bankCode,
      //     accountNo: pos.accountNo,
      //     accountHolderName: pos.accountHolderName,
      //   },
      // });
    }
    // Failure case: Verification completed but failed
    else if (!isVerifyingBankName && verificationAttempted && accountNumber && accountNumber.length >= 10) {
      // Only mark as invalid if verification was attempted and completed without success
      setIsAccountValid(false);

      // Log verification failure
      // console.log("❌ Bank Verification Failed:", {
      //   bankCode: selectedBank,
      //   accountNumber: accountNumber,
      //   accountName: accountNameBankName,
      // });

      // Only clear account name if verification failed (no account name returned)
      // Don't clear if user manually entered a name
      if (!accountNameBankName) {
        const currentAccountName = form.getValues("accountHolderName");
        // Only clear if the current name matches the verified name (was auto-filled)
        // or if there's no current name
        if (currentAccountName === accountNameBankName || !currentAccountName) {
          setValue("accountHolderName", "");
        }
      }
    }
  }, [isVerifiedBankName, accountNameBankName, isVerifyingBankName, accountNumber, verificationAttempted, setValue, form, selectedBank, bankOptions, pos]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  /**
   * Handles form submission
   * - Maps form data to API payload format
   * - Resolves bank name from bank code
   * - Calls update mutation
   */
  const handleSubmit = useCallback(
    (data: UpdatePosFormData) => {
      // Get bank name from bank code using bank options
      const selectedBank = bankOptions.find(
        (bank) => bank.value === data.bankCode
      );
      const bankName = selectedBank?.label || pos.bankName || "";

      // Construct update payload
      const updatePayload: UpdatePosPayload = {
        id: pos.id,
        posId: pos.posId,
        posName: data.posName,
        merchantId: pos.merchantId,
        branchId: pos.branchId || "",
        bankName: bankName,
        accountNo: data.accountNo,
        accountHolderName: data.accountHolderName,
        bankCode: data.bankCode,
        bankTransferCode: data.bankCode || "",
        location: data.location || "",
        address: data.address || "",
      };

      // Log the update payload for debugging
      // console.log("📤 Update POS Payload:", {
      //   ...updatePayload,
      //   bankCode: data.bankCode,
      //   bankName: bankName,
      //   originalBankCode: pos.bankCode,
      //   originalBankName: pos.bankName,
      // });

      // Call update mutation
      handleUpdatePos(updatePayload);
    },
    [pos, bankOptions, handleUpdatePos]
  );

  /**
   * Handles dialog close
   * - Resets form to clear any changes
   * - Calls parent's onClose handler
   */
  const handleClose = useCallback(() => {
    form.reset();
    onClose();
  }, [form, onClose]);

  // ============================================================================
  // EFFECT: AUTO-CLOSE ON SUCCESS
  // ============================================================================

  /**
   * Closes dialog automatically when update succeeds
   * Provides better UX by not requiring manual close after successful update
   */
  useEffect(() => {
    if (isSuccess) {
      handleClose();
    }
  }, [isSuccess, handleClose]);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        // Prevent closing while update is in progress
        if (!open && !isPending) {
          handleClose();
        }
      }}
    >
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0">
        {/* ==================================================================== */}
        {/* FIXED HEADER - Stays visible while scrolling */}
        {/* ==================================================================== */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-200 shrink-0">
          <DialogTitle>Edit POS Information</DialogTitle>
          <DialogDescription>
            Update the POS details and bank information
          </DialogDescription>
        </DialogHeader>

        {/* ==================================================================== */}
        {/* SCROLLABLE CONTENT - Form fields */}
        {/* ==================================================================== */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {/* POS Information Section */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-gray-900">
                  POS Information
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInputTopLabel
                    control={form.control}
                    name="posName"
                    label="POS Name"
                    placeholder="Enter POS name"
                    required
                  />

                  <FormInputTopLabel
                    control={form.control}
                    name="location"
                    label="Location"
                    placeholder="Enter location"
                  />
                </div>

                <FormInputTopLabel
                  control={form.control}
                  name="address"
                  label="Address"
                  placeholder="Enter address"
                />
              </div>

              {/* Bank Information Section */}
              <div className="space-y-4">
                <h4 className="text-md font-semibold text-gray-900">
                  Bank Information
                </h4>

                {/* Bank Selection and Account Number */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Bank Selection Combobox */}
                  <FormCombobox
                    control={form.control}
                    name="bankCode"
                    label="Select Bank"
                    options={bankOptions}
                    placeholder={
                      isBanksPending ? "Loading banks..." : "Search and select a bank..."
                    }
                    searchPlaceholder="Search banks..."
                    emptyMessage="No bank found."
                    disabled={isBanksPending}
                    required
                  />

                  {/* Account Number Input */}
                  <FormInputTopLabel
                    control={form.control}
                    name="accountNo"
                    label="Account Number"
                    placeholder="Enter account number"
                    required
                  />
                </div>

                {/* Account Holder Name and Bank Transfer Code */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInputTopLabel
                    control={form.control}
                    name="accountHolderName"
                    label="Account Holder Name"
                    placeholder="Enter account holder name"
                    required
                  />

                  <FormInputTopLabel
                    control={form.control}
                    name="bankTransferCode"
                    label="Bank Transfer Code"
                    placeholder="Enter bank transfer code"
                  />
                </div>

                {/* Account Verification Status Messages */}
                {/* Only show when account number is valid length and verification is complete */}
                {accountNumber && accountNumber.length >= 10 && !isVerifyingBankName && (
                  <div className="mt-4">
                    {/* Success Message - Shows when verification succeeds */}
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

                    {/* Error Message - Only shows after verification attempt fails */}
                    {verificationAttempted && !isVerifyingBankName && !isAccountValid && (
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
            </form>
          </Form>
        </div>

        {/* ==================================================================== */}
        {/* LOADING MODAL - Shows during bank verification */}
        {/* ==================================================================== */}
        <LoadingModal
          isOpen={isVerifyingBankName}
          title="Verifying Account"
          message="We're verifying your bank account details. This may take a few seconds."
          description="Please do not close this window while verification is in progress."
        />

        {/* ==================================================================== */}
        {/* FIXED FOOTER - Stays visible while scrolling */}
        {/* ==================================================================== */}
        <div className="px-6 py-4 border-t border-gray-200 shrink-0">
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-12 py-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              isLoading={isPending}
              onClick={form.handleSubmit(handleSubmit)}
              className="bg-theme-dark-green hover:bg-theme-dark-green/90 text-white px-12 py-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              loadingText="Updating..."
            >
              Update POS
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

