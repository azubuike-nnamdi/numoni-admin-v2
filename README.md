# Numoni Admin Dashboard v2

A comprehensive admin dashboard for managing the Numoni platform - a loyalty points and rewards system that connects merchants, customers, and charities. This application provides administrative tools for managing merchants, customers, charities, deals & promotions, and generating detailed reports.

## 🚀 Project Overview

The Numoni Admin Dashboard is a modern, full-featured administrative interface built with Next.js 15 and React 19. It serves as the central management hub for the Numoni ecosystem, enabling administrators to:

-  **Manage Merchants**: Add, edit, and monitor merchant accounts, their transactions, and performance metrics
-  **Customer Management**: Handle customer accounts, view transaction history, and manage loyalty points
-  **Charity Operations**: Manage charity organizations, track donations, and monitor impact
-  **Deals & Promotions**: Create and manage promotional campaigns and special offers
-  **Admin Management**: Control admin user accounts, roles, and permissions
-  **Analytics & Reporting**: Generate comprehensive reports on sales, points, and charity activities
-  **Activity Monitoring**: Track system activities and user interactions

## 🛠️ Tech Stack

### Core Framework

-  **Next.js 15.5.4** - React framework with App Router
-  **React 19.1.0** - UI library
-  **TypeScript 5** - Type safety and development experience

### UI & Styling

-  **Tailwind CSS 4** - Utility-first CSS framework
-  **Radix UI** - Headless UI components for accessibility
-  **shadcn/ui** - Modern component library built on Radix UI
-  **Lucide React** - Icon library
-  **Framer Motion** - Animation library
-  **Recharts** - Data visualization and charts

### State Management & Data Fetching

-  **Zustand** - Lightweight state management
-  **TanStack Query (React Query)** - Server state management and caching
-  **React Hook Form** - Form handling and validation
-  **Zod** - Schema validation

### Authentication & Security

-  **JWT Tokens** - Authentication with automatic refresh
-  **Cookie-based Storage** - Secure token storage
-  **Role-based Access Control** - Admin permission system

### Development Tools

-  **ESLint** - Code linting
-  **Husky** - Git hooks
-  **Commitlint** - Commit message linting
-  **Turbopack** - Fast bundling (Next.js)

## 📁 Project Structure

```
numoni-admin-v2/
├── app/                          # Next.js App Router
│   ├── api/                     # API routes
│   │   ├── branches/            # Branch management endpoints
│   │   ├── generateBankToken/   # Bank token generation
│   │   ├── maps/               # Maps integration
│   │   ├── pay-on-us/          # Payment processing
│   │   └── places/             # Location services
│   ├── auth/                    # Authentication pages
│   │   └── sign-in/            # Login page
│   ├── dashboard/              # Main dashboard pages
│   │   ├── activity-logs/      # System activity monitoring
│   │   ├── admin-management/   # Admin user management
│   │   ├── charity/           # Charity management
│   │   ├── customers/         # Customer management
│   │   ├── deals-promo/       # Deals and promotions
│   │   ├── merchants/         # Merchant management
│   │   ├── notifications/     # Notification center
│   │   ├── reports/           # Analytics and reporting
│   │   ├── roles/             # Role and permission management
│   │   └── support/           # Support ticket system
│   ├── fonts/                 # Custom font files
│   ├── globals.css            # Global styles
│   └── layout.tsx             # Root layout
├── components/                 # Reusable components
│   ├── admin/                 # Admin-specific components
│   │   ├── add-merchants/     # Merchant creation forms
│   │   ├── admin-management/  # Admin management UI
│   │   ├── charity/          # Charity management UI
│   │   ├── customers/        # Customer management UI
│   │   ├── deals-and-promo/  # Deals management UI
│   │   ├── roles-and-permission/ # Role management UI
│   │   └── support/          # Support system UI
│   ├── auth/                 # Authentication components
│   ├── common/               # Shared components
│   └── ui/                   # Base UI components (shadcn/ui)
├── constant/                 # Application constants
│   ├── icons.ts             # Icon definitions
│   ├── images.ts            # Image assets
│   └── routes.ts            # Route definitions
├── context/                 # React contexts
├── data/                   # Mock data and constants
├── hooks/                  # Custom React hooks
│   ├── mutation/           # Data mutation hooks
│   └── query/              # Data fetching hooks
├── lib/                    # Utility libraries
│   ├── schemas/            # Zod validation schemas
│   ├── stores/             # Additional stores
│   └── types/              # TypeScript type definitions
├── stores/                 # Zustand stores
│   ├── bank-store.ts       # Bank integration state
│   ├── branch-store.ts     # Branch management state
│   ├── pay-on-us-store.ts  # Payment processing state
│   └── user-auth-store.ts  # Authentication state
└── public/                 # Static assets
    └── assets/             # Images and icons
```

## 🚀 Getting Started

### Prerequisites

-  **Node.js** >= 19.0.0 < 23.0.0
-  **pnpm** (recommended package manager)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd numoni-admin-v2
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Configure the following environment variables:

   ```env
   NEXT_PUBLIC_API_URL=your_api_base_url
   # Add other required environment variables
   ```

4. **Run the development server**

   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
# Development
pnpm dev              # Start development server with Turbopack
pnpm build            # Build for production with Turbopack
pnpm start            # Start production server
pnpm clean            # Clean build artifacts and dependencies

# Code Quality
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript type checking
pnpm commitlint       # Lint commit messages
```

## 🏗️ Architecture

### State Management

The application uses **Zustand** for client-side state management with the following stores:

-  **`user-auth-store`**: Manages authentication state, user data, and token refresh
-  **`bank-store`**: Handles bank integration tokens and API access
-  **`pay-on-us-store`**: Manages payment processing tokens
-  **`branch-store`**: Stores branch-related data and operations

### Data Fetching

**TanStack Query** is used for server state management:

-  **Query Hooks**: Located in `hooks/query/` for data fetching
-  **Mutation Hooks**: Located in `hooks/mutation/` for data modifications
-  **Automatic Caching**: Built-in caching and background refetching
-  **Optimistic Updates**: Enhanced user experience with immediate UI updates

### Authentication Flow

1. **Login**: Users authenticate via JWT tokens
2. **Token Storage**: Secure cookie-based token storage
3. **Auto Refresh**: Automatic token refresh using refresh tokens
4. **Route Protection**: Middleware-based route protection
5. **Role-based Access**: Admin permissions and role management

### API Integration

-  **Axios**: HTTP client with interceptors
-  **Automatic Token Refresh**: Built-in token refresh mechanism
-  **Error Handling**: Centralized error handling and user feedback
-  **Type Safety**: Full TypeScript integration for API responses

## 🔒 CORS Issue Resolution

### Problem

When downloading QR code images from S3 buckets, the browser was blocking the download due to CORS (Cross-Origin Resource Sharing) restrictions. The error occurred because:

1. **S3 Bucket Configuration**: The S3 buckets (`cpip-dev-public.s3.eu-west-1.amazonaws.com`, etc.) don't have CORS headers configured
2. **Canvas Taint**: When loading external images directly into a canvas element, browsers enforce CORS policies. If the image server doesn't send proper CORS headers, the canvas becomes "tainted" and cannot be exported
3. **Direct Fetch Failure**: Attempting to fetch images directly from S3 using `fetch()` or `new Image()` fails when CORS headers are missing

### Solution: Image Proxy API Route

We implemented a **server-side proxy** approach that bypasses browser CORS restrictions:

#### 1. Created Image Proxy API Route (`/app/api/images/proxy/route.ts`)

This Next.js API route:

-  **Fetches images server-side**: Server-to-server requests don't have CORS restrictions
-  **Validates allowed domains**: Only allows requests from whitelisted S3 domains for security
-  **Returns images with proper headers**: Serves images with CORS headers that allow browser access
-  **Handles errors gracefully**: Returns appropriate error responses for invalid requests

```typescript
// Example usage:
GET /api/images/proxy?url=https://cpip-dev-public.s3.eu-west-1.amazonaws.com/image.png
```

#### 2. Updated Image Loading Function (`lib/helper.ts`)

Modified `loadImageWithCors()` to:

-  **Detect S3 URLs**: Automatically identifies S3 bucket URLs
-  **Route through proxy**: S3 URLs are automatically proxied through `/api/images/proxy`
-  **Handle local assets**: Local paths (like `/assets/icons/...`) are loaded directly without proxying
-  **Maintain fallback**: Still attempts direct loading for non-S3 external URLs

#### How It Works

```
┌─────────────┐         ┌──────────────┐         ┌─────────────┐
│   Browser   │────────▶│  Next.js    │────────▶│  S3 Bucket  │
│  (Client)   │         │  API Proxy  │         │  (Server)   │
└─────────────┘         └──────────────┘         └─────────────┘
     │                          │                         │
     │ 1. Request image         │ 2. Fetch from S3        │
     │    via proxy             │    (no CORS issue)     │
     │                          │                         │
     │◀─────────────────────────│ 3. Return with         │
     │                          │    CORS headers        │
     │                          │                         │
     │ 4. Load into canvas      │                         │
     │    (same-origin,         │                         │
     │     no CORS issue)       │                         │
```

#### Benefits

✅ **No AWS Configuration Required**: Works without modifying S3 bucket CORS settings  
✅ **Secure**: Domain whitelisting prevents unauthorized image proxying  
✅ **Transparent**: Client code doesn't need to know about the proxy  
✅ **Performant**: Images are cached with proper cache headers  
✅ **Backward Compatible**: Local assets and other external URLs still work normally

#### Allowed Domains

The proxy currently allows images from:

-  `cpip-dev-public.s3.eu-west-1.amazonaws.com`
-  `numoniimages.s3.amazonaws.com`
-  `numoni-prod-uploads.s3.eu-west-1.amazonaws.com`
-  `s3.amazonaws.com` (general S3 bucket pattern)

To add more domains, update the `allowedDomains` array in `/app/api/images/proxy/route.ts`.

#### Related Files

-  `/app/api/images/proxy/route.ts` - Image proxy API route
-  `/lib/helper.ts` - `loadImageWithCors()` function that uses the proxy
-  `/lib/helper.ts` - `downloadQRCodeImageWithLogo()` function that downloads QR codes

## 🎨 UI Components

### Component Library

Built on **shadcn/ui** with **Radix UI** primitives:

-  **Accessibility**: WCAG compliant components
-  **Customizable**: Easy theming and customization
-  **Type Safe**: Full TypeScript support
-  **Consistent**: Design system consistency

### Key Components

-  **MetricCard**: Dashboard metrics display
-  **DataTable**: Sortable and filterable data tables
-  **Form Components**: Validated form inputs with error handling
-  **Modal Dialogs**: Accessible modal and dialog components
-  **Navigation**: Responsive sidebar and navbar
-  **Charts**: Data visualization components

## 📊 Features

### Dashboard Overview

-  Real-time metrics and KPIs
-  Active users monitoring
-  Top-performing merchants
-  Most supported charities
-  Transaction summaries

### Merchant Management

-  Merchant registration and onboarding
-  Business information management
-  Transaction monitoring
-  Performance analytics
-  KYC verification
-  Reward point management

### Customer Management

-  Customer account management
-  Transaction history
-  Loyalty points tracking
-  Account controls (balance adjustment, password reset)
-  Customer reviews and feedback

### Charity Operations

-  Charity registration and verification
-  Donation tracking
-  Impact reporting
-  Charity performance metrics

### Admin Controls

-  Admin user management
-  Role and permission assignment
-  Activity logging and monitoring
-  System configuration

### Reporting & Analytics

-  Sales reports
-  Points distribution reports
-  Charity impact reports
-  Custom date range filtering
-  Export capabilities

## 🔧 Development

### Code Style

-  **ESLint**: Configured with Next.js and TypeScript rules
-  **Prettier**: Code formatting (if configured)
-  **Husky**: Pre-commit hooks for code quality
-  **Commitlint**: Conventional commit messages

### TypeScript

-  **Strict Mode**: Enabled for better type safety
-  **Path Mapping**: `@/*` alias for clean imports
-  **Type Definitions**: Comprehensive type definitions in `lib/types/`

### Component Development

1. **Create components** in appropriate directories
2. **Use TypeScript** for all components
3. **Follow naming conventions**: PascalCase for components
4. **Add proper prop types** and interfaces
5. **Include accessibility** attributes where needed

## 🚀 Deployment

### Build Process

```bash
pnpm build
```

The build process:

-  TypeScript compilation
-  Next.js optimization
-  Static asset optimization
-  Bundle analysis

### Environment Configuration

Ensure all required environment variables are set:

-  `NEXT_PUBLIC_API_URL`: Backend API base URL
-  Additional environment variables as needed

### Production Considerations

-  **Image Optimization**: Next.js automatic image optimization
-  **Bundle Analysis**: Use `@next/bundle-analyzer` for optimization
-  **Performance**: Built-in Next.js performance optimizations
-  **Security**: Secure cookie settings and HTTPS enforcement

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
4. **Run tests and linting**

   ```bash
   pnpm lint
   pnpm type-check
   ```

5. **Commit your changes**

   ```bash
   git commit -m "feat: add your feature description"
   ```

6. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**

### Commit Convention

This project uses conventional commits:

-  `feat:` New features
-  `fix:` Bug fixes
-  `docs:` Documentation changes
-  `style:` Code style changes
-  `refactor:` Code refactoring
-  `test:` Test additions or changes
-  `chore:` Build process or auxiliary tool changes

### Code Review Process

1. All changes require code review
2. Ensure tests pass
3. Follow TypeScript best practices
4. Maintain component consistency
5. Update documentation as needed

## 🆘 Support

For support and questions:

-  Create an issue in the repository
-  Contact the development team
-  Check the documentation

---

**Built with ❤️ using Next.js, React, and modern web technologies**
