import { DateRangeOption } from '@/lib/types';
import { endOfToday, format, startOfToday } from 'date-fns';
import { useEffect, useState } from 'react';
import { useDebounce } from './useDebounce';

interface FundingFilters {
  sessionId: string;
  providerId: string;
  senderName: string;
  customerId: string;
  startDate: string;
  endDate: string;
  dateRangeOption: DateRangeOption;
}

interface UseFundingFiltersReturn {
  filters: FundingFilters;
  debouncedFilters: FundingFilters;
  setFilter: <K extends keyof FundingFilters>(key: K, value: FundingFilters[K]) => void;
  resetFilters: () => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  showFilters: boolean;
  toggleFilters: () => void;
}

const initialFilters: FundingFilters = {
  sessionId: '',
  providerId: '',
  senderName: '',
  customerId: '',
  startDate: format(startOfToday(), 'yyyy-MM-dd'),
  endDate: format(endOfToday(), 'yyyy-MM-dd'),
  dateRangeOption: 'Today',
};

export function useFundingFilters(): UseFundingFiltersReturn {
  const [filters, setFilters] = useState<FundingFilters>(initialFilters);
  const [currentPage, setCurrentPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  // Debounce all filters
  const debouncedSessionId = useDebounce(filters.sessionId);
  const debouncedProviderId = useDebounce(filters.providerId);
  const debouncedSenderName = useDebounce(filters.senderName);
  const debouncedCustomerId = useDebounce(filters.customerId);
  const debouncedStartDate = useDebounce(filters.startDate);
  const debouncedEndDate = useDebounce(filters.endDate);
  const debouncedDateRangeOption = useDebounce(filters.dateRangeOption);

  const debouncedFilters: FundingFilters = {
    sessionId: debouncedSessionId,
    providerId: debouncedProviderId,
    senderName: debouncedSenderName,
    customerId: debouncedCustomerId,
    startDate: debouncedStartDate,
    endDate: debouncedEndDate,
    dateRangeOption: debouncedDateRangeOption,
  };

  // Reset to first page when any debounced filter changes
  useEffect(() => {
    setCurrentPage(0);
  }, [
    debouncedSessionId,
    debouncedProviderId,
    debouncedSenderName,
    debouncedCustomerId,
    debouncedStartDate,
    debouncedEndDate,
    debouncedDateRangeOption,
  ]);

  const setFilter = <K extends keyof FundingFilters>(key: K, value: FundingFilters[K]) => {
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
