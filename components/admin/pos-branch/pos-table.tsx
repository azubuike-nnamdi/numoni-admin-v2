import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { PosData } from "@/lib/types";
import { posColumns } from "./pos-column";


type PosTableProps = {
  posData: PosData[];
  searchTerm: string;
}

export default function PosTable({
  posData,
  searchTerm,
}: PosTableProps) {
  const hasPos = posData && posData?.length > 0;
  const hasFilters = searchTerm !== "";

  if (!hasPos) {
    return <EmptyState title="No POS found" description="No POS found matching your criteria" />;
  }

  return (
    <div>
      <DataTable columns={posColumns} data={posData} />
    </div>
  );
}