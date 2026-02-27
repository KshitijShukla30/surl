# SURL - URL Shortener Project Overview

## 🎯 Project Purpose
**SURL** is a production-ready URL shortener application that allows users to convert long URLs into short, shareable links with customizable short codes. The application is built with modern web technologies and provides a fast, beautiful user experience.

---

## 📊 Project Type & Stack

### Technology Stack
- **Frontend Framework**: Next.js 16 (App Router) with React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database ORM**: Prisma
- **Database**: PostgreSQL
- **API**: RESTful API with Next.js API routes & Server Actions
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Data Fetching**: SWR (for client-side caching)
- **UI Components**: Custom components with Tailwind CSS
- **Notifications**: Sonner (toast notifications)

### Development Tools
- ESLint (code linting)
- PostCSS
- Tailwind Merge (utility class merging)

---

## 🗂️ Project Structure

```
surl/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── page.tsx              # Home page (main UI)
│   │   ├── layout.tsx            # Root layout
│   │   ├── globals.css           # Global styles
│   │   ├── actions/
│   │   │   └── link.ts           # Server Actions for link operations
│   │   ├── api/
│   │   │   └── links/
│   │   │       └── route.ts      # API endpoint for fetching links
│   │   └── [code]/
│   │       └── route.ts          # Dynamic route for short code redirects
│   ├── components/               # Reusable React components
│   │   ├── CreateLinkForm.tsx    # Form to create short links
│   │   └── RecentLinks.tsx       # Display recently created links
│   └── lib/
│       ├── prisma.ts            # Prisma client singleton
│       └── utils.ts             # Utility functions (validation, code generation)
├── prisma/
│   ├── schema.prisma            # Database schema definition
│   └── seed.ts                  # Database seeding script
├── public/                       # Static assets
├── next.config.ts               # Next.js configuration
├── tailwind.config.js           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies & scripts
└── eslint.config.mjs            # ESLint configuration
```

---

## 🔧 Core Features & Functionality

### 1. **URL Shortening**
   - Users submit a long URL through the form
   - Backend validates the URL format
   - Generates a unique short code (typically 6-8 characters)
   - Stores the mapping in PostgreSQL via Prisma
   - Returns the shortened URL to the user

### 2. **Link Redirect**
   - Dynamic route handler `[code]/route.ts` processes short code requests
   - Looks up the short code in the database
   - Redirects to the original URL or returns 404 if not found
   - Tracks click count for analytics

### 3. **Recent Links Display**
   - Fetches recently created links from `/api/links`
   - Displays links in a list/grid format
   - Shows creation date, expiration status, and click count
   - Uses SWR for efficient client-side data fetching and caching

### 4. **Data Persistence**
   - PostgreSQL database stores all link records
   - Prisma ORM handles database queries
   - Link model includes:
     - `id`: Unique identifier (CUID)
     - `url`: Original long URL
     - `shortCode`: Unique short code
     - `createdAt`: Timestamp of creation
     - `expiresAt`: Optional expiration date
     - `clicks`: Counter for analytics

---

## 🔑 Key Components

### **CreateLinkForm** (`src/components/CreateLinkForm.tsx`)
- Input field for URL submission
- Form validation before submission
- Server Action integration for creating links
- Error/success feedback to user

### **RecentLinks** (`src/components/RecentLinks.tsx`)
- Fetches links from API endpoint
- Displays list of recently created short links
- Shows metadata (creation date, clicks, expiration)
- Real-time updates via SWR

### **Server Actions** (`src/app/actions/link.ts`)
- `createShortLink()`: Handles URL shortening logic
- Validates input URLs
- Generates unique short codes with retry logic
- Stores data in database
- Returns status/error messages

### **API Endpoints**
- `/api/links`: GET endpoint to fetch all links (for RecentLinks display)
- `/[code]`: Dynamic route to handle short link redirects

---

## 🎨 User Interface Design

### Design Highlights
- **Dark Theme**: Modern dark background (`#050511`) with white text
- **Gradient Accents**: Blue/indigo gradient overlays for visual appeal
- **Glassmorphism**: Blur effects on background elements
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Motion**: Framer Motion for smooth animations
- **Accessibility**: Semantic HTML, proper form handling, icon accessibility

### Main Sections
1. **Hero Section**: Project title and value proposition
2. **Form Section**: Input field to create short links
3. **Recent Links Section**: Display of previously created links

---

## 🚀 How It Works (User Flow)

```
User enters long URL
    ↓
Form validates URL format
    ↓
Server Action processes request
    ↓
Backend generates unique short code
    ↓
Data stored in PostgreSQL
    ↓
Short URL displayed to user
    ↓
User can copy/share short URL
    ↓
When short URL is accessed → Dynamic route redirects to original URL
```

---

## 💾 Database Schema

```prisma
model Link {
  id        String    @id @default(cuid())
  url       String
  shortCode String    @unique
  createdAt DateTime  @default(now())
  expiresAt DateTime?
  clicks    Int       @default(0)
}
```

- **Unique constraint** on `shortCode` ensures no duplicate short links
- **Optional `expiresAt`** allows for link expiration functionality
- **Click tracking** via `clicks` counter for analytics

---

## 📝 Development Scripts

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint code linting
```

---

## 🔐 Key Utilities

### URL Validation (`utils.ts`)
- `isValidUrl()`: Validates URL format before processing
- Ensures only valid HTTP/HTTPS URLs are shortened

### Short Code Generation (`utils.ts`)
- `generateShortCode()`: Creates random 6-8 character codes
- Uses alphanumeric characters for URL-safe codes
- Includes retry logic in server action for uniqueness (max 5 attempts)

### Database Connection (`lib/prisma.ts`)
- Singleton pattern for Prisma client
- Prevents connection leaks in development
- Provides global access to database queries

---

## 🌟 Project Strengths

✅ **Modern Architecture**: Uses latest Next.js App Router with Server Components/Actions
✅ **Type-Safe**: Full TypeScript implementation
✅ **Performance Optimized**: SWR for caching, Prisma for efficient queries
✅ **Beautiful UI**: Modern dark theme with animations and gradients
✅ **Scalable**: PostgreSQL backend, RESTful API design
✅ **Production-Ready**: Includes error handling, validation, and analytics tracking
✅ **Developer Experience**: ESLint, TypeScript, clear project structure

---

## 📈 Future Enhancement Ideas

- User authentication & personal dashboard
- Custom short code creation
- Link expiration & auto-deletion
- Advanced analytics dashboard (clicks, referrers, devices)
- QR code generation for short links
- Bulk URL shortening
- API key integration for programmatic access
- Social media sharing buttons

---

## 🎓 Learning Value

This project demonstrates:
- Next.js 16 with App Router and Server Actions
- PostgreSQL + Prisma database interactions
- TypeScript for type safety
- Tailwind CSS for modern styling
- RESTful API design patterns
- Form handling and validation
- Client-side state management with SWR
- Dynamic routing in Next.js
- Production-ready code structure
