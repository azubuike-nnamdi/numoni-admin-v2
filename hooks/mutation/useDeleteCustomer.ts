import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DeleteCustomerPayload {
  customerId: string;
}

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data: DeleteCustomerPayload) =>
      api.delete(`/admin/deleteCustomer?customerId=${data.customerId}`),
    onSuccess: (data) => {
      toast.success(data?.data?.message ?? "Customer deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
    onError: (error: { response: { data: { message: string } } }) => {
      toast.error(error?.response?.data?.message ?? "Failed to delete customer");
    },
  });

  const handleDeleteCustomer = (customerId: string) => {
    mutate({ customerId });
  };

  return { handleDeleteCustomer, isPending, isSuccess };
};
