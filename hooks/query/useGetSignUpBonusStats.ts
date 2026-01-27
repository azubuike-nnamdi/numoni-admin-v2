import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";


const useGetSignUpBonusStats = () => {
  const { data, isPending, error, isError, refetch } = useQuery({
    queryKey: ["sign-up-bonus-stats", "bonuses"],
    queryFn: () => api.get("/customer/admin/signup-bonus-statistics"),
  });

  return { data, isPending, error, isError, refetch };
};

export default useGetSignUpBonusStats;