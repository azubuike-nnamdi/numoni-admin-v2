'use client';

import { useUploadDealsFile } from '@/hooks/mutation/useUploadDealsFile';
import { Plus, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { toast } from 'sonner';

interface BusinessImagesSectionProps {
  onImagesChange: (imageUrls: string[]) => void;
  imageUrls?: string[];
  maxImages?: number;
  maxTotalSize?: number; // in MB
}

export default function BusinessImagesSection({
  onImagesChange,
  imageUrls = [],
  maxImages = 5,
  maxTotalSize = 3
}: BusinessImagesSectionProps) {
  console.log("maxTotalSize", maxTotalSize);
  const [error, setError] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const { handleUploadDealsFile } = useUploadDealsFile();

  const validateFile = (file: File): boolean => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload JPG, JPEG, or PNG files only.');
      return false;
    }

    // Check file size (3MB = 3 * 1024 * 1024 bytes)
    const maxFileSize = 3 * 1024 * 1024;
    if (file.size > maxFileSize) {
      setError('Each file must be less than 3MB.');
      return false;
    }

    setError('');
    return true;
  };


  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    // Check if adding these files would exceed the limit
    if (imageUrls.length + files.length > maxImages) {
      setError(`You can only upload a maximum of ${maxImages} images.`);
      return;
    }

    // Validate each file
    const validFiles: File[] = [];
    for (const file of files) {
      if (validateFile(file)) {
        validFiles.push(file);
      } else {
        return; // Stop if any file is invalid
      }
    }

    // Upload files one by one
    setIsUploading(true);
    const loadingToast = toast.loading(`Uploading ${validFiles.length} image(s)...`);
    const uploadedUrls: string[] = [];

    try {
      for (const file of validFiles) {
        const formData = new FormData();
        formData.append('file', file);

        const imageUrl = await handleUploadDealsFile(formData);
        if (imageUrl) {
          uploadedUrls.push(imageUrl);
        }
      }

      if (uploadedUrls.length > 0) {
        const updatedUrls = [...imageUrls, ...uploadedUrls];
        onImagesChange(updatedUrls);
        setError('');
        toast.dismiss(loadingToast);
        // Success toast is already shown by the hook
      } else {
        toast.dismiss(loadingToast);
      }
    } catch {
      toast.dismiss(loadingToast);
      // Error toast is already shown by the hook
    } finally {
      setIsUploading(false);
    }

    // Reset input
    event.target.value = '';
  };

  const removeImage = (index: number) => {
    const updatedUrls = imageUrls.filter((_, i) => i !== index);
    onImagesChange(updatedUrls);
    setError('');
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Add Business Images</h2>

      {imageUrls.length === 0 ? (
        /* Default State - Large Upload Area */
        <div className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-400 transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleImageUpload}
            disabled={isUploading}
            className="hidden"
            id="business-image-upload"
          />
          <label htmlFor="business-image-upload" className={`cursor-pointer ${isUploading ? 'cursor-not-allowed' : ''}`}>
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">
              {isUploading ? 'Uploading images...' : (
                <>
                  Choose Images to <span className="text-green-600 font-medium">Upload or Drag and drop</span> or <span className="text-green-600 font-medium">click</span> to browse your device
                </>
              )}
            </p>
            <p className="text-sm text-gray-500">
              JPG or PNG Supported format. Max file size is 3mb
            </p>
          </label>
        </div>
      ) : (
        /* Images Present - Horizontal Slots View */
        <>
          <div className="flex gap-4 flex-wrap">
            {/* Render uploaded images */}
            {imageUrls.map((imageUrl, index) => (
              <div key={index} className="relative flex-shrink-0">
                <div className="w-[200px] h-[200px] rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={imageUrl}
                    alt={`Business image ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover"
                    unoptimized={imageUrl?.startsWith('http')}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  disabled={isUploading}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg z-10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}

            {/* Render empty slots */}
            {Array.from({ length: maxImages - imageUrls.length }).map((_, index) => (
              <div key={`empty-${index}`} className="">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                  id={`business-image-upload-${index}`}
                />
                <label
                  htmlFor={`business-image-upload-${index}`}
                  className={`w-[200px] h-[200px] border border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-green-400 transition-colors bg-white ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mb-2">
                    <Plus className="h-5 w-5 text-gray-600" />
                  </div>
                  <span className="text-sm text-gray-600 font-medium">Add Images</span>
                </label>
              </div>
            ))}
          </div>

          {/* Progress Info */}
          <div className="mt-4 text-sm text-gray-500">
            {imageUrls.length}/{maxImages} images uploaded
          </div>
        </>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}

