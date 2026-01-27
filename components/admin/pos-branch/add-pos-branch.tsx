'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { FormInputTopLabel } from '@/components/ui/form-input';
import { useCreatePos } from '@/hooks/mutation/useCreatePos';
import useDownloadSamplePosCsv from '@/hooks/mutation/useDownloadSamplePosCsv';
import { useUploadPosCsv } from '@/hooks/mutation/useUploadPosCsv';
import useGetAllMerchants from '@/hooks/query/useGetAllMerchants';
import useGetBanks from '@/hooks/query/useGetBanks';
import { PosBranchFormData, posBranchSchema } from '@/lib/schemas/pos-branch-schema';
import { Bank, Merchant } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosResponse } from 'axios';
import { Download } from 'lucide-react';
import { useMemo } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import MerchantSelection from './merchant-selection';
import PosBranchBankInfo from './pos-branch-bank-info';
import PosBranchFileUpload from './pos-branch-file-upload';

// Constants
const FORM_DEFAULT_VALUES: PosBranchFormData = {
  merchantId: '',
  singleUpload: false,
  posName: '',
  posBranchFile: undefined,
  bankCode: '',
  bankAccountNumber: '',
  accountName: '',
  location: '',
  address: '',
};

const ANIMATION_CLASSES = {
  hidden: 'max-h-0 opacity-0 mb-0',
  visible: 'max-h-[500px] opacity-100 mb-6',
  transition: 'transition-all duration-300 ease-in-out overflow-hidden',
};

// Helper functions
const getMerchantName = (merchantId: string, merchants: Merchant[] | undefined): string => {
  if (!merchantId || !merchants) return '';
  const merchant = merchants.find((m) => m.id === merchantId);
  return merchant?.businessName || '';
};

const getBankName = (bankCode: string, banks: Bank[] | undefined): string => {
  if (!bankCode || !banks) return '';
  const bank = banks.find((b) => b.code === bankCode);
  return bank?.name || '';
};

type BanksApiResponse = Bank[] | { data: Bank[] };
type MerchantsApiResponse = { data: { pageData: Merchant[] } };

const extractBanksData = (banks: AxiosResponse<BanksApiResponse> | undefined): Bank[] | undefined => {
  if (!banks?.data) return undefined;
  const allBanks = Array.isArray(banks.data) ? banks.data : banks.data.data;
  return Array.isArray(allBanks) ? allBanks : undefined;
};

const extractMerchantsData = (merchantsData: AxiosResponse<MerchantsApiResponse> | undefined): Merchant[] | undefined => {
  return merchantsData?.data?.data?.pageData as Merchant[] | undefined;
};

const downloadFile = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(new Blob([blob], { type: 'text/csv' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export default function AddPosBranch() {
  const form = useForm<PosBranchFormData>({
    resolver: zodResolver(posBranchSchema),
    mode: 'onChange',
    defaultValues: FORM_DEFAULT_VALUES,
  });

  const { control, handleSubmit, setValue } = form;

  // Mutations
  const { mutateAsync: uploadPosCsv, isPending: isUploadingCsv } = useUploadPosCsv();
  const { handleCreatePos, isPending: isCreatingPos } = useCreatePos();
  const { mutateAsync: downloadSampleCsv, isPending: isDownloadingCsv } = useDownloadSamplePosCsv();

  // Data fetching
  const { data: merchantsData } = useGetAllMerchants({ size: 1000 });
  const { data: banks } = useGetBanks();

  // Watch form values
  const merchantId = useWatch({ control, name: 'merchantId' });
  const bankCode = useWatch({ control, name: 'bankCode' });
  const singleUpload = useWatch({ control, name: 'singleUpload' });

  // Computed values
  const merchants = useMemo(() => extractMerchantsData(merchantsData), [merchantsData]);
  const banksList = useMemo(() => extractBanksData(banks), [banks]);
  const merchantName = useMemo(() => getMerchantName(merchantId, merchants), [merchantId, merchants]);
  const bankName = useMemo(() => getBankName(bankCode, banksList), [bankCode, banksList]);

  const isLoading = isUploadingCsv || isCreatingPos;

  // Handlers
  const handleSingleUploadChange = (checked: boolean) => {
    if (checked) {
      setValue('posBranchFile', undefined);
    } else {
      setValue('posName', '');
      setValue('location', '');
      setValue('address', '');
    }
  };

  const validateFormData = (data: PosBranchFormData): string | null => {
    if (!merchantName) return 'Please select a merchant';
    if (!bankName) return 'Please select a bank';
    if (!data.accountName) return 'Please verify your bank account';
    return null;
  };

  const handleSingleUpload = (data: PosBranchFormData) => {
    const { location, address, posName } = data;

    if (!posName || !posName.trim()) {
      toast.error('Please provide POS name');
      return;
    }

    if (!location || !address) {
      toast.error('Please provide location and address');
      return;
    }

    handleCreatePos({
      posName: posName.trim(),
      merchantId: data.merchantId,
      bankName,
      accountNo: data.bankAccountNumber,
      accountHolderName: data.accountName || '',
      bankCode: data.bankCode,
      bankTransferCode: data.bankCode,
      location,
      address,
    });
  };

  const handleMultipleUpload = async (data: PosBranchFormData) => {
    if (!data.posBranchFile || !(data.posBranchFile instanceof File)) {
      toast.error('Please upload a CSV or Excel file');
      return;
    }

    await uploadPosCsv({
      formData: data,
      file: data.posBranchFile,
      bankName,
    });
  };

  const onSubmit = async (data: PosBranchFormData) => {
    const validationError = validateFormData(data);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    try {
      if (data.singleUpload) {
        handleSingleUpload(data);
      } else {
        await handleMultipleUpload(data);
      }
    } catch (error) {
      toast.error(`Failed to process request: ${error}`);
    }
  };

  const handleDownloadSampleCsv = async () => {
    try {
      const blob = await downloadSampleCsv();
      downloadFile(blob, 'sample-pos.csv');
    } catch (error) {
      toast.error('Failed to download sample CSV');
    }
  };

  const getSubmitButtonText = () => {
    if (isUploadingCsv) return 'Uploading CSV...';
    if (isCreatingPos) return 'Creating POS...';
    return 'Submit';
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-gray-100 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Merchant POS Setup</h1>
          <div
            className={`${ANIMATION_CLASSES.transition} ${singleUpload ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'
              }`}
          >
            <Button
              variant="outline"
              size="sm"
              className="shadow-none"
              type="button"
              onClick={handleDownloadSampleCsv}
              disabled={isDownloadingCsv}
              isLoading={isDownloadingCsv}
              loadingText="Downloading Sample CSV..."
            >
              <Download className="w-4 h-4 mr-2" />
              Download Sample CSV
            </Button>
          </div>
        </div>

        {/* Merchant Selection */}
        <div className="mb-6">
          <MerchantSelection control={control} />
        </div>

        {/* Single Upload Toggle */}
        <div className="mb-6">
          <FormField
            control={control}
            name="singleUpload"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) => {
                      const isChecked = checked === true;
                      field.onChange(isChecked);
                      handleSingleUploadChange(isChecked);
                    }}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-medium text-gray-700 cursor-pointer">
                    Single Upload
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
        </div>
        {/* File Upload Section - Show when singleUpload is false */}
        <div
          className={`${ANIMATION_CLASSES.transition} ${singleUpload ? ANIMATION_CLASSES.hidden : ANIMATION_CLASSES.visible
            }`}
        >
          <PosBranchFileUpload control={control} setValue={setValue} />
        </div>

        {/* POS Name and Location Information Section - Show when singleUpload is true */}
        <div
          className={`${ANIMATION_CLASSES.transition} ${singleUpload ? ANIMATION_CLASSES.visible : ANIMATION_CLASSES.hidden
            }`}
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">POS Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <FormInputTopLabel
                control={control}
                name="posName"
                label="POS Name"
                placeholder="Enter POS name"
                required
              />
              <FormInputTopLabel
                control={control}
                name="location"
                label="Location"
                placeholder="Enter location"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInputTopLabel
                control={control}
                name="address"
                label="Address"
                placeholder="Enter address"
                required
              />
            </div>
          </div>
        </div>

        {/* Bank Information */}
        <PosBranchBankInfo control={control} setValue={setValue} />

        {/* Submit Button */}
        <div className="flex justify-end mt-8">
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-theme-dark-green hover:bg-theme-dark-green/90 text-white px-12 py-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {getSubmitButtonText()}
          </Button>
        </div>
      </form>
    </Form>
  );
}
