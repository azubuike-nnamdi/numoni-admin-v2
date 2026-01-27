import AddPosBranch from "@/components/admin/pos-branch/add-pos-branch";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Add POS Branch',
  description: 'Add POS Branch',
}

export default function Page() {
  return (
    <AddPosBranch />
  )
}