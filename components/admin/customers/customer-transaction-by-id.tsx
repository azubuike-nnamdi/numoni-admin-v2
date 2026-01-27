"use client";

import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import LoadingSpinner from "@/components/ui/loading-spinner";
import useGetTransactionListByCustomerId from "@/hooks/query/useGetTransactionListByCustomerId";
import { extractErrorMessage, formatDateReadable, getTransactionTypeColor } from "@/lib/helper";
import { ColumnDef } from "@tanstack/react-table";

type Transaction = {
  date: string;
  amount: number;
  balance: number;
  merchantId: string | null;
  customerId: string;
  transactionNo: string;
  type: string;
  transactionId: string;
  status: string;
};

const transactionColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "date",
    header: "Date & Time",
    cell: ({ row }) => {
      const date = new Date(row.getValue("date") as string);
      return (
        <div className="text-gray-600 text-sm">
          <div>{formatDateReadable(row.getValue("date") as string)}</div>
          <div className="text-xs text-gray-500">
            {date.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            })}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "transactionId",
    header: "Transaction ID",
    cell: ({ row }) => {
      const transactionId = row.getValue("transactionId") as string;
      return (
        <div className="text-gray-600 text-sm font-mono">
          {transactionId?.length > 12 ? `${transactionId.slice(0, 8)}...` : transactionId}
        </div>
      );
    },
  },
  {
    accessorKey: "transactionNo",
    header: "Transaction No",
    cell: ({ row }) => {
      const transactionNo = row.getValue("transactionNo") as string;
      return (
        <div className="text-gray-600 text-sm font-mono">
          {transactionNo?.length > 20 ? `${transactionNo?.slice(0, 20)}...` : transactionNo}
        </div>
      );
    },
  },
  {
    accessorKey: "customerId",
    header: "Customer ID",
    cell: ({ row }) => {
      const customerId = row.getValue("customerId") as string;
      return (
        <div className="text-gray-600 text-sm">
          {customerId}
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string;
      return (
        <Badge
          variant="outline"
          className={`${getTransactionTypeColor(type)} text-xs`}
        >
          {type.replace(/_/g, ' ')}
        </Badge>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.getValue("amount") as number;
      return (
        <div className="text-gray-900 text-sm font-medium">
          ₦{amount?.toLocaleString()}
        </div>
      );
    },
  },
  {
    accessorKey: "balance",
    header: "Balance",
    cell: ({ row }) => {
      const balance = row.getValue("balance") as number;
      return (
        <div className="text-gray-600 text-sm">
          ₦{balance?.toLocaleString()}
        </div>
      );
    },
  },
  {
    accessorKey: "merchantId",
    header: "Merchant ID",
    cell: ({ row }) => {
      const merchantId = row.getValue("merchantId") as string | null;
      return (
        <div className="text-gray-600 text-sm">
          {merchantId || "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const getStatusColor = (status: string) => {
        switch (status) {
          case "COMPLETED":
            return "bg-green-100 text-green-800 border-green-200";
          case "PENDING":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
          case "FAILED":
            return "bg-red-100 text-red-800 border-red-200";
          default:
            return "bg-gray-100 text-gray-800 border-gray-200";
        }
      };
      return (
        <Badge
          variant="outline"
          className={`${getStatusColor(status)} text-xs`}
        >
          {status}
        </Badge>
      );
    },
  },
];

export default function CustomerTransactionById({ customerId }: { customerId: string }) {
  const { data, isPending, error, isError, refetch } = useGetTransactionListByCustomerId({ customerId });

  if (isPending) {
    return <LoadingSpinner message="Loading transaction list..." />;
  }
  if (isError) {
    return <ErrorState title="Error Loading Transaction List" message={extractErrorMessage(error) || "Failed to load transaction list. Please try again."} onRetry={refetch} retryText="Retry" />;
  }

  const transactions = data?.data?.data || [];

  if (transactions.length === 0) {
    return <EmptyState title="No transaction found" description="No transaction found. Please try again." />;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="p-0">
        <DataTable columns={transactionColumns} data={transactions} />
      </div>
    </div>
  );
}