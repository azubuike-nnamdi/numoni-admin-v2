'use client';

import { DataTable } from '@/components/ui/data-table';

import { EmptyState } from '@/components/ui/empty-state';
import { ErrorState } from '@/components/ui/error-state';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { ADMIN_CUSTOMERS_ADD_URL } from '@/constant/routes';
import useGetCustomers from '@/hooks/query/useGetCustomers';
import { formatDateForAPI, getTimelineDates } from '@/lib/helper';
import { DateRangeOption } from '@/lib/types';
import { Customer } from '@/lib/types/customer';
import { ChevronLeft, ChevronRight, Download, Info, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { customerColumns } from './customer-columns';
import CustomersHeaderSection from './customers-header-section';

type FilterType = 'name' | 'email' | 'phone' | 'customerId' | '';

export default function Customers() {
  const [filterType, setFilterType] = useState<FilterType>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // 0-based for server-side pagination
  const [dateRangeOption, setDateRangeOption] = useState<DateRangeOption>(null);
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>(undefined);
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>(undefined);

  const itemsPerPage = 20;

  // Convert date range option to API date strings in dd-mm-yyyy format
  const { startDate, endDate } = useMemo(() => {
    if (dateRangeOption === 'Custom Range') {
      // Use custom dates if Custom Range is selected
      if (customStartDate && customEndDate) {
        // Format dates as dd-mm-yyyy
        const formatDate = (date: Date): string => {
          const day = String(date.getDate()).padStart(2, '0');
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const year = date.getFullYear();
          return `${day}-${month}-${year}`;
        };
        return {
          startDate: formatDate(customStartDate),
          endDate: formatDate(customEndDate),
        };
      }
      return { startDate: undefined, endDate: undefined };
    }

    if (dateRangeOption === null) {
      return { startDate: undefined, endDate: undefined };
    }

    // Use getTimelineDates for predefined ranges (returns yyyy-MM-dd)
    // Convert to dd-mm-yyyy format using formatDateForAPI
    const dates = getTimelineDates(dateRangeOption);
    return {
      startDate: formatDateForAPI(dates.startDate),
      endDate: formatDateForAPI(dates.endDate),
    };
  }, [dateRangeOption, customStartDate, customEndDate]);

  // Parse search term based on selected filter type
  const parseSearchTerm = (searchValue: string, type: FilterType) => {
    const trimmed = searchValue.trim();
    if (!trimmed || !type) {
      return {
        name: undefined,
        customerEmail: undefined,
        customerPhoneNo: undefined,
        customerId: undefined,
      };
    }

    // Apply filter based on selected type
    switch (type) {
      case 'name':
        return {
          name: trimmed,
          customerEmail: undefined,
          customerPhoneNo: undefined,
          customerId: undefined,
        };
      case 'email':
        return {
          name: undefined,
          customerEmail: trimmed,
          customerPhoneNo: undefined,
          customerId: undefined,
        };
      case 'phone': {
        // Clean phone number (remove spaces, dashes, parentheses, keep + if present)
        const digitsOnly = trimmed.replace(/\D/g, '');
        const hasPlus = trimmed.startsWith('+');
        const cleanedPhone = hasPlus ? '+' + digitsOnly : digitsOnly;
        return {
          name: undefined,
          customerEmail: undefined,
          customerPhoneNo: cleanedPhone,
          customerId: undefined,
        };
      }
      case 'customerId':
        return {
          name: undefined,
          customerEmail: undefined,
          customerPhoneNo: undefined,
          customerId: trimmed,
        };
      default:
        return {
          name: undefined,
          customerEmail: undefined,
          customerPhoneNo: undefined,
          customerId: undefined,
        };
    }
  };

  // Get placeholder text based on filter type
  const getSearchPlaceholder = (type: FilterType): string => {
    switch (type) {
      case 'name':
        return 'Enter customer name';
      case 'email':
        return 'Enter customer email';
      case 'phone':
        return 'Enter phone number';
      case 'customerId':
        return 'Enter customer ID';
      default:
        return 'Select filter type first';
    }
  };

  // Debounce search term - wait 1 second after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  // Parse search term based on selected filter type
  const searchFilters = parseSearchTerm(debouncedSearchTerm, filterType);

  // Use parsed search filters, pass page (0-based) and size
  const { data, isPending, error, isError, refetch } = useGetCustomers({
    page: currentPage,
    size: itemsPerPage,
    ...searchFilters,
    startDate,
    endDate,
  });

  // Extract customers data from API response
  const apiData = data?.data?.data;
  const customers: Customer[] = apiData?.pageData || [];
  const totalRows = apiData?.totalRows || 0;
  const totalPages = apiData?.totalPages || 0;

  // Calculate pagination display values
  const startIndex = currentPage * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalRows);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages - 1));
  };

  // Reset to first page when debounced search term, filter type, or date range changes
  useEffect(() => {
    setCurrentPage(0);
  }, [debouncedSearchTerm, filterType, dateRangeOption, customStartDate, customEndDate]);

  // Clear search term when filter type changes
  useEffect(() => {
    setSearchTerm('');
    setDebouncedSearchTerm('');
  }, [filterType]);

  const handleDateRangeDatesChange = (start: Date | undefined, end: Date | undefined) => {
    setCustomStartDate(start);
    setCustomEndDate(end);
  };

  const handleResetFilter = () => {
    setFilterType('');
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setDateRangeOption(null);
    setCustomStartDate(undefined);
    setCustomEndDate(undefined);
    setCurrentPage(0); // Reset to first page when clearing filters
  };

  // Show loading state
  if (isPending) {
    return (
      <LoadingSpinner message="Loading customers..." />
    );
  }

  // Show error state
  if (isError) {
    return (
      <ErrorState title="Error Loading Customers" message={error?.message || "Failed to load customers. Please try again."} onRetry={refetch} retryText="Retry" />
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Header with Search and Filters */}
      <CustomersHeaderSection
        filterType={filterType}
        onFilterTypeChange={setFilterType}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={getSearchPlaceholder(filterType)}
        dateRangeOption={dateRangeOption}
        onDateRangeChange={setDateRangeOption}
        onDateRangeDatesChange={handleDateRangeDatesChange}
        onResetFilter={handleResetFilter}
      />

      {/* Data Table */}
      <div className="p-0">
        {customers.length === 0 ? (
          // Empty State
          <EmptyState
            title="No Customers Found"
            description="No customers match your current search criteria. Try adjusting your search terms."
            actionButton={
              <Link href={ADMIN_CUSTOMERS_ADD_URL}>
                <button className="flex items-center gap-2 bg-theme-dark-green hover:bg-theme-dark-green/90 text-white px-6 py-3 rounded-lg font-medium transition-colors cursor-pointer">
                  <Plus className="h-5 w-5" />
                  Add Customers
                </button>
              </Link>
            }
          />
        ) : (
          // Data Table
          <DataTable columns={customerColumns} data={customers} />
        )}
      </div>

      {/* Pagination and Row Actions */}
      {customers.length > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Row Count */}
            <div className="text-sm text-gray-600 order-2 sm:order-1">
              Showing {startIndex + 1}-{endIndex} of {totalRows}
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
                disabled={currentPage === 0}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="px-3 py-1 text-sm text-gray-600 whitespace-nowrap">
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