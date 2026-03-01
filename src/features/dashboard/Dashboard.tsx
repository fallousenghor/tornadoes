// Dashboard Feature - AEVUM Enterprise ERP
// Main dashboard component with KPIs, charts, and analytics - Theme Support

import React from 'react';
import { Sparkline } from '../../components/charts';
import { Spacing, BorderRadius } from '../../constants/theme';
import { useAppStore } from '../../store';
import { useTheme } from '../../contexts/ThemeContext';

// Import dashboard components
import { 
  KPICard, 
  AIAlerts,
  Clock,
  RevenueChart,
  BudgetByDepartment,
  PresenceChart,
  LeavesPieChart,
  PerformanceRadar,
  CashFlowChart,
  InvoicesList,
  ProjectsList,
  StockChart,
  ProgramsGrid,
  ActivityFeed,
} from './components';

// Import mock data
import { kpis } from '../../data/mockData';

// KPI Card Component with Theme Support
interface KPICardLocalProps {
  label: string;
  value: string;
  change: number;
  icon: string;
  color: string;
  sparkData: number[];
  index: number;
}

const DashboardKPICard: React.FC<KPICardLocalProps> = ({ label, value, change, icon, color, sparkData, index }) => {
  const { colors } = useTheme();
  
  const cardStyle: React.CSSProperties = {
    background: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
  };

  return (
    <div 
      className="kpi-a" 
      style={{ 
        ...cardStyle, 
        position: 'relative',
        overflow: 'hidden',
        opacity: 0,
        animationDelay: `${index * 0.05}s`,
      }}
    >
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        borderRadius: BorderRadius.xxl,
        background: 'linear-gradient(90deg, transparent, rgba(30,58,138,0.03), transparent)',
        backgroundSize: '200%',
        animation: 'sh 4s infinite',
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 7,
          background: `${color}18`, border: `1px solid ${color}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, color
        }}>{icon}</div>
        <span style={{
          padding: '3px 8px',
          borderRadius: 4,
          fontSize: 10,
          fontWeight: 600,
          background: change > 0 ? colors.successBg : colors.dangerBg,
          color: change > 0 ? colors.success : colors.danger,
        }}>
          {change > 0 ? '+' : ''}{change}%
        </span>
      </div>
      <div style={{ 
        fontFamily: "'DM Serif Display', Georgia, serif", 
        fontSize: 20,
        fontWeight: 700, 
        color: colors.text, 
        marginBottom: 2 
      }}>{value}</div>
      <div style={{ fontSize: 9, color: colors.textMuted, fontFamily: "'DM Sans', sans-serif", marginBottom: 8 }}>{label}</div>
      <Sparkline data={sparkData} color={change > 0 ? color : colors.danger} />
    </div>
  );
};

const Dashboard: React.FC = () => {
  const store = useAppStore();
  const { colors } = useTheme();

  // Animation keyframes
  const keyframes = `
    @keyframes upfade {
      from { opacity: 0; transform: translateY(12px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes sh {
      0% { background-position: -200%; }
      100% { background-position: 200%; }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
    .kpi-a {
      animation: upfade 0.5s ease forwards;
    }
  `;

  // Get AI alerts from mock data
  const aiAlerts = [
    { icon: '⚡', text: '3 nouveaux employés en attente de validation', color: colors.primaryMuted, border: colors.primaryMuted, btn: 'Voir' },
    { icon: '💰', text: 'Facture #INV-2024-156 en retard de paiement', color: colors.warningBg, border: colors.warningMuted, btn: 'Relancer' },
    { icon: '📦', text: 'Alerte stock: 5 produits en rupture', color: colors.dangerBg, border: colors.dangerMuted, btn: 'Commander' },
  ];

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{keyframes}</style>

      {/* AI Alerts */}
      <AIAlerts alerts={aiAlerts} />

      {/* Clock + KPI Grid Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 16, marginBottom: 20 }}>
        {/* Clock */}
        <Clock size="large" />
        
        {/* KPI Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {kpis.slice(0, 6).map((k, i) => (
            <DashboardKPICard
              key={k.id}
              label={k.label}
              value={k.value as string}
              change={k.change}
              icon={k.icon}
              color={k.color}
              sparkData={k.sparklineData || []}
              index={i}
            />
          ))}
        </div>
      </div>

      {/* ROW 1: Revenue + Budget */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
        <RevenueChart />
        <BudgetByDepartment />
      </div>

      {/* ROW 2: RH Section Title */}
      <div style={{ 
        fontSize: 9, 
        fontWeight: 700, 
        letterSpacing: '0.14em', 
        textTransform: 'uppercase',
        color: colors.textMuted, 
        fontFamily: "'DM Sans', sans-serif", 
        marginBottom: 12, 
        marginTop: 8 
      }}>
        👥 Ressources Humaines
      </div>

      {/* ROW 2: RH Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 16 }}>
        <PresenceChart />
        <LeavesPieChart />
        <PerformanceRadar />
      </div>

      {/* Finance Section Title */}
      <div style={{ 
        fontSize: 9, 
        fontWeight: 700, 
        letterSpacing: '0.14em', 
        textTransform: 'uppercase',
        color: colors.textMuted, 
        fontFamily: "'DM Sans', sans-serif", 
        marginBottom: 12, 
        marginTop: 8 
      }}>
        💰 Finance & Trésorerie
      </div>

      {/* Finance Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <CashFlowChart />
        <InvoicesList />
      </div>

      {/* Projects + Stock Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <ProjectsList />
        <StockChart />
      </div>

      {/* Activity Section Title */}
      <div style={{ 
        fontSize: 9, 
        fontWeight: 700, 
        letterSpacing: '0.14em', 
        textTransform: 'uppercase',
        color: colors.textMuted, 
        fontFamily: "'DM Sans', sans-serif", 
        marginBottom: 12, 
        marginTop: 8 
      }}>
        📡 Activité en Temps Réel
      </div>

      {/* Activity Feed */}
      <ActivityFeed />

      {/* Footer */}
      <div style={{ 
        padding: '12px 0', 
        borderTop: `1px solid ${colors.border}`,
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <span style={{ fontSize: 9, color: colors.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
          © 2025 Nexus ERP · Suite Entreprise · v5.0 · Architecture SOLID · JWT + RBAC
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span style={{ fontSize: 9, color: colors.textMuted, fontFamily: "'DM Sans', sans-serif" }}>
            Dernière sync : il y a 1 min
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            {['Docs API','Support','RGPD'].map(l => (
              <span 
                key={l} 
                style={{ 
                  fontSize: 9, 
                  color: colors.textMuted, 
                  cursor: 'pointer',
                  fontFamily: "'DM Sans', sans-serif" 
                }}
              >
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

