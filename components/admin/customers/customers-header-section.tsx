'use client';

import SearchInput from '@/components/common/search-input';
import { DateRangeSelector } from '@/components/ui/date-range-selector';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangeOption } from '@/lib/types';
import { RefreshCw } from 'lucide-react';

type FilterType = 'name' | 'email' | 'phone' | 'customerId' | '';

interface CustomersHeaderSectionProps {
  filterType: FilterType;
  onFilterTypeChange: (type: FilterType) => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder: string;
  dateRangeOption: DateRangeOption;
  onDateRangeChange: (option: DateRangeOption) => void;
  onDateRangeDatesChange: (start: Date | undefined, end: Date | undefined) => void;
  onResetFilter: () => void;
}

export default function CustomersHeaderSection({
  filterType,
  onFilterTypeChange,
  searchTerm,
  onSearchChange,
  searchPlaceholder,
  dateRangeOption,
  onDateRangeChange,
  onDateRangeDatesChange,
  onResetFilter,
}: CustomersHeaderSectionProps) {
  return (
    <div className="p-4 sm:p-6 border-b border-gray-200">
      <div className="flex flex-col gap-4">
        {/* First Row: Filter Type + Search Input */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Filter Type Dropdown */}
          <div className="w-full sm:w-48">
            <Select value={filterType} onValueChange={(value) => onFilterTypeChange(value as FilterType)}>
              <SelectTrigger className="w-full h-[42px] shadow-none">
                <SelectValue placeholder="Select filter type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phone">Phone Number</SelectItem>
                <SelectItem value="customerId">Customer ID</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Input */}
          <div className="flex-1">
            <SearchInput
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={onSearchChange}
              disabled={!filterType}
            />
          </div>
        </div>

        {/* Second Row: Date Range + Reset Button */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          {/* Date Range Selector */}
          <div className="w-full sm:w-64">
            <DateRangeSelector
              value={dateRangeOption}
              onValueChange={onDateRangeChange}
              onDatesChange={onDateRangeDatesChange}
              placeholder="Filter by created date range"
              showCustomRange={true}
            />
          </div>

          {/* Reset Filter Button */}
          <div className="flex items-center">
            <button
              onClick={onResetFilter}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer h-[42px]"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Reset Filter</span>
              <span className="sm:hidden">Reset</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

