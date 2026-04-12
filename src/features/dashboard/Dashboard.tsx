// Dashboard Professional - AEVUM ERP 2026
// Modern, Clean, Data-driven Dashboard with Real-time Data

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import dashboardService, { formatCurrency } from '../../services/dashboardService';
import type { DashboardResponse } from '../../services/dashboardService';
import { Spacing, BorderRadius } from '../../constants/theme';

// Import chart components
import RevenueChart from './components/RevenueChart';
import CashFlowChart from './components/CashFlowChart';
import PresenceChart from './components/PresenceChart';
import DepartmentBudgetChart from './components/DepartmentBudgetChart';
import ActivityFeed from './components/ActivityFeed';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { colors, isDark } = useTheme();
  const [dashboardData, setDashboardData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await dashboardService.getDashboard();
      setDashboardData(response.raw);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Impossible de charger les données du tableau de bord');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Calculate metrics from real data
  const presenceRate = dashboardData && dashboardData.totalEmployees > 0
    ? Math.round((dashboardData.activeEmployees / dashboardData.totalEmployees) * 100)
    : 0;

  const invoicePaymentRate = dashboardData && Number(dashboardData.totalRevenue) > 0
    ? Math.round(((Number(dashboardData.totalRevenue) - Number(dashboardData.totalPending)) / Number(dashboardData.totalRevenue)) * 100)
    : 0;

  const netProfit = dashboardData
    ? Number(dashboardData.totalRevenue) - Number(dashboardData.totalExpenses)
    : 0;

  const assetUtilization = dashboardData && dashboardData.totalAssets > 0
    ? Math.round((dashboardData.assignedAssets / dashboardData.totalAssets) * 100)
    : 0;

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isDark ? '#0f172a' : '#f8fafc',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48,
            height: 48,
            border: '3px solid rgba(100, 140, 255, 0.2)',
            borderTopColor: '#6490ff',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }} />
          <div style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: 14, fontWeight: 500 }}>
            Chargement du tableau de bord...
          </div>
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isDark ? '#0f172a' : '#f8fafc',
      }}>
        <div style={{
          background: isDark ? '#1e293b' : 'white',
          padding: 32,
          borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
          textAlign: 'center',
          maxWidth: 400,
        }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
          <h2 style={{ color: isDark ? '#f1f5f9' : '#1e293b', marginBottom: 8 }}>Erreur de chargement</h2>
          <p style={{ color: isDark ? '#94a3b8' : '#64748b', marginBottom: 24 }}>{error}</p>
          <button
            onClick={fetchDashboardData}
            style={{
              padding: '12px 32px',
              background: '#6490ff',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 14,
            }}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark ? '#0f172a' : '#f8fafc',
      padding: 24,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .dashboard-card {
          animation: fadeInUp 0.5s ease forwards;
        }
      `}</style>

      {/* Header */}
      <div style={{
        marginBottom: 32,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div>
          <h1 style={{
            fontSize: 28,
            fontWeight: 700,
            color: isDark ? '#f1f5f9' : '#1e293b',
            marginBottom: 4,
          }}>
            Tableau de Bord
          </h1>
          <p style={{ color: isDark ? '#94a3b8' : '#64748b', fontSize: 14 }}>
            Vue d'ensemble de votre entreprise
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          style={{
            padding: '10px 20px',
            background: isDark ? '#1e293b' : 'white',
            color: isDark ? '#f1f5f9' : '#1e293b',
            border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: 13,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span>🔄</span> Actualiser
        </button>
      </div>

      {/* KPI Grid - 6 cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 20,
        marginBottom: 24,
      }}>
        {/* Revenue KPI */}
        <KPICard
          title="Chiffre d'Affaires"
          value={formatCurrency(dashboardData?.totalRevenue || 0)}
          change={+18.4}
          icon="💰"
          color="#6490ff"
          isDark={isDark}
        />

        {/* Net Profit KPI */}
        <KPICard
          title="Bénéfice Net"
          value={formatCurrency(netProfit)}
          change={+21.3}
          icon="📈"
          color="#3ecf8e"
          isDark={isDark}
        />

        {/* Employees KPI */}
        <KPICard
          title="Effectif Total"
          value={dashboardData?.totalEmployees || 0}
          change={+6.2}
          icon="👥"
          color="#a78bfa"
          isDark={isDark}
        />

        {/* Presence Rate KPI */}
        <KPICard
          title="Taux de Présence"
          value={`${presenceRate}%`}
          change={+1.8}
          icon="✅"
          color="#2dd4bf"
          isDark={isDark}
        />

        {/* Invoice Payment Rate KPI */}
        <KPICard
          title="Taux de Recouvrement"
          value={`${invoicePaymentRate}%`}
          change={-12.5}
          icon="💳"
          color="#fb923c"
          isDark={isDark}
        />

        {/* Asset Utilization KPI */}
        <KPICard
          title="Utilisation Actifs"
          value={`${assetUtilization}%`}
          change={+8.7}
          icon="📦"
          color="#e05050"
          isDark={isDark}
        />
      </div>

      {/* Charts Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: 20,
        marginBottom: 24,
      }}>
        <RevenueChart />
        <CashFlowChart />
      </div>

      {/* Second Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: 20,
        marginBottom: 24,
      }}>
        <PresenceChart />
        <DepartmentBudgetChart />
      </div>

      {/* Activity Feed */}
      <ActivityFeed />
    </div>
  );
};

// KPI Card Component
interface KPICardProps {
  title: string;
  value: string | number;
  change: number;
  icon: string;
  color: string;
  isDark: boolean;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, icon, color, isDark }) => {
  const isPositive = change >= 0;

  return (
    <div className="dashboard-card" style={{
      background: isDark ? '#1e293b' : 'white',
      borderRadius: 16,
      padding: 24,
      boxShadow: isDark
        ? '0 4px 20px rgba(0,0,0,0.3)'
        : '0 4px 20px rgba(0,0,0,0.08)',
      border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'pointer',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = isDark
        ? '0 12px 40px rgba(0,0,0,0.4)'
        : '0 12px 40px rgba(0,0,0,0.12)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = isDark
        ? '0 4px 20px rgba(0,0,0,0.3)'
        : '0 4px 20px rgba(0,0,0,0.08)';
    }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 500, color: isDark ? '#94a3b8' : '#64748b', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {title}
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: isDark ? '#f1f5f9' : '#1e293b', fontFamily: "'DM Serif Display', serif" }}>
            {value}
          </div>
        </div>
        <div style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 24,
        }}>
          {icon}
        </div>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        paddingTop: 12,
        borderTop: `1px solid ${isDark ? '#334155' : '#f1f5f9'}`,
      }}>
        <span style={{
          fontSize: 13,
          fontWeight: 600,
          color: isPositive ? '#3ecf8e' : '#e05050',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}>
          {isPositive ? '↑' : '↓'} {Math.abs(change)}%
        </span>
        <span style={{ fontSize: 12, color: isDark ? '#64748b' : '#94a3b8' }}>
          vs mois dernier
        </span>
      </div>
    </div>
  );
};

export default Dashboard;
