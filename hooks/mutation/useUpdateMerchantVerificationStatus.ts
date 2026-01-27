// admin / updateMerchantVerificationStatus

import api from "@/lib/api";
import { UpdateMerchantVerificationStatusPayload } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useUpdateMerchantVerificationStatus = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess, reset } = useMutation({
    mutationFn: (data: UpdateMerchantVerificationStatusPayload) => api.put("/admin/updateMerchantVerificationStatus", {}, { params: data }),
    onSuccess: (data) => {
      if (data) {
        toast.success(data?.data?.message ?? "Merchant status updated successfully");

        queryClient.invalidateQueries({ queryKey: ["merchants"] });
      }
    },
    onError: (error: { response: { data: { message: string } } }) => {

      toast.error(error?.response?.data?.message ?? "Failed to update merchant status");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["merchants"] });
    },
  });

  const handleUpdateMerchantVerificationStatus = (data: UpdateMerchantVerificationStatusPayload) => {
    mutate(data);
  };

  return { handleUpdateMerchantVerificationStatus, isPending, isSuccess, reset };
};