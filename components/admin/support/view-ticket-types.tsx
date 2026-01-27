"use client";

import { ErrorState } from "@/components/ui/error-state";
import LoadingSpinner from "@/components/ui/loading-spinner";
import useGetTicketTypeList from "@/hooks/query/useGetTicketTypeList";
import { extractErrorMessage } from "@/lib/helper";

export default function ViewTicketTypes() {

  const { data: ticketTypeList, isPending: isPendingTicketTypeList, error: errorTicketTypeList, isError: isErrorTicketTypeList, refetch: refetchTicketTypeList } = useGetTicketTypeList();

  const ticketTypes = ticketTypeList?.data?.data || [];

  if (isPendingTicketTypeList) {
    return <LoadingSpinner message="Loading ticket types..." />;
  }

  if (isErrorTicketTypeList) {
    return <ErrorState title="Error Loading Ticket Types" message={extractErrorMessage(errorTicketTypeList) || "Failed to load ticket types. Please try again."} onRetry={() => refetchTicketTypeList()} retryText="Try Again" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Ticket Types</h1>
          <p className="text-gray-600 mt-1">Manage and view all ticket types</p>
        </div>

        {ticketTypes.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No ticket types found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ticketTypes.map((ticketType: { id: string; userType: string | null; name: string | null }) => (
              <div
                key={ticketType.id}
                className="bg-white rounded-xl border border-gray-200 p-6 transition-shadow"
              >
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {ticketType.name || "Unnamed Ticket Type"}
                    </h3>
                    {/* <p className="text-xs text-gray-500 font-mono">ID: {ticketType.id}</p> */}
                  </div>

                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">User Type:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {ticketType.userType || "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}