'use client';

import SearchInput from '@/components/common/search-input';
import { DataTable } from '@/components/ui/data-table';
import { ErrorState } from '@/components/ui/error-state';
import LoadingSpinner from '@/components/ui/loading-spinner';
import useGetActivityList from '@/hooks/query/useGetActivityList';
import { extractErrorMessage, mapApiActivityToActivityLog } from '@/lib/helper';
import { ChevronLeft, ChevronRight, Download, Info, RefreshCw, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { activityLogColumns } from './activity-log-columns';

export default function ActivityLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // 0-based for server-side pagination
  const itemsPerPage = 10;

  // Use searchTerm as userName filter, pass page (0-based) and size
  const { data, isPending, error, isError, refetch } = useGetActivityList({
    page: currentPage,
    size: itemsPerPage,
    userName: searchTerm.trim() || undefined, // Send search term as userName filter
  });

  const activityLogs = useMemo(() => {
    const rawActivityLogs = data?.data?.data?.pageData || [];
    return mapApiActivityToActivityLog(Array.isArray(rawActivityLogs) ? rawActivityLogs : []);
  }, [data?.data?.data?.pageData]);

  // Get pagination metadata from API response
  const totalElements = data?.data?.data?.totalElements || 0;
  const totalPages = data?.data?.data?.totalPages || 0;
  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalElements);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
  };

  const handleResetFilter = () => {
    setSearchTerm('');
    setCurrentPage(0); // Reset to first page when clearing filters
  };

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchTerm]);

  if (isPending) {
    return <LoadingSpinner message="Loading activity logs..." />;
  }
  if (isError) {
    return <ErrorState title="Error Loading Activity Logs" message={extractErrorMessage(error) || "Failed to load activity logs. Please try again."} onRetry={refetch} retryText="Retry" />;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Header with Search and Reset Filter */}
      <div className="p-6 border-gray-200">
        <div className="flex items-center justify-between mb-4">
          {/* Search Input */}
          <SearchInput
            placeholder="Search Activity Log"
            value={searchTerm}
            onChange={setSearchTerm}
          />

          {/* Reset Filter Button */}
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
        {activityLogs.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-16 px-8">
            {/* Illustration */}
            <div className="w-32 h-32 mb-6 flex items-center justify-center">
              <div className="w-24 h-20 bg-gray-100 rounded-lg relative">
                {/* Box illustration */}
                <div className="absolute inset-2 border-2 border-gray-300 rounded"></div>
                <div className="absolute top-0 left-2 right-2 h-2 bg-gray-300 rounded-t"></div>
                {/* Dashed lines and stars */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                  <div className="w-8 h-8 border-2 border-dashed border-green-400 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                </div>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"></div>
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-green-400 rounded-full"></div>
              </div>
            </div>

            {/* Text Content */}
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No Activity Logs Found</h3>
            <p className="text-gray-600 text-center max-w-md mb-8 leading-relaxed">
              No activity logs match your current search criteria. Try adjusting your search terms.
            </p>
          </div>
        ) : (
          // Data Table with alternating row colors
          <div className="overflow-x-auto">
            <DataTable
              columns={activityLogColumns}
              data={activityLogs}
            />
          </div>
        )}
      </div>

      {/* Pagination and Row Actions */}
      {activityLogs.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            {/* Row Count */}
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1}-{endIndex} of {totalElements}
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
                disabled={currentPage === 0}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-3 py-1 text-sm text-gray-600">
                Page {currentPage + 1} of {totalPages || 1}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage >= totalPages - 1 || totalPages === 0}
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