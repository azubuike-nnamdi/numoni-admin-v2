'use client';

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRangeOption } from "@/lib/types";
import { endOfMonth, endOfToday, endOfWeek, endOfYesterday, format, startOfMonth, startOfToday, startOfWeek, startOfYesterday, subMonths } from "date-fns";
import { Calendar as CalendarIcon, ChevronDownIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface DateRangeSelectorProps {
  value: DateRangeOption;
  onValueChange: (option: DateRangeOption) => void;
  onDatesChange?: (startDate: Date | undefined, endDate: Date | undefined) => void;
  placeholder?: string;
  showAllTime?: boolean;
  showCustomRange?: boolean;
  className?: string;
  disabled?: boolean;
}

export function DateRangeSelector({
  value,
  onValueChange,
  onDatesChange,
  placeholder = 'Select Date Range',
  showAllTime = false,
  showCustomRange = false,
  className,
  disabled = false,
}: Readonly<DateRangeSelectorProps>) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [customStartDatePopoverOpen, setCustomStartDatePopoverOpen] = useState(false);
  const [customEndDatePopoverOpen, setCustomEndDatePopoverOpen] = useState(false);
  const [customStartDate, setCustomStartDate] = useState<Date | undefined>();
  const [customEndDate, setCustomEndDate] = useState<Date | undefined>();

  const handleOptionChange = useCallback((option: DateRangeOption) => {
    onValueChange(option);
    setPopoverOpen(false);

    if (option === 'Custom Range' && showCustomRange) {
      setCustomStartDatePopoverOpen(true);
      return;
    }

    if (!onDatesChange) return;

    let start: Date | undefined;
    let end: Date | undefined;

    const now = new Date();

    switch (option) {
      case 'Today':
        start = startOfToday();
        end = endOfToday();
        break;
      case 'Yesterday':
        start = startOfYesterday();
        end = endOfYesterday();
        break;
      case 'This Week':
        start = startOfWeek(now);
        end = endOfWeek(now);
        break;
      case 'This Month':
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case 'Last Month': {
        const lastMonth = subMonths(now, 1);
        start = startOfMonth(lastMonth);
        end = endOfMonth(lastMonth);
        break;
      }
      case 'All Time':
      default:
        start = undefined;
        end = undefined;
        break;
    }

    onDatesChange(start, end);
  }, [onValueChange, showCustomRange, onDatesChange]);

  const handleCustomStartDateSelect = useCallback((date: Date | undefined) => {
    setCustomStartDate(date);
    if (date && customEndDate && date > customEndDate) {
      setCustomEndDate(undefined);
    }
    if (date) {
      setCustomStartDatePopoverOpen(false);
    }
  }, [customEndDate]);

  const handleCustomEndDateSelect = useCallback((date: Date | undefined) => {
    setCustomEndDate(date);
    if (date) {
      setCustomEndDatePopoverOpen(false);
    }
  }, []);

  // Notify parent of date changes when custom dates are selected
  useEffect(() => {
    if (showCustomRange && value === 'Custom Range' && onDatesChange) {
      onDatesChange(customStartDate, customEndDate);
    }
  }, [customStartDate, customEndDate, value, showCustomRange, onDatesChange]);

  // Reset custom dates when switching away from Custom Range
  useEffect(() => {
    if (value !== 'Custom Range') {
      setCustomStartDate(undefined);
      setCustomEndDate(undefined);
    }
  }, [value]);

  const options: Array<{ value: DateRangeOption; label: string }> = [
    ...(showAllTime ? [{ value: null as DateRangeOption, label: 'All Time' }] : []),
    { value: 'Today' as DateRangeOption, label: 'Today' },
    { value: 'Yesterday' as DateRangeOption, label: 'Yesterday' },
    { value: 'This Week' as DateRangeOption, label: 'This Week' },
    { value: 'This Month' as DateRangeOption, label: 'This Month' },
    { value: 'Last Month' as DateRangeOption, label: 'Last Month' },
    ...(showCustomRange ? [{ value: 'Custom Range' as DateRangeOption, label: 'Custom Range' }] : []),
  ];

  return (
    <div className={className}>
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal gap-2 p-5 shadow-none"
            disabled={disabled}
          >
            <span>{value || placeholder}</span>
            <ChevronDownIcon className="h-4 w-4 ml-auto" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-38 p-1 shadow-none">
          {options.map((option) => (
            <button
              key={option.value || 'null'}
              className={`px-3 py-2 text-sm cursor-pointer rounded-md transition-colors ${value === option.value
                ? 'bg-gray-100 font-medium'
                : 'hover:bg-gray-100'
                }`}
              onClick={() => handleOptionChange(option.value)}
            >
              {option.label}
            </button>
          ))}
        </PopoverContent>
      </Popover>

      {/* Custom Date Range Picker */}
      {showCustomRange && value === 'Custom Range' && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <label className="text-xs text-gray-600">Start Date</label>
            <Popover open={customStartDatePopoverOpen} onOpenChange={setCustomStartDatePopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {customStartDate ? format(customStartDate, "dd-MM-yyyy") : "Pick start date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={customStartDate}
                  onSelect={handleCustomStartDateSelect}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(23, 59, 59, 999);
                    return date > today || (customEndDate ? date > customEndDate : false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-gray-600">End Date</label>
            <Popover open={customEndDatePopoverOpen} onOpenChange={setCustomEndDatePopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {customEndDate ? format(customEndDate, "dd-MM-yyyy") : "Pick end date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={customEndDate}
                  onSelect={handleCustomEndDateSelect}
                  disabled={(date) => {
                    const today = new Date();
                    today.setHours(23, 59, 59, 999);
                    return date > today || (customStartDate ? date < customStartDate : false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </div>
  );
}

