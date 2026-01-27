import api from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface DeletePosPayload {
  id: string;
}

export const useDeletePos = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data: DeletePosPayload) =>
      api.delete(`/admin/pos/${data.id}`),
    onSuccess: (data) => {
      toast.success(data?.data?.message ?? "POS deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["pos", "pos-branches"] });
    },
    onError: (error: { response: { data: { message: string } } }) => {
      // console.log("Failed to delete POS", error);
      toast.error(error?.response?.data?.message ?? "Failed to delete POS");
    },
  });

  const handleDeletePos = (id: string) => {
    mutate({ id });
  };

  return { handleDeletePos, isPending, isSuccess };
};
