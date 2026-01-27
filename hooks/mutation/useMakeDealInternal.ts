import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export type MakeDealInternalPayload = {
  dealId: string;
  isInternal: boolean;
};

export const useMakeDealInternal = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data: MakeDealInternalPayload) => api.post(`/admin/updateDealInternalStatus?dealId=${data.dealId}&isInternal=${data.isInternal}`),
    onSuccess: (data) => {
      if (data) {
        toast.success(data?.data?.message ?? "Deal made internal successfully");

      }
    },
    onError: (error: { response: { data: { message: string } } }) => {
      // console.log("Failed to create POS", error);
      toast.error(error?.response?.data?.message ?? "Failed to make deal internal");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["deals"] });
    },
  });

  const handleMakeDealInternal = (data: MakeDealInternalPayload) => {
    mutate(data);
  };

  return { handleMakeDealInternal, isPending, isSuccess };
};
