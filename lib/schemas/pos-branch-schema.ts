import { z } from 'zod';

const baseSchema = z.object({
  merchantId: z.string().min(1, 'Merchant is required'),
  singleUpload: z.boolean().optional(),
  posName: z.string().optional(),
  bankCode: z.string().min(1, 'Bank is required'),
  bankAccountNumber: z.string().min(10, 'Bank account number must be at least 10 digits').max(10, 'Bank account number must not exceed 10 digits'),
  accountName: z.string().optional(),
});

export const posBranchSchema = baseSchema.extend({
  posBranchFile: z.instanceof(File).optional().or(z.literal('')),
  location: z.string().optional(),
  address: z.string().optional(),
}).superRefine((data, ctx) => {
  // If singleUpload is true, posName, location and address are required
  if (data.singleUpload) {
    if (!data.posName || !data.posName.trim().length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'POS name is required for single upload',
        path: ['posName'],
      });
    }
    if (!data.location || !data.location.trim().length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Location is required for single upload',
        path: ['location'],
      });
    }
    if (!data.address || !data.address.trim().length) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Address is required for single upload',
        path: ['address'],
      });
    }
  } else {
    // If singleUpload is false, posBranchFile is required
    if (!(data.posBranchFile instanceof File)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please upload a CSV or Excel file',
        path: ['posBranchFile'],
      });
    }
  }
});

export type PosBranchFormData = z.infer<typeof posBranchSchema>;

