"use client";

import SearchInput from '@/components/common/search-input';
import { Button } from '@/components/ui/button';
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import LoadingSpinner from "@/components/ui/loading-spinner";
import useGetSupportTicketList from "@/hooks/query/useGetSupportTicketList";
import { ChevronLeft, ChevronRight, Download, Info, RefreshCw, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { SupportTicket, supportTicketColumns } from "./support-ticket-columns";

export default function ViewSupportTickets() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: supportTicketList, isPending: isPendingSupportTicketList, error: errorSupportTicketList, isError: isErrorSupportTicketList, refetch: refetchSupportTicketList } = useGetSupportTicketList();

  // Extract tickets data from API response
  const apiData = supportTicketList?.data?.data;
  const allTickets: SupportTicket[] = useMemo(() => {
    return (apiData?.pageData as SupportTicket[]) || [];
  }, [apiData]);

  // Filter tickets based on search term
  const filteredTickets = useMemo(() => {
    if (!searchTerm.trim()) return allTickets;

    const searchLower = searchTerm.toLowerCase().trim();
    return allTickets.filter(ticket =>
      ticket.name.toLowerCase().includes(searchLower) ||
      ticket.userType.toLowerCase().includes(searchLower) ||
      (ticket.ticketType?.toLowerCase().includes(searchLower)) ||
      (ticket.description?.toLowerCase().includes(searchLower)) ||
      (ticket.assignToName?.toLowerCase().includes(searchLower)) ||
      (ticket.status?.toLowerCase().includes(searchLower))
    );
  }, [searchTerm, allTickets]);

  const itemsPerPage = 20;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTickets = filteredTickets.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, Math.ceil(filteredTickets.length / itemsPerPage)));
  };

  const handleResetFilter = () => {
    setSearchTerm('');
  };

  // Render function for data table content
  const renderDataTableContent = () => {
    if (currentTickets.length === 0) {
      return (
        <EmptyState
          title="No Support Tickets Found"
          description="No support tickets match your current search criteria. Try adjusting your search terms."
          actionButton={
            <Button
              onClick={handleResetFilter}
              className="flex items-center gap-2 bg-theme-dark-green hover:bg-theme-dark-green/90 text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer"
            >
              Clear Search
            </Button>
          }
        />
      );
    }

    return <DataTable columns={supportTicketColumns} data={currentTickets} />;
  };

  // Show loading state
  if (isPendingSupportTicketList) {
    return <LoadingSpinner message="Loading support tickets..." />;
  }

  // Show error state
  if (isErrorSupportTicketList) {
    return (
      <ErrorState
        title="Error Loading Support Tickets"
        message={errorSupportTicketList?.message || "Failed to load support tickets. Please try again."}
        onRetry={() => refetchSupportTicketList()}
        retryText="Try Again"
      />
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Header with Search and Filters */}
      <div className="p-6 border-gray-200">
        <div className="flex items-center justify-between mb-4">
          {/* Search Input */}
          <SearchInput
            placeholder="Search by name, user type, ticket type, description, assignee, or status..."
            value={searchTerm}
            onChange={setSearchTerm}
          />

          {/* Filter Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetFilter}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              Reset Filter
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="p-0">
        {renderDataTableContent()}
      </div>

      {/* Pagination and Row Actions */}
      {currentTickets.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            {/* Row Count */}
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredTickets.length)} of {filteredTickets.length} support tickets
            </div>

            {/* Row Action Icons */}
            <div className="flex items-center gap-4">
              <button
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Download"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                title="Information"
              >
                <Info className="h-4 w-4" />
              </button>
              <button
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-gray-600 px-3">
                Page {currentPage} of {Math.ceil(filteredTickets.length / itemsPerPage)}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === Math.ceil(filteredTickets.length / itemsPerPage)}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}