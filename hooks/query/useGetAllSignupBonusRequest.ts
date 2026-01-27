'use client'

import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface GetAllSignupBonusRequestParams {
  page?: number;
  size?: number;
}

const useGetAllSignupBonusRequest = (params: GetAllSignupBonusRequestParams = {}) => {
  const {
    page = 0,
    size = 10,
  } = params;

  const { data, isPending, error, isError, refetch, isRefetching } = useQuery({
    queryKey: ["bonuses", page, size],
    queryFn: () => {
      const queryParams = new URLSearchParams();

      // Required pagination parameters
      queryParams.append("page", page.toString());
      queryParams.append("size", size.toString());

      const queryString = queryParams.toString();
      return api.get(`/customer/admin/signup-bonus-requests?${queryString}`);
    },
  });

  return { data, isPending, error, isError, refetch, isRefetching };
};

export default useGetAllSignupBonusRequest;