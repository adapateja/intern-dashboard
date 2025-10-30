# NextShop - E-Commerce Demo with Rendering Strategy Simulations

NextShop is a full-stack e-commerce application built with React, Vite, TypeScript, and Tailwind CSS. It demonstrates how Next.js rendering strategies can be conceptually mapped to a React-based architecture.

## 🎯 Project Overview

This project showcases different data fetching and rendering patterns that correspond to Next.js's rendering strategies:

- **SSG (Static Site Generation)** - Home page product catalog
- **ISR (Incremental Static Regeneration)** - Product detail pages
- **SSR (Server-Side Rendering)** - Inventory dashboard
- **CSR (Client-Side Rendering)** - Admin panel
- **RSC (React Server Components)** - Recommendations page

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Backend**: Lovable Cloud (PostgreSQL + Edge Functions)
- **Authentication**: Supabase Auth
- **State Management**: React Query (TanStack Query)
- **UI Components**: shadcn/ui

### Database Schema

```sql
products {
  id: UUID (primary key)
  name: TEXT
  slug: TEXT (unique)
  description: TEXT
  price: NUMERIC
  category: TEXT
  inventory: INTEGER
  image_url: TEXT
  last_updated: TIMESTAMP
  created_at: TIMESTAMP
}
```

## 📄 Pages & Rendering Strategies

### 1. Home Page (`/`) - SSG Simulation

**Next.js Equivalent**: `getStaticProps`

**Implementation**:
- Fetches product data on mount with aggressive caching (5-minute staleTime)
- Client-side search and filtering operate on cached data
- Minimal server requests after initial load

**Key Features**:
- Product grid with filtering by name and category
- Real-time search without API calls
- Responsive layout

**Code Location**: `src/pages/Home.tsx`

---

### 2. Product Detail (`/products/:id`) - ISR Simulation

**Next.js Equivalent**: `getStaticProps` with `revalidate: 60`

**Implementation**:
- React Query refetches data every 60 seconds in the background
- Serves cached data immediately while revalidating
- Displays "Last Updated" timestamp to show ISR behavior

**Key Features**:
- Dynamic product details
- Real-time inventory status
- Low stock warnings
- Automatic background revalidation

**Code Location**: `src/pages/ProductDetail.tsx`

---

### 3. Inventory Dashboard (`/dashboard`) - SSR Simulation

**Next.js Equivalent**: `getServerSideProps`

**Implementation**:
- No caching (staleTime: 0)
- Fetches fresh data on every mount
- Refetches when window regains focus
- Manual refresh button for on-demand updates

**Key Features**:
- Real-time inventory statistics
- Low stock alerts
- Total inventory value calculation
- Out-of-stock tracking

**Code Location**: `src/pages/Dashboard.tsx`

---

### 4. Admin Panel (`/admin`) - CSR (Client-Side Rendering)

**Next.js Equivalent**: Client Component (no SSR/SSG)

**Implementation**:
- All data fetching happens after mount in the browser
- Client-side authentication check
- Form submissions via Supabase client
- Real-time mutations with optimistic updates

**Key Features**:
- Create new products
- Edit existing products
- Form validation
- Admin-only access control

**Code Location**: `src/pages/Admin.tsx`

---

### 5. Recommendations Page (`/recommendations`) - RSC Simulation (BONUS)

**Next.js Equivalent**: React Server Components in App Router

**Implementation**:
- Simulates server-side data fetching with long cache times
- Client-side interactivity (wishlist) separate from data fetching
- Demonstrates the RSC pattern: static data + dynamic UI

**Key Features**:
- Curated product recommendations
- Interactive wishlist (client-side state)
- Smooth animations and transitions

**Code Location**: `src/pages/Recommendations.tsx`

---

## 🔐 Authentication & Authorization

### User Roles

The app implements secure role-based access control:

- **Regular Users**: Can browse products and view details
- **Admin Users**: Full CRUD access to product management

### Security Features

- Secure password authentication via Supabase Auth
- Row-Level Security (RLS) policies on database
- Server-side role validation using security definer functions
- Admin routes protected with client and server checks
- Auto-confirmed emails for testing (configurable)

### Admin Setup

To grant admin access to a user, manually insert into the `user_roles` table:

```sql
INSERT INTO user_roles (user_id, role)
VALUES ('user-uuid-here', 'admin');
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or bun

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd nextshop
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:8080](http://localhost:8080)

## 📊 Database Seeding

The database comes pre-seeded with 12 demo products across three categories:
- Electronics (7 products)
- Furniture (2 products)
- Accessories (3 products)

Products include realistic pricing, inventory levels, and images.

## 🎨 Design System

NextShop uses a comprehensive design system defined in `src/index.css` and `tailwind.config.ts`:

### Color Palette

- **Primary**: Deep indigo (trustworthy, professional)
- **Accent**: Emerald green (CTAs, success states)
- **Warning**: Amber (low stock alerts)
- **Semantic tokens**: All colors use CSS variables for consistency

### Key Design Features

- Custom gradients for hero sections
- Consistent shadows and transitions
- Responsive typography scale
- Smooth animations and hover effects

## 🔄 React Query Configuration

The app uses React Query for optimal data fetching:

```typescript
// SSG Simulation (Home)
staleTime: 5 * 60 * 1000  // 5 minutes

// ISR Simulation (Product Detail)
staleTime: 30 * 1000
refetchInterval: 60 * 1000  // Revalidate every 60 seconds

// SSR Simulation (Dashboard)
staleTime: 0  // Always fresh

// RSC Simulation (Recommendations)
staleTime: 10 * 60 * 1000  // 10 minutes
```

## 📝 API Endpoints (Conceptual)

While this app uses Supabase client methods, it conceptually maps to these REST endpoints:

- `GET /api/products` - Fetch all products
- `GET /api/products/:id` - Fetch single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)

## 🧪 Testing Rendering Strategies

### Test SSG (Home Page)
1. Load the home page
2. Note the initial load time
3. Filter products - no network requests
4. Data stays cached for 5 minutes

### Test ISR (Product Detail)
1. Open a product detail page
2. Note the "Last Updated" timestamp
3. Wait 60 seconds
4. Observe background refetch in Network tab
5. Timestamp updates automatically

### Test SSR (Dashboard)
1. Navigate to Dashboard
2. Check Network tab - fresh request every time
3. Click "Refresh Data" for manual refetch
4. Switch tabs and return - auto refetch

### Test CSR (Admin)
1. Sign in with admin credentials
2. Open Admin panel
3. All data loads after page mount
4. Add/edit products - instant UI updates

### Test RSC (Recommendations)
1. Visit Recommendations page
2. Data loads once, cached for 10 minutes
3. Wishlist button works instantly (client-side)
4. Demonstrates server data + client interactivity

## 🔒 Security Best Practices

- Row-Level Security (RLS) enabled on all tables
- Admin role validation via security definer functions
- No client-side role checks (prevents privilege escalation)
- Secure password requirements enforced
- Input validation on all forms

## 📦 Deployment

The app can be deployed via Lovable's built-in deployment:

1. Click "Publish" in Lovable
2. Your app will be deployed with backend included
3. Custom domains available on paid plans

## 🤝 Contributing

This is a demo project showcasing rendering strategies. Feel free to:
- Add more products
- Customize the design system
- Implement additional features
- Experiment with caching strategies

## 📚 Learn More

- [React Query Documentation](https://tanstack.com/query/latest)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Rendering Strategies](https://nextjs.org/docs/basic-features/data-fetching)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 📄 License

This project is for educational purposes demonstrating Next.js rendering concepts in a React application.

---

**Built with ❤️ using Lovable**
