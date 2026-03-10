// App.tsx - AEVUM Enterprise ERP
// Main application component with React Router, Lazy Loading and Theme Provider

import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAppStore } from './store';
import { AppLayout } from './components/layout';
import { ThemeProvider } from './contexts/ThemeContext';
import { getNavItems, getRouteId } from './routes';

// Lazy load Login component
const Login = React.lazy(() => import('./features/auth/Login'));

// Lazy load all feature components - direct imports to avoid type issues
const Dashboard = React.lazy(() => import('./features/dashboard/Dashboard'));
const Employees = React.lazy(() => import('./features/rh/Employees')); 
const Departments = React.lazy(() => import('./features/rh/Departments'));
const Presence = React.lazy(() => import('./features/rh/Presence'));
const Leaves = React.lazy(() => import('./features/rh/Leaves'));
const Performance = React.lazy(() => import('./features/rh/Performance'));
const EmployeeDetail = React.lazy(() => import('./features/rh/EmployeeDetail'));
const Treasury = React.lazy(() => import('./features/finance/Treasury'));
const Invoices = React.lazy(() => import('./features/finance/Invoices'));
const Expenses = React.lazy(() => import('./features/finance/Expenses'));
const Accounting = React.lazy(() => import('./features/finance/Accounting'));
const Stock = React.lazy(() => import('./features/stock/Stock'));
const Projects = React.lazy(() => import('./features/projects/Projects'));
const Documents = React.lazy(() => import('./features/documents/Documents'));
const Students = React.lazy(() => import('./features/students/Students'));
const Teachers = React.lazy(() => import('./features/teachers/Teachers'));
const Schedule = React.lazy(() => import('./features/schedule/Schedule'));
const Grades = React.lazy(() => import('./features/grades/Grades'));
const Roles = React.lazy(() => import('./features/roles/Roles'));
const Audit = React.lazy(() => import('./features/audit/Audit'));
const Settings = React.lazy(() => import('./features/settings/Settings'));
const AIAnalytics = React.lazy(() => import('./features/ai/AIAnalytics'));

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
    <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 4 }}>Nexus ERP</div>
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

        {/* RH Routes */}
        <Route path="/rh/employees" element={<Suspense fallback={<LoadingFallback />}><Employees /></Suspense>} />
        <Route path="/rh/employees/:id" element={<Suspense fallback={<LoadingFallback />}><EmployeeDetail /></Suspense>} />
        <Route path="/rh/departments" element={<Suspense fallback={<LoadingFallback />}><Departments /></Suspense>} />
        <Route path="/rh/presence" element={<Suspense fallback={<LoadingFallback />}><Presence /></Suspense>} />
        <Route path="/rh/leaves" element={<Suspense fallback={<LoadingFallback />}><Leaves /></Suspense>} />
        <Route path="/rh/performance" element={<Suspense fallback={<LoadingFallback />}><Performance /></Suspense>} />

        {/* Finance Routes */}
        <Route path="/finance/treasury" element={<Suspense fallback={<LoadingFallback />}><Treasury /></Suspense>} />
        <Route path="/finance/invoices" element={<Suspense fallback={<LoadingFallback />}><Invoices /></Suspense>} />
        <Route path="/finance/expenses" element={<Suspense fallback={<LoadingFallback />}><Expenses /></Suspense>} />
        <Route path="/finance/accounting" element={<Suspense fallback={<LoadingFallback />}><Accounting /></Suspense>} />

        {/* Operations Routes */}
        <Route path="/stock" element={<Suspense fallback={<LoadingFallback />}><Stock /></Suspense>} />
        <Route path="/projects" element={<Suspense fallback={<LoadingFallback />}><Projects /></Suspense>} />
        <Route path="/documents" element={<Suspense fallback={<LoadingFallback />}><Documents /></Suspense>} />

        {/* Formation Routes */}
        <Route path="/formation/students" element={<Suspense fallback={<LoadingFallback />}><Students /></Suspense>} />
        <Route path="/formation/teachers" element={<Suspense fallback={<LoadingFallback />}><Teachers /></Suspense>} />
        <Route path="/formation/schedule" element={<Suspense fallback={<LoadingFallback />}><Schedule /></Suspense>} />
        <Route path="/formation/grades" element={<Suspense fallback={<LoadingFallback />}><Grades /></Suspense>} />

        {/* System Routes */}
        <Route path="/system/roles" element={<Suspense fallback={<LoadingFallback />}><Roles /></Suspense>} />
        <Route path="/system/audit" element={<Suspense fallback={<LoadingFallback />}><Audit /></Suspense>} />
        <Route path="/system/settings" element={<Suspense fallback={<LoadingFallback />}><Settings /></Suspense>} />
        <Route path="/system/ai" element={<Suspense fallback={<LoadingFallback />}><AIAnalytics /></Suspense>} />
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
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;

