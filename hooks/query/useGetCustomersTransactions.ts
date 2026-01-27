import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface GetCustomersTransactionsParams {
  customerName?: string;
  transactionType?: string;
  page?: number;
  size?: number;
}

const useGetCustomersTransactions = (params: GetCustomersTransactionsParams = {}) => {
  const { customerName, transactionType, page, size } = params;

  const { data, isPending, error, isError, refetch } = useQuery({
    queryKey: ["customers-transactions", customerName, transactionType, page, size],
    queryFn: () => {
      const queryParams = new URLSearchParams();

      // Optional filter parameters
      if (customerName) {
        queryParams.append("customerName", customerName);
      }
      if (transactionType) {
        queryParams.append("transactionType", transactionType);
      }
      if (page !== undefined) {
        queryParams.append("page", page.toString());
      }
      if (size !== undefined) {
        queryParams.append("size", size.toString());
      }

      const queryString = queryParams.toString();
      const url = queryString ? `/admin/getCustomerTransacionList?${queryString}` : "/admin/getCustomerTransacionList";
      return api.get(url);
    },
  });

  return { data, isPending, error, isError, refetch };
};

export default useGetCustomersTransactions;