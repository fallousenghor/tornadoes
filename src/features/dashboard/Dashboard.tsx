// Simplified Professional Dashboard - Clean, Modern, Responsive Design
// 4 KPIs + Revenue Chart + CashFlow Chart + Presence Chart
// Fixed TS errors, beautiful gradients, shadows, animations

import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store';
import { useTheme } from '../../contexts/ThemeContext';
import KPICard from './components/KPICard';
import RevenueChart from './components/RevenueChart';
import PresenceChart from './components/PresenceChart';
import CashFlowChart from './components/CashFlowChart';
import dashboardService from '../../services/dashboardService';
import type { KPI } from '@/types';
import { Spacing, BorderRadius } from '../../constants/theme';

const Dashboard: React.FC = () => {
  const { colors } = useTheme();
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        setLoading(true);
        const data = await dashboardService.getKPIs();
        setKpis(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching KPIs:', err);
        setError('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };
    fetchKPIs();
  }, []);

  const sectionTitleStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color: colors.textMuted,
    fontFamily: "'DM Sans', sans-serif",
    marginBottom: 20,
    marginTop: 32,
    padding: '12px 20px',
    background: `linear-gradient(90deg, ${colors.primary || '#64748b'}20, ${colors.accent || '#64748b'}10)`,
    borderRadius: BorderRadius.lg,
    border: `1px solid ${colors.border || '#e2e8f0'}20`,
    boxShadow: `0 4px 12px ${(colors.primary || '#64748b')}10`,
  };

  const containerStyle = {
    background: colors.card || '#f8fafc',
    minHeight: '100vh',
    padding: '24px',
    fontFamily: "'DM Sans', sans-serif",
  };

  const cardContainerStyle = {
    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
    borderRadius: BorderRadius.xxl as any,
    overflow: 'hidden',
    transition: 'all 0.3s ease',
  };

  if (loading) {
    return (
      <div style={{...containerStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', color: colors.textMuted || '#64748b', fontSize: 16 }}>
        Chargement du tableau de bord...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{...containerStyle, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: colors.danger || '#ef4444', gap: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 600 }}>{error}</div>
        <button 
          onClick={() => window.location.reload()} 
          style={{
            padding: '12px 24px',
            background: colors.primary || '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .dashboard-animate {
          animation: fadeUp 0.6s ease forwards;
        }
        .kpi-container {
          animation-delay: 0.1s;
        }
        .finance-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 24px;
        }
        @media (max-width: 1200px) {
          .finance-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* Hero KPIs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 20,
        marginBottom: 32,
      }}>
        {kpis.slice(0, 4).map((k, i) => (
          <div key={k.id} className="dashboard-animate kpi-container" style={{ '--i': i } as React.CSSProperties}>
            <KPICard
              label={k.label}
              value={k.value as string}
              change={k.change}
              icon={k.icon}
              color={k.color}
              sparkData={k.sparklineData || []}
              index={i}
            />
          </div>
        ))}
      </div>

      {/* Finance Section */}
      <div style={sectionTitleStyle}>
        💰 Performance Financière
      </div>
      <div className="finance-grid">
        <div style={cardContainerStyle}>
          <RevenueChart />
        </div>
        <div style={cardContainerStyle}>
          <CashFlowChart />
        </div>
      </div>

      {/* HR Section */}
      <div style={sectionTitleStyle}>
        👥 Ressources Humaines
      </div>
      <div style={{ 
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)', 
        borderRadius: BorderRadius.xxl as any, 
        overflow: 'hidden' 
      }}>
        <PresenceChart />
      </div>
    </div>
  );
};

export default Dashboard;

