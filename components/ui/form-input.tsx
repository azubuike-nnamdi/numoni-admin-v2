"use client"

import { Control } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormMessage } from './form'

interface FormInputTopLabelProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any>
  name: string
  label: string
  type?: string
  disabled?: boolean
  required?: boolean
  placeholder?: string
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export function FormInputTopLabel({
  control,
  name,
  label,
  type = 'text',
  disabled,
  required,
  placeholder,
  onKeyDown,
}: FormInputTopLabelProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormItem className="w-full">
          <label htmlFor={name} className="mb-1 block text-sm font-medium text-[#838383]">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <FormControl>
            <input
              {...field}
              id={name}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              onKeyDown={onKeyDown}
              className={`w-full rounded-lg border px-4 py-3 text-base text-gray-900 placeholder-gray-400 disabled:cursor-not-allowed ${error
                ? 'border-red-500 bg-red-50 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-200 bg-gray-50 focus:border-blue-500 focus:ring-blue-500'
                } ${type === 'number'
                  ? '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
                  : ''
                }`}
            />
          </FormControl>
          <div className="min-h-[20px]">
            <FormMessage className="text-sm text-red-600" />
          </div>
        </FormItem>
      )}
    />
  )
}
