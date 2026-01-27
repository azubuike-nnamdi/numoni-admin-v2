import { ComponentType, ReactNode } from "react";


type TanstackProviderProps = {
  children: ReactNode
}

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
}

type DashboardProps = {
  brandName?: string;
  merchantId?: string;
  logoUrl?: string;
  qrCodeUrl?: string;
  qrTitle?: string;
  qrDescription?: string;
  summaryContent?: ReactNode;
  onAccountSettings?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
}

type BrandSummaryProps = {
  title?: string;
  subtitle?: string;
  onboardedBranches?: number;
  availableBrandPoints?: string;
  totalCustomers?: string;
}

type QRCodeCardProps = {
  qrCodeUrl?: string;
  title?: string;
  description?: string;
  onDownload?: () => void;
  onShare?: () => void;
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
}

type BrandProfileProps = {
  brandName?: string;
  merchantId?: string;
  logoUrl?: string;
  onAccountSettings?: () => void;
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
}

type SummaryItem = {
  label: string;
  value: string;
  color: 'green' | 'red' | 'gray';
}

type MainBranchSummaryProps = {
  title?: string;
  items?: SummaryItem[];
}

type BranchSummaryData = {
  id: string;
  merchantName: string;
  merchantId: string;
  merchantLogo: string;
  status: 'active' | 'closed' | 'pending';
  todayTransactions: {
    allocatedBudget: number;
    amountSpent: number;
    fees: number;
  };
}

type Branch = {
  branchId: string;
  merchantId: string;
  name: string;
  logo: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING';
  totalAmountRecieved?: number;
  totalPayout?: number;
  fees?: number;
}

type GetBranchesResponse = {
  data: Branch[];
  success: boolean;
  count: number;
  message: string;
  accessedBy: string;
}

type SocialMediaData = {
  whatsApp?: string | null;
  instagram?: string | null;
  x?: string | null;
  linkedin?: string | null;
  snapchat?: string | null;
  website?: string | null;
}


type ActiveBranchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

type RewardModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onCancel?: () => void;
  icon?: ReactNode;
  iconColor?: 'red' | 'green' | 'blue' | 'yellow' | 'gray';
  title: string;
  description: string;
  subDescription?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  primaryButtonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  secondaryButtonVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  primaryButtonColor?: string;
  secondaryButtonColor?: string;
  isLoading?: boolean;
  disabled?: boolean;
}

type Customer = {
  totalTransactions: number;
  totalSpent: number;
  mostShoppedBranch: string;
  customerId: string;
  customerName: string;
  rank?: number;
}

type CustomerAnalyticsData = {
  totalTransactions: number;
  totalSpent: number;
  mostShoppedBranch: string;
  customerId: string;
  customerUserId: string;
  customerName: string;
}

type CustomerAnalyticsResponse = {
  topLoyalCustomers: CustomerAnalyticsData[];
  totalCustomers: number;
}

type BranchAnalyticsData = {
  branchId: string;
  branchName: string;
  logo: string;
  totalPointsIssued: number;
}

type CustomerCardProps = {
  customer: Customer;
  rank?: number;
}

type CustomerSectionProps = {
  title: string;
  customers: Customer[];
}


type RewardRulesSectionProps = {
  earnMethod: string;
  minSpending: string;
  setMinSpending: (value: string) => void;
  maxSpending: string;
  setMaxSpending: (value: string) => void;
  rewardPercentage: string;
  setRewardPercentage: (value: string) => void;
  rewardRules: Array<{ min: string, max: string, percentage: string }>;
  setRewardRules: (rules: Array<{ min: string, max: string, percentage: string }>) => void;
  showTable: boolean;
  setShowTable: (show: boolean) => void;
}

type RewardCapSectionProps = {
  rewardCap: string;
  setRewardCap: (value: string) => void;
}

type MilestoneTargetSectionProps = {
  milestoneTarget: string;
  setMilestoneTarget: (value: string) => void;
}

type ReceiveMethodSectionProps = {
  receiveMethod: string;
  setReceiveMethod: (value: string) => void;
}

type ExpirationSectionProps = {
  pointExpiration: string;
  setPointExpiration: (value: string) => void;
}

type DateSectionProps = {
  startDate: string;
  setStartDate: (value: string) => void;
  endDate: string;
  setEndDate: (value: string) => void;
}

type signInPayload = {
  username: string;
  password: string;
  usertype: string;
  deviceId: string;
}

type AuthUser = {
  id: string;
  username: string;
  usertype: string;
  roles: string[];
  token: string;
  refreshToken: string;
}

type AuthUserStore = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logoutInProgress: boolean;

  // Actions
  setUser: (user: AuthUser) => void;
  clearUser: () => void;
  updateTokens: (token: string, refreshToken: string) => void;
  setLoading: (loading: boolean) => void;
  setLogoutInProgress: (inProgress: boolean) => void;
}

type CreateRewardsPayload = {
  merchantId: string;
  rewardType: string;
  rules: Array<{
    minSpend: number;
    maxSpend: number;
    rewardValue: number;
  }>;
  rewardCap: number;
  distributionType: string;
  milestoneTarget: number;
  pointExpirationDays: number;
  status: string;
  startDate: string | null;
  endDate: string | null;

}

type UpdateBranchManagerPayload = {
  branchId: string;
  name: string;
  email: string;
  phone: string;
}


type AdminNavigationItem = {
  name: string;
  path?: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  children?: AdminNavigationItem[];
  badge?: string;
}

type RewardRule = {
  minSpend: number;
  maxSpend: number;
  rewardValue: number;
};

type Rewards = {
  id: string;
  merchantId: string;
  rewardType: string;
  rules: Array<RewardRule>;
  rewardCap: number;
  distributionType: string;
  milestoneTarget: number;
  pointExpirationDays: number;
  status: string;
  startDate: string | null;
  endDate: string | null;
}

// Axios error type for API error handling
type AxiosError = {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
  message?: string;
};

// Error display component props
type ErrorDisplayProps = {
  error?: string;
  isError?: boolean;
  onRetry?: () => void;
  className?: string;
};

// Point analytics component props
type PointAnalyticsProps = {
  isPending: boolean;
  rewardTableData: Rewards | null;
  errorMessage?: string;
  isError: boolean;
  onRetry?: () => void;
};

type singleBranchDetails = {
  lga: string;
  openingTime: string;
  latitude: string;
  description: string;
  linkedin: string | null;
  instagram: string | null;
  managerProfilePhoto: string;
  snapchat: string | null;
  emailAddress: string;
  closingTime: string;
  merchantId: string;
  logo: string;
  minimumPaymentAmount: string;
  bankAccountNumber: string;
  id: string;
  state: string;
  longitude: string;
  bankAccountName: string;
  bankCode: string;
  images: string[];
  website: string;
  address: string;
  whatsApp: string;
  managerId: string;
  phoneNumber: string;
  totalAmountRecieved: number;
  totalPayout: number;
  fees: number;
  name: string;
  x: string | null;
  region: string;
  status: string;
  managerDetails: {
    name: string;
    email: string;
    phone: string;
  }
}

type BankPayload = {
  secret: string;
  clientId: string;
}

type BankToken = {
  accessToken: string;
  expiresIn: number;
  tokenType: string;
  expirationTime?: number;
}

type VerifyBankPayload = {
  bankCode: string;
  accountNumber: string;
}

type ChangeBranchStatusPayload = {
  branchId: string;
  status: string;
}

type BranchManagerPayload = {
  name: string
  email: string
  phone: string
}


type UpdateRewardRuleModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ruleData: Rewards | null;
}


// Transaction data type based on API response
type Transaction = {
  transactionViewId: string;
  customerId: string;
  merchantId: string;
  merchantName: string;
  merchantImageURl: string | null;
  customername: string;
  customerImageURl: string | null;
  createdDt: string;
  type: string;
  transactionId: string;
  transactionNo: string | null;
  status: string | null;
  trnType: 'C' | 'D';
  amount: number;
}

type InfoItem = {
  label: string;
  value: string;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  isBadge?: boolean;
};

type AccountInformationProps = {
  registrationDate: string;
  lastLogin: string;
  accountType: string;
  accountStatus: "Verified" | "Pending" | "Suspended";
  identityType: string;
  identityNumber: string;
  businessNumber: string;
  maxPointsIssued: string;
}

type CreateCustomersPayload = {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  notifyByEmail: boolean;
  password: string;
  preferredLanguage: string;
  address: string;
  lga: string;
  state: string;
  region: string;
  postalCode: string;
}

type CreateCharityPayload = {
  charityName: string;
  charityRegNumber: string;
  charityAddress: string;
  country: string;
  state: string;
  city: string;
  associatedBrandsIds: string[];
  description: string;
  contactPersonName: string;
  contactEmail: string;
  contactPhoneNumber: string;
  password: string;
  contactAddress: string;
  contactCountry: string;
  contactState: string;
  contactCity: string;
  bankName: string;
  bankAccountNumber: string;
  accountName: string;
  verifiedAccountName: string;
}

type CreateMerchantsPayload = {
  businessName: string;
  emailAddress: string;
  phoneNumber: string;
  businessImgPath: string;
  businessCategory: string[];
  rcNumber: string;
  userId: string;
  businessType: string;
  headquartersAddress: string;
  region: string;
  state: string;
  lga: string;
  businessDescription: string;
  businessImagePath?: string[];
  businessOpenHours?: string;
  businessClosingHours?: string;
  cacDocumentPath?: string;
  password: string;
  confirmPassword: string;
  contactPersonName: string;
  contactEmailAddress: string;
  contactPhoneNumber: string;
  contactAddress: string;
  contactRegion: string;
  contactState: string;
  contactIga: string;
  bankName: string;
  bankAccountNumber: string;
  accountHolderName: string;
}

type MerchantTransaction = {
  merchantName: string;
  merchantId: string;
  transactionId: string;
  date: string;
  time: string;
  type: 'SALES' | 'PAY_OUT' | 'SERVICE_FEE';
  amount: number;
  pointIssued: number | null;
  status: 'SUCCESSFUL' | null;
}


type VerifyPayOnUsBankPayload = {
  institutionCode: string;
  accountNumber: string;
  businessId: string;
}

type VerifyBankNamePayload = {
  institutionCode: string;
  accountNumber: string;
}


type CustomerTransaction = {
  customerName: string | null;
  customerId: string | null;
  date: string;
  transactionId: string;
  time: string;
  type: 'PURCHASE' | 'LOAD_MONEY' | 'SHARE_MONEY_DEBIT' | 'SHARE_MONEY_CREDIT' | 'BONUS';
  amount: number;
  pointIssued: number | null;
  status: 'SUCCESSFUL' | null;
};


type MetricCardProps = {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative';
  icon?: React.ReactNode;
  bgColor?: string;
  iconBgColor?: string;
}


type CreateCustomerKycPayload = {
  identificationType: string,
  identificationTypeNumber?: string,
  businessRegNo: string,
  cacDocumentPath?: string,
  reqCertificatePath?: string,
  tinNo?: string,
  tinPath?: string,
  menuPath?: string,
  verifiedNin: boolean,
  verifiedTinNo: boolean,
  verifiedCac: boolean
}

type MerchantDetailsResponse = {
  createdDt: string;
  merchantId: string,
  userId: string | null,
  businessName: string,
  brandName: string | null,
  businessImagePath: string | null,
  businessPhoneNo: string | null,
  businessEmail: string,
  qrCode: string | null,
  registeredBusiness: string | null,
  businessReqNo: string | null,
  spendMinimumAmount: number | null,
  sellOffline: boolean | null,
  sellOnline: boolean | null,
  cacDocumentPath: string | null,
  verifiedNin: boolean | null,
  verifiedTin: boolean | null,
  verifiedCac: boolean | null,
  reqCertificatePath: string | null,
  tinNo: string | null,
  tinPath: string | null,
  ninNo: string | null,
  cacNo: string | null,
  menuPath: string | null,
  userInformation: string | null,
  menu: string | null,
  "status": "Active",
  averageRating: number | null,
  numberOfReviews: number | null,
  category: string[] | null,
  description: string | null,
  identificationType: string | null,
  identificationTypeNumber: string | null,
  minimumThreshold: string | null,
  approvalStatus: string | null,
  locations: [
    {
      id: string | null,
      userId: string | null,
      storeNo: string | null,
      address: string | null,
      street: string | null,
      city: string | null,
      country: string | null,
      postalCode: string | null,
      latitude: string | null,
      longitude: string | null,
      contactPersonName: string | null,
      contactEmailAddress: string | null,
      contactPhoneNumber: string | null,
      contactAddress: string | null,
      createdDt: string | null,
      updatedDt: string | null,
      active: boolean | null,
    }
  ],
  bankInformation: [
    {
      id: string | null,
      merchantId: string | null,
      bankname: string | null,
      bankcode: string | null,
      accountNo: string | null,
      accountHolderName: string | null,
      bankTransferCode: string | null,
      primary: boolean | null,
      minimumSpentAmount: number | null,
      active: boolean | null,
      createdDt: string | null,
      updatedDt: string | null
    }
  ],
  businessImages: string | null,
  percentage: number | null,
  facebook: string | null,
  instagram: string | null,
  twitter: string | null,
  linkedin: string | null,
  snapchat: string | null,
  website: string | null,
  tiktok: string | null,
  wallet: string | null
  lastLogin: string;
  kycStatus: string;
  reviewAvg: number | null;
  reviewCount: number | null;
  registrationDate: string | null;
  nin: string | null;
}

type CustomerDetailsResponse = {
  id: string,
  name: string;
  email: string;
  termAndCondition: string | null;
  userId: string;
  phoneNumber: string;
  qrCode: string | null;
  createdDt: string;
  updatedDt: string | null;
  kudaAccountNumber: string | null;
  kudaAccountHolderName: string | null;
  profilePicture: string | null;
  dateOfBirth: string;
  gender: string;
  loyaltyPoints: string | null;
  membershipTier: string | null;
  totalSpent: string | null;
  lastPurchaseDate: string | null;
  lastLogin: string;
  globalWalletBalance: string | null;
  level2WalletBalance: string | null;
  savedCharities: string | null;
  referralCode: string | null;
  referredBy: string | null;
  referralPoints: string | null;
  switchAccountEnabled: boolean;
  language: string;
  currency: string | null;
  wallet: {
    userId: string;
    amount: number;
    createdDt: string;
  },
  locations: [
    {
      id: string;
      customerId: string;
      homeNumber: string | null;
      latitude: string | null;
      longitude: string | null;
      street: string | null;
      address: string;
      city: string;
      state: string;
      country: string;
      postalCode: string;
      locationType: string;
      createdDt: string;
      updatedDt: string | null;
      default: boolean;
    }
  ],
  financialOverview: {
    brandPointBalance: {
      totalBrandPoint: number;
      allBrandPointsEarned: number;
      allBrandPointsRedeemed: number;
      allBrandPointsDonated: number;
    },
    walletPointBalance: {
      totalPoint: number;
      allTimeSpent: number;
    },
  },
  emailVerified: boolean;
  phoneVerified: boolean;
}

type UpdateMerchantPayload = {
  businessName?: string;
  emailAddress?: string;
  phoneNumber?: string;
  businessImgPath?: string;
  businessCategory?: string[];
  rcNumber?: string;
  userId?: string;
  businessType?: string;
  headquartersAddress?: string;
  region?: string;
  state?: string;
  lga?: string;
  businessDescription?: string;
  password?: string;
  confirmPassword?: string;
  contactPersonName?: string;
  contactEmailAddress?: string;
  contactPhoneNumber?: string;
  contactAddress?: string;
  contactRegion?: string;
  contactState?: string;
  contactIga?: string;
  bankName?: string;
  bankAccountNumber?: string;
  accountHolderName?: string;
}

type UpdatePosPayload = {
  id: string;
  posId: string;
  posName: string;
  merchantId: string;
  branchId: string;
  bankName: string;
  accountNo: string;
  accountHolderName: string;
  bankCode: string;
  bankTransferCode: string;
  location: string;
  address: string;
}
type CharityData = {
  id: string;
  charityName: string;
  charityRegNumber: string;
  charityAddress: string;
  country: string;
  state: string;
  city: string;
  associatedBrandsIds: string | null;
  description: string;
  logoUrl: string;
  mediaUrls: string[];
  contactPersonName: string;
  contactEmail: string;
  contactPhoneNumber: string;
  contactAddress: string;
  contactCountry: string;
  contactState: string;
  contactCity: string;
  bankName: string;
  bankAccountNumber: string;
  accountName: string;
  status: string;
  dateAdded: string;
  totalPointDonated: number;
  numberOfDonations: number;
  message: string | null;
}

type DealData = {
  id: string;
  userId: string;
  name: string;
  description: string;
  dealType: string;
  initialPrice: string;
  discount: string;
  newPrice: string;
  category: string[];
  qualifyingPurchase: string;
  rewardItemQuantity: string;
  pricePerItem: string;
  availableStock: string;
  startDate: string;
  endDate: string;
  dealStatus: string;
  usageLimit: string | null;
  merchantName: string;
  merchantLogo: string | null;
  imagePath: Array<{
    id: string;
    dealId: string;
    imagePath: string;
  }>;
}

type PosData = {
  id: string;
  posId: string;
  posName: string;
  merchantId: string;
  branchId: string | null;
  bankName: string;
  accountNo: string;
  accountHolderName: string;
  bankCode: string;
  bankTransferCode: string;
  location: string | null;
  address: string | null;
  status: string;
  posQRCode: string;
  createDate: string;
  updatedDate: string;
  merchantLogo: string | null;
  merchantName: string | null;
}

type Merchant = {
  id: string;
  userId: string;
  businessName: string;
  description: string;
  createdDt: string;
  email: string;
  businessPhoneNo: string | null;
  category: string[];
}

type CreateDealsPayload = {
  brandOrMerchantId: string;
  name: string;
  dealType: string;
  description: string;
  availableStock: string;
  initialPrice?: string;
  discount?: string;
  newPrice?: string;
  qualifyingPurchase?: string;
  rewardItemQuantity?: string;
  pricePerItem?: string;
  category: string[];
  startDate: string;
  endDate: string;
  imagePath: Array<{ imagePath: string }>;
  dealProducts?: {
    productId: string;
    productName: string;
  }[];
  dealLocations?: {
    city: string;
    street: string;
    locationId: string;
  }[];
  active: boolean;
}

type EditDealPayload = {
  dealId: string;
  dealsTitle: string;
  brandsMerchants: string;
  dealType: string;
  dealCategory: string[];
  startDate: string;
  endDate: string;
  availableStock: string;
  oldPrice?: number;
  discountPercent?: string;
  newPrice?: number;
  qualifyingPurchase?: string;
  rewardItemQuantity?: string;
  pricePerItem?: number;
  products?: string[];
  targetLocation?: string[];
  dealsDescription: string;
  sendNotification: 'yes' | 'no';
}

type UpdateDealStatusPayload = {
  dealId: string;
  status: string;
}

type CreateRolePayload = {
  name: string;
  description: string;
}

type CreatePrivilegeMappingPayload = {
  roleId: string,
  roleName: string,
  moduleId: string,
  moduleName: string,
  privilegeCreate: boolean,
  privilegeUpdate: boolean,
  privilegeDelete: boolean,
  privilegeView: boolean
}[]

type CreateModulePayload = {
  moduleName: string;
  description: string;
}

type CreateTicketTypePayload = {
  name: string;
  userType: string;
}

type CreateAdminPayload = {
  id?: string;
  name?: string;
  position?: string | null;
  department?: string | null;
  email?: string;
  phone?: string;
  shift?: string | null;
  loginAccess?: boolean;
  roleName?: string;
  password?: string;
}

type UpdateKycStatusPayload = {
  merchantId: string
  documentType: string
  status: string
  reason?: string
}


type Bank = {
  code: string;
  name: string;
}

type AdjustPointPayload = {
  walletId: string;
  points: number;
  reason: string;
  adminId: string;
  walletType: string;
}

type AdjustBalancePayload = {
  walletId: string;
  balance: number;
  reason: string;
  adminId: string;
  walletType: string;
}


// Type representing the raw API activity log item
type ApiActivityLog = {
  id: string;
  userId?: string | null;
  userName?: string;
  userType?: string;
  changeLog?: string;
  createdBy?: string;
  typeId?: string | null;
  type?: string;
  action?: string;
  accessDate?: string;
  systemIp?: string;
  createdTime?: string;
};

type IndividualMerchantTransactionDetails = {
  transactionId: string;
  transactionNo: string;
  type: string;
  trnType: string;
  trnInAmount: number | null;
  trnOutAmount: number | null;
  fee: number | null;
  status: string;
  paymentDate: string | null;
  merchantId: string;
  merchantName: string;
  branchId: string | null;
  customerId: string;
  payOnusAccountName: string | null;
  payOnusAccountNumber: string | null;
  payOnusBank: string | null;
  paidFromAccount: string | null;
  currency: string | null;
  bonusDetails: string;
  reportDetails: string | null;
}

interface DashboardMetrics {
  merchants: {
    serviceFee: number;
    totalServiceFee: number;
    payOnUsFee: number;
    totalCredit: number;
    newMerchants: number;
    totalSales: number;
    payOut: number;
    totalPayOut: number;
    totalMerchants: number;
    credit: number;
  };
  customers: {
    deactiveCustomers: number;
    totalLoadMoney: number;
    totalBonus: number;
    totalCustomers: number;
    shareMoneyDebit: number;
    totalCredit: number;
    shareMoneyCredit: number;
    bonus: number;
    activeCustomers: number;
    purchase: number;
    loadMoney: number;
    totalDebit: number;
    totalPurchase: number;
    credit: number;
    debit: number;
    dateBetweenUsers: number;
  };
  tickets: {
    pendingTickets: string;
    processingTickets: string;
    totalProcessingTickets: string | number;
    totalPendingTickets: string | number;
    totalCompletedTickets: string | number;
    totalTickets: number;
    completedTickets: string;
  };
}

interface ChartDataPoint {
  period: string;
  value: number;
}

interface MetricItem {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  progress: number;
}

type PointFlowData = {
  // percentage: { redeemed: number; earned: number };
  totalPoints: number;
  earnedPoints: number;
  expiredPoints: number;
  redeemedPercentage: string;
  redeemedPoints: number;
  donatedPoints: number;
  earnedPercentage: string;
  // distribution: { redeemed: number; earned: number; expired: number; donated: number };
};

type Funding = {
  id: string;
  amount: number;
  transactionId: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type FundingReconciliation = {
  dynamicAccountNumber: string;
  collectionBank: string;
  sessionId: string | null;
  providerId: string;
  fees: number;
  transactionReference: string;
  providerStatus: string;
  customerId: string;
  senderName: string | null;
  senderBank: string | null;
  amountPaid: number;
  pointsIssued: number;
  numoniStatus: string;
  timestamp: string;
};

type PaginatedFundingReconciliationData = {
  data: FundingReconciliation[];
  totalRows?: number;
  totalPages?: number;
  total?: number;
};

type FundingReconciliationApiResponse = {
  success: boolean;
  message: string;
  data: FundingReconciliation[] | PaginatedFundingReconciliationData;
};

type Payout = {
  merchantName: string;
  merchantBankName: string | null;
  accountNumber: string | null;
  branchName: string | null;
  merchantId: string;
  payoutAmount: number;
  payoutDate: string;
  merchantBalanceBefore: number | null;
  merchantBalanceAfter: number | null;
  providerFee: number | null;
  salesStartDateTime: string | null;
  salesEndDateTime: string | null;
  settlementReference: string | null;
  payonusReference: string | null;
  payonusBalanceBefore: number | null;
  payonusBalanceAfter: number | null;
  status: string | null;
};

type PayoutPagination = {
  totalPages: number;
  pageSize: number;
  currentPage: number;
  totalElements: number;
};

type PaginatedPayoutData = {
  pagination: PayoutPagination;
  data: Payout[];
  success: boolean;
  message: string;
};

type PayoutApiResponse = {
  pagination: PayoutPagination;
  data: Payout[];
  success: boolean;
  message: string;
};

interface MerchantRewardRule {
  id: string;
  minSpend: number;
  maxSpend: number;
  rewardValue: number;
}

interface RewardRuleApiItem {
  minSpend: number;
  maxSpend: number;
  rewardValue: number;
}

interface RewardData {
  distributionType: string;
  rewardCap: number;
  rewardType: string;
  rules: RewardRuleApiItem[];
  milestoneTarget: number;
  PercentageDeductionpertransaction: number;
}

interface RewardRuleApiResponse {
  data: RewardData;
  message: string;
  status: boolean;
}

interface RuleCardProps {
  title: string;
  value: string | number;
  tooltip?: string;
}

interface CacVerificationResponse {
  data: {
    headOfficeAddress: string;
    companyEmail: string;
    city: string;
    rcNumber: string;
    companyName: string;
    cac_status: string;
    id: number;
    state: string;
    cac_check: string;
    status: string;
  };
  message: string;
  status: number;
}

type DealInformationProps = {
  name: string;
  description: string;
  dealType: string;
  initialPrice?: string;
  discount?: string;
  newPrice?: string;
  category: string[];
  availableStock: string;
  startDate: string;
  endDate: string;
  dealStatus: string;
  approveStatus?: string | null;
  merchantName?: string;
  merchantId?: string | null;
  usageLimit?: string | null;
  qualifyingPurchase?: string | null;
  rewardItemQuantity?: string | null;
  pricePerItem?: string | null;
  isBranchDeal?: boolean;
  branchId?: string | null;
}

type DateRangeOption = 'Today' | 'Yesterday' | 'This Week' | 'This Month' | 'Last Month' | 'Custom Range' | 'All Time' | null;

type UpdateMerchantVerificationStatusPayload = {
  merchantId: string;
  status: 'APPROVED' | 'REJECTED' | 'SUSPENDED' | 'VERIFIED' | 'UNVERIFIED';
}



type PointAllocationApiItem = {
  customerName: string;
  customerCode: string;
  pointBalance: number;
  expireDate: string;
  location: string;
}

type PointAllocationPagination = {
  totalPages: number;
  pageSize: number;
  currentPage: number;
  totalElements: number;
}
type PointAllocationApiResponse = {
  pagination: PointAllocationPagination;
  data: PointAllocationApiItem[];
  success: boolean;
  message: string;
}

type SponsorDealApiItem = {
  id: string;
  heading: string;
  description: string;
  dealId: string;
  backgroundImage: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

type SponsorDealApiResponse = {
  content: SponsorDealApiItem[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: Array<{
      direction: string;
      property: string;
      ignoreCase: boolean;
      nullHandling: string;
      ascending: boolean;
      descending: boolean;
    }>;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  sort: Array<{
    direction: string;
    property: string;
    ignoreCase: boolean;
    nullHandling: string;
    ascending: boolean;
    descending: boolean;
  }>;
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}


export type { AccountInformationProps, ActiveBranchModalProps, AdjustBalancePayload, AdjustPointPayload, AdminNavigationItem, ApiActivityLog, AuthUser, AuthUserStore, AxiosError, Bank, BankPayload, BankToken, Branch, BranchAnalyticsData, BranchManagerPayload, BranchSummaryData, BrandProfileProps, BrandSummaryProps, CacVerificationResponse, ChangeBranchStatusPayload, CharityData, ChartDataPoint, CreateAdminPayload, CreateCharityPayload, CreateCustomerKycPayload, CreateCustomersPayload, CreateDealsPayload, CreateMerchantsPayload, CreateModulePayload, CreatePrivilegeMappingPayload, CreateRewardsPayload, CreateRolePayload, CreateTicketTypePayload, Customer, CustomerAnalyticsData, CustomerAnalyticsResponse, CustomerCardProps, CustomerDetailsResponse, CustomerSectionProps, CustomerTransaction, DashboardMetrics, DashboardProps, DateRangeOption, DateSectionProps, DealData, DealInformationProps, EditDealPayload, ErrorDisplayProps, ExpirationSectionProps, Funding, FundingReconciliation, FundingReconciliationApiResponse, GetBranchesResponse, IndividualMerchantTransactionDetails, InfoItem, MainBranchSummaryProps, Merchant, MerchantDetailsResponse, MerchantRewardRule, MerchantTransaction, MetricCardProps, MetricItem, MilestoneTargetSectionProps, PaginatedFundingReconciliationData, PaginatedPayoutData, Payout, PayoutApiResponse, PayoutPagination, PointAllocationApiItem, PointAllocationApiResponse, PointAllocationPagination, PointAnalyticsProps, PointFlowData, PosData, QRCodeCardProps, ReceiveMethodSectionProps, RewardCapSectionProps, RewardData, RewardModalProps, RewardRule, RewardRuleApiItem, RewardRuleApiResponse, RewardRulesSectionProps, Rewards, RuleCardProps, SidebarProps, signInPayload, singleBranchDetails, SocialMediaData, SponsorDealApiItem, SponsorDealApiResponse, TanstackProviderProps, Transaction, UpdateBranchManagerPayload, UpdateDealStatusPayload, UpdateKycStatusPayload, UpdateMerchantPayload, UpdateMerchantVerificationStatusPayload, UpdatePosPayload, UpdateRewardRuleModalProps, VerifyBankNamePayload, VerifyBankPayload, VerifyPayOnUsBankPayload };

