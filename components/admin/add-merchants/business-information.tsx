

'use client';

import { FormInputTopLabel } from '@/components/ui/form-input';
import { FormPhoneInput } from '@/components/ui/form-phone-input';
import { FormSelectTopLabel } from '@/components/ui/form-select';
import { FormTextareaTopLabel } from '@/components/ui/form-textarea';
import useGetAllRegions from '@/hooks/query/useGetAllRegions';
import useGetLga from '@/hooks/query/useGetLga';
import useGetStates from '@/hooks/query/useGetStates';
import { businessCategories, businessTypes, MerchantFormData } from '@/lib/schemas/merchant-schema';
import { useEffect } from 'react';
import { Control, UseFormSetValue, useWatch } from 'react-hook-form';

interface BusinessInformationProps {
  control: Control<MerchantFormData>;
  setValue: UseFormSetValue<MerchantFormData>;
}

export default function BusinessInformation({ control, setValue }: BusinessInformationProps) {
  // Get regions data
  const { data: regionsData, isPending: regionsPending } = useGetAllRegions();

  // Watch the selected region and state
  const selectedRegion = useWatch({
    control,
    name: "region"
  });

  const selectedState = useWatch({
    control,
    name: "state"
  });

  // Get states based on selected region
  const { data: statesData, isPending: statesPending } = useGetStates({
    region: selectedRegion || ""
  });

  // Get LGAs based on selected state
  const { data: lgasData, isPending: lgasPending } = useGetLga({
    state: selectedState || ""
  });

  // Map the regions from API response to the expected format
  const regions = regionsData?.data?.data?.map((region: string) => ({
    value: region,
    label: region
  })) || [];

  // Map the states from API response to the expected format
  const states = statesData?.data?.data?.map((state: string) => ({
    value: state,
    label: state
  })) || [];

  // Map the LGAs from API response to the expected format
  const lgas = lgasData?.data?.data?.map((lga: string) => ({
    value: lga,
    label: lga
  })) || [];

  // Map business categories to the expected format
  const businessCategoryOptions = businessCategories.map((category) => ({
    value: category,
    label: category
  }));

  // Map business types to the expected format
  const businessTypeOptions = businessTypes.map((type) => ({
    value: type,
    label: type
  }));

  // Reset state and LGA when region changes
  useEffect(() => {
    if (selectedRegion) {
      setValue("state", "");
      setValue("lga", "");
    }
  }, [selectedRegion, setValue]);

  // Reset LGA when state changes
  useEffect(() => {
    if (selectedState) {
      setValue("lga", "");
    }
  }, [selectedState, setValue]);

  return (
    <div className="m-6 border border-gray-100 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Business Information</h2>

      {/* Top Section - 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <FormInputTopLabel
          control={control}
          name="businessName"
          label="Business Name"
          placeholder="Shai Hulud"
          required
        />

        <FormInputTopLabel
          control={control}
          name="emailAddress"
          label="Email Address"
          type="email"
          placeholder="shaihulud@gmail.com"
          required
        />

        <FormPhoneInput
          control={control}
          name="phoneNumber"
          label="Phone Number"
          placeholder="7012345678"
          required
        />
      </div>

      {/* Middle Section - 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <FormSelectTopLabel
          control={control}
          name="businessCategory"
          label="Business Category"
          options={businessCategoryOptions}
          placeholder="Choose a category"
          required
        />

        <FormInputTopLabel
          control={control}
          name="rcNumber"
          label="RC Number"
          placeholder="RC3456KSV"
          required
        />

        <FormSelectTopLabel
          control={control}
          name="businessType"
          label="Business Type"
          options={businessTypeOptions}
          placeholder="Choose a type"
          required
        />
      </div>

      {/* Address Section - 3 Columns: Region, State, LGA */}
      {/* Headquarter Address */}
      <div className="mb-6">
        <FormInputTopLabel
          control={control}
          name="headquarterAddress"
          label="Headquarter Address"
          placeholder="Enter your headquarter address"
          required
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <FormSelectTopLabel
            control={control}
            name="region"
            label="Region"
            options={regions}
            placeholder={regionsPending ? "Loading regions..." : "Select a region"}
            disabled={regionsPending}
            required
          />

          <FormSelectTopLabel
            control={control}
            name="state"
            label="State"
            options={states}
            placeholder={!selectedRegion ? "Select Region First" : statesPending ? "Loading states..." : "Select a state"}
            disabled={!selectedRegion || statesPending}
            required
          />

          <FormSelectTopLabel
            control={control}
            name="lga"
            label="LGA"
            options={lgas}
            placeholder={!selectedState ? "Select State First" : lgasPending ? "Loading LGAs..." : "Select an LGA"}
            disabled={!selectedState || lgasPending}
            required
          />
        </div>

      </div>

      {/* Bottom Section - 2 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormTextareaTopLabel
          control={control}
          name="businessDescription"
          label="Business Description"
          placeholder="Tell us about your business"
          rows={6}
          required
        />

        {/* Password Fields */}
        <div className="space-y-4">
          <FormInputTopLabel
            control={control}
            name="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
            required
          />

          <FormInputTopLabel
            control={control}
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            required
          />
        </div>
      </div>
    </div>
  );
}
