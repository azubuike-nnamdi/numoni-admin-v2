import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const useGetSamplePosCsv = () => {
  const { data, isPending, error, isError, refetch } = useQuery({
    queryKey: ["sample-pos-csv"],
    queryFn: () => api.get(`/admin/pos/download_sample_csv`),
    enabled: false,
  });

  return { data, isPending, error, isError, refetch };
};

export default useGetSamplePosCsv;