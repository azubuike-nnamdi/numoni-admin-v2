"use client";


import MerchantDetails from "@/components/admin/add-merchants/merchant-details";
import { useParams, useSearchParams } from "next/navigation";

export default function Page() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  return <MerchantDetails merchantId={id} userId={userId} />;
}