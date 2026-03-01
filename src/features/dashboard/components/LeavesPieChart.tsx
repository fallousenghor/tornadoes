// Leaves Pie Chart Component - Types de Congés
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { SectionTitle } from '../../../components/common';
import { Colors } from '../../../constants/theme';
import { leaveData } from '../../../data/mockData';

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

export const LeavesPieChart: React.FC = () => {
  return (
    <div style={{
      background: Colors.card,
      border: `1px solid ${Colors.border}`,
      borderRadius: 16,
      padding: 24,
    }}>
      <SectionTitle icon="◇" title="Types de Congés" sub="Répartition — Trimestre en cours" />
      <ResponsiveContainer width="100%" height={140}>
        <PieChart>
          <Pie data={leaveData} cx="50%" cy="50%" innerRadius={38} outerRadius={60}
            paddingAngle={3} dataKey="value">
            {leaveData.map((d, i) => <Cell key={i} fill={d.color} />)}
          </Pie>
          <Tooltip {...tooltipStyle} formatter={(v: number) => `${v} demandes`} />
        </PieChart>
      </ResponsiveContainer>
      {leaveData.map((d, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: 2, background: d.color }} />
            <span style={{ fontSize: 9, color: Colors.textMuted, fontFamily: "'DM Sans',sans-serif" }}>{d.name}</span>
          </div>
          <span style={{ fontSize: 9, fontWeight: 600, color: '#a0b0d0', fontFamily: "'DM Sans',sans-serif" }}>{d.value}</span>
        </div>
      ))}
    </div>
  );
};

export default LeavesPieChart;

