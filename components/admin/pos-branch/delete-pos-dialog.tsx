'use client';

import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";

interface DeletePOSDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  posName: string;
  posId: string;
  isLoading?: boolean;
}

export default function DeletePOSDialog({
  isOpen,
  onClose,
  onConfirm,
  posName,
  posId,
  isLoading = false,
}: DeletePOSDialogProps) {
  return (
    <DeleteConfirmationDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete POS"
      description={`This will permanently delete the POS and all associated data. POS ID: ${posId}`}
      itemName={posName || posId}
      isLoading={isLoading}
    />
  );
}