// Stock Chart Component - Stock & Matériel
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button, ProgressBar, SectionTitle } from '../../../components/common';
import { Colors } from '../../../constants/theme';
import { stockItems } from '../../../data/mockData';

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

export const StockChart: React.FC = () => {
  return (
    <div style={{
      background: Colors.card,
      border: `1px solid ${Colors.border}`,
      borderRadius: 16,
      padding: 24,
    }}>
      <SectionTitle icon="◈" title="Stock & Matériel" sub="Inventaire · Attribution · Alertes" />
      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={stockItems} layout="vertical" barSize={10}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,140,255,0.05)" horizontal={false} />
          <XAxis type="number" tick={{ fill: '#3a4560', fontSize: 9 }} axisLine={false} tickLine={false} />
          <YAxis dataKey="category" type="category" tick={{ fill: '#5a6480', fontSize: 9, fontFamily: "'DM Sans',sans-serif" }} axisLine={false} tickLine={false} width={80} />
          <Tooltip {...tooltipStyle} />
          <Bar dataKey="available" fill="#3ecf8e" radius={[0,3,3,0]} name="Disponible" />
          <Bar dataKey="assigned" fill="#6490ff" radius={[0,3,3,0]} name="Assigné" />
        </BarChart>
      </ResponsiveContainer>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 10 }}>
        {[
          { l: 'Total articles', v: '518', c: Colors.text },
          { l: 'Disponible', v: '369', c: Colors.green },
          { l: 'Assigné', v: '149', c: Colors.accent }
        ].map(s => (
          <div key={s.l} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 7, padding: '8px 10px', textAlign: 'center' }}>
            <div style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 16, color: s.c }}>{s.v}</div>
            <div style={{ fontSize: 8, color: Colors.textDim, fontFamily: "'DM Sans',sans-serif", marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(251,146,60,0.06)',
        borderRadius: 8, border: '1px solid rgba(251,146,60,0.15)',
        display: 'flex', alignItems: 'center', gap: 8 }}>
        <span>⚠️</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: Colors.orange, fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>Alertes Maintenance</div>
          <div style={{ fontSize: 9, color: Colors.textMuted, fontFamily: "'DM Sans',sans-serif" }}>5 équipements en maintenance prévue · 2 items en rupture</div>
        </div>
        <Button variant="ghost" size="sm">Gérer</Button>
      </div>
    </div>
  );
};

export default StockChart;

