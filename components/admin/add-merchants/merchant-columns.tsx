"use client";

import { Badge } from "@/components/ui/badge";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useDeleteMerchant } from "@/hooks/mutation/useDeleteMerchant";
import { formatDateReadable, generateRandomBadgeColor } from "@/lib/helper";
import { ColumnDef } from "@tanstack/react-table";
import { MoreVertical } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UpdateMerchantStatusDialog } from "./update-merchant-status-dialog";

// Merchant type definition based on API response
export type Merchant = {
  id: string;
  userId: string;
  businessName: string;
  createdDt: string;
  email: string;
  businessPhoneNo: string | null;
  category: string[];
};



// Column definitions
export const merchantColumns: ColumnDef<Merchant>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
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
    accessorKey: "businessName",
    header: "Business Name",
    cell: ({ row }) => {
      const merchant = row.original;
      return (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm">
            {merchant?.businessName?.charAt(0).toUpperCase()}
          </div>
          <div>
            <Link href={`/dashboard/merchants/${merchant?.id}/?userId=${merchant?.userId}&merchantName=${encodeURIComponent(merchant.businessName)}`}>
              <div className="font-medium text-gray-900 hover:text-theme-dark-green cursor-pointer transition-colors">
                {merchant?.businessName}
              </div>
            </Link>
            <div className="text-xs text-gray-500">ID: {merchant?.id}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "createdDt",
    header: "Date Joined",
    cell: ({ row }) => (
      <div className="text-gray-600 text-sm">{formatDateReadable(row.getValue("createdDt"))}</div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email Address",
    cell: ({ row }) => (
      <div className="text-gray-600 text-sm">{row.getValue("email")}</div>
    ),
  },
  // {
  //   accessorKey: "businessPhoneNo",
  //   header: "Phone Number",
  //   cell: ({ row }) => (
  //     <div className="text-gray-600 text-sm">{row.getValue("businessPhoneNo") || "N/A"}</div>
  //   ),
  // },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const categories = row.original.category;
      return (
        <div className="flex flex-wrap gap-1">
          {categories?.map((cat, index) => (
            <Badge
              key={index}
              variant="outline"
              className={`${generateRandomBadgeColor(cat)} text-xs`}
            >
              {cat}
            </Badge>
          )) || <span className="text-gray-500 text-xs">No categories</span>}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => {
      return <ActionCell merchant={row.original} />;
    },
  },
];

// Action Cell Component
function ActionCell({ merchant }: { merchant: Merchant }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const { handleDeleteMerchant, isPending, isSuccess } = useDeleteMerchant();
  const router = useRouter();

  const handleViewProfile = () => {
    // Navigate to profile page
    router.push(`/dashboard/merchants/${merchant?.userId}/?merchantName=${encodeURIComponent(merchant.businessName)}`);
  };

  const handleUpdateMerchantStatus = () => {
    setIsUpdateDialogOpen(true);
  };

  const handleDeleteMerchantClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    handleDeleteMerchant(merchant.userId);

  };

  useEffect(() => {
    if (isSuccess) {
      setIsDeleteDialogOpen(false);
    }
  }, [isSuccess]);

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
              onClick={handleViewProfile}
              className="cursor-pointer"
            >
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleUpdateMerchantStatus}
              className="cursor-pointer"
            >
              Update Merchant Status
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleDeleteMerchantClick}
              className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              Delete Merchant
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Merchant"
        description="This will permanently delete the merchant and all associated data."
        itemName={merchant.businessName}
        isLoading={isPending}
      />

      <UpdateMerchantStatusDialog
        isOpen={isUpdateDialogOpen}
        onClose={() => setIsUpdateDialogOpen(false)}
        merchant={merchant}
      />
    </>
  );
}
