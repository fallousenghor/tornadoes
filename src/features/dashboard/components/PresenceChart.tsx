// Presence Chart Component - Présence Hebdomadaire
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SectionTitle } from '../../../components/common';
import { Colors } from '../../../constants/theme';
import { presenceData } from '../../../data/mockData';

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

export const PresenceChart: React.FC = () => {
  return (
    <div style={{
      background: Colors.card,
      border: `1px solid ${Colors.border}`,
      borderRadius: 16,
      padding: 24,
    }}>
      <SectionTitle icon="◎" title="Présence Hebdomadaire" sub="Présents · Absents · Retards" />
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={presenceData} barSize={14}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,140,255,0.05)" vertical={false} />
          <XAxis dataKey="jour" tick={{ fill: '#3a4560', fontSize: 9 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: '#3a4560', fontSize: 9 }} axisLine={false} tickLine={false} />
          <Tooltip {...tooltipStyle} />
          <Bar dataKey="presents" fill="#3ecf8e" radius={[3,3,0,0]} name="Présents" />
          <Bar dataKey="absents" fill="#e05050" radius={[3,3,0,0]} name="Absents" />
          <Bar dataKey="retards" fill="#fb923c" radius={[3,3,0,0]} name="Retards" />
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 10 }}>
        {[
          { l: 'Présents moy.', v: '86', c: Colors.green },
          { l: 'Absents moy.', v: '9', c: Colors.red },
          { l: 'Retards moy.', v: '5', c: Colors.orange }
        ].map(s => (
          <div key={s.l} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 7, padding: 8, textAlign: 'center' }}>
            <div style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 16, color: s.c }}>{s.v}</div>
            <div style={{ fontSize: 8, color: Colors.textDim, fontFamily: "'DM Sans',sans-serif", marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PresenceChart;

