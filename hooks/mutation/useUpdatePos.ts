// admin / save

import { ADMIN_MERCHANTS_POS_BRANCH_LIST_URL } from "@/constant/routes";
import api from "@/lib/api";
import { UpdatePosPayload } from "@/lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useUpdatePos = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data: UpdatePosPayload) => api.put("/admin/pos/update", data),
    onSuccess: (data) => {
      if (data) {
        toast.success(data?.data?.message ?? "POS updated successfully");
        router.push(ADMIN_MERCHANTS_POS_BRANCH_LIST_URL);
        queryClient.invalidateQueries({ queryKey: ["pos", "pos-branches"] });
      }
    },
    onError: (error: { response: { data: { message: string } } }) => {

      toast.error(error?.response?.data?.message ?? "Failed to update POS");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["pos", "pos-branches"] });
    },
  });

  const handleUpdatePos = (data: UpdatePosPayload) => {
    mutate(data);
  };

  return { handleUpdatePos, isPending, isSuccess };
};