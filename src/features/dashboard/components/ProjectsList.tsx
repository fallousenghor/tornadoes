// Projects List Component - Projets en Cours
import React, { useState, useEffect } from 'react';
import { Button, ProgressBar, SectionTitle } from '../../../components/common';
import { Colors } from '../../../constants/theme';
import projectService from '../../../services/projectService';
import type { Project } from '@/types';

const priorityColors: Record<string, { bg: string; color: string }> = {
  'critique': { bg: 'rgba(224,80,80,0.15)', color: Colors.red },
  'haute': { bg: 'rgba(224,80,80,0.15)', color: Colors.red },
  'moyenne': { bg: 'rgba(100,140,255,0.1)', color: Colors.accent },
  'basse': { bg: 'rgba(100,140,255,0.1)', color: Colors.accent },
};

const statusLabels: Record<string, string> = {
  'demarrage': 'Démarrage',
  'en_cours': 'En cours',
  'finalisation': 'Finalisation',
  'termine': 'Terminé',
};

export const ProjectsList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await projectService.getProjects({ pageSize: 5 });
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

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
      {loading ? (
        <div style={{ padding: 20, textAlign: 'center', color: Colors.textMuted }}>Chargement...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {projects.map((p, i) => {
            const priorityStyle = priorityColors[p.priority] || priorityColors.moyenne;
            return (
              <div key={p.id || i} style={{ padding: '12px', borderRadius: 9,
                background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(100,140,255,0.07)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: Colors.text,
                      fontFamily: "'DM Sans',sans-serif" }}>{p.name}</span>
                    <span style={{ marginLeft: 8, fontSize: 8, padding: '2px 6px', borderRadius: 99,
                      background: priorityStyle.bg,
                      color: priorityStyle.color,
                      fontFamily: "'DM Sans',sans-serif" }}>{p.priority}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 9, color: Colors.textDim, fontFamily: "'DM Sans',sans-serif" }}>
                      📅 {p.deadline instanceof Date ? p.deadline.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : new Date(p.deadline).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </span>
                    <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 99,
                      background: 'rgba(100,140,255,0.08)', color: Colors.textMuted,
                      fontFamily: "'DM Sans',sans-serif" }}>
                      {statusLabels[p.status] || p.status}
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectsList;

