
import React from 'react';
import { RewardRule } from './types';

// Extend Window interface for html2canvas
declare global {
  interface Window {
    html2canvas?: (
      element: HTMLElement,
      options?: {
        backgroundColor?: string;
        scale?: number;
        useCORS?: boolean;
        logging?: boolean;
      }
    ) => Promise<HTMLCanvasElement>;
  }
}

/**
 * Determines if a navigation item should be marked as active based on the current path.
 * 
 * This function implements a hierarchical navigation system where only the most specific
 * matching route is considered active. It prevents multiple navigation items from being
 * active simultaneously when dealing with nested routes.
 * 
 * @param itemPath - The path of the navigation item to check (e.g., '/dashboard')
 * @param currentPath - The current URL pathname (e.g., '/dashboard/branch-level/1')
 * @param allPaths - Array of all available navigation paths for comparison
 * 
 * @returns `true` if the navigation item should be active, `false` otherwise
 * 
 * @example
 * ```typescript
 * const allPaths = ['/dashboard', '/dashboard/branch-level', '/dashboard/reward-table'];
 * 
 * // Exact match - always active
 * isNavigationItemActive('/dashboard', '/dashboard', allPaths); // true
 * 
 * // Child route with no more specific parent - active
 * isNavigationItemActive('/dashboard/branch-level', '/dashboard/branch-level/1', allPaths); // true
 * 
 * // Parent route when child exists - not active
 * isNavigationItemActive('/dashboard', '/dashboard/branch-level', allPaths); // false
 * 
 * // No match - not active
 * isNavigationItemActive('/dashboard', '/profile', allPaths); // false
 * ```
 * 
 * @remarks
 * The function uses a hierarchical approach:
 * 1. Exact matches are always active
 * 2. Child routes are only active if no more specific parent route exists
 * 3. Parent routes are inactive when a more specific child route matches
 * 
 * This prevents the common issue of both parent and child navigation items
 * being highlighted simultaneously in sidebar navigation.
 */
export const isNavigationItemActive = (itemPath: string, currentPath: string, allPaths: string[]) => {
  // Exact match is always active
  if (currentPath === itemPath) return true;

  // Check if current path is a child of this item
  if (!currentPath.startsWith(itemPath + '/')) return false;

  // Find the most specific matching parent route
  // A route is more specific if it's longer and the current path starts with it
  const moreSpecificPaths = allPaths.filter(path =>
    path !== itemPath &&
    path.length > itemPath.length &&
    (currentPath.startsWith(path + '/') || currentPath === path)
  );

  // Only active if no more specific route exists
  return moreSpecificPaths.length === 0;
};


/**
 * Converts a pathname to a readable page title
 * @param path - The pathname string (e.g., "/dashboard/branch-level")
 * @param searchParams - Optional search parameters object (e.g., { branchName: "My Branch" })
 * @returns A formatted title (e.g., "Branch Level" or "My Branch")
 */
export const getPageTitle = (path: string, searchParams?: Record<string, string>): string => {
  // Debug logging
  // console.log('getPageTitle - path:', path);
  // console.log('getPageTitle - searchParams:', searchParams);
  // console.log('getPageTitle - searchParams type:', typeof searchParams);
  // console.log('getPageTitle - searchParams keys:', searchParams ? Object.keys(searchParams) : 'undefined');

  // Check if we have a branchName in search params for branch-level routes
  if (searchParams?.customerName && path.includes('/customers/')) {
    // console.log('Returning customerName:', searchParams.customerName);
    return searchParams.customerName;
  }
  if (searchParams?.merchantName && path.includes('/merchants')) {
    // console.log('Returning merchantName:', searchParams.merchantName);
    return searchParams.merchantName;
  }

  const pathSegments = path.split('/').filter(Boolean);
  const lastSegment = pathSegments[pathSegments.length - 1];

  // Convert kebab-case or snake_case to Title Case
  return lastSegment
    ? lastSegment
      .split(/[-_]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
    : 'Dashboard';
};

/**
 * Converts a color to a class name
 * @param color - The color string (e.g., "green", "red", "gray")
 * @returns A class name (e.g., "bg-green-500", "bg-red-500", "bg-gray-400")
 */
export const getColorClass = (color: string) => {
  switch (color) {
    case 'green':
      return 'bg-green-500';
    case 'red':
      return 'bg-red-500';
    case 'gray':
      return 'bg-gray-400';
    default:
      return 'bg-gray-400';
  }
};

/**
 * Gets the appropriate Tailwind CSS class for bar chart colors
 * @param barColor - The bar color string (e.g., "orange", "red", "green")
 * @returns A Tailwind CSS background color class
 */
export const getBarColor = (barColor: string): string => {
  const colors = [
    'bg-yellow-500',
    'bg-red-500',
    'bg-white border-2 border-gray-200',
    'bg-blue-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-indigo-500',
    'bg-cyan-500'
  ];
  const index = parseInt(barColor) || 0;
  return colors[index % colors.length];
};

/**
 * Gets the appropriate hex color value for chart bars
 * @param barColor - The bar color string (e.g., "0", "1", "2")
 * @returns A hex color value for charts
 */
export const getChartBarColor = (barColor: string): string => {
  const colors = [
    '#eab308', // yellow-500
    '#ef4444', // red-500
    '#ffffff', // white
    '#3b82f6', // blue-500
    '#f97316', // orange-500
    '#ec4899', // pink-500
    '#22c55e', // green-500
    '#a855f7', // purple-500
    '#6366f1', // indigo-500
    '#06b6d4'  // cyan-500
  ];
  const index = parseInt(barColor) || 0;
  return colors[index % colors.length];
};

/**
 * Gets the appropriate Tailwind CSS ring color class for chart icons
 * @param ringColor - The ring color string (e.g., "red", "green", "black", "blue", "orange")
 * @returns A Tailwind CSS ring color class
 */
export const getRingColor = (ringColor: string): string => {
  const colors = [
    'ring-red-500',
    'ring-green-500',
    'ring-black',
    'ring-blue-500',
    'ring-orange-500',
    'ring-purple-500',
    'ring-pink-500',
    'ring-indigo-500',
    'ring-yellow-500',
    'ring-teal-500',
    'ring-cyan-500',
    'ring-gray-500'
  ];
  const index = parseInt(ringColor) || 0;
  return colors[index % colors.length];
};

/**
 * Gets the appropriate Tailwind CSS class for indicator colors in lists
 * @param indicatorColor - The indicator color string (e.g., "red", "green", "black", "blue", "orange", "purple", "yellow")
 * @returns A Tailwind CSS background color class
 */
export const getIndicatorColor = (indicatorColor: string): string => {
  switch (indicatorColor) {
    case 'red': return 'bg-red-500';
    case 'green': return 'bg-green-500';
    case 'black': return 'bg-black';
    case 'blue': return 'bg-blue-500';
    case 'orange': return 'bg-orange-500';
    case 'purple': return 'bg-purple-500';
    case 'yellow': return 'bg-yellow-500';
    default: return 'bg-gray-500';
  }
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 2,
  }).format(amount).replace('NGN', '₦');
};

/**
 * Formats a numeric value for display, supporting both currency and number formatting.
 * 
 * This function provides a unified way to format values from API responses, handling
 * null/undefined values gracefully and supporting two formatting modes:
 * - Currency formatting: Uses `formatCurrency` to display values with ₦ symbol (e.g., "₦38,800.00")
 * - Number formatting: Uses `formatNumberWithCommas` to display values with thousand separators (e.g., "1,234" or "47")
 * 
 * @param value - The numeric value to format. Can be a number, null, or undefined.
 * @param isCurrency - Optional. If `true`, formats as currency (₦). If `false` or omitted, formats as a number with commas.
 * @returns A formatted string representation of the value. Returns "0" if value is null or undefined.
 * 
 * @example
 * ```typescript
 * formatValue(38800, true);  // Returns: "₦38,800.00"
 * formatValue(47, false);    // Returns: "47"
 * formatValue(1234.56);      // Returns: "1,234.56"
 * formatValue(null);         // Returns: "0"
 * formatValue(undefined);    // Returns: "0"
 * ```
 * 
 * @remarks
 * This function is commonly used in dashboard components to format metric values
 * consistently across different metric cards. Currency values (points, amounts) use
 * currency formatting, while counts (customers, merchants, tickets) use number formatting.
 */
export const formatValue = (value: number | null | undefined, isCurrency: boolean = false): string => {
  if (value === null || value === undefined) return '0';
  if (isCurrency) {
    return formatCurrency(value);
  }
  return formatNumberWithCommas(value);
};

export const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'open':
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
    case 'close':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'inactive':
    case 'closed':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

/**
 * Gets the badge color class for account status values (KYC Status, Account Status, etc.).
 * 
 * This function is specifically designed for merchant account information badges,
 * handling statuses like "approved", "active", "verified", "pending", and "suspended".
 * 
 * @param status - The status string to get the color for (case-insensitive)
 * @returns Tailwind CSS classes for badge styling
 * 
 * @example
 * ```typescript
 * getAccountStatusColor("approved");  // Returns: "bg-green-100 text-green-800"
 * getAccountStatusColor("active");   // Returns: "bg-green-100 text-green-800"
 * getAccountStatusColor("pending");   // Returns: "bg-yellow-100 text-yellow-800"
 * getAccountStatusColor("suspended"); // Returns: "bg-red-100 text-red-800"
 * ```
 */
export const getAccountStatusColor = (status: string): string => {
  const normalizedStatus = status?.toLowerCase();
  switch (normalizedStatus) {
    case "verified":
    case "approved":
    case "active":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "suspended":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export const getStatusText = (status: string) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'Active';
    case 'inactive':
    case 'closed':
      return 'Inactive';
    case 'pending':
      return 'Pending';
    default:
      return 'Unknown';
  }
};

/**
 * Gets the appropriate Tailwind CSS class for icon colors in modals
 * @param color - The color string (e.g., "red", "green", "blue", "yellow", "gray")
 * @returns A Tailwind CSS text color class
 */
export const getIconColorClass = (color: string): string => {
  switch (color) {
    case 'red':
      return 'text-red-500';
    case 'green':
      return 'text-green-500';
    case 'blue':
      return 'text-blue-500';
    case 'yellow':
      return 'text-yellow-500';
    case 'gray':
      return 'text-gray-500';
    default:
      return 'text-red-500';
  }
};

/**
 * Gets button styles for custom colors in modals
 * @param variant - The button variant
 * @param color - Optional custom color
 * @returns Style object with backgroundColor and borderColor
 */
export const getButtonStyle = (variant: string, color?: string): React.CSSProperties => {
  if (color) {
    return {
      backgroundColor: color,
      borderColor: color,
    };
  }
  return {};
};


export const generateUUID = () => {
  return crypto.randomUUID();
}


export function isStaticAsset(pathname: string) {
  return /\.(svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|eot|otf)$/i.test(pathname);
}


export const getRewardType = (earnMethod: string) => {
  switch (earnMethod) {
    case "percentage":
      return "PERCENTAGE_BASED";
    case "fixed":
      return "FIXED_POINTS";
    default:
      return "PERCENTAGE_BASED";
  }
};

export const getDistributionType = (receiveMethod: string) => {
  switch (receiveMethod) {
    case "instantly":
      return "INSTANT";
    case "later":
      return "MILESTONE_BASED";
    default:
      return "INSTANT";
  }
};

// Reverse mapping functions for prepopulating forms
export const getEarnMethodFromRewardType = (rewardType: string) => {
  switch (rewardType) {
    case "PERCENTAGE_BASED":
      return "percentage";
    case "FIXED_POINTS":
      return "fixed";
    default:
      return "percentage";
  }
};

export const getReceiveMethodFromDistributionType = (distributionType: string) => {
  switch (distributionType) {
    case "INSTANT":
      return "instantly";
    case "MILESTONE_BASED":
      return "later";
    default:
      return "instantly";
  }
};

/**
 * Formats reward type from API enum to user-friendly display text
 * @param rewardType - The reward type from API (e.g., "PERCENTAGE_BASED")
 * @returns Formatted string for display (e.g., "Percentage Based")
 */
export const formatRewardType = (rewardType: string) => {
  switch (rewardType) {
    case "PERCENTAGE_BASED":
      return "Percentage Based";
    case "FIXED_POINTS":
      return "Fixed Points";
    default:
      return rewardType;
  }
};

/**
 * Formats distribution type from API enum to user-friendly display text
 * @param distributionType - The distribution type from API (e.g., "INSTANT")
 * @returns Formatted string for display (e.g., "Instant")
 */
export const formatDistributionType = (distributionType: string) => {
  switch (distributionType) {
    case "INSTANT":
      return "Instant";
    case "MILESTONE_BASED":
      return "Milestone Based";
    default:
      return distributionType;
  }
};

/**
 * Safely extracts rules from rewards object
 * @param rewards - The rewards object or null
 * @returns Array of rules or empty array if no rewards/rules
 */
export const getRewardsRules = (rewards: { rules?: Array<RewardRule> } | null): Array<RewardRule> => {
  if (!rewards || !rewards.rules) return [];
  return rewards.rules;
};

/**
 * Formats a date string with fallback
 * @param dateString - Date string or null
 * @param fallback - Fallback text if date is null
 * @returns Formatted date string or fallback
 */
export const formatDate = (dateString: string | null, fallback: string) => {
  if (!dateString) return fallback;
  return new Date(dateString).toLocaleDateString();
};

/**
 * Formats a date string to a readable format (e.g., "27 Sep 2025")
 * @param dateString - Date string to format
 * @returns Formatted date string in "DD MMM YYYY" format
 */
export const formatDateReadable = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Creates summary data array from rewards object
 * @param rewards - The rewards object or null
 * @returns Array of summary data objects
 */
export const createRewardsSummaryData = (rewards: {
  rewardType: string;
  distributionType: string;
  startDate: string | null;
  endDate: string | null;
} | null) => {
  if (!rewards) return [];

  return [
    {
      icon: "giftIcon", // Will be replaced with actual icon in component
      label: "Reward Type",
      value: formatRewardType(rewards.rewardType)
    },
    {
      icon: "grayPointIcon", // Will be replaced with actual icon in component
      label: "Claim Type",
      value: formatDistributionType(rewards.distributionType)
    },
    {
      icon: "calenderIcon", // Will be replaced with actual icon in component
      label: "Issuing Date",
      value: formatDate(rewards.startDate, "From today")
    },
    {
      icon: "calenderIcon", // Will be replaced with actual icon in component
      label: "End Date",
      value: formatDate(rewards.endDate, "-")
    }
  ];
};

/**
 * Determines if skeleton should be shown
 * @param isPending - Loading state
 * @param rulesLength - Number of rules
 * @returns Boolean indicating if skeleton should show
 */
export const shouldShowSkeleton = (isPending: boolean, rulesLength: number) => {
  return isPending && rulesLength === 0;
};

/**
 * Determines if rules should be displayed
 * @param rulesLength - Number of rules
 * @returns Boolean indicating if rules should show
 */
export const shouldShowRules = (rulesLength: number) => {
  return rulesLength > 0;
};

/**
 * Determines if empty state should be shown
 * @param isPending - Loading state
 * @param rulesLength - Number of rules
 * @returns Boolean indicating if empty state should show
 */
export const shouldShowEmptyState = (isPending: boolean, rulesLength: number) => {
  return !isPending && rulesLength === 0;
};

/**
 * Formats a number with thousands separators and decimal places
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted number string (e.g., "100,000.00")
 */
export const formatNumber = (value: number | string, decimals: number = 2): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) return '0.00';

  return numValue.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * Formats social media URLs for different platforms
 * 
 * This function intelligently formats URLs based on the platform type.
 * It preserves already complete URLs and formats incomplete ones appropriately.
 * 
 * @param url - The URL to format (can be complete, partial, or just a username/handle)
 * @param platform - The social media platform ('whatsapp', 'instagram', 'x', 'linkedin', 'snapchat', 'website')
 * @returns Formatted URL ready for use
 * 
 * @example
 * // Complete URLs are returned as-is
 * formatUrl('https://wa.link/a6zomo', 'whatsapp') // Returns: 'https://wa.link/a6zomo'
 * formatUrl('https://x.com/_iamclement_', 'x') // Returns: 'https://x.com/_iamclement_'
 * 
 * @example
 * // Partial URLs get https protocol added
 * formatUrl('wa.link/a6zomo', 'whatsapp') // Returns: 'https://wa.link/a6zomo'
 * formatUrl('x.com/_iamclement_', 'x') // Returns: 'https://x.com/_iamclement_'
 * 
 * @example
 * // Usernames/handles get platform-specific formatting
 * formatUrl('_iamclement_', 'x') // Returns: 'https://x.com/_iamclement_'
 * formatUrl('username', 'instagram') // Returns: 'https://instagram.com/username'
 * formatUrl('+2348012345679', 'whatsapp') // Returns: 'https://wa.me/2348012345679'
 * 
 * @example
 * // Website URLs just get https protocol
 * formatUrl('example.com', 'website') // Returns: 'https://example.com'
 * formatUrl('https://example.com', 'website') // Returns: 'https://example.com'
 */
export const formatUrl = (url: string, platform: string): string => {
  // If URL is already complete (starts with http/https), return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  // Handle different platforms for incomplete URLs
  switch (platform) {
    case 'whatsapp':
      // Handle different WhatsApp URL formats
      if (url.includes('wa.link/') || url.includes('wa.me/')) {
        return url.startsWith('http') ? url : `https://${url}`;
      }
      // Extract phone number and format for wa.me
      return `https://wa.me/${url.replace(/[^\d]/g, '')}`;

    case 'instagram':
      // Handle different Instagram URL formats
      if (url.includes('instagram.com/')) {
        return url.startsWith('http') ? url : `https://${url}`;
      }
      return `https://instagram.com/${url}`;

    case 'x':
      // Handle different X/Twitter URL formats
      if (url.includes('twitter.com/') || url.includes('x.com/')) {
        return url.startsWith('http') ? url : `https://${url}`;
      }
      return `https://x.com/${url}`;

    case 'linkedin':
      // Handle different LinkedIn URL formats
      if (url.includes('linkedin.com/')) {
        return url.startsWith('http') ? url : `https://${url}`;
      }
      return `https://linkedin.com/in/${url}`;

    case 'snapchat':
      // Handle different Snapchat URL formats
      if (url.includes('snapchat.com/')) {
        return url.startsWith('http') ? url : `https://${url}`;
      }
      return `https://snapchat.com/add/${url}`;

    case 'website':
      // For websites, just ensure https protocol
      return url.startsWith('http') ? url : `https://${url}`;

    default:
      return url;
  }
};

/**
 * Downloads a QR code as a PNG image
 * @param printRef - Reference to the element containing the QR code SVG
 * @param title - Title for the downloaded file
 */
export const downloadQRCodeAsImage = async (printRef: React.RefObject<HTMLDivElement | null>, title: string) => {
  try {
    // Get the SVG element from the print ref
    const svgElement = printRef.current?.querySelector('svg');
    if (!svgElement) {
      console.error('QR code SVG not found');
      return;
    }

    // Convert SVG to canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Set canvas size - increased height to accommodate logo
    const qrCodeSize = 400;
    const logoHeight = 60; // Space for logo at top
    const padding = 40; // Padding around content
    canvas.width = qrCodeSize + (padding * 2);
    canvas.height = qrCodeSize + logoHeight + (padding * 3); // Extra padding for spacing

    if (ctx) {
      // Draw white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Load logo image
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';

      // Convert SVG to data URL for QR code
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);

      const qrCodeImg = document.createElement('img');

      // Load logo first
      logoImg.onload = () => {
        // Draw logo at the top center
        const logoWidth = 120; // Logo width
        const logoHeightActual = 28; // Logo height (maintaining aspect ratio)
        const logoX = (canvas.width - logoWidth) / 2;
        const logoY = padding;

        ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeightActual);

        // Then load and draw QR code
        qrCodeImg.onload = () => {
          // Calculate position for QR code (below logo)
          const qrSize = qrCodeSize;
          const qrX = (canvas.width - qrSize) / 2;
          const qrY = logoY + logoHeightActual + padding; // Position below logo with padding

          // Draw the QR code image
          ctx.drawImage(qrCodeImg, qrX, qrY, qrSize, qrSize);

          // Convert canvas to blob and download
          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${title.replace(/\s+/g, '-').toLowerCase()}-qr-code.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
              URL.revokeObjectURL(svgUrl);
            }
          }, 'image/png');
        };

        qrCodeImg.onerror = () => {
          console.error('Error loading QR code image');
          URL.revokeObjectURL(svgUrl);
        };

        qrCodeImg.src = svgUrl;
      };

      logoImg.onerror = () => {
        console.error('Error loading logo image');
        // Fallback: draw QR code without logo
        qrCodeImg.onload = () => {
          const qrSize = qrCodeSize;
          const qrX = (canvas.width - qrSize) / 2;
          const qrY = (canvas.height - qrSize) / 2;
          ctx.drawImage(qrCodeImg, qrX, qrY, qrSize, qrSize);

          canvas.toBlob((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${title.replace(/\s+/g, '-').toLowerCase()}-qr-code.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
              URL.revokeObjectURL(svgUrl);
            }
          }, 'image/png');
        };
        qrCodeImg.src = svgUrl;
      };

      // Load logo from public assets
      logoImg.src = '/assets/icons/numoni-logo-dark.svg';
    }
  } catch (error) {
    console.error('Error downloading QR code as image:', error);
    throw error;
  }
};

/**
 * Helper function to load an image with CORS handling
 * Uses fetch + blob approach to avoid CORS issues when drawing to canvas
 */
export const loadImageWithCors = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    // For data URLs or blob URLs, load directly
    if (src.startsWith('data:') || src.startsWith('blob:')) {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
      return;
    }

    // Check if this is an S3 URL that needs proxying
    const isS3Url = src.includes('s3.amazonaws.com') || src.includes('s3.eu-west-1.amazonaws.com');
    const isLocalPath = src.startsWith('/');
    const proxyUrl = isS3Url ? `/api/images/proxy?url=${encodeURIComponent(src)}` : src;

    // For external URLs, use fetch to bypass CORS restrictions
    // This works because fetch can read the image data, then we create a blob URL
    // which is same-origin and can be used in canvas without CORS issues
    // Local paths don't need CORS mode
    fetch(proxyUrl, {
      mode: isLocalPath ? 'same-origin' : 'cors',
      credentials: 'omit'
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.blob();
      })
      .then(blob => {
        // Create a blob URL (same-origin, no CORS issues)
        const blobUrl = URL.createObjectURL(blob);
        const img = new Image();

        img.onload = () => {
          // Don't revoke URL yet - we need it until canvas is drawn
          resolve(img);
        };

        img.onerror = () => {
          URL.revokeObjectURL(blobUrl);
          reject(new Error(`Failed to load image blob: ${src}`));
        };

        img.src = blobUrl;
      })
      .catch((error) => {
        // If fetch fails (CORS or network error), try direct load as fallback
        // This won't work for canvas export, but at least the image might display
        console.warn(`Fetch failed for ${src}, trying direct load:`, error);
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${src}. CORS may be blocking access.`));
        img.src = src;
      });
  });
};

/**
 * Downloads a QR code image URL with merchant logo and Numoni logo at the top, and merchant name/location/address below
 * @param qrCodeUrl - URL or base64 data URL of the QR code image
 * @param title - Merchant name to display at the bottom
 * @param merchantLogo - Optional merchant logo URL
 * @param location - Optional location text to display below QR code
 * @param address - Optional address text to display below QR code
 */
export const downloadQRCodeImageWithLogo = async (
  qrCodeUrl: string,
  title: string,
  merchantLogo?: string | null,
  location?: string | null,
  address?: string | null,
  posId?: string | null
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Convert image URL to canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Set canvas size - increased height to accommodate logos, QR code, and text
      const qrCodeSize = 400;
      const numoniLogoHeight = 50; // Space for Numoni logo at top
      const merchantLogoHeight = merchantLogo ? 30 : 0; // Space for merchant logo if available (smaller)
      const gapBetweenLogos = 15; // Gap between Numoni and merchant logos
      const logoHeight = numoniLogoHeight + (merchantLogo ? gapBetweenLogos + merchantLogoHeight : 0); // Total logo area height
      const textHeight = (title || location || address) ? 100 : 0; // Space for merchant name, location, and address text
      const padding = 40; // Padding around content
      canvas.width = qrCodeSize + (padding * 2);
      canvas.height = qrCodeSize + logoHeight + textHeight + (padding * 4); // Extra padding for spacing

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Draw white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      try {
        // Always load Numoni logo
        const numoniLogoUrl = '/assets/icons/numoni-logo-dark.svg';
        const numoniLogoImg = await loadImageWithCors(numoniLogoUrl);

        // Load merchant logo if provided
        let merchantLogoImg: HTMLImageElement | null = null;
        if (merchantLogo) {
          try {
            merchantLogoImg = await loadImageWithCors(merchantLogo);
          } catch (error) {
            console.warn('Failed to load merchant logo, will show only Numoni logo:', error);
          }
        }

        // Load QR code image
        const qrCodeImg = await loadImageWithCors(qrCodeUrl);

        // Clean up blob URLs if they were created (for images loaded via fetch)
        const cleanupBlobUrls = () => {
          if (numoniLogoImg.src.startsWith('blob:')) {
            URL.revokeObjectURL(numoniLogoImg.src);
          }
          if (merchantLogoImg && merchantLogoImg.src.startsWith('blob:')) {
            URL.revokeObjectURL(merchantLogoImg.src);
          }
          if (qrCodeImg.src.startsWith('blob:')) {
            URL.revokeObjectURL(qrCodeImg.src);
          }
        };

        // Draw logos at the top center - Numoni on top, merchant underneath (if available)
        const numoniLogoWidth = 120; // Numoni logo width
        const numoniLogoHeightActual = Math.min(numoniLogoImg.height * (numoniLogoWidth / numoniLogoImg.width), 50); // Max 50px height

        const logoY = padding;
        const numoniLogoX = (canvas.width - numoniLogoWidth) / 2; // Center Numoni logo

        // Always draw Numoni logo at the top
        ctx.drawImage(numoniLogoImg, numoniLogoX, logoY, numoniLogoWidth, numoniLogoHeightActual);

        let bottomOfLogos = logoY + numoniLogoHeightActual; // Bottom of Numoni logo

        if (merchantLogoImg) {
          // Draw merchant logo underneath Numoni logo (smaller)
          const gapBetweenLogos = 15; // Gap between Numoni and merchant logos
          const merchantLogoWidth = 60; // Smaller merchant logo
          const merchantLogoHeightActual = Math.min(merchantLogoImg.height * (merchantLogoWidth / merchantLogoImg.width), 30); // Max 30px height (smaller)

          const merchantLogoY = bottomOfLogos + gapBetweenLogos; // Position below Numoni logo with gap
          const merchantLogoX = (canvas.width - merchantLogoWidth) / 2; // Center merchant logo
          ctx.drawImage(merchantLogoImg, merchantLogoX, merchantLogoY, merchantLogoWidth, merchantLogoHeightActual);

          bottomOfLogos = merchantLogoY + merchantLogoHeightActual; // Update to bottom of merchant logo
        }

        // Calculate position for QR code (below logos)
        const qrSize = qrCodeSize;
        const qrX = (canvas.width - qrSize) / 2;
        const qrY = bottomOfLogos + padding; // Position below logos with padding

        // Draw the QR code image
        ctx.drawImage(qrCodeImg, qrX, qrY, qrSize, qrSize);

        // Draw merchant name, location, and address text below QR code (all in small letters)
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillStyle = '#333333';

        let textY = qrY + qrSize + padding;

        // Draw merchant name
        if (title) {
          ctx.font = '12px Arial, sans-serif';
          ctx.fillText(title.toLowerCase(), canvas.width / 2, textY);
          textY += 18;
        }

        // Draw location
        if (location) {
          ctx.font = '11px Arial, sans-serif';
          ctx.fillStyle = '#666666';
          ctx.fillText(location.toLowerCase(), canvas.width / 2, textY);
          textY += 16;
        }
        // Draw pos ID
        if (posId) {
          ctx.font = '11px Arial, sans-serif';
          ctx.fillStyle = '#666666';
          ctx.fillText('POS ID: ' + posId.toLowerCase(), canvas.width / 2, textY);
          textY += 16;
        }

        // Draw address
        if (address) {
          ctx.font = '11px Arial, sans-serif';
          ctx.fillStyle = '#666666';
          ctx.fillText(address.toLowerCase(), canvas.width / 2, textY);
        }

        // Check if canvas is tainted (CORS issue)
        try {
          ctx.getImageData(0, 0, 1, 1);
        } catch (e) {
          cleanupBlobUrls();
          reject(new Error('Canvas is tainted due to CORS restrictions. Images must be served with proper CORS headers.'));
          return;
        }

        // Convert canvas to blob and download
        canvas.toBlob((blob) => {
          // Clean up blob URLs after drawing to canvas
          cleanupBlobUrls();

          if (blob) {
            try {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = `${posId ? `${posId}-` : ''}${title.replace(/\s+/g, '-').toLowerCase()}-qr-code.png`;
              link.style.display = 'none';
              document.body.appendChild(link);

              // Trigger download synchronously within user gesture context
              link.click();

              // Clean up after a short delay to ensure download starts
              setTimeout(() => {
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              }, 100);

              resolve();
            } catch (downloadError) {
              reject(new Error(`Failed to trigger download: ${downloadError instanceof Error ? downloadError.message : String(downloadError)}`));
            }
          } else {
            reject(new Error('Failed to create blob from canvas. Canvas may be tainted due to CORS restrictions.'));
          }
        }, 'image/png');
      } catch (error) {
        // Fallback: try to draw QR code without logos if logo loading fails
        try {
          const qrCodeImg = await loadImageWithCors(qrCodeUrl);
          const qrSize = qrCodeSize;
          const qrX = (canvas.width - qrSize) / 2;
          const qrY = (canvas.height - qrSize - textHeight) / 2;
          ctx.drawImage(qrCodeImg, qrX, qrY, qrSize, qrSize);

          // Draw merchant name, location, and address text (all in small letters)
          ctx.textAlign = 'center';
          ctx.textBaseline = 'top';
          ctx.fillStyle = '#333333';

          let textY = qrY + qrSize + padding;

          // Draw merchant name
          if (title) {
            ctx.font = '12px Arial, sans-serif';
            ctx.fillText(title.toLowerCase(), canvas.width / 2, textY);
            textY += 18;
          }

          // Draw location
          if (location) {
            ctx.font = '11px Arial, sans-serif';
            ctx.fillStyle = '#666666';
            ctx.fillText(location.toLowerCase(), canvas.width / 2, textY);
            textY += 16;
          }

          // Draw pos ID
          if (posId) {
            ctx.font = '11px Arial, sans-serif';
            ctx.fillStyle = '#666666';
            ctx.fillText('POS ID: ' + posId.toLowerCase(), canvas.width / 2, textY);
            textY += 16;
          }

          // Draw address
          if (address) {
            ctx.font = '11px Arial, sans-serif';
            ctx.fillStyle = '#666666';
            ctx.fillText(address.toLowerCase(), canvas.width / 2, textY);
          }

          // Clean up blob URLs after drawing to canvas
          if (qrCodeImg.src.startsWith('blob:')) {
            URL.revokeObjectURL(qrCodeImg.src);
          }

          // Check if canvas is tainted (CORS issue)
          try {
            ctx.getImageData(0, 0, 1, 1);
          } catch (e) {
            if (qrCodeImg.src.startsWith('blob:')) {
              URL.revokeObjectURL(qrCodeImg.src);
            }
            reject(new Error('Canvas is tainted due to CORS restrictions. Images must be served with proper CORS headers.'));
            return;
          }

          canvas.toBlob((blob) => {
            if (blob) {
              try {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${posId ? `${posId}-` : ''}${title.replace(/\s+/g, '-').toLowerCase()}-qr-code.png`;
                link.style.display = 'none';
                document.body.appendChild(link);

                // Trigger download synchronously within user gesture context
                link.click();

                // Clean up after a short delay to ensure download starts
                setTimeout(() => {
                  document.body.removeChild(link);
                  URL.revokeObjectURL(url);
                }, 100);

                resolve();
              } catch (downloadError) {
                reject(new Error(`Failed to trigger download: ${downloadError instanceof Error ? downloadError.message : String(downloadError)}`));
              }
            } else {
              reject(new Error('Failed to create blob from canvas. Canvas may be tainted due to CORS restrictions.'));
            }
          }, 'image/png');
        } catch (fallbackError) {
          reject(new Error(`Failed to load images: ${fallbackError instanceof Error ? fallbackError.message : String(fallbackError)}`));
        }
      }
    } catch (error) {
      console.error('Error downloading QR code as image:', error);
      reject(error);
    }
  });
};

/**
 * Fetches an image and converts it to a data URL to avoid CORS issues
 * Falls back to direct image loading if fetch fails
 */
export const fetchImageAsDataUrl = async (src: string): Promise<string> => {
  // If it's already a data URL, return it
  if (src.startsWith('data:')) {
    return src;
  }

  try {
    // Try fetching with CORS
    const response = await fetch(src, {
      mode: 'cors',
      credentials: 'omit'
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          resolve(reader.result as string);
        } else {
          reject(new Error('FileReader returned no result'));
        }
      };
      reader.onerror = () => reject(new Error('FileReader error'));
      reader.readAsDataURL(blob);
    });
  } catch (fetchError) {
    // Fallback: return the original URL and let the image load handle it
    // This will work if the image can be loaded directly (same origin or CORS-enabled)
    console.warn('Fetch failed, using direct image load:', fetchError);
    return src;
  }
};

/**
 * Loads an image with proper error handling and timeout
 * Sets crossOrigin for external URLs to allow canvas access
 */
export const loadImage = (src: string, isExternal: boolean = false): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const timeout = setTimeout(() => {
      reject(new Error(`Image load timeout: ${src}`));
    }, 10000); // 10 second timeout

    // Set crossOrigin for external URLs to allow canvas to read pixel data
    if (isExternal && !src.startsWith('data:') && !src.startsWith('blob:')) {
      img.crossOrigin = 'anonymous';
    }

    img.onload = () => {
      clearTimeout(timeout);
      resolve(img);
    };
    img.onerror = (error) => {
      clearTimeout(timeout);
      const errorMsg = isExternal
        ? `Failed to load external image (CORS may be blocking): ${src}`
        : `Failed to load image: ${src}`;
      reject(new Error(errorMsg));
    };

    img.src = src;
  });
};

/**
 * Converts SVG file to data URL by fetching it
 */
export const svgToDataUrl = async (svgPath: string): Promise<string> => {
  try {
    const response = await fetch(svgPath);
    if (!response.ok) {
      throw new Error(`Failed to fetch SVG: ${response.statusText}`);
    }
    const svgText = await response.text();
    const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    return URL.createObjectURL(svgBlob);
  } catch (error) {
    throw new Error(`Failed to convert SVG to data URL: ${error}`);
  }
};

/**
 * Downloads a QR code image with Numoni logo at the top using HTML/CSS approach
 * This avoids CORS issues by using DOM rendering instead of canvas
 * @param qrCodeUrl - URL or base64 data URL of the QR code image
 * @param filename - Name for the downloaded file
 * @param format - Download format: 'image' (PNG) or 'pdf'
 * @param logoPath - Path to the logo image (defaults to Numoni logo)
 */
export const downloadQRCodeWithLogo = async (
  qrCodeUrl: string,
  filename: string,
  format: 'image' | 'pdf' = 'image',
  logoPath: string = '/assets/icons/numoni-logo-dark.svg'
): Promise<void> => {
  return new Promise(async (resolve, reject) => {
    try {
      // Convert SVG logo to data URL for PDF to ensure it loads
      let logoSrc = logoPath;
      if (logoPath.endsWith('.svg')) {
        try {
          const response = await fetch(logoPath);
          if (response.ok) {
            const svgText = await response.text();
            logoSrc = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgText)}`;
          }
        } catch (error) {
          console.warn('Failed to convert SVG to data URL, using original path:', error);
        }
      }

      // Create a temporary container
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '-9999px';
      container.style.left = '-9999px';
      container.style.width = '440px';
      container.style.height = '520px';
      container.style.backgroundColor = '#ffffff';
      container.style.padding = '20px';
      container.style.display = 'flex';
      container.style.flexDirection = 'column';
      container.style.alignItems = 'center';
      container.style.gap = '20px';

      // Create logo element
      const logoImg = document.createElement('img');
      logoImg.src = logoSrc;
      logoImg.style.height = '80px';
      logoImg.style.width = 'auto';
      logoImg.style.objectFit = 'contain';

      // Create QR code element
      const qrCodeImg = document.createElement('img');
      qrCodeImg.src = qrCodeUrl;
      qrCodeImg.style.width = '400px';
      qrCodeImg.style.height = '400px';
      qrCodeImg.style.objectFit = 'contain';

      // Append elements
      container.appendChild(logoImg);
      container.appendChild(qrCodeImg);
      document.body.appendChild(container);

      // Wait for images to load
      let imagesLoaded = 0;
      const totalImages = 2;

      const onImageLoad = () => {
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
          if (format === 'pdf') {
            // PDF format: Open print window
            const printWindow = window.open('', '_blank');
            if (printWindow) {
              printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                  <head>
                    <title>${filename} - QR Code</title>
                    <style>
                      @media print {
                        @page { 
                          margin: 0; 
                          size: A4;
                        }
                        body { 
                          margin: 0; 
                          padding: 20px; 
                        }
                      }
                      body {
                        margin: 0;
                        padding: 20px;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        gap: 20px;
                        background: white;
                        font-family: Arial, sans-serif;
                        min-height: 100vh;
                      }
                      .logo {
                        height: 80px;
                        width: auto;
                        max-width: 100%;
                      }
                      .qr-code {
                        width: 400px;
                        height: 400px;
                        max-width: 100%;
                        object-fit: contain;
                      }
                    </style>
                  </head>
                  <body>
                    <img src="${logoSrc}" class="logo" alt="Logo" />
                    <img src="${qrCodeUrl}" class="qr-code" alt="QR Code" />
                    <script>
                      window.onload = function() {
                        setTimeout(function() {
                          window.print();
                          setTimeout(function() {
                            window.close();
                          }, 500);
                        }, 250);
                      };
                    </script>
                  </body>
                </html>
              `);
              printWindow.document.close();
            }
            document.body.removeChild(container);
            resolve();
          } else {
            // Image format: Use html2canvas if available, otherwise use canvas fallback
            if (typeof window !== 'undefined' && window.html2canvas) {
              // Use html2canvas library if installed
              window.html2canvas(container, {
                backgroundColor: '#ffffff',
                scale: 2,
                useCORS: true,
                logging: false,
              }).then((canvas: HTMLCanvasElement) => {
                canvas.toBlob((blob) => {
                  if (blob) {
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `${filename.replace(/\s+/g, '-').toLowerCase()}-qr-code.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                  }
                  document.body.removeChild(container);
                  resolve();
                }, 'image/png');
              }).catch((error: Error) => {
                document.body.removeChild(container);
                reject(error);
              });
            } else {
              // Fallback: Try to use the container's images directly with canvas
              // Since images are already loaded in DOM, we can try to draw them
              // But if CORS fails, we'll open a new window as last resort
              try {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                if (!ctx) {
                  throw new Error('Could not get canvas context');
                }

                canvas.width = 440;
                canvas.height = 520;
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Try to draw the already-loaded images from the container
                const logoElement = container.querySelector('img:first-child') as HTMLImageElement;
                const qrElement = container.querySelector('img:last-child') as HTMLImageElement;

                if (logoElement && qrElement && logoElement.complete && qrElement.complete) {
                  // Images are already loaded, try to draw them
                  try {
                    // Draw logo (centered)
                    const logoHeight = 80;
                    const logoWidth = logoElement.naturalWidth * (logoHeight / logoElement.naturalHeight);
                    const logoX = (canvas.width - logoWidth) / 2;
                    ctx.drawImage(logoElement, logoX, 20, logoWidth, logoHeight);

                    // Draw QR code
                    ctx.drawImage(qrElement, 20, 120, 400, 400);

                    // Convert to blob and download
                    canvas.toBlob((blob) => {
                      if (blob) {
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `${filename.replace(/\s+/g, '-').toLowerCase()}-qr-code.png`;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);
                      }
                      document.body.removeChild(container);
                      resolve();
                    }, 'image/png');
                  } catch (drawError) {
                    // If drawing fails (CORS), fall back to opening window
                    throw drawError;
                  }
                } else {
                  throw new Error('Images not fully loaded');
                }
              } catch (error) {
                // Final fallback: Open a new window with the images
                // User can right-click to save, or browser print to PDF
                const tempWindow = window.open('', '_blank');
                if (tempWindow) {
                  tempWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                      <head>
                        <title>${filename} - QR Code</title>
                        <style>
                          body {
                            margin: 0;
                            padding: 20px;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            justify-content: center;
                            gap: 20px;
                            background: white;
                            font-family: Arial, sans-serif;
                          }
                          .logo {
                            height: 80px;
                            width: auto;
                          }
                          .qr-code {
                            width: 400px;
                            height: 400px;
                            object-fit: contain;
                          }
                          .instructions {
                            text-align: center;
                            color: #666;
                            font-size: 14px;
                            margin-top: 20px;
                          }
                        </style>
                      </head>
                      <body>
                        <img src="${logoPath}" class="logo" alt="Logo" />
                        <img src="${qrCodeUrl}" class="qr-code" alt="QR Code" />
                        <div class="instructions">
                          Right-click on the image and select "Save image as..." to download,<br/>
                          or use your browser's print function (Ctrl/Cmd+P) to save as PDF.
                        </div>
                      </body>
                    </html>
                  `);
                  tempWindow.document.close();
                  document.body.removeChild(container);
                  resolve();
                } else {
                  document.body.removeChild(container);
                  reject(new Error('Popup blocked. Please allow popups and try again, or install html2canvas library.'));
                }
              }
            }
          }
        }
      };

      const onImageError = (error: string | Event) => {
        document.body.removeChild(container);
        reject(new Error('Failed to load image'));
      };

      logoImg.onload = onImageLoad;
      logoImg.onerror = onImageError;
      qrCodeImg.onload = onImageLoad;
      qrCodeImg.onerror = onImageError;

      // Timeout fallback
      setTimeout(() => {
        if (imagesLoaded < totalImages) {
          document.body.removeChild(container);
          reject(new Error('Image load timeout'));
        }
      }, 10000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      reject(new Error(`Failed to download QR code: ${errorMessage}`));
    }
  });
};

export const mapPointExpirationToForm = (pointExpirationDays: number): string => {
  if (pointExpirationDays === 1) return "1-day";
  if (pointExpirationDays === 3) return "3-days";
  if (pointExpirationDays === 7) return "7-days";
  if (pointExpirationDays === 14) return "14-days";
  if (pointExpirationDays === 30) return "30-days";
  return "never";
};

export const mapPointExpirationToApi = (pointExpiration: string): number => {
  if (pointExpiration === "1-day") return 1;
  if (pointExpiration === "3-days") return 3;
  if (pointExpiration === "7-days") return 7;
  if (pointExpiration === "14-days") return 14;
  if (pointExpiration === "30-days") return 30;
  return 0;
};

/**
 * Gets the current date in various formats
 * @param format - The format to return the date in ('iso', 'formatted', 'timestamp', 'dd-mm-yyyy')
 * @returns Current date in the specified format
 * 
 * @example
 * getCurrentDate('iso') // Returns: '2024-01-15T10:30:00.000Z'
 * getCurrentDate('formatted') // Returns: 'Jan 15, 2024'
 * getCurrentDate('timestamp') // Returns: 1705312200000
 * getCurrentDate('dd-mm-yyyy') // Returns: '15-01-2024'
 */
export const getCurrentDate = (format: 'iso' | 'formatted' | 'timestamp' | 'dd-mm-yyyy' = 'iso'): string | number => {
  const now = new Date();

  switch (format) {
    case 'iso':
      return now.toISOString();
    case 'formatted':
      return now.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    case 'dd-mm-yyyy':
      return now.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '-');
    case 'timestamp':
      return now.getTime();
    default:
      return now.toISOString();
  }
};

/**
 * Gets yesterday's date in various formats
 * @param format - The format to return the date in ('iso', 'formatted', 'timestamp', 'dd-mm-yyyy')
 * @returns Yesterday's date in the specified format
 * 
 * @example
 * getYesterdayDate('iso') // Returns: '2024-01-14T10:30:00.000Z'
 * getYesterdayDate('formatted') // Returns: 'Jan 14, 2024'
 * getYesterdayDate('timestamp') // Returns: 1705225800000
 * getYesterdayDate('dd-mm-yyyy') // Returns: '14-01-2024'
 */
export const getYesterdayDate = (format: 'iso' | 'formatted' | 'timestamp' | 'dd-mm-yyyy' = 'iso'): string | number => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  switch (format) {
    case 'iso':
      return yesterday.toISOString();
    case 'formatted':
      return yesterday.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    case 'dd-mm-yyyy':
      return yesterday.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '-');
    case 'timestamp':
      return yesterday.getTime();
    default:
      return yesterday.toISOString();
  }
};

/**
 * Gets the start and end dates for different timeline options
 * @param timeline - The timeline option ('Today', 'Yesterday', 'This Week', 'Last Week', 'This Month', 'Last Month', 'Custom Range')
 * @param customStartDate - Custom start date for 'Custom Range' (optional)
 * @param customEndDate - Custom end date for 'Custom Range' (optional)
 * @returns Object with startDate and endDate in YYYY-MM-DD format
 * 
 * @example
 * getTimelineDates('Today') // Returns: { startDate: '2024-01-15', endDate: '2024-01-15' }
 * getTimelineDates('Yesterday') // Returns: { startDate: '2024-01-14', endDate: '2024-01-14' }
 * getTimelineDates('This Week') // Returns: { startDate: '2024-01-15', endDate: '2024-01-21' }
 * getTimelineDates('Custom Range', '2024-01-01', '2024-01-31') // Returns: { startDate: '2024-01-01', endDate: '2024-01-31' }
 */
export const getTimelineDates = (
  timeline: string,
  customStartDate?: string,
  customEndDate?: string
): { startDate: string; endDate: string } => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Helper function to format date as YYYY-MM-DD (local timezone)
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper function to get start of week (Monday)
  const getStartOfWeek = (date: Date): Date => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(date.setDate(diff));
  };

  // Helper function to get end of week (Sunday)
  const getEndOfWeek = (date: Date): Date => {
    const startOfWeek = getStartOfWeek(new Date(date));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return endOfWeek;
  };

  // Helper function to get start of month
  const getStartOfMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  // Helper function to get end of month
  const getEndOfMonth = (date: Date): Date => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0);
  };

  switch (timeline) {
    case 'Today':
      return {
        startDate: formatDate(today),
        endDate: formatDate(today)
      };

    case 'Yesterday': {
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      return {
        startDate: formatDate(yesterday),
        endDate: formatDate(yesterday)
      };
    }

    case 'This Week': {
      const startOfWeek = getStartOfWeek(new Date(today));
      const endOfWeek = getEndOfWeek(new Date(today));
      return {
        startDate: formatDate(startOfWeek),
        endDate: formatDate(endOfWeek)
      };
    }

    case 'Last Week': {
      const lastWeekStart = new Date(today);
      lastWeekStart.setDate(lastWeekStart.getDate() - 7);
      const startOfLastWeek = getStartOfWeek(lastWeekStart);
      const endOfLastWeek = getEndOfWeek(lastWeekStart);
      return {
        startDate: formatDate(startOfLastWeek),
        endDate: formatDate(endOfLastWeek)
      };
    }

    case 'This Month': {
      const startOfMonth = getStartOfMonth(today);
      const endOfMonth = getEndOfMonth(today);
      return {
        startDate: formatDate(startOfMonth),
        endDate: formatDate(endOfMonth)
      };
    }

    case 'Last Month': {
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const startOfLastMonth = getStartOfMonth(lastMonth);
      const endOfLastMonth = getEndOfMonth(lastMonth);
      return {
        startDate: formatDate(startOfLastMonth),
        endDate: formatDate(endOfLastMonth)
      };
    }

    case 'Custom Range':
      if (customStartDate && customEndDate) {
        return {
          startDate: customStartDate,
          endDate: customEndDate
        };
      }
      // Fallback to today if no custom dates provided
      return {
        startDate: formatDate(today),
        endDate: formatDate(today)
      };

    default:
      // Default to today
      return {
        startDate: formatDate(today),
        endDate: formatDate(today)
      };
  }
};

/**
 * Gets the date range for dashboard period filters (daily, weekly, monthly, yearly).
 * 
 * This function calculates the start and end dates based on the selected period filter.
 * The dates are formatted in DD-MM-YYYY format suitable for API requests.
 * 
 * @param period - The period filter type ('daily', 'weekly', 'monthly', 'yearly')
 * @returns An object containing `fromDate` and `toDate` in DD-MM-YYYY format
 * 
 * @example
 * ```typescript
 * // Daily: Last 7 days
 * getDateRange('daily') 
 * // Returns: { fromDate: '08-01-2024', toDate: '15-01-2024' }
 * 
 * // Weekly: Last 4 weeks (28 days)
 * getDateRange('weekly')
 * // Returns: { fromDate: '19-12-2023', toDate: '15-01-2024' }
 * 
 * // Monthly: Last 6 months
 * getDateRange('monthly')
 * // Returns: { fromDate: '15-07-2023', toDate: '15-01-2024' }
 * 
 * // Yearly: Last 4 years
 * getDateRange('yearly')
 * // Returns: { fromDate: '15-01-2020', toDate: '15-01-2024' }
 * 
 * // Default: Today only
 * getDateRange('unknown')
 * // Returns: { fromDate: '15-01-2024', toDate: '15-01-2024' }
 * ```
 * 
 * @remarks
 * - All periods use the current date as the end date
 * - Daily period includes the last 7 days (including today)
 * - Weekly period includes the last 4 weeks (28 days)
 * - Monthly period includes the last 6 months
 * - Yearly period includes the last 4 years
 * - Dates are formatted as DD-MM-YYYY (e.g., "15-01-2024")
 * - Invalid period values default to today's date for both fromDate and toDate
 */
export const getDateRange = (period: string): { fromDate: string; toDate: string } => {
  const now = new Date();
  const formatDate = (date: Date): string => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  switch (period) {
    case 'daily': {
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 6); // Last 7 days
      return { fromDate: formatDate(startDate), toDate: formatDate(now) };
    }
    case 'weekly': {
      const startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 27); // Last 4 weeks
      return { fromDate: formatDate(startDate), toDate: formatDate(now) };
    }
    case 'monthly': {
      const startDate = new Date(now);
      startDate.setMonth(startDate.getMonth() - 5); // Last 6 months
      return { fromDate: formatDate(startDate), toDate: formatDate(now) };
    }
    case 'yearly': {
      const startDate = new Date(now);
      startDate.setFullYear(startDate.getFullYear() - 3); // Last 4 years
      return { fromDate: formatDate(startDate), toDate: formatDate(now) };
    }
    default:
      return { fromDate: formatDate(now), toDate: formatDate(now) };
  }
};

// File size validation utilities
export const parseFileSize = (sizeString: string): number => {
  const units: { [key: string]: number } = {
    'b': 1,
    'kb': 1024,
    'mb': 1024 * 1024,
    'gb': 1024 * 1024 * 1024,
  };

  const match = sizeString.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)$/);
  if (!match) return 0;

  const size = parseFloat(match[1]);
  const unit = match[2];
  return size * units[unit];
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const validateFileSize = (file: File, maxSizeString: string): { isValid: boolean; error?: string } => {
  const maxSizeBytes = parseFileSize(maxSizeString);
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `File size is ${formatFileSize(file.size)}. Maximum allowed size is ${maxSizeString.toUpperCase()}.`
    };
  }
  return { isValid: true };
};

// File type validation utility
export const validateFileType = (file: File, allowedTypes: string[] = ['image/png', 'image/jpeg', 'image/jpg']): { isValid: boolean; error?: string } => {
  // Check if file type matches any of the allowed types
  const isValidType = allowedTypes.some(type => {
    // Handle MIME types (e.g., 'image/png', 'application/pdf')
    if (type.includes('/')) {
      return file.type === type;
    }
    // Handle file extensions (e.g., 'pdf', 'png')
    return file.type === `application/${type}` || file.type === `image/${type}`;
  });

  if (!isValidType) {
    const allowedExtensions = allowedTypes.map(type => {
      // If it's a MIME type, extract the extension
      if (type.includes('/')) {
        return type.split('/')[1].toUpperCase();
      }
      // If it's already an extension, just uppercase it
      return type.toUpperCase();
    }).join(', ');

    return {
      isValid: false,
      error: `File type not supported. Please upload ${allowedExtensions} files only.`
    };
  }
  return { isValid: true };
};

// Image compression utility
export const compressImage = (file: File, maxWidth: number = 1920, quality: number = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          } else {
            reject(new Error('Compression failed'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = () => reject(new Error('Image load failed'));
    img.src = URL.createObjectURL(file);
  });
};

// Calculate total payload size for validation
export const calculatePayloadSize = (data: { logo?: File; images?: File[]; managerProfilePhoto?: File }): number => {
  let totalSize = 0;

  // Calculate size of all files
  if (data.logo && data.logo instanceof File) {
    totalSize += data.logo.size;
  }

  if (data.images && Array.isArray(data.images)) {
    data.images.forEach((file: File) => {
      if (file instanceof File) {
        totalSize += file.size;
      }
    });
  }

  if (data.managerProfilePhoto && data.managerProfilePhoto instanceof File) {
    totalSize += data.managerProfilePhoto.size;
  }

  return totalSize;
};

/**
 * Generates a random color for badges based on a string input
 * Uses a simple hash function to ensure consistent colors for the same input
 * @param input - The string to generate a color for (e.g., category name)
 * @returns A Tailwind CSS color class for badges
 * 
 * @example
 * generateRandomBadgeColor('Agriculture') // Returns: 'bg-blue-100 text-blue-800 border-blue-200'
 * generateRandomBadgeColor('Fashion') // Returns: 'bg-pink-100 text-pink-800 border-pink-200'
 */
export const generateRandomBadgeColor = (input: string): string => {
  // Predefined color combinations for badges
  const colorCombinations = [
    'bg-blue-100 text-blue-800 border-blue-200',
    'bg-green-100 text-green-800 border-green-200',
    'bg-yellow-100 text-yellow-800 border-yellow-200',
    'bg-red-100 text-red-800 border-red-200',
    'bg-purple-100 text-purple-800 border-purple-200',
    'bg-pink-100 text-pink-800 border-pink-200',
    'bg-indigo-100 text-indigo-800 border-indigo-200',
    'bg-cyan-100 text-cyan-800 border-cyan-200',
    'bg-orange-100 text-orange-800 border-orange-200',
    'bg-teal-100 text-teal-800 border-teal-200',
    'bg-lime-100 text-lime-800 border-lime-200',
    'bg-emerald-100 text-emerald-800 border-emerald-200',
    'bg-rose-100 text-rose-800 border-rose-200',
    'bg-violet-100 text-violet-800 border-violet-200',
    'bg-amber-100 text-amber-800 border-amber-200',
    'bg-sky-100 text-sky-800 border-sky-200',
  ];

  // Simple hash function to convert string to number
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Use absolute value and modulo to get index
  const index = Math.abs(hash) % colorCombinations.length;
  return colorCombinations[index];
};

/**
 * Gets the appropriate color classes for transaction type badges
 * @param type - The transaction type ('SALES', 'PAY_OUT', 'SERVICE_FEE')
 * @returns Tailwind CSS color classes for badges
 * 
 * @example
 * getTransactionTypeColor('SALES') // Returns: 'bg-green-100 text-green-800 border-green-200'
 * getTransactionTypeColor('PAY_OUT') // Returns: 'bg-red-100 text-red-800 border-red-200'
 */
export const getTransactionTypeColor = (type: string): string => {
  switch (type) {
    // Merchant transaction types
    case 'SALES':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'PAY_OUT':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'SERVICE_FEE':
      return 'bg-red-100 text-red-800 border-red-200';
    // Customer transaction types
    case 'PURCHASE':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'LOAD_MONEY':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'SHARE_MONEY_DEBIT':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'SHARE_MONEY_CREDIT':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'BONUS':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

/**
 * Formats a number with thousands separators (commas)
 * @param value - The number or string to format
 * @returns Formatted number string with commas (e.g., "40,000")
 * 
 * @example
 * formatNumberWithCommas(40000) // Returns: "40,000"
 * formatNumberWithCommas("1234567.89") // Returns: "1,234,567.89"
 */
export const formatNumberWithCommas = (value: number | string): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(numValue)) return '0';

  return numValue.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
};

/**
 * Removes commas from a formatted number string
 * @param value - The formatted number string (e.g., "40,000")
 * @returns Clean number string (e.g., "40000")
 * 
 * @example
 * removeCommasFromNumber("40,000") // Returns: "40000"
 * removeCommasFromNumber("1,234,567.89") // Returns: "1234567.89"
 */
export const removeCommasFromNumber = (value: string): string => {
  return value.replace(/,/g, '');
};

/**
 * Calculates the new price based on old price and discount percentage
 * @param oldPrice - The original price
 * @param discountPercent - The discount percentage
 * @returns Calculated new price as a formatted string with 2 decimal places
 * 
 * @example
 * calculateNewPrice(1000, 25) // Returns: "750.00"
 * calculateNewPrice("1000", "25") // Returns: "750.00"
 */
export const calculateNewPrice = (oldPrice: number | string, discountPercent: number | string): string => {
  const oldPriceNum = typeof oldPrice === 'string' ? parseFloat(oldPrice) : oldPrice;
  const discountPercentNum = typeof discountPercent === 'string' ? parseFloat(discountPercent) : discountPercent;

  if (isNaN(oldPriceNum) || isNaN(discountPercentNum)) {
    return '';
  }

  const discountAmount = (oldPriceNum * discountPercentNum) / 100;
  const newPrice = oldPriceNum - discountAmount;

  return newPrice.toFixed(2);
};

/**
 * Formats a date string to "01-10-2025" format (DD-MM-YYYY)
 * @param dateString - The date string to format (e.g., "2025-10-01")
 * @returns Formatted date string in DD-MM-YYYY format
 * 
 * @example
 * formatDateForAPI("2025-10-01") // "01-10-2025"
 * formatDateForAPI("2025-12-25") // "25-12-2025"
 */
export const formatDateForAPI = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
};

/**
 * Converts a date string from DD-MM-YYYY format to YYYY-MM-DD format
 * @param dateStr - The date string in DD-MM-YYYY format (e.g., "01-10-2025")
 * @returns Formatted date string in YYYY-MM-DD format (e.g., "2025-10-01")
 * 
 * @example
 * convertDateFormat("01-10-2025") // "2025-10-01"
 * convertDateFormat("25-12-2025") // "2025-12-25"
 * convertDateFormat("") // ""
 */
export const convertDateFormat = (dateStr: string): string => {
  if (!dateStr) return '';
  const [day, month, year] = dateStr.split('-');
  return `${year}-${month}-${day}`;
};

// Helper function to get deal status color
export const getDealStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'open':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'hidden':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'inactive':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'expired':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'paused':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Helper function to get deal status text
export const getDealStatusText = (status: string) => {
  switch (status.toLowerCase()) {
    case 'open':
      return 'Open';
    case 'hidden':
      return 'Hidden';
    case 'active':
      return 'Active';
    case 'expired':
      return 'Expired';
    case 'paused':
      return 'Paused';
    case 'pending':
      return 'Pending';
    default:
      return 'Unknown';
  }
};

// Helper function to get approval status color
export const getApproveStatusColor = (status: string | null | undefined): string => {
  if (!status) return 'bg-gray-100 text-gray-800 border-gray-200';
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case 'approved':
    case 'open':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'rejected':
    case 'hidden':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Helper function to get approval status text
export const getApproveStatusText = (status: string | null | undefined): string => {
  if (!status) return 'Not Set';
  const normalizedStatus = status.toLowerCase();
  switch (normalizedStatus) {
    case 'approved':
      return 'Approved';
    case 'rejected':
      return 'Rejected';
    case 'pending':
      return 'Pending';
    default:
      return status;
  }
};

/**
 * Interface for metric loading and error states.
 * Used to manage the state of dashboard metrics that fetch data from API endpoints.
 */
export interface MetricState {
  isPending: boolean;
  error: unknown;
}

/**
 * Retrieves the loading state for a specific dashboard metric.
 * 
 * This function maps metric titles to their corresponding loading states from API hooks.
 * It provides a centralized way to determine if a particular metric is currently being fetched.
 * 
 * @param title - The title of the metric (e.g., 'Total Points Issued', 'Total Donations')
 * @param metricStates - An object mapping metric titles to their loading/error states
 * 
 * @returns `true` if the metric is currently loading, `false` otherwise
 * 
 * @example
 * ```typescript
 * const metricStates = {
 *   'Total Points Issued': { isPending: true, error: null },
 *   'Total Donations': { isPending: false, error: null },
 *   'Total Points Redeemed': { isPending: false, error: null }
 * };
 * 
 * getMetricLoadingState('Total Points Issued', metricStates); // true
 * getMetricLoadingState('Total Donations', metricStates); // false
 * ```
 * 
 * @remarks
 * This function is designed to work with the dashboard metrics system where different metrics
 * may have different loading states. It provides a clean abstraction for checking loading states
 * without directly accessing individual hook states in components.
 * 
 * If a metric title is not found in the provided states object, the function returns `false`
 * by default, assuming the metric does not require loading.
 */
export const getMetricLoadingState = (
  title: string,
  metricStates: Record<string, MetricState>
): boolean => {
  return metricStates[title]?.isPending ?? false;
};

/**
 * Retrieves the error state for a specific dashboard metric.
 * 
 * This function maps metric titles to their corresponding error states from API hooks.
 * It provides a centralized way to determine if a particular metric encountered an error during fetching.
 * 
 * @param title - The title of the metric (e.g., 'Total Points Issued', 'Total Donations')
 * @param metricStates - An object mapping metric titles to their loading/error states
 * 
 * @returns The error object if the metric encountered an error, `false` otherwise
 * 
 * @example
 * ```typescript
 * const metricStates = {
 *   'Total Points Issued': { isPending: false, error: null },
 *   'Total Donations': { isPending: false, error: new Error('API Error') },
 *   'Total Points Redeemed': { isPending: false, error: null }
 * };
 * 
 * getMetricErrorState('Total Donations', metricStates); // Error('API Error')
 * getMetricErrorState('Total Points Issued', metricStates); // false
 * ```
 * 
 * @remarks
 * This function is designed to work with the dashboard metrics system where different metrics
 * may have different error states. It provides a clean abstraction for checking error states
 * without directly accessing individual hook states in components.
 * 
 * If a metric title is not found in the provided states object, or if the metric has no error,
 * the function returns `false`.
 * 
 * The error can be of any type (Error objects, API errors, etc.) and should be handled
 * appropriately in the consuming component.
 */
export const getMetricErrorState = (
  title: string,
  metricStates: Record<string, MetricState>
): unknown => {
  return metricStates[title]?.error ?? false;
};

// --------------------
// Activity Logs Helpers
// --------------------
import type { ActivityLog } from "@/lib/types/activity-log";

// Type representing the raw API activity log item
export interface ApiActivityLog {
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
}



// Extract a clean username from the API userName value
export const extractActivityUsername = (userName: string): string => {
  return userName.replace(/_(MERCHANT|CUSTOMER|NUMONI)$/i, '').trim();
};

// Formats the activity timestamp using existing date helper and time
export const formatActivityTimestamp = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const datePart = formatDateReadable(date.toISOString());
  const timePart = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
  return `${datePart}, ${timePart}`;
};

// Maps API activity logs to the ActivityLog table shape
export const mapApiActivityToActivityLog = (apiData: ApiActivityLog[]): ActivityLog[] => {
  return apiData.map((item, index) => ({
    id: index + 1,
    timestamp: formatActivityTimestamp(item.accessDate || item.createdTime || ''),
    user: extractActivityUsername(item.userName || item.createdBy || 'Unknown'),
    role: item.userType || item.type || 'Unknown',
    action: item.action || 'Unknown',
    details: item.changeLog || 'No details available',
    ipAddress: item.systemIp || 'N/A',
  }));
};

/**
 * Checks if a pathname matches a route path, handling dynamic routes and nested paths.
 * 
 * This function is designed to handle Next.js dynamic routes (e.g., `/dashboard/merchants/[id]`)
 * by checking if the current pathname matches a base route path exactly or is a child of that route.
 * 
 * @param pathname - Current pathname from the URL (e.g., '/dashboard/merchants/123')
 * @param routePath - Route path to match against (e.g., '/dashboard/merchants')
 * @returns `true` if pathname matches the route (exact match or is a child route), `false` otherwise
 * 
 * @example
 * ```typescript
 * // Exact match
 * isPathMatch('/dashboard/merchants', '/dashboard/merchants'); // true
 * 
 * // Dynamic route match
 * isPathMatch('/dashboard/merchants/123', '/dashboard/merchants'); // true
 * isPathMatch('/dashboard/customers/456', '/dashboard/customers'); // true
 * isPathMatch('/dashboard/charity/789', '/dashboard/charity'); // true
 * 
 * // Special case: '/dashboard' only matches exactly
 * isPathMatch('/dashboard', '/dashboard'); // true
 * isPathMatch('/dashboard/merchants/123', '/dashboard'); // false
 * 
 * // No match
 * isPathMatch('/dashboard/merchants', '/dashboard/customers'); // false
 * isPathMatch('/profile', '/dashboard'); // false
 * ```
 * 
 * @remarks
 * - Exact matches always return `true`
 * - The base route `/dashboard` has special handling to prevent it from matching child routes
 *   (e.g., `/dashboard/merchants/123` will not match `/dashboard`)
 * - For other routes, the function checks if the pathname starts with the route path followed by '/'
 *   to determine if it's a child route (handles dynamic segments like `[id]`)
 * 
 * This is particularly useful for navigation sidebars where you want to highlight parent navigation
 * items when viewing their child pages (e.g., highlight "Merchants" when viewing a specific merchant detail page).
 */
export const isPathMatch = (pathname: string, routePath: string): boolean => {
  // Exact match
  if (pathname === routePath) return true;

  // Special case: '/dashboard' should only match exactly, not child routes
  // This prevents '/dashboard' from matching '/dashboard/merchants/123'
  if (routePath === '/dashboard') {
    return false;
  }

  // Check if pathname is a child of routePath (handles dynamic routes like /merchants/[id])
  // Only match if pathname starts with routePath + '/' to avoid matching siblings
  // e.g., '/dashboard/merchants/123' matches '/dashboard/merchants' but not '/dashboard'
  if (pathname.startsWith(routePath + '/')) {
    // Get the segment after the route path
    const remainingPath = pathname.slice(routePath.length + 1);
    // Match if there's a path segment after (handles dynamic IDs and child routes)
    return remainingPath.length > 0;
  }

  return false;
};

/**
 * Formats deal date from DD-MM-YYYY to readable format
 * @param dateStr - Date string in DD-MM-YYYY format
 * @returns Formatted readable date string or "N/A" if invalid
 */
export const formatDealDate = (dateStr: string): string => {
  if (!dateStr) return "N/A";
  const convertedDate = convertDateFormat(dateStr);
  return formatDateReadable(convertedDate);
};

/**
 * Gets default date range for reports (last 30 days)
 * @returns Object with start and end dates for the last month
 * 
 * @example
 * const { start, end } = getDefaultReportDates();
 * // Returns: { start: Date (30 days ago), end: Date (today) }
 */
export const getDefaultReportDates = (): { start: Date; end: Date } => {
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  return {
    start: thirtyDaysAgo,
    end: today,
  };
};

function extractObjectErrorMessage(error: object): string | null {
  // 1. Try "message" property
  if ('message' in error && typeof (error as { message: unknown }).message === 'string') {
    return (error as { message: string }).message
  }

  // 2. Try JSON.stringify
  try {
    const jsonString = JSON.stringify(error)
    if (jsonString !== '{}') {
      return jsonString
    }
  } catch {
    // Ignore stringify errors
  }

  // 3. If the object has a custom toString method
  const stringified = String(error)
  if (stringified !== '[object Object]') {
    return stringified
  }

  return null
}

/**
 * Safely extracts an error message from various error types
 * (Axios errors, standard Errors, unknown, etc.)
 */
export function extractErrorMessage(error: unknown): string {
  if (!error) {
    return 'An error occurred'
  }

  // Axios-style errors (checking for "response")
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const axiosError = error as {
      response?: { data?: { message?: string } }
    }
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message
    }
    return 'An error occurred'
  }

  // Standard JS Error
  if (error instanceof Error) {
    return error.message
  }

  // String errors
  if (typeof error === 'string') {
    return error
  }

  // Generic object errors
  if (typeof error === 'object' && error !== null) {
    const objMsg = extractObjectErrorMessage(error)
    if (objMsg) {
      return objMsg
    }
  }

  // Fallback
  return 'An error occurred'
}