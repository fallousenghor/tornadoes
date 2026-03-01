# Plan: React Router + Lazy Loading Implementation

## Information Gathered

### Current Architecture:
- **App.tsx**: Simple authentication check - shows Login if not authenticated, otherwise Dashboard
- **Dashboard.tsx**: Contains ALL imports at the top (eager loading), uses Zustand store `activeNav` state for conditional rendering
- **react-router-dom v6.22.0** is already installed but NOT being used
- All feature components are imported statically: Employees, Departments, Leaves, Projects, Stock, Students, Teachers, etc.

### Features to Route:
- Dashboard (`/`)
- RH: Employees, Departments, Presence, Leaves, Performance
- Finance: Treasury, Invoices, Accounting
- Stock, Projects, Documents
- Formation: Students, Teachers, Schedule, Grades
- System: Roles, Audit, Settings, AI Analytics

---

## Plan: Implementation Steps

### Step 1: Create centralized routes configuration
- Create `src/routes/index.ts` with route definitions
- Define routes with path, component (lazy), and metadata

### Step 2: Create AppRoutes component with lazy loading
- Use React.lazy() for all feature components
- Wrap routes in Suspense with loading fallback
- Implement protected route wrapper

### Step 3: Update App.tsx
- Import BrowserRouter and wrap the app
- Add routes configuration
- Keep authentication logic

### Step 4: Create Layout component
- Extract sidebar and header from Dashboard
- Create `src/components/layout/AppLayout.tsx`
- Use Outlet for nested routes

### Step 5: Simplify Dashboard.tsx
- Remove all routing logic and module imports
- Keep only dashboard-specific components and charts

### Step 6: Update store (optional)
- Remove `activeNav` state if no longer needed for routing

---

## Files to Create:
- `src/routes/index.ts` - Route definitions

## Files to Modify:
- `src/App.tsx` - Add router setup
- `src/components/layout/AppLayout.tsx` - New layout component
- `src/features/dashboard/Dashboard.tsx` - Simplify to only dashboard content

---

## Followup Steps:
1. Run `npm run dev` to test the implementation
2. Verify lazy loading works (check network tab for code splitting)
3. Test all routes work correctly
4. Test authentication still works properly

