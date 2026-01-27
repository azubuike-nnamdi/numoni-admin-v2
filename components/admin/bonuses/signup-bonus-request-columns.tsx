"use client";

import { formatDateReadable } from "@/lib/helper";
import { ColumnDef } from "@tanstack/react-table";

export interface SignupBonusRequestData {
  id: string;
  customerId: string;
  errorTypeEnum: string;
  errorMessage: string;
  retries: number;
  maxRetries: number;
  resolved: boolean;
  comment: string;
  updatedDt: string;
  createdDt: string;
}

export const signupBonusRequestColumns: ColumnDef<SignupBonusRequestData>[] = [
  {
    id: "serialNumber",
    header: "S/N",
    cell: ({ row }) => {
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
    accessorKey: "customerId",
    header: "Customer ID",
    cell: ({ row }) => (
      <div className="text-gray-900 text-sm font-medium">
        {row.getValue("customerId")}
      </div>
    ),
  },
  {
    accessorKey: "resolved",
    header: "Status",
    cell: ({ row }) => {
      const resolved = row.getValue("resolved") as boolean;
      const statusColor = resolved
        ? "bg-green-100 text-green-800 border-green-200"
        : "bg-yellow-100 text-yellow-800 border-yellow-200";

      return (
        <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${statusColor}`}>
          {resolved ? "Resolved" : "Pending"}
        </div>
      );
    },
  },
  {
    accessorKey: "comment",
    header: "Comment",
    cell: ({ row }) => {
      const comment = row.getValue("comment") as string;
      return (
        <div className="text-gray-600 text-sm max-w-xs truncate" title={comment}>
          {comment || "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "createdDt",
    header: "Created Date",
    cell: ({ row }) => (
      <div className="text-gray-600 text-sm">
        {formatDateReadable(row.getValue("createdDt"))}
      </div>
    ),
  },
  {
    accessorKey: "updatedDt",
    header: "Updated Date",
    cell: ({ row }) => (
      <div className="text-gray-600 text-sm">
        {formatDateReadable(row.getValue("updatedDt"))}
      </div>
    ),
  },
];

