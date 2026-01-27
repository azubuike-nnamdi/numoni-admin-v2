'use client';

import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { FormCombobox } from '@/components/ui/form-combobox';
import useGetAllMerchants from '@/hooks/query/useGetAllMerchants';
import { PosBranchFormData } from '@/lib/schemas/pos-branch-schema';
import { Merchant } from '@/lib/types';
import { useEffect, useState } from 'react';
import { Control } from 'react-hook-form';

interface MerchantSelectionProps {
  control: Control<PosBranchFormData>;
}

export default function MerchantSelection({ control }: MerchantSelectionProps) {
  const [merchantPage, setMerchantPage] = useState(0);
  const [merchantOptions, setMerchantOptions] = useState<{ value: string; label: string }[]>([]);
  const { data: merchantsData, isPending: isMerchantsPending } = useGetAllMerchants({ page: merchantPage, size: 20 });

  const merchantsPageData = merchantsData?.data?.data?.pageData as Merchant[] | undefined;
  const totalMerchantPages = merchantsData?.data?.data?.totalPages ?? 0;

  useEffect(() => {
    if (!merchantsPageData || merchantsPageData.length === 0) {
      if (merchantPage === 0) {
        setMerchantOptions([]);
      }
      return;
    }

    const nextOptions = merchantsPageData.map((merchant: Merchant) => ({
      value: merchant.id,
      label: merchant.businessName,
    }));

    setMerchantOptions(prev => {
      const existing = new Set(prev.map(o => o.value));
      const merged = [...prev];
      nextOptions.forEach(o => { if (!existing.has(o.value)) merged.push(o); });
      return merged;
    });
  }, [merchantsPageData, merchantPage]);

  const canGoPrev = merchantPage > 0;
  const canGoNext = merchantPage + 1 < totalMerchantPages;
  const merchantFooter = (
    <div className="p-2 sticky bottom-0 bg-white border-t border-gray-100">
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          disabled={!canGoPrev || isMerchantsPending}
          onClick={() => setMerchantPage(p => Math.max(p - 1, 0))}
          className="text-xs px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prev
        </button>
        <div className="text-[10px] text-gray-500 whitespace-nowrap">
          Page {totalMerchantPages === 0 ? 0 : merchantPage + 1} of {totalMerchantPages}
        </div>
        <button
          type="button"
          disabled={!canGoNext || isMerchantsPending}
          onClick={() => setMerchantPage(p => p + 1)}
          className="text-xs px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isMerchantsPending ? 'Loading...' : 'Next'}
        </button>
      </div>
    </div>
  );

  return (
    <div className="mb-6">
      <FormField
        control={control}
        name="merchantId"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <FormCombobox
                control={control}
                name="merchantId"
                label="Select Merchant"
                options={merchantOptions}
                placeholder={isMerchantsPending ? "Loading merchants..." : "Search and select a merchant..."}
                searchPlaceholder="Search merchants..."
                emptyMessage={merchantOptions.length === 0 && !isMerchantsPending ? "No merchants found. Click Next to load more." : "No merchant found."}
                disabled={isMerchantsPending}
                required
                footerSlot={merchantFooter}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

