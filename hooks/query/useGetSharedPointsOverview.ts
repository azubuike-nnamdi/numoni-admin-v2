'use client'

import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";


const useGetSharedPointsOverview = () => {
  const { data, isPending, error, isError, refetch } = useQuery({
    queryKey: ["shared-points-overview"],
    queryFn: () => api.get(`/admin/sharePointsOverview`),
  });

  return { data, isPending, error, isError, refetch };
};

export default useGetSharedPointsOverview;