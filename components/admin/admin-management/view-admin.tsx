'use client';

import SearchInput from '@/components/common/search-input';
import { DataTable } from '@/components/ui/data-table';
import { ErrorState } from '@/components/ui/error-state';
import LoadingSpinner from '@/components/ui/loading-spinner';
import useGetAdminList from '@/hooks/query/useGetAdminList';
import { extractErrorMessage } from '@/lib/helper';
import { Admin } from '@/lib/types/admin';
import { ChevronDown, ChevronLeft, ChevronRight, Download, Filter, Info, RefreshCw, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { adminColumns } from './admin-columns';

export default function ViewAdmin() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { data: adminList, isPending: isAdminListPending, error: isAdminError, isError: isAdminListError, refetch: refetchAdminList } = useGetAdminList();
  const admins = adminList?.data?.data?.pageData || [];
  // console.log(admins);
  // const [filterBy, setFilterBy] = useState('');
  // const [roleFilter, setRoleFilter] = useState('');
  // const [teamFilter, setTeamFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const itemsPerPage = 12;

  // Filter admins based on search term
  const filteredAdmins = useMemo(() => {
    if (!searchTerm.trim()) return admins;

    const searchLower = searchTerm.toLowerCase().trim();
    return admins.filter((admin: Admin) =>
      admin.name?.toLowerCase().includes(searchLower) ||
      admin.email?.toLowerCase().includes(searchLower) ||
      admin.id?.toLowerCase().includes(searchLower) ||
      admin.roleName?.toLowerCase().includes(searchLower) ||
      admin.department?.toLowerCase().includes(searchLower) ||
      admin.position?.toLowerCase().includes(searchLower)
    );
  }, [searchTerm, admins]);

  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAdmins = filteredAdmins.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handleResetFilter = () => {

    setSearchTerm('');
  };

  if (isAdminListPending) {
    return <LoadingSpinner message="Loading Admins..." />;
  }

  if (isAdminListError) {
    return <ErrorState title="Error Loading Admins" message={extractErrorMessage(isAdminError) || "Failed to load admins. Please try again."} onRetry={() => refetchAdminList()} retryText="Try Again" />;
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Header with Search and Filters */}
      <div className="p-4 sm:p-6 border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
          {/* Search Input */}
          <div className="w-full lg:max-w-md">
            <SearchInput
              placeholder="Search Admin Name"
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filter By</span>
            </button>

            <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="hidden sm:inline">Role</span>
              <span className="sm:hidden">Role</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            <button className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="hidden sm:inline">Team</span>
              <span className="sm:hidden">Team</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            <button
              onClick={handleResetFilter}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Reset Filter</span>
              <span className="sm:hidden">Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="p-0">
        <DataTable columns={adminColumns} data={currentAdmins} />

      </div>

      {/* Pagination and Row Actions */}
      {!isAdminListPending && currentAdmins.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Row Count */}
            <div className="text-sm text-gray-600 order-2 sm:order-1">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredAdmins.length)} of {filteredAdmins.length}
            </div>

            {/* Row Action Icons */}
            <div className="flex items-center gap-2 sm:gap-4 order-1 sm:order-2">
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
            <div className="flex items-center justify-center gap-2 order-3">
              <button
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-3 py-1 text-sm text-gray-600 whitespace-nowrap">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
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