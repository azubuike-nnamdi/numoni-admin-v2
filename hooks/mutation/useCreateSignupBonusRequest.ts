import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateSignupBonusRequestPayload {
  customerId: string;
}

export const useCreateSignupBonusRequest = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data: CreateSignupBonusRequestPayload) =>
      api.post("/customer/admin/add-signup-bonus-request", data),
    onSuccess: (data) => {
      if (data) {
        toast.success(data?.data?.message ?? "Sign up bonus request created successfully");
      }
    },
    onError: (error: { response: { data: { message: string } } }) => {
      toast.error(error?.response?.data?.message ?? "Failed to create signup bonus request");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["bonuses"] });
    },
  });

  const handleCreateSignupBonusRequest = (data: CreateSignupBonusRequestPayload) => {
    mutate(data);
  };

  return { handleCreateSignupBonusRequest, isPending, isSuccess };
};

