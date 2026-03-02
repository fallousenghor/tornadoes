// Programs Grid Component - Filières & Apprenants
import React, { useState, useEffect } from 'react';
import { Button, ProgressBar, SectionTitle } from '../../../components/common';
import { Colors } from '../../../constants/theme';
import programService from '../../../services/programService';
import type { Program } from '@/types';

export const ProgramsGrid: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await programService.getPrograms();
        setPrograms(response.data.slice(0, 4)); // Limit to 4 for dashboard
      } catch (error) {
        console.error('Error fetching programs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrograms();
  }, []);

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
      {loading ? (
        <div style={{ padding: 20, textAlign: 'center', color: Colors.textMuted }}>
          Chargement...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {programs.map((program, i) => (
            <div key={program.id || i} style={{ padding: '14px', borderRadius: 10,
              background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(167,139,250,0.1)' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: Colors.text,
                fontFamily: "'DM Sans',sans-serif", marginBottom: 10 }}>{program.name}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 18, color: Colors.purple }}>{program.studentsCount}</div>
                  <div style={{ fontSize: 8, color: Colors.textDim, fontFamily: "'DM Sans',sans-serif" }}>Inscrits</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 18, color: Colors.green }}>{program.activeStudents}</div>
                  <div style={{ fontSize: 8, color: Colors.textDim, fontFamily: "'DM Sans',sans-serif" }}>Actifs</div>
                </div>
              </div>
              <div style={{ marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 8, color: Colors.textDim, fontFamily: "'DM Sans',sans-serif" }}>Complétion</span>
                <span style={{ fontSize: 8, color: Colors.text, fontFamily: "'DM Sans',sans-serif" }}>{program.completionRate}%</span>
              </div>
              <ProgressBar value={program.completionRate} color={program.completionRate >= 85 ? Colors.green : Colors.purple} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProgramsGrid;

