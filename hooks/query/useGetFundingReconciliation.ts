'use client'

import api from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";

interface GetFundingReconciliationParams {
  page?: number;
  size?: number;
  sessionId?: string;
  providerId?: string;
  senderName?: string;
  customerId?: string;
  startDate?: string;
  endDate?: string;
}

const useGetFundingReconciliation = (params: GetFundingReconciliationParams = {}) => {
  const {
    page = 0,
    size = 20,
    sessionId,
    providerId,
    senderName,
    customerId,
    startDate,
    endDate,
  } = params;

  const { data, isPending, error, isError, refetch } = useQuery({
    queryKey: ["funding-reconciliation", page, size, sessionId, providerId, senderName, customerId, startDate, endDate],
    queryFn: () => {
      const queryParams = new URLSearchParams();

      // Required pagination parameters (always send them)
      queryParams.append("page", page.toString());
      queryParams.append("size", size.toString());

      // Optional filter parameters
      if (sessionId) queryParams.append("sessionId", sessionId);
      if (providerId) queryParams.append("providerId", providerId);
      if (senderName) queryParams.append("senderName", senderName);
      if (customerId) queryParams.append("customerId", customerId);

      if (startDate) {
        const formattedDate = format(parseISO(startDate), "dd-MM-yyyy");
        queryParams.append("startDate", formattedDate);
      }
      if (endDate) {
        const formattedDate = format(parseISO(endDate), "dd-MM-yyyy");
        queryParams.append("endDate", formattedDate);
      }

      const queryString = queryParams.toString();
      return api.get(`/admin/getFundingReconciliation?${queryString}`);
    },
  });

  return { data, isPending, error, isError, refetch };
};

export default useGetFundingReconciliation;