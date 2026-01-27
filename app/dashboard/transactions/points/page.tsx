import PointsLanding from "@/components/admin/transactions/points-landing";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Share Points",
  description: "Points",
}

export default function Page() {
  return <PointsLanding />;
}