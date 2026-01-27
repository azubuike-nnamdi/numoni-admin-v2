import { ADMIN_MERCHANTS_POS_BRANCH_LIST_URL } from "@/constant/routes";
import api from "@/lib/api";
import { PosBranchFormData } from "@/lib/schemas/pos-branch-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type UploadPosCsvPayload = {
  formData: PosBranchFormData;
  file: File;
  bankName: string; // Bank name resolved from bankCode
};

export const useUploadPosCsv = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate, mutateAsync, isPending, isSuccess } = useMutation({
    mutationFn: async (payload: UploadPosCsvPayload) => {
      const { formData, file, bankName } = payload;

      // Create FormData for file upload
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      // Build query parameters
      const queryParams = new URLSearchParams();
      queryParams.append('merchantId', formData.merchantId);
      if (formData.bankCode) {
        queryParams.append('bankCode', formData.bankCode);
      }
      if (bankName) {
        queryParams.append('bankName', bankName);
      }
      // bankTransferCode - using bankCode as transfer code if not available
      if (formData.bankCode) {
        queryParams.append('bankTransferCode', formData.bankCode);
      }
      if (formData.accountName) {
        queryParams.append('accountHolderName', formData.accountName);
      }
      if (formData.bankAccountNumber) {
        queryParams.append('accountNo', formData.bankAccountNumber);
      }
      // branchId is optional, skip if not available

      // Make the API call with FormData and query params
      const endpoint = `/admin/pos/upload_csv?${queryParams.toString()}`;
      return api.post(endpoint, uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    onSuccess: (data) => {
      if (data) {
        toast.success(data?.data?.message ?? "POS CSV uploaded successfully");
        router.push(ADMIN_MERCHANTS_POS_BRANCH_LIST_URL);
      }
    },
    onError: (error: { response: { data: { message: string } } }) => {
      console.log("Failed to upload POS CSV", error);
      toast.error(error?.response?.data?.message ?? "Failed to upload POS CSV");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["pos-branches"] });
      queryClient.invalidateQueries({ queryKey: ["merchants"] });
    },
  });

  const handleUploadPosCsv = (payload: UploadPosCsvPayload) => {
    mutate(payload);
  };

  return { handleUploadPosCsv, mutateAsync, isPending, isSuccess };
};
