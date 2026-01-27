import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface GetAllPosParams {
  page?: number;
  size?: number;
  searchTerm?: string;
}

const useGetAllPos = (params: GetAllPosParams = {}) => {
  const {
    page = 0,
    size = 20,
    searchTerm,
  } = params;

  const { data, isPending, error, isError, refetch } = useQuery({
    queryKey: ["pos", 'pos-branches', page, size, searchTerm],
    queryFn: () => {
      const queryParams = new URLSearchParams();
      // Required pagination parameters
      queryParams.append("page", page.toString());
      queryParams.append("size", size.toString());
      // Optional filter parameters
      if (searchTerm) queryParams.append("merchantId", searchTerm);
      return api.get(`/admin/pos/all?${queryParams.toString()}`);
    },
  });

  return { data, isPending, error, isError, refetch };
};

export default useGetAllPos;