import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

const useDownloadSamplePosCsv = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await api.get(
        "/admin/pos/download_sample_csv",
      );
      return response.data;
    },
  });
};

export default useDownloadSamplePosCsv;
