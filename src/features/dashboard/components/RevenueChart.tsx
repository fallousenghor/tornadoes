// Revenue Chart Component - Performance Financière
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SectionTitle } from '../../../components/common';
import { Colors } from '../../../constants/theme';
import { formatCurrency } from '../../../utils';
import dashboardService from '../../../services/dashboardService';
import type { RevenueDataPoint } from '@/services/dashboardService';

const tooltipStyle = {
  contentStyle: {
    background: Colors.card,
    border: '1px solid rgba(100,140,255,0.2)',
    borderRadius: 8,
    fontSize: 11,
    fontFamily: "'DM Sans', sans-serif",
  },
  labelStyle: { color: Colors.accent },
  itemStyle: { color: Colors.textLight },
};

export const RevenueChart: React.FC = () => {
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

  return (
    <div style={{
      background: Colors.card,
      border: `1px solid ${Colors.border}`,
      borderRadius: 16,
      padding: 24,
    }}>
      <SectionTitle icon="◈" title="Performance Financière 2024" sub="Revenus · Dépenses · Bénéfice mensuel" />
      {loading ? (
        <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: Colors.textMuted }}>
          Chargement...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={revenueData}>
            <defs>
              <linearGradient id="gRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6490ff" stopOpacity={0.22} />
                <stop offset="95%" stopColor="#6490ff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gBen" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3ecf8e" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#3ecf8e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,140,255,0.06)" />
            <XAxis dataKey="month" tick={{ fill: '#3a4560', fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v: number) => `${(v/1000).toFixed(0)}K`} tick={{ fill: '#3a4560', fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip {...tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
            <Area type="monotone" dataKey="revenus" stroke="#6490ff" strokeWidth={2} fill="url(#gRev)" name="Revenus" />
            <Area type="monotone" dataKey="depenses" stroke="#e05050" strokeWidth={1.5} fill="none" strokeDasharray="4 3" name="Dépenses" />
            <Area type="monotone" dataKey="benefice" stroke="#3ecf8e" strokeWidth={2} fill="url(#gBen)" name="Bénéfice" />
          </AreaChart>
        </ResponsiveContainer>
      )}
      <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
        {[["#6490ff","Revenus"],["#e05050","Dépenses"],["#3ecf8e","Bénéfice"]].map(([c,l]) => (
          <div key={l as string} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: c as string }} />
            <span style={{ fontSize: 9, color: Colors.textDim, fontFamily: "'DM Sans',sans-serif" }}>{l as string}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueChart;

