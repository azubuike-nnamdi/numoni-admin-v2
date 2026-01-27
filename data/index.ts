import { DealIcon } from "@/components/common/icon-svg";
import { calenderIcon, dealIcon, emailIcon, giftIcon, graphDirectionIcon, grayPointIcon, instagramIcon, musicPauseIcon, phoneNotificationIcon, twitterIcon, whatsappIcon } from "@/constant/icons";
import { ADMIN_ACTIVITY_LOGS_URL, ADMIN_CHARITY_ADD_URL, ADMIN_CHARITY_URL, ADMIN_CUSTOMERS_ADD_URL, ADMIN_CUSTOMERS_TRANSACTION_URL, ADMIN_CUSTOMERS_URL, ADMIN_DEALS_PROMO_ADD_URL, ADMIN_DEALS_PROMO_SPONSORED_DEAL_ADD_URL, ADMIN_DEALS_PROMO_SPONSORED_DEAL_URL, ADMIN_DEALS_PROMO_URL, ADMIN_FUNDING_URL, ADMIN_MANAGEMENT_ADD_URL, ADMIN_MANAGEMENT_URL, ADMIN_MERCHANTS_ADD_URL, ADMIN_MERCHANTS_POS_BRANCH_LIST_URL, ADMIN_MERCHANTS_POS_BRANCH_URL, ADMIN_MERCHANTS_ROLES_URL, ADMIN_MERCHANTS_TRANSACTION_URL, ADMIN_MERCHANTS_URL, ADMIN_NOTIFICATIONS_URL, ADMIN_REPORTS_CHARITY_URL, ADMIN_REPORTS_POINTS_URL, ADMIN_REPORTS_SUPPORT_URL, ADMIN_REPORTS_URL, ADMIN_SIGN_UP_BONUS_URL, ADMIN_TRANSACTIONS_PAYOUTS_URL, ADMIN_TRANSACTIONS_POINTS_URL, ADMIN_TRANSACTIONS_PURCHASES_URL, ADMIN_URL } from "@/constant/routes";
import { AdminNavigationItem } from "@/lib/types";
import { AppWindow, BarChart3, Bell, Building, ChartArea, FileBarChart, FileText, Gift, Heart, LayoutDashboard, Plus, Shield, Ticket, User, Users } from "lucide-react";



// Data for "What You Can Do" section
const whatYouCanDoData = [
  {
    icon: dealIcon,
    alt: "Deal Icon",
    text: "Define rewards as a percentage, fixed amount, or by category"
  },
  {
    icon: graphDirectionIcon,
    alt: "Graph Direction Icon",
    text: "Set limits and caps to control total points issued"
  },
  {
    icon: musicPauseIcon,
    alt: "Pause Icon",
    text: "Pause and resume rewards when needed"
  },
  {
    icon: phoneNotificationIcon,
    alt: "Notification Icon",
    text: "Get notified when 75% of your reward budget is used"
  }
];

// Data for "Benefits" section
const benefitsData = [
  {
    icon: dealIcon,
    alt: "Control Icon",
    text: "Keep full control of your marketing spend"
  },
  {
    icon: graphDirectionIcon
    ,
    alt: "Motivation Icon",
    text: "Motivate customers to keep coming back"
  },
  {
    icon: musicPauseIcon,
    alt: "Fairness Icon",
    text: "Ensure rewards stay fair and sustainable"
  }
];

const tabs = [
  { id: "reward-table", label: "Reward Table" },
  // { id: "customers-score", label: "Customers Score" },
  { id: "points-allocation", label: "Points Allocation" },
  { id: "analytics-trends", label: "Analytics & Trends" }
];

const rewardTableData = [
  { min: 1, max: "9,999", reward: "1%" },
  { min: "10,000", max: "29,999", reward: "2%" },
  { min: "30,000", max: "49,999", reward: "3%" },
  { min: "50,000", max: "69,999", reward: "4%" },
  { min: "70,000", max: "Above", reward: "5%" }
];

const summaryData = [
  {
    icon: giftIcon,
    label: "Reward Type",
    value: "Up to 5% cash-back"
  },
  {
    icon: grayPointIcon,
    label: "Claim Type",
    value: "Instant"
  },
  {
    icon: calenderIcon,
    label: "Issuing Date",
    value: "From today"
  },
  {
    icon: calenderIcon,
    label: "End Date",
    value: "-"
  }
];

// Dummy transaction data
const transactionData = [
  { id: 1, name: "From Adebimpe", date: "Aug 16, 2025", time: "2:45 PM", amount: "27,200", status: "Received" },
  { id: 2, name: "From Adebimpe", date: "Aug 16, 2025", time: "2:45 PM", amount: "27,200", status: "Received" },
  { id: 3, name: "To Olu", date: "Aug 19, 2025", time: "4:00 PM", amount: "8,750", status: "Received" },
  { id: 4, name: "To Uche", date: "Aug 21, 2025", time: "3:30 PM", amount: "20,600", status: "Received" },
  { id: 5, name: "From Chidi", date: "Aug 22, 2025", time: "10:15 AM", amount: "15,300", status: "Received" },
  { id: 6, name: "To Fatima", date: "Aug 22, 2025", time: "11:30 AM", amount: "12,500", status: "Received" },
  { id: 7, name: "From Ibrahim", date: "Aug 23, 2025", time: "1:20 PM", amount: "35,000", status: "Received" },
  { id: 8, name: "To Grace", date: "Aug 23, 2025", time: "3:45 PM", amount: "18,750", status: "Received" },
  { id: 9, name: "From David", date: "Aug 24, 2025", time: "9:00 AM", amount: "22,100", status: "Received" },
  { id: 10, name: "To Blessing", date: "Aug 24, 2025", time: "2:15 PM", amount: "14,800", status: "Received" },
  { id: 11, name: "From Sarah", date: "Aug 25, 2025", time: "4:30 PM", amount: "29,500", status: "Received" },
  { id: 12, name: "To Michael", date: "Aug 25, 2025", time: "5:45 PM", amount: "16,200", status: "Received" },
  { id: 13, name: "From Peace", date: "Aug 26, 2025", time: "8:30 AM", amount: "31,400", status: "Received" },
  { id: 14, name: "To John", date: "Aug 26, 2025", time: "12:00 PM", amount: "19,600", status: "Received" },
  { id: 15, name: "From Mary", date: "Aug 27, 2025", time: "1:45 PM", amount: "25,300", status: "Received" },
  { id: 16, name: "To Peter", date: "Aug 27, 2025", time: "3:20 PM", amount: "13,700", status: "Received" },
  { id: 17, name: "From James", date: "Aug 28, 2025", time: "10:45 AM", amount: "28,900", status: "Received" },
  { id: 18, name: "To Faith", date: "Aug 28, 2025", time: "2:30 PM", amount: "17,400", status: "Received" },
  { id: 19, name: "From Hope", date: "Aug 29, 2025", time: "11:15 AM", amount: "24,800", status: "Received" },
  { id: 20, name: "To Joy", date: "Aug 29, 2025", time: "4:00 PM", amount: "21,500", status: "Received" },
  { id: 21, name: "From Love", date: "Aug 30, 2025", time: "9:30 AM", amount: "26,700", status: "Received" },
  { id: 22, name: "To Patience", date: "Aug 30, 2025", time: "1:00 PM", amount: "15,900", status: "Received" },
  { id: 23, name: "From Wisdom", date: "Aug 31, 2025", time: "2:15 PM", amount: "33,200", status: "Received" },
  { id: 24, name: "To Understanding", date: "Aug 31, 2025", time: "5:30 PM", amount: "20,100", status: "Received" },
  { id: 25, name: "From Knowledge", date: "Sep 1, 2025", time: "8:45 AM", amount: "30,500", status: "Received" }
];

// Point Allocation Dashboard Data
const branches = [
  "Chicken Republic Ikeja",
  "Chicken Republic Vi",
  "Chicken Republic Abuja",
  "Chicken Republic Ketu",
  "Chicken Republic Surulere"
];

const regions = [
  "Lagos", "Kogi", "Abuja", "Delta", "Bayelsa", "Rivers", "Kano", "Kaduna",
  "Ogun", "Oyo", "Osun", "Ondo", "Edo", "Enugu", "Anambra", "Imo", "Abia"
];

const timelineOptions = [
  "Today",
  "Yesterday",
  "This Week",
  "Last Week",
  "This Month",
  "Last Month",
  "Custom Range"
];

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const years = ["2023", "2024", "2025"];




const adminNavigationItem: AdminNavigationItem[] = [
  {
    name: 'Overview',
    path: ADMIN_URL,
    icon: LayoutDashboard
  },
  {
    name: 'Notifications',
    path: ADMIN_NOTIFICATIONS_URL,
    icon: Bell,
    // badge: '12'
  },
  {
    name: 'Merchants',
    icon: Users,
    children: [
      { name: 'Add Merchant', path: ADMIN_MERCHANTS_ADD_URL, icon: Plus },
      { name: 'All Merchants', path: ADMIN_MERCHANTS_URL, icon: Users },
      { name: 'Add POS Branch', path: ADMIN_MERCHANTS_POS_BRANCH_URL, icon: Plus },
      { name: 'All POS Branches', path: ADMIN_MERCHANTS_POS_BRANCH_LIST_URL, icon: Building },
      { name: 'Merchant Transactions', path: ADMIN_MERCHANTS_TRANSACTION_URL, icon: BarChart3 }
    ]
  },
  {
    name: 'Customers',
    icon: User,
    children: [
      { name: 'All Customers', path: ADMIN_CUSTOMERS_URL, icon: User },
      { name: 'Add New Customers', path: ADMIN_CUSTOMERS_ADD_URL, icon: Plus },
      { name: 'Customers Transactions', path: ADMIN_CUSTOMERS_TRANSACTION_URL, icon: FileText }
    ]
  },
  {
    name: 'Charities',
    icon: Heart,
    children: [
      { name: 'All Charities', path: ADMIN_CHARITY_URL, icon: Heart },
      { name: 'Add New Charities', path: ADMIN_CHARITY_ADD_URL, icon: Plus },
      // { name: ' Transactions', path: ADMIN_CHARITY_TRANSACTION_URL, icon: FileText }
    ]
  },
  {
    name: 'Deals & Promo',
    icon: DealIcon,
    children: [
      { name: 'All Deals & Promo', path: ADMIN_DEALS_PROMO_URL, icon: Heart },
      { name: 'Add New Deals & Promo', path: ADMIN_DEALS_PROMO_ADD_URL, icon: Plus },
      { name: 'All Sponsored Deals', path: ADMIN_DEALS_PROMO_SPONSORED_DEAL_URL, icon: AppWindow },
      { name: 'Add New Sponsored Deal', path: ADMIN_DEALS_PROMO_SPONSORED_DEAL_ADD_URL, icon: Plus },
    ]
  },
  {
    name: 'Transactions',
    icon: ChartArea,
    children: [
      { name: 'Funding', path: ADMIN_FUNDING_URL, icon: ChartArea },
      { name: 'Purchases', path: ADMIN_TRANSACTIONS_PURCHASES_URL, icon: BarChart3 },
      { name: 'Payouts', path: ADMIN_TRANSACTIONS_PAYOUTS_URL, icon: FileText },
      { name: 'Points', path: ADMIN_TRANSACTIONS_POINTS_URL, icon: FileText },
    ]
  },
  {
    name: 'Admin Management',
    icon: Building,
    children: [
      { name: 'All Admins', path: ADMIN_MANAGEMENT_URL, icon: Building },
      { name: 'Add New Admin', path: ADMIN_MANAGEMENT_ADD_URL, icon: Plus },
    ]
  },
  {
    name: 'Roles & Permission',
    path: ADMIN_MERCHANTS_ROLES_URL,
    icon: Shield
  },
  {
    name: 'Sign Up Bonus',
    icon: Gift,
    children: [
      { name: 'All Bonus', path: ADMIN_SIGN_UP_BONUS_URL, icon: Gift },
      // { name: 'Add Bonus', path: ADMIN_SIGN_UP_BONUS_ADD_URL, icon: Plus },
    ]
  },
  {
    name: 'Activity Logs',
    path: ADMIN_ACTIVITY_LOGS_URL,
    icon: FileText,

  },
  {
    name: 'Sales Report',
    icon: BarChart3,
    path: ADMIN_REPORTS_URL
  },
  {
    name: 'Points Report',
    path: ADMIN_REPORTS_POINTS_URL,
    icon: FileBarChart
  },
  {
    name: 'Charity Report',
    path: ADMIN_REPORTS_CHARITY_URL,
    icon: Heart
  },
  {
    name: 'Support ',
    path: ADMIN_REPORTS_SUPPORT_URL,
    icon: Ticket
  }
];

// Social Media Platforms Configuration
const socialMediaPlatforms = [
  {
    key: 'whatsapp',
    name: 'WhatsApp',
    icon: whatsappIcon,
    color: 'text-green-600'
  },
  {
    key: 'instagram',
    name: 'Instagram',
    icon: instagramIcon,
    color: 'text-pink-600'
  },
  {
    key: 'x',
    name: 'X(Twitter)',
    icon: twitterIcon,
    color: 'text-gray-600'
  },
  {
    key: 'linkedin',
    name: 'LinkedIn',
    icon: emailIcon, // Using email icon as fallback
    color: 'text-blue-700'
  },
  {
    key: 'snapchat',
    name: 'Snapchat',
    icon: emailIcon, // Using email icon as fallback
    color: 'text-yellow-600'
  },
  {
    key: 'website',
    name: 'Website',
    icon: emailIcon, // Using email icon as fallback
    color: 'text-gray-700'
  }
];

// Mock data - in a real app, this would come from an API
const mockMerchantData = {
  businessName: "NyxLuxe Lingeries",
  userId: "035448",
  level: "Level 2",
  personalInfo: {
    businessName: "NyxLuxe Lingeries",
    category: "Fashion",
    email: "NyxLuxe@gmail.com",
    address: "20b, Atumwa street, Ikeja, Lagos",
    phone: "+234 7012345678",
    bankName: "Zenith Bank",
    accountName: "NyxLuxe Lingeries",
    accountNumber: "0246352345",
  },
  accountInfo: {
    registrationDate: "20 June 2022",
    lastLogin: "January 5 2024, 10:30pm",
    accountType: "Merchants",
    accountStatus: "Verified" as const,
    identityType: "NIN",
    identityNumber: "123456789012",
    businessNumber: "BN123456CA",
    maxPointsIssued: "300k",
  },
  description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  charityCount: 20,
  reportsCompleted: 1,
  totalReports: 3,

};



export {
  adminNavigationItem, benefitsData,
  branches,
  mockMerchantData, months,

  regions,
  rewardTableData,
  socialMediaPlatforms,
  summaryData,
  tabs,
  timelineOptions,
  transactionData,
  whatYouCanDoData,
  years
};

