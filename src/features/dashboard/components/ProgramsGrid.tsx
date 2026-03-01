// Programs Grid Component - Filières & Apprenants
import React from 'react';
import { Button, ProgressBar, SectionTitle } from '../../../components/common';
import { Colors } from '../../../constants/theme';
import { programsData } from '../../../data/mockData';

export const ProgramsGrid: React.FC = () => {
  return (
    <div style={{
      background: Colors.card,
      border: `1px solid ${Colors.border}`,
      borderRadius: 16,
      padding: 24,
      marginBottom: 16,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <SectionTitle icon="◉" title="Filières & Apprenants" sub="Inscriptions · Suivi · Complétion" />
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="primary" size="sm" style={{ background: Colors.purpleMuted, color: Colors.purple }}>+ Nouvelle filière</Button>
          <Button variant="secondary" size="sm">Bulletins PDF ↓</Button>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {programsData.map((a, i) => (
          <div key={i} style={{ padding: '14px', borderRadius: 10,
            background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(167,139,250,0.1)' }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: Colors.text,
              fontFamily: "'DM Sans',sans-serif", marginBottom: 10 }}>{a.filiere}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 18, color: Colors.purple }}>{a.inscrits}</div>
                <div style={{ fontSize: 8, color: Colors.textDim, fontFamily: "'DM Sans',sans-serif" }}>Inscrits</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 18, color: Colors.green }}>{a.actifs}</div>
                <div style={{ fontSize: 8, color: Colors.textDim, fontFamily: "'DM Sans',sans-serif" }}>Actifs</div>
              </div>
            </div>
            <div style={{ marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 8, color: Colors.textDim, fontFamily: "'DM Sans',sans-serif" }}>Complétion</span>
              <span style={{ fontSize: 8, color: Colors.text, fontFamily: "'DM Sans',sans-serif" }}>{a.completion}%</span>
            </div>
            <ProgressBar value={a.completion} color={a.completion >= 85 ? Colors.green : Colors.purple} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgramsGrid;

