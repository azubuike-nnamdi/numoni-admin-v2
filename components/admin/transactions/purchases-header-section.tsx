"use client";

import SearchInput from '@/components/common/search-input';
import { DateRangeSelector } from '@/components/ui/date-range-selector';
import { DateRangeOption } from '@/lib/types';
import { format } from 'date-fns';
import { Filter, RefreshCw } from 'lucide-react';

interface PurchasesHeaderSectionProps {
  customerName: string;
  onCustomerNameChange: (value: string) => void;
  dealName: string;
  onDealNameChange: (value: string) => void;
  transactionId: string;
  onTransactionIdChange: (value: string) => void;
  dealId: string;
  onDealIdChange: (value: string) => void;
  purchaseId: string;
  onPurchaseIdChange: (value: string) => void;
  startDate: string;
  onStartDateChange: (value: string) => void;
  endDate: string;
  onEndDateChange: (value: string) => void;
  dateRangeOption: DateRangeOption;
  onDateRangeOptionChange: (option: DateRangeOption) => void;
  onResetFilter: () => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

export default function PurchasesHeaderSection({
  customerName,
  onCustomerNameChange,
  dealName,
  onDealNameChange,
  transactionId,
  onTransactionIdChange,
  dealId,
  onDealIdChange,
  purchaseId,
  onPurchaseIdChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  dateRangeOption,
  onDateRangeOptionChange,
  onResetFilter,
  showFilters,
  onToggleFilters
}: Readonly<PurchasesHeaderSectionProps>) {
  return (
    <div className="p-6 border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <SearchInput
          placeholder="Search by customer name"
          value={customerName}
          onChange={onCustomerNameChange}
        />

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleFilters}
            aria-pressed={showFilters}
            className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${showFilters ? 'bg-gray-100 border-gray-400' : 'border-gray-300 hover:bg-gray-50'}`}
          >
            <Filter className="h-4 w-4" />
            Filter By
          </button>

          <DateRangeSelector
            value={dateRangeOption}
            onValueChange={onDateRangeOptionChange}
            onDatesChange={(start, end) => {
              onStartDateChange(start ? format(start, 'yyyy-MM-dd') : '');
              onEndDateChange(end ? format(end, 'yyyy-MM-dd') : '');
            }}
            showCustomRange
            placeholder="Select Range"
          />

          <button
            onClick={onResetFilter}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            Reset Filter
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div>
            <label htmlFor='deal-name' className="block text-sm font-medium text-gray-700 mb-2">
              Deal Name
            </label>
            <input
              type="text"
              placeholder="Filter by deal name"
              value={dealName}
              onChange={(e) => onDealNameChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor='transaction-id' className="block text-sm font-medium text-gray-700 mb-2">
              Transaction ID
            </label>
            <input
              type="text"
              placeholder="Filter by transaction ID"
              value={transactionId}
              onChange={(e) => onTransactionIdChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor='deal-id' className="block text-sm font-medium text-gray-700 mb-2">
              Deal ID
            </label>
            <input
              type="text"
              placeholder="Filter by deal ID"
              value={dealId}
              onChange={(e) => onDealIdChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor='purchase-id' className="block text-sm font-medium text-gray-700 mb-2">
              Purchase ID
            </label>
            <input
              type="text"
              placeholder="Filter by purchase ID"
              value={purchaseId}
              onChange={(e) => onPurchaseIdChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor='start-date' className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                onStartDateChange(e.target.value);
                onDateRangeOptionChange('Custom Range');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor='end-date' className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                onEndDateChange(e.target.value);
                onDateRangeOptionChange('Custom Range');
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      )}
    </div>
  );
}

