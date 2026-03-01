// Cash Flow Chart Component - Flux de Trésorerie
import React from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SectionTitle } from '../../../components/common';
import { Colors } from '../../../constants/theme';
import { formatCurrency } from '../../../utils';
import { cashFlowData } from '../../../data/mockData';

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

export const CashFlowChart: React.FC = () => {
  return (
    <div style={{
      background: Colors.card,
      border: `1px solid ${Colors.border}`,
      borderRadius: 16,
      padding: 24,
    }}>
      <SectionTitle icon="◆" title="Flux de Trésorerie" sub="Entrées · Sorties · Solde cumulé" />
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={cashFlowData}>
          <defs>
            <linearGradient id="gSolde" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,140,255,0.05)" />
          <XAxis dataKey="month" tick={{ fill: '#3a4560', fontSize: 9 }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={(v: number) => `${(v/1000).toFixed(0)}K`} tick={{ fill: '#3a4560', fontSize: 9 }} axisLine={false} tickLine={false} />
          <Tooltip {...tooltipStyle} formatter={(v: number) => formatCurrency(v)} />
          <Bar dataKey="incomes" fill="#3ecf8e" opacity={0.8} radius={[3,3,0,0]} barSize={14} name="Entrées" />
          <Bar dataKey="expenses" fill="#e05050" opacity={0.7} radius={[3,3,0,0]} barSize={14} name="Sorties" />
          <Line type="monotone" dataKey="balance" stroke="#2dd4bf" strokeWidth={2.5} dot={{ fill: '#2dd4bf', r: 3 }} name="Solde" />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CashFlowChart;

