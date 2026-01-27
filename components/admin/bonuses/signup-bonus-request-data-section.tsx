"use client";

import { DataTable } from '@/components/ui/data-table';
import { EmptyState } from '@/components/ui/empty-state';
import { SignupBonusRequestData } from './signup-bonus-request-columns';

import { ColumnDef } from '@tanstack/react-table';

interface SignupBonusRequestDataSectionProps {
  data: SignupBonusRequestData[];
  columns: ColumnDef<SignupBonusRequestData>[];
}

export default function SignupBonusRequestDataSection({ data, columns }: SignupBonusRequestDataSectionProps) {
  if (data.length === 0) {
    return (
      <div className="p-0">
        <EmptyState
          title="No Sign Up Bonus Requests Found"
          description="No sign up bonus requests match your current criteria. Try adjusting your filters or check back later."
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

