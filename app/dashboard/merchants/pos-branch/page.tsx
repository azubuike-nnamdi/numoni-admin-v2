import PosBranch from "@/components/admin/pos-branch";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'POS Branch',
  description: 'POS Branch',
}


export default function Page() {
  return (
    <PosBranch />
  );
}