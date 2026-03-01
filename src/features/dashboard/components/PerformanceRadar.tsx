// Performance Radar Chart Component
import React from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { SectionTitle } from '../../../components/common';
import { Colors } from '../../../constants/theme';
import { radarDeptData } from '../../../data/mockData';

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

export const PerformanceRadar: React.FC = () => {
  return (
    <div style={{
      background: Colors.card,
      border: `1px solid ${Colors.border}`,
      borderRadius: 16,
      padding: 24,
    }}>
      <SectionTitle icon="▣" title="Radar Performance" sub="Réel vs Objectif — par département" />
      <ResponsiveContainer width="100%" height={200}>
        <RadarChart data={radarDeptData} cx="50%" cy="50%" outerRadius={75}>
          <PolarGrid stroke="rgba(100,140,255,0.1)" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#3a4560', fontSize: 8, fontFamily: "'DM Sans',sans-serif" }} />
          <PolarRadiusAxis tick={false} axisLine={false} />
          <Radar name="Réel" dataKey="A" stroke={Colors.accent} fill={Colors.accent} fillOpacity={0.15} strokeWidth={2} />
          <Radar name="Objectif" dataKey="B" stroke={Colors.gold} fill={Colors.gold} fillOpacity={0.1} strokeWidth={1.5} strokeDasharray="4 3" />
          <Tooltip {...tooltipStyle} />
        </RadarChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 6 }}>
        {[[Colors.accent,"Réel"],[Colors.gold,"Objectif"]].map(([c,l]) => (
          <div key={l as string} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: c as string }} />
            <span style={{ fontSize: 9, color: Colors.textDim, fontFamily: "'DM Sans',sans-serif" }}>{l as string}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceRadar;

