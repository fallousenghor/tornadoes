// Budget by Department Component
import React from 'react';
import { SectionTitle, ProgressBar } from '../../../components/common';
import { Colors } from '../../../constants/theme';
import { formatCurrency } from '../../../utils';
import { deptPerformance } from '../../../data/mockData';

export const BudgetByDepartment: React.FC = () => {
  return (
    <div style={{
      background: Colors.card,
      border: `1px solid ${Colors.border}`,
      borderRadius: 16,
      padding: 24,
    }}>
      <SectionTitle icon="▦" title="Budget par Département" sub="Alloué vs Dépensé" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {deptPerformance.map((d, i) => (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 10, color: Colors.textMuted, fontFamily: "'DM Sans',sans-serif", fontWeight: 500 }}>{d.name}</span>
              <span style={{ fontSize: 9, color: Colors.textDim, fontFamily: "'DM Sans',sans-serif" }}>
                {formatCurrency(d.spent)} / {formatCurrency(d.budget)}
              </span>
            </div>
            <ProgressBar 
              value={Math.round(d.spent/d.budget*100)}
              color={d.spent/d.budget > 0.9 ? Colors.orange : d.spent/d.budget > 0.8 ? Colors.accent : Colors.green} 
            />
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, padding: '10px', background: 'rgba(100,140,255,0.06)',
        borderRadius: 8, border: '1px solid rgba(100,140,255,0.1)' }}>
        <div style={{ fontSize: 9, color: Colors.textDim, fontFamily: "'DM Sans',sans-serif", marginBottom: 2 }}>Budget Total Alloué</div>
        <div style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 20, color: Colors.text }}>765 000 €</div>
        <div style={{ fontSize: 9, color: Colors.green, fontFamily: "'DM Sans',sans-serif" }}>▲ Utilisé à 82,5%</div>
      </div>
    </div>
  );
};

export default BudgetByDepartment;

