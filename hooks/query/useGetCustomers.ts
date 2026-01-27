import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

interface GetCustomersParams {
  page?: number;
  size?: number;
  name?: string;
  customerEmail?: string;
  customerPhoneNo?: string;
  customerId?: string;
  createdDate?: string;
  startDate?: string;
  endDate?: string;
  sort?: string[];
}

const useGetCustomers = (params: GetCustomersParams = {}) => {
  const {
    page = 0,
    size = 20,
    name,
    customerEmail,
    customerPhoneNo,
    customerId,
    createdDate,
    startDate,
    endDate,
    sort = [],
  } = params;

  const { data, isPending, error, isError, refetch } = useQuery({
    queryKey: ["customers", page, size, name, customerEmail, customerPhoneNo, customerId, createdDate, startDate, endDate, sort],
    queryFn: () => {
      const queryParams = new URLSearchParams();

      // Top-level pagination parameters (Spring Pageable defaults)
      queryParams.append("page", String(page));
      queryParams.append("size", String(size));

      // Optional filters
      if (name) queryParams.append("name", name);
      if (customerEmail) queryParams.append("customerEmail", customerEmail);
      if (customerPhoneNo) queryParams.append("customerPhoneNo", customerPhoneNo);
      if (customerId) queryParams.append("customerId", customerId);
      if (createdDate) queryParams.append("createdDate", createdDate);
      if (startDate) queryParams.append("startDate", startDate);
      if (endDate) queryParams.append("endDate", endDate);

      // Optional sort parameters (e.g., field,asc)
      for (const s of sort) {
        queryParams.append("sort", s);
      }

      return api.get(`/admin/getCustomerList?${queryParams.toString()}`);
    },
  });

  return { data, isPending, error, isError, refetch };
};

export default useGetCustomers;