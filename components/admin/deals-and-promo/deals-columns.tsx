"use client";

import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useApproveDeal } from "@/hooks/mutation/useApproveDeal";
import { useDeleteDeals } from "@/hooks/mutation/useDeleteDeals";
import { useMakeDealInternal } from "@/hooks/mutation/useMakeDealInternal";
import { useUpdateDeals } from "@/hooks/mutation/useUpdateDeals";
import { useUpdateDealStatus } from "@/hooks/mutation/useUpdateDealStatus";
import { formatCurrency, formatDateReadable, generateRandomBadgeColor, getApproveStatusColor, getApproveStatusText, getDealStatusColor, getDealStatusText } from "@/lib/helper";
import { DealData, EditDealPayload } from "@/lib/types";
import { useUserAuthStore } from "@/stores/user-auth-store";
import { ColumnDef } from "@tanstack/react-table";
import { Check, MoreVertical, Package, Settings, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ApproveDealDialog from "./approve-deal-dialog";
import EditDealDialog from "./edit-deal-dialog";
import MakeDealInternalDialog from "./make-deal-internal-dialog";
import RejectDealDialog from "./reject-deal-dialog";
import UpdateDealStatusDialog from "./update-deal-status-dialog";

// Extended DealData type that includes approveStatus from API response
type DealDataWithApproval = DealData & {
  approveStatus?: string | null;
};


// Column definitions
export const dealsColumns: ColumnDef<DealData>[] = [
  {
    id: "serialNumber",
    header: "S/N",
    cell: ({ row }) => {
      // Serial number starts from 1 for the current page
      // For pagination-aware serial numbers, you would need to pass currentPage and itemsPerPage
      const serialNumber = row.index + 1;
      return (
        <div className="text-gray-600 text-sm text-center">
          {serialNumber}
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: "Deal Title",
    cell: ({ row }) => {
      const deal = row.original;
      return (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            {deal.imagePath && deal.imagePath.length > 0 ? (
              <Image
                src={deal.imagePath[0].imagePath}
                alt={deal.name}
                className="w-10 h-10 rounded-lg object-cover"
                width={40}
                height={40}
              />
            ) : (
              <Package className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <div>
            <Link href={`/dashboard/deals-promo/${deal.id}/?dealName=${encodeURIComponent(deal.name)}`}>
              <div className="font-medium text-gray-900 hover:text-theme-dark-green cursor-pointer transition-colors">
                {deal.name}
              </div>
            </Link>
            <div className="text-xs text-gray-500">{deal.merchantName}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "availableStock",
    header: "Available Stock",
    cell: ({ row }) => (
      <div className="flex items-center space-x-1 text-gray-600 text-sm">
        <span>{row.getValue("availableStock")}</span>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const categories = row.getValue("category") as string[];
      const maxVisible = 1; // Show only the first category
      const visibleCategories = categories.slice(0, maxVisible);
      const remainingCount = categories.length - maxVisible;

      return (
        <div className="flex flex-wrap gap-1 items-center">
          {visibleCategories.map((category, index) => (
            <span
              key={index}
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${generateRandomBadgeColor(category)}`}
            >
              {category}
            </span>
          ))}
          {remainingCount > 0 && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border bg-gray-100 text-gray-600 border-gray-200">
              +{remainingCount}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "dealType",
    header: "Deal Type",
    cell: ({ row }) => (
      <div className="flex items-center space-x-1 text-gray-600 text-sm">
        <span className="font-medium">{row.getValue("dealType")}</span>
      </div>
    ),
  },
  {
    accessorKey: "discount",
    header: "Discount",
    cell: ({ row }) => (
      <div className="flex items-center space-x-1 text-green-600 text-sm font-medium">
        <span>{row.getValue("discount") ?? "0"}</span>
      </div>
    ),
  },
  {
    accessorKey: "initialPrice",
    header: "Initial Price",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("initialPrice") ?? "0");
      return (
        <div className="flex items-center space-x-1 text-gray-600 text-sm">
          <span>{formatCurrency(price) ?? "-"}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => {
      const dateStr = row.getValue("startDate") as string;
      // Convert DD-MM-YYYY to YYYY-MM-DD for proper parsing
      const [day, month, year] = dateStr.split('-');
      const formattedDate = `${year}-${month}-${day}`;
      return (
        <div className="flex items-center space-x-1 text-gray-600 text-sm">
          <span>{formatDateReadable(formattedDate)}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => {
      const dateStr = row.getValue("endDate") as string;
      // Convert DD-MM-YYYY to YYYY-MM-DD for proper parsing
      const [day, month, year] = dateStr.split('-');
      const formattedDate = `${year}-${month}-${day}`;
      return (
        <div className="flex items-center space-x-1 text-gray-600 text-sm">
          <span>{formatDateReadable(formattedDate)}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "dealStatus",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("dealStatus") as string;
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getDealStatusColor(status)}`}>
          {getDealStatusText(status)}
        </span>
      );
    },
  },
  {
    accessorKey: "approveStatus",
    header: "Approved Status",
    cell: ({ row }) => {
      const deal = row.original as DealDataWithApproval;
      const approveStatus = deal.approveStatus ?? null;
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getApproveStatusColor(approveStatus)}`}>
          {getApproveStatusText(approveStatus)}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      return <ActionCell deal={row.original} />;
    },
  },
];

// Action Cell Component
function ActionCell({ deal }: { deal: DealData }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isUpdateStatusDialogOpen, setIsUpdateStatusDialogOpen] = useState(false);
  const [isMakeDealInternalDialogOpen, setIsMakeDealInternalDialogOpen] = useState(false);
  const { handleDeleteDeals, isPending, isSuccess } = useDeleteDeals();
  const { handleUpdateDeals, isPending: isUpdatePending, isSuccess: isUpdateSuccess } = useUpdateDeals();
  const { handleApproveDeal, isPending: isApprovePending, isSuccess: isApproveSuccess } = useApproveDeal();
  const { handleUpdateDealStatus, isPending: isUpdateStatusPending, isSuccess: isUpdateStatusSuccess } = useUpdateDealStatus();
  const { handleMakeDealInternal, isPending: isMakeInternalPending, isSuccess: isMakeInternalSuccess } = useMakeDealInternal();

  const dealWithApproval = deal as DealDataWithApproval;
  const approveStatus = dealWithApproval.approveStatus ?? null;

  // const handleDeleteDealClick = () => {
  //   setIsDeleteDialogOpen(true);
  // };

  const handleEditDealClick = () => {
    setIsEditDialogOpen(true);
  };

  const handleApproveClick = () => {
    setIsApproveDialogOpen(true);
  };

  const handleRejectClick = () => {
    setIsRejectDialogOpen(true);
  };

  const handleUpdateStatusClick = () => {
    // Check if deal is approved before allowing status update
    if (approveStatus !== "APPROVED") {
      toast.error("Deal must be approved before the status can be updated");
      return;
    }
    setIsUpdateStatusDialogOpen(true);
  };

  const { user } = useUserAuthStore();

  const handleApproveConfirm = (adminComments: string) => {
    handleApproveDeal({
      dealId: deal.id,
      approvalStatus: "APPROVED",
      adminComments: adminComments || undefined,
      adminUsername: user?.username,
      approved: true,
    });
  };

  const handleRejectConfirm = (rejectionReason: string) => {
    handleApproveDeal({
      dealId: deal.id,
      approvalStatus: "REJECTED",
      rejectionReason: rejectionReason,
      adminUsername: user?.username,
      approved: false,
    });
  };

  const handleDeleteConfirm = () => {
    handleDeleteDeals({ dealId: deal.id });
  };

  const handleEditSave = (data: Omit<EditDealPayload, 'dealId'>) => {
    handleUpdateDeals({ ...data, dealId: deal.id });
  };

  const handleUpdateStatusConfirm = (status: string) => {
    handleUpdateDealStatus({
      dealId: deal.id,
      status: status,
    });
  };

  const handleMakeDealInternalClick = () => {
    setIsMakeDealInternalDialogOpen(true);
  };

  const handleMakeDealInternalConfirm = (isInternal: boolean) => {
    handleMakeDealInternal({
      dealId: deal.id,
      isInternal: isInternal,
    });
  };

  useEffect(() => {
    if (isSuccess) {
      setIsDeleteDialogOpen(false);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isUpdateSuccess) {
      setIsEditDialogOpen(false);
    }
  }, [isUpdateSuccess]);

  useEffect(() => {
    if (isApproveSuccess) {
      setIsApproveDialogOpen(false);
      setIsRejectDialogOpen(false);
    }
  }, [isApproveSuccess]);

  useEffect(() => {
    if (isUpdateStatusSuccess) {
      setIsUpdateStatusDialogOpen(false);
    }
  }, [isUpdateStatusSuccess]);

  useEffect(() => {
    if (isMakeInternalSuccess) {
      setIsMakeDealInternalDialogOpen(false);
    }
  }, [isMakeInternalSuccess]);

  return (
    <>
      <div className="flex items-center justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none">
              <MoreVertical className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem
              onClick={handleEditDealClick}
              className="cursor-pointer"
            >
              Edit Deal
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={handleUpdateStatusClick}
              disabled={isUpdateStatusPending || approveStatus !== "APPROVED"}
              className="cursor-pointer"
            >
              <Settings className="h-4 w-4 mr-2" />
              Update Deal Status
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {approveStatus !== "APPROVED" && (
              <DropdownMenuItem
                onClick={handleApproveClick}
                disabled={isApprovePending}
                className="cursor-pointer text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <Check className="h-4 w-4 mr-2" />
                Approve Deal
              </DropdownMenuItem>
            )}

            {approveStatus !== "REJECTED" && (
              <DropdownMenuItem
                onClick={handleRejectClick}
                disabled={isApprovePending}
                className="cursor-pointer text-orange-600 hover:text-orange-700 hover:bg-orange-50"
              >
                <X className="h-4 w-4 mr-2" />
                Reject Deal
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            {/* <DropdownMenuItem
              onClick={handleDeleteDealClick}
              className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Delete Deal
            </DropdownMenuItem> */}
            <DropdownMenuItem
              onClick={handleMakeDealInternalClick}
              className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Make Deal Internal
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Deal"
        description="This will permanently delete the deal and all associated data."
        itemName={deal.name}
        isLoading={isPending}
      />

      <EditDealDialog
        isOpen={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        deal={deal}
        onSave={handleEditSave}
        isLoading={isUpdatePending}
      />

      <ApproveDealDialog
        isOpen={isApproveDialogOpen}
        onClose={() => setIsApproveDialogOpen(false)}
        onConfirm={handleApproveConfirm}
        dealName={deal.name}
        isLoading={isApprovePending}
      />

      <RejectDealDialog
        isOpen={isRejectDialogOpen}
        onClose={() => setIsRejectDialogOpen(false)}
        onConfirm={handleRejectConfirm}
        dealName={deal.name}
        isLoading={isApprovePending}
      />

      <UpdateDealStatusDialog
        isOpen={isUpdateStatusDialogOpen}
        onClose={() => setIsUpdateStatusDialogOpen(false)}
        onConfirm={handleUpdateStatusConfirm}
        dealName={deal.name}
        currentStatus={deal.dealStatus}
        approveStatus={approveStatus}
        isLoading={isUpdateStatusPending}
      />

      <MakeDealInternalDialog
        isOpen={isMakeDealInternalDialogOpen}
        onClose={() => setIsMakeDealInternalDialogOpen(false)}
        onConfirm={handleMakeDealInternalConfirm}
        dealName={deal.name}
        isLoading={isMakeInternalPending}
      />
    </>
  );
}
