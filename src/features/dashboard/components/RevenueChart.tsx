// Revenue Chart Component - Performance Financière
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../../contexts/ThemeContext';
import { formatCurrency } from '../../../services/dashboardService';
import dashboardService from '../../../services/dashboardService';
import type { RevenueDataPoint } from '../../../services/dashboardService';

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const RevenueChart: React.FC = () => {
  const { isDark } = useTheme();
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const data = await dashboardService.getRevenueData();
        setRevenueData(data);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenueData();
  }, []);

  const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: isDark ? '#1e293b' : 'white',
          border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
          borderRadius: 8,
          padding: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          minWidth: 140,
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: isDark ? '#f1f5f9' : '#1e293b', marginBottom: 8 }}>
            {label}
          </div>
          {payload.map((entry: any, index: number) => (
            <div key={index} style={{
              fontSize: 11,
              color: entry.color,
              marginBottom: index < payload.length - 1 ? 4 : 0,
              display: 'flex',
              justifyContent: 'space-between',
              gap: 16,
            }}>
              <span>{entry.name}:</span>
              <span style={{ fontWeight: 600 }}>{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div style={{
        background: isDark ? '#1e293b' : 'white',
        borderRadius: 16,
        padding: 24,
        border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
      }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#f1f5f9' : '#1e293b', marginBottom: 16 }}>
          📈 Performance Financière
        </h3>
        <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDark ? '#64748b' : '#94a3b8' }}>
          Chargement...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: isDark ? '#1e293b' : 'white',
      borderRadius: 16,
      padding: 24,
      border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
      boxShadow: isDark
        ? '0 4px 20px rgba(0,0,0,0.3)'
        : '0 4px 20px rgba(0,0,0,0.08)',
    }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#f1f5f9' : '#1e293b', marginBottom: 4 }}>
          📈 Performance Financière
        </h3>
        <p style={{ fontSize: 11, color: isDark ? '#64748b' : '#94a3b8' }}>
          Revenus · Dépenses · Bénéfice mensuel
        </p>
      </div>

      {revenueData.length === 0 ? (
        <div style={{
          height: 200,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: isDark ? '#64748b' : '#94a3b8',
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
          <div style={{ fontSize: 12 }}>Aucune donnée disponible</div>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6490ff" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6490ff" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gBen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3ecf8e" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3ecf8e" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? '#334155' : '#e2e8f0'}
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`}
                tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="revenus"
                stroke="#6490ff"
                strokeWidth={2.5}
                fill="url(#gRev)"
                name="Revenus"
              />
              <Area
                type="monotone"
                dataKey="depenses"
                stroke="#e05050"
                strokeWidth={2}
                fill="none"
                strokeDasharray="4 3"
                name="Dépenses"
              />
              <Area
                type="monotone"
                dataKey="benefice"
                stroke="#3ecf8e"
                strokeWidth={2.5}
                fill="url(#gBen)"
                name="Bénéfice"
              />
            </AreaChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 16, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${isDark ? '#334155' : '#f1f5f9'}` }}>
            {[
              { color: '#6490ff', label: 'Revenus' },
              { color: '#e05050', label: 'Dépenses' },
              { color: '#3ecf8e', label: 'Bénéfice' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: item.color }} />
                <span style={{ fontSize: 10, color: isDark ? '#94a3b8' : '#64748b' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RevenueChart;
