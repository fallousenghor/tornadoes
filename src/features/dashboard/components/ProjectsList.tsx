// Projects List Component - Projets en Cours
import React from 'react';
import { Button, ProgressBar, SectionTitle } from '../../../components/common';
import { Colors } from '../../../constants/theme';
import { projectsData } from '../../../data/mockData';

export const ProjectsList: React.FC = () => {
  return (
    <div style={{
      background: Colors.card,
      border: `1px solid ${Colors.border}`,
      borderRadius: 16,
      padding: 24,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <SectionTitle icon="▣" title="Projets en Cours" sub="Avancement & Délais" />
        <Button variant="primary" size="sm">+ Nouveau</Button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {projectsData.map((p, i) => (
          <div key={i} style={{ padding: '12px', borderRadius: 9,
            background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(100,140,255,0.07)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 600, color: Colors.text,
                  fontFamily: "'DM Sans',sans-serif" }}>{p.name}</span>
                <span style={{ marginLeft: 8, fontSize: 8, padding: '2px 6px', borderRadius: 99,
                  background: p.priority === 'critique' ? 'rgba(224,80,80,0.15)' : p.priority === 'haute' ? 'rgba(224,80,80,0.15)' : 'rgba(100,140,255,0.1)',
                  color: p.priority === 'critique' ? Colors.red : p.priority === 'haute' ? Colors.red : Colors.accent,
                  fontFamily: "'DM Sans',sans-serif" }}>{p.priority}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 9, color: Colors.textDim, fontFamily: "'DM Sans',sans-serif" }}>
                  📅 {p.deadline.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                </span>
                <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 99,
                  background: 'rgba(100,140,255,0.08)', color: Colors.textMuted,
                  fontFamily: "'DM Sans',sans-serif" }}>
                  {p.status === 'en_cours' ? 'En cours' : p.status === 'demarrage' ? 'Démarrage' : p.status === 'finalisation' ? 'Finalisation' : 'Terminé'}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <ProgressBar 
                  value={p.progress}
                  color={p.progress >= 80 ? Colors.green : p.progress >= 50 ? Colors.accent : Colors.orange} 
                />
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, color: Colors.text,
                fontFamily: "'DM Serif Display',Georgia,serif", minWidth: 32 }}>{p.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsList;

