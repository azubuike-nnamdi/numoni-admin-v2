"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUpdateMerchantVerificationStatus } from "@/hooks/mutation/useUpdateMerchantVerificationStatus";
import { UpdateMerchantVerificationStatusPayload } from "@/lib/types";
import { useEffect, useState } from "react";
import { Merchant } from "./merchant-columns";

export const UpdateMerchantStatusDialog = ({
  isOpen,
  onClose,
  merchant,
}: {
  isOpen: boolean;
  onClose: () => void;
  merchant: Merchant;
}) => {
  const [status, setStatus] = useState<UpdateMerchantVerificationStatusPayload['status'] | "">("");
  const { handleUpdateMerchantVerificationStatus, isPending, isSuccess, reset } = useUpdateMerchantVerificationStatus();

  // Use a separate useEffect for closing on success
  useEffect(() => {
    if (isSuccess) {
      onClose();
    }
  }, [isSuccess, onClose]);

  // Reset state when dialog is closed/opened
  useEffect(() => {
    if (!isOpen) {
      setStatus("");
      reset();
    }
  }, [isOpen, reset]);

  const handleUpdate = () => {
    if (!status) return;
    handleUpdateMerchantVerificationStatus({
      merchantId: merchant?.id,
      status: status,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Merchant Status</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-4">

            <Select
              value={status}
              onValueChange={(value) => setStatus(value as UpdateMerchantVerificationStatusPayload['status'])}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="APPROVED">Approved</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
                <SelectItem value="SUSPENDED">Suspended</SelectItem>
                <SelectItem value="VERIFIED">Verified</SelectItem>
                <SelectItem value="UNVERIFIED">Unverified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleUpdate} disabled={isPending || !status}
            className="bg-theme-dark-green"
            isLoading={isPending}
            loadingText={`Updating ${merchant.businessName}...`}
          >
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};