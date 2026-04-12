// App.tsx - TORNADOES JOB ERP
// Main application component with React Router, Lazy Loading and Theme Provider

import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAppStore } from './store';
import { AppLayout } from './components/layout';
import { ThemeProvider } from './contexts/ThemeContext';
import { getNavItems, getRouteId } from './routes';
import ToastContainer from './components/common/ToastContainer';

// Lazy load Login component
const Login = React.lazy(() => import('./features/auth/Login'));

// Lazy load all feature components - direct imports to avoid type issues
// Dashboard
const Dashboard = React.lazy(() => import('./features/dashboard/Dashboard'));

// HR (ex: RH)
const Employees = React.lazy(() => import('./features/hr/Employees'));
const Departments = React.lazy(() => import('./features/hr/Departments'));
const Presence = React.lazy(() => import('./features/hr/Presence'));
const Leaves = React.lazy(() => import('./features/hr/Leaves'));
const Performance = React.lazy(() => import('./features/hr/Performance'));
const EmployeeDetail = React.lazy(() => import('./features/hr/EmployeeDetail'));

// Finance
const FinanceDashboard = React.lazy(() => import('./features/finance/FinanceDashboard'));
const Invoices = React.lazy(() => import('./features/finance/Invoices'));
const Expenses = React.lazy(() => import('./features/finance/Expenses'));
const Accounting = React.lazy(() => import('./features/finance/Accounting'));

// CRM (NOUVEAU)
const Contacts = React.lazy(() => import('./features/crm/Contacts'));
const Deals = React.lazy(() => import('./features/crm/Deals'));

// Purchases (NOUVEAU)
const Purchases = React.lazy(() => import('./features/purchases/Purchases'));

// Inventory (ex: Stock)
const Inventory = React.lazy(() => import('./features/inventory/Inventory'));

// Projects
const Projects = React.lazy(() => import('./features/projects/Projects'));

// Documents
const Documents = React.lazy(() => import('./features/documents/Documents'));

// Formation
const Students = React.lazy(() => import('./features/formation/Students'));
const Teachers = React.lazy(() => import('./features/formation/Teachers'));
const Schedule = React.lazy(() => import('./features/formation/Schedule'));
const Grades = React.lazy(() => import('./features/formation/Grades'));
const Programs = React.lazy(() => import('./features/formation/Programs'));
const Enrollments = React.lazy(() => import('./features/formation/Enrollments'));
const TuitionPayments = React.lazy(() => import('./features/formation/TuitionPayments'));
const TeacherSalaries = React.lazy(() => import('./features/formation/TeacherSalaries'));

// AI
const AIAnalytics = React.lazy(() => import('./features/ai/AIAnalytics'));

// System
const Roles = React.lazy(() => import('./features/roles/Roles'));
const Audit = React.lazy(() => import('./features/audit/Audit'));
const Settings = React.lazy(() => import('./features/settings/Settings'));

// Loading fallback component - uses CSS variables for theme support
const LoadingFallback: React.FC = () => (
  <div style={{
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--color-bg)',
    color: 'var(--color-primary)',
    fontFamily: "'DM Sans', sans-serif",
  }}>
    <div style={{
      width: 48,
      height: 48,
      border: '3px solid rgba(100, 140, 255, 0.2)',
      borderTopColor: 'var(--color-primary)',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
      marginBottom: 16,
    }} />
    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color-text)' }}>Chargement...</div>
    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>Tornadoes Job ERP</div>
    <style>{`
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isHydrated } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for hydration to complete before checking auth
    if (!isHydrated) return;

    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, isHydrated, navigate]);

  // Show loading while hydrating
  if (!isHydrated) {
    return <LoadingFallback />;
  }

  if (!isAuthenticated) {
    return <LoadingFallback />;
  }

  return <>{children}</>;
};

// Public Route Wrapper (redirect to dashboard if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isHydrated } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for hydration to complete before checking auth
    if (!isHydrated) return;

    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isHydrated, navigate]);

  // Show loading while hydrating
  if (!isHydrated) {
    return <LoadingFallback />;
  }

  if (isAuthenticated) {
    return <LoadingFallback />;
  }

  return <>{children}</>;
};

// App Routes Component
const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAppStore();

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Suspense fallback={<LoadingFallback />}>
              <Login />
            </Suspense>
          </PublicRoute>
        }
      />

      {/* Protected Routes with AppLayout */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route
          path="/"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Dashboard />
            </Suspense>
          }
        />

        {/* AI Analytics */}
        <Route path="/ai" element={<Suspense fallback={<LoadingFallback />}><AIAnalytics /></Suspense>} />

        {/* HR Routes */}
        <Route path="/hr/employees" element={<Suspense fallback={<LoadingFallback />}><Employees /></Suspense>} />
        <Route path="/hr/employees/:id" element={<Suspense fallback={<LoadingFallback />}><EmployeeDetail /></Suspense>} />
        <Route path="/hr/departments" element={<Suspense fallback={<LoadingFallback />}><Departments /></Suspense>} />
        <Route path="/hr/presence" element={<Suspense fallback={<LoadingFallback />}><Presence /></Suspense>} />
        <Route path="/hr/leaves" element={<Suspense fallback={<LoadingFallback />}><Leaves /></Suspense>} />
        <Route path="/hr/performance" element={<Suspense fallback={<LoadingFallback />}><Performance /></Suspense>} />

        {/* Finance Routes */}
        <Route path="/finance" element={<Suspense fallback={<LoadingFallback />}><FinanceDashboard /></Suspense>} />
        <Route path="/finance/invoices" element={<Suspense fallback={<LoadingFallback />}><Invoices /></Suspense>} />
        <Route path="/finance/expenses" element={<Suspense fallback={<LoadingFallback />}><Expenses /></Suspense>} />

        {/* CRM Routes (NOUVEAU) */}
        <Route path="/crm/contacts" element={<Suspense fallback={<LoadingFallback />}><Contacts /></Suspense>} />
        <Route path="/crm/deals" element={<Suspense fallback={<LoadingFallback />}><Deals /></Suspense>} />

        {/* Purchases Routes (NOUVEAU) */}
        <Route path="/purchases" element={<Suspense fallback={<LoadingFallback />}><Purchases /></Suspense>} />

        {/* Inventory Routes */}
        <Route path="/inventory" element={<Suspense fallback={<LoadingFallback />}><Inventory /></Suspense>} />

        {/* Operations Routes */}
        <Route path="/projects" element={<Suspense fallback={<LoadingFallback />}><Projects /></Suspense>} />
        <Route path="/documents" element={<Suspense fallback={<LoadingFallback />}><Documents /></Suspense>} />

        {/* Formation Routes */}
        <Route path="/formation/students" element={<Suspense fallback={<LoadingFallback />}><Students /></Suspense>} />
        <Route path="/formation/teachers" element={<Suspense fallback={<LoadingFallback />}><Teachers /></Suspense>} />
        <Route path="/formation/schedule" element={<Suspense fallback={<LoadingFallback />}><Schedule /></Suspense>} />
        <Route path="/formation/grades" element={<Suspense fallback={<LoadingFallback />}><Grades /></Suspense>} />
        <Route path="/formation/programs" element={<Suspense fallback={<LoadingFallback />}><Programs /></Suspense>} />
        <Route path="/formation/enrollments" element={<Suspense fallback={<LoadingFallback />}><Enrollments /></Suspense>} />
        <Route path="/formation/payments" element={<Suspense fallback={<LoadingFallback />}><TuitionPayments /></Suspense>} />
        <Route path="/formation/salaries" element={<Suspense fallback={<LoadingFallback />}><TeacherSalaries /></Suspense>} />

        {/* System Routes */}
        <Route path="/system/roles" element={<Suspense fallback={<LoadingFallback />}><Roles /></Suspense>} />
        <Route path="/system/audit" element={<Suspense fallback={<LoadingFallback />}><Audit /></Suspense>} />
        <Route path="/system/settings" element={<Suspense fallback={<LoadingFallback />}><Settings /></Suspense>} />
      </Route>

      {/* Catch all - redirect to dashboard or login */}
      <Route
        path="*"
        element={
          isAuthenticated ? <Navigate to="/" replace /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
};

// Main App Component with ThemeProvider
const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppRoutes />
        <ToastContainer />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
