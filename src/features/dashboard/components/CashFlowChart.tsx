// Cash Flow Chart Component - Flux de Trésorerie
import React, { useState, useEffect } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../../contexts/ThemeContext';
import { formatCurrency } from '../../../services/dashboardService';
import dashboardService from '../../../services/dashboardService';
import type { CashFlowDataPoint } from '../../../services/dashboardService';

const CashFlowChart: React.FC = () => {
  const { isDark } = useTheme();
  const [cashFlowData, setCashFlowData] = useState<CashFlowDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCashFlow = async () => {
      try {
        const data = await dashboardService.getCashFlow();
        setCashFlowData(data);
      } catch (error) {
        console.error('Error fetching cash flow data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCashFlow();
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
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
          💰 Flux de Trésorerie
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
          💰 Flux de Trésorerie
        </h3>
        <p style={{ fontSize: 11, color: isDark ? '#64748b' : '#94a3b8' }}>
          Entrées · Sorties · Solde cumulé
        </p>
      </div>

      {cashFlowData.length === 0 ? (
        <div style={{
          height: 200,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: isDark ? '#64748b' : '#94a3b8',
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>💰</div>
          <div style={{ fontSize: 12 }}>Aucune donnée disponible</div>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <ComposedChart data={cashFlowData}>
              <defs>
                <linearGradient id="gBalance" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
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
              <Bar
                dataKey="incomes"
                fill="#3ecf8e"
                radius={[4, 4, 0, 0]}
                barSize={16}
                name="Entrées"
              />
              <Bar
                dataKey="expenses"
                fill="#e05050"
                radius={[4, 4, 0, 0]}
                barSize={16}
                name="Sorties"
              />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#2dd4bf"
                strokeWidth={2.5}
                dot={{ fill: '#2dd4bf', r: 4, strokeWidth: 2, stroke: isDark ? '#1e293b' : 'white' }}
                name="Solde"
              />
            </ComposedChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 16, marginTop: 12, paddingTop: 12, borderTop: `1px solid ${isDark ? '#334155' : '#f1f5f9'}` }}>
            {[
              { color: '#3ecf8e', label: 'Entrées' },
              { color: '#e05050', label: 'Sorties' },
              { color: '#2dd4bf', label: 'Solde' },
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

export default CashFlowChart;
