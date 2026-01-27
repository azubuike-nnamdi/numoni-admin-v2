import Bonuses from "@/components/admin/bonuses";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Sign Up Bonus',
  description: 'Sign Up Bonus - Overview of sign up bonus metrics and performance',
}

export default function Page() {

  return <Bonuses />
}