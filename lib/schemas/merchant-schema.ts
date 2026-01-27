import { z } from 'zod';

export const merchantSchema = z.object({
  // Profile
  profileImage: z.string().optional(),

  // Business Information
  businessName: z.string()
    .min(1, 'Business name is required')
    .min(2, 'Business name must be at least 2 characters')
    .max(100, 'Business name must not exceed 100 characters'),
  emailAddress: z.string().email('Invalid email address'),
  phoneNumber: z.string()
    .min(10, 'Phone number must be exactly 10 digits')
    .max(10, 'Phone number must be exactly 10 digits')
    .regex(/^\d{10}$/, 'Phone number must contain only digits'),
  businessCategory: z.array(z.string()).min(1, 'At least one business category is required'),
  rcNumber: z.string().optional().refine(
    (val) => !val || /^RC[A-Z0-9]+$/i.test(val),
    { message: 'RC number must start with "RC" followed by alphanumeric characters' }
  ),
  businessType: z.string().min(1, 'Business type is required'),
  headquarterAddress: z.string().min(1, 'Headquarter address is required'),
  country: z.string().optional(),
  region: z.string().min(1, 'Region is required'),
  state: z.string().min(1, 'State is required'),
  lga: z.string().min(1, 'LGA is required'),
  businessDescription: z.string()
    .min(10, 'Business description must be at least 10 characters')
    .max(500, 'Business description must not exceed 500 characters'),
  businessImagePath: z.array(z.string()).optional(),
  businessOpenHours: z.string().optional(),
  businessClosingHours: z.string().optional(),
  cacDocumentPath: z.string().optional(),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(50, 'Password must not exceed 50 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),

  // Contact Information
  contactPersonName: z.string().min(1, 'Contact person name is required'),
  contactEmailAddress: z.string().email('Invalid contact email address'),
  contactPhoneNumber: z.string()
    .min(10, 'Contact phone number must be exactly 10 digits')
    .max(10, 'Contact phone number must be exactly 10 digits')
    .regex(/^\d{10}$/, 'Contact phone number must contain only digits'),
  contactAddress: z.string().min(1, 'Contact address is required'),
  contactRegion: z.string().min(1, 'Contact region is required'),
  contactState: z.string().min(1, 'Contact state is required'),
  contactLga: z.string().min(1, 'Contact LGA is required'),

  // Payout Information
  bankName: z.string().optional(),
  bankCode: z.string().min(1, 'Bank code is required'),
  bankAccountNumber: z.string()
    .min(10, 'Bank account number must be at least 10 digits')
    .max(10, 'Bank account number must not exceed 10 digits')
    .regex(/^\d{10}$/, 'Bank account number must contain only digits'),
  accountName: z.string().min(1, 'Account name is required'),
  verifiedAccountName: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type MerchantFormData = z.infer<typeof merchantSchema>;

// Dropdown options
export const businessCategories = [
  'Retail',
  'Wholesale',
  'Manufacturing',
  'Service',
  'Agriculture',
  'Hospitality',
  'Transportation'
];

export const businessTypes = [
  'Sole Proprietorship',
  'Partnership',
  'Limited Liability Company',
  'Corporation',
  'S-Corporation',
  'Non-Profit Organization',
  'Cooperative',
  'Franchise'
];




