"use client";

import { DataTable } from '@/components/ui/data-table';
import { EmptyState } from '@/components/ui/empty-state';
import { ColumnDef } from '@tanstack/react-table';
import { PointsTransactionData } from './points-columns';

interface PointsDataSectionProps {
  data: PointsTransactionData[];
  columns: ColumnDef<PointsTransactionData>[];
}

export default function PointsDataSection({ data, columns }: PointsDataSectionProps) {
  if (data.length === 0) {
    return (
      <div className="p-0">
        <EmptyState
          title="No Points Transactions Found"
          description="No points transactions match your current search or filter criteria. Try adjusting your search terms or filters."
        />
      </div>
    );
  }

  return (
    <div className="p-0">
      <DataTable columns={columns} data={data} />
    </div>
  );
}

