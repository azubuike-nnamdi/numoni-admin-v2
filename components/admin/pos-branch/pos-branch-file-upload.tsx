'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { validateFileSize } from '@/lib/helper';
import { Control, UseFormSetValue } from 'react-hook-form';
import { FileText, Upload, X } from 'lucide-react';
import { useId, useState } from 'react';
import { toast } from 'sonner';
import { PosBranchFormData } from '@/lib/schemas/pos-branch-schema';

interface PosBranchFileUploadProps {
  control: Control<PosBranchFormData>;
  setValue: UseFormSetValue<PosBranchFormData>;
}

export default function PosBranchFileUpload({ control, setValue }: PosBranchFileUploadProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputId = useId();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type - accept CSV and Excel files
    const validMimeTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    const validExtensions = ['.csv', '.xls', '.xlsx'];

    const isValidMimeType = validMimeTypes.includes(file.type);
    const isValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (!isValidMimeType && !isValidExtension) {
      toast.error("Only CSV or Excel files are allowed.");
      return;
    }

    // Validate file size (3MB)
    const sizeValidation = validateFileSize(file, '3mb');
    if (!sizeValidation.isValid) {
      toast.error(sizeValidation.error || 'File size exceeds maximum allowed size of 3MB');
      return;
    }

    setFileName(file.name);
    setFilePreview(file);
    setValue('posBranchFile', file);
  };

  const handleRemoveFile = () => {
    setFileName(null);
    setFilePreview(null);
    setValue('posBranchFile', undefined);
    const fileInput = document.getElementById(fileInputId) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="mb-6">
      <FormField
        control={control}
        name="posBranchFile"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700 mb-2 block">
              Upload POS Branch
            </FormLabel>
            <FormControl>
              <div className="space-y-2">
                <div
                  className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                    field.value
                      ? 'border-gray-300'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {filePreview ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-green-600" />
                        <span className="text-sm text-gray-700 truncate max-w-[300px]" title={fileName || 'File'}>
                          {fileName || 'File uploaded'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        disabled={isUploading}
                        className="text-red-500 p-1 cursor-pointer rounded-full hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                      <div>
                        <input
                          type="file"
                          id={fileInputId}
                          accept=".csv,.xls,.xlsx,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById(fileInputId)?.click()}
                          disabled={isUploading}
                          className="text-gray-800 hover:text-gray-900 disabled:opacity-50"
                        >
                          {isUploading ? 'Uploading...' : 'Choose file'}
                        </button>
                        <p className="text-xs text-gray-500 mt-1">
                          or drag and drop here
                        </p>
                        <p className="text-xs text-gray-400">
                          CSV or Excel files only • Max file size: 3MB
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

