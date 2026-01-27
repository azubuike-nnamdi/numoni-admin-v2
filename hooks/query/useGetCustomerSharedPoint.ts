'use client'

import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface GetCustomerSharedPointParams {
  page?: number;
  size?: number;
}

const useGetCustomerSharedPoint = (params: GetCustomerSharedPointParams = {}) => {
  const {
    page = 0,
    size = 20,
  } = params;

  const { data, isPending, error, isError, refetch } = useQuery({
    queryKey: ["customer-shared-point", page, size],
    queryFn: () => {
      const queryParams = new URLSearchParams();
      queryParams.append("page", String(page));
      queryParams.append("size", String(size));
      return api.get(`/admin/customerSharePoints?${queryParams.toString()}`);
    },
  });

  return { data, isPending, error, isError, refetch };
};

export default useGetCustomerSharedPoint;