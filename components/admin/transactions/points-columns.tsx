"use client";

import { formatDateReadable, formatValue } from "@/lib/helper";
import { ColumnDef } from "@tanstack/react-table";

export interface PointsTransactionData {
  receiveCustomerId: string | null;
  customerId: string;
  senderCustomerId: string;
  customerName: string | null;
  senderName: string | null;
  receiverName: string | null;
  amount: number;
  transactionType: "SHARE_POINTS_DEBIT" | "SHARE_POINTS_CREDIT";
  transactionId: string;
  transactionRefId: string;
  type: "CUSTOMER_ID" | "MOBILE_NO";
  timestamp: string;
}

export const pointsColumns: ColumnDef<PointsTransactionData>[] = [
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
    accessorKey: "transactionRefId",
    header: "Transaction Ref",
    cell: ({ row }) => (
      <div className="text-gray-600 text-sm font-mono">
        {row.getValue("transactionRefId")}
      </div>
    ),
  },
  {
    accessorKey: "customerId",
    header: "Customer ID",
    cell: ({ row }) => (
      <div className="text-gray-600 text-sm">
        {row.getValue("customerId")}
      </div>
    ),
  },
  {
    accessorKey: "customerName",
    header: "Customer Name",
    cell: ({ row }) => {
      const customerName = row.getValue("customerName") as string | null;
      return (
        <div className="text-gray-900 text-sm font-medium">
          {customerName || "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "senderName",
    header: "Sender Name",
    cell: ({ row }) => {
      const senderName = row.getValue("senderName") as string | null;
      return (
        <div className="text-gray-900 text-sm font-medium">
          {senderName || "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "receiverName",
    header: "Receiver Name",
    cell: ({ row }) => {
      const receiverName = row.getValue("receiverName") as string | null;
      return (
        <div className="text-gray-900 text-sm font-medium">
          {receiverName || "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <div className="text-gray-900 text-sm font-medium">
        {formatValue(row.getValue("amount"), false)}
      </div>
    ),
  },
  {
    accessorKey: "transactionType",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("transactionType") as string;
      const isCredit = type === "SHARE_POINTS_CREDIT";
      const statusColor = isCredit
        ? "bg-green-100 text-green-800 border-green-200"
        : "bg-red-100 text-red-800 border-red-200";

      return (
        <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${statusColor}`}>
          {isCredit ? "CREDIT" : "DEBIT"}
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Identifier Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <div className="text-gray-600 text-sm">
          {type === "CUSTOMER_ID" ? "Customer ID" : "Mobile No"}
        </div>
      );
    },
  },
  {
    accessorKey: "timestamp",
    header: "Date",
    cell: ({ row }) => (
      <div className="text-gray-600 text-sm">
        {formatDateReadable(row.getValue("timestamp"))}
      </div>
    ),
  },
];

