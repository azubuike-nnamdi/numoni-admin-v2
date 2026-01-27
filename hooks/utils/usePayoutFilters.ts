import { DateRangeOption } from '@/lib/types';
import { endOfToday, format, startOfToday } from 'date-fns';
import { useEffect, useState } from 'react';
import { useDebounce } from './useDebounce';

interface PayoutFilters {
  merchantId: string;
  settlementRefId: string;
  payonusRefId: string;
  status: string;
  startDate: string;
  endDate: string;
  dateRangeOption: DateRangeOption;
}

interface UsePayoutFiltersReturn {
  filters: PayoutFilters;
  debouncedFilters: PayoutFilters;
  setFilter: <K extends keyof PayoutFilters>(key: K, value: PayoutFilters[K]) => void;
  resetFilters: () => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  showFilters: boolean;
  toggleFilters: () => void;
}

const initialFilters: PayoutFilters = {
  merchantId: '',
  settlementRefId: '',
  payonusRefId: '',
  status: '',
  startDate: format(startOfToday(), 'yyyy-MM-dd'),
  endDate: format(endOfToday(), 'yyyy-MM-dd'),
  dateRangeOption: 'Today',
};

export function usePayoutFilters(): UsePayoutFiltersReturn {
  const [filters, setFilters] = useState<PayoutFilters>(initialFilters);
  const [currentPage, setCurrentPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce all filters
  const debouncedMerchantId = useDebounce(filters.merchantId);
  const debouncedSettlementRefId = useDebounce(filters.settlementRefId);
  const debouncedPayonusRefId = useDebounce(filters.payonusRefId);
  const debouncedStatus = useDebounce(filters.status);
  const debouncedStartDate = useDebounce(filters.startDate);
  const debouncedEndDate = useDebounce(filters.endDate);
  const debouncedDateRangeOption = useDebounce(filters.dateRangeOption);

  const debouncedFilters: PayoutFilters = {
    merchantId: debouncedMerchantId,
    settlementRefId: debouncedSettlementRefId,
    payonusRefId: debouncedPayonusRefId,
    status: debouncedStatus,
    startDate: debouncedStartDate,
    endDate: debouncedEndDate,
    dateRangeOption: debouncedDateRangeOption,
  };

  // Reset to first page when any debounced filter changes
  useEffect(() => {
    setCurrentPage(0);
  }, [
    debouncedMerchantId,
    debouncedSettlementRefId,
    debouncedPayonusRefId,
    debouncedStatus,
    debouncedStartDate,
    debouncedEndDate,
    debouncedDateRangeOption,
  ]);

  const setFilter = <K extends keyof PayoutFilters>(key: K, value: PayoutFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setCurrentPage(0);
  };

  const toggleFilters = () => {
    setShowFilters((prev) => !prev);
  };

  return {
    filters,
    debouncedFilters,
    setFilter,
    resetFilters,
    currentPage,
    setCurrentPage,
    showFilters,
    toggleFilters,
  };
}
