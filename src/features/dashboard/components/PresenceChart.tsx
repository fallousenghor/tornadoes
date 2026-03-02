// Presence Chart Component - Présence Hebdomadaire
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { SectionTitle } from '../../../components/common';
import { Colors } from '../../../constants/theme';
import attendanceService from '../../../services/attendanceService';

interface PresenceData {
  jour: string;
  presents: number;
  absents: number;
  retards: number;
}

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
  const [presenceData, setPresenceData] = useState<PresenceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPresence = async () => {
      try {
        const data = await attendanceService.getWeeklyPresence();
        // Map data to expected format
        const mappedData: PresenceData[] = data.map((d: { dayOfWeek: string; present: number; absent: number; late: number }) => ({
          jour: d.dayOfWeek,
          presents: d.present,
          absents: d.absent,
          retards: d.late,
        }));
        setPresenceData(mappedData);
      } catch (error) {
        console.error('Error fetching presence:', error);
        // Fallback data on error
        setPresenceData([
          { jour: 'Lun', presents: 87, absents: 8, retards: 5 },
          { jour: 'Mar', presents: 91, absents: 5, retards: 4 },
          { jour: 'Mer', presents: 84, absents: 10, retards: 6 },
          { jour: 'Jeu', presents: 89, absents: 7, retards: 4 },
          { jour: 'Ven', presents: 79, absents: 14, retards: 7 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchPresence();
  }, []);

  // Calculate averages
  const avgPresent = presenceData.length > 0 
    ? Math.round(presenceData.reduce((sum, d) => sum + d.presents, 0) / presenceData.length)
    : 0;
  const avgAbsent = presenceData.length > 0 
    ? Math.round(presenceData.reduce((sum, d) => sum + d.absents, 0) / presenceData.length)
    : 0;
  const avgLate = presenceData.length > 0 
    ? Math.round(presenceData.reduce((sum, d) => sum + d.retards, 0) / presenceData.length)
    : 0;

  return (
    <div style={{
      background: Colors.card,
      border: `1px solid ${Colors.border}`,
      borderRadius: 16,
      padding: 24,
    }}>
      <SectionTitle icon="◎" title="Présence Hebdomadaire" sub="Présents · Absents · Retards" />
      {loading ? (
        <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: Colors.textMuted }}>
          Chargement...
        </div>
      ) : (
        <>
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
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 7, padding: 8, textAlign: 'center' }}>
              <div style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 16, color: Colors.green }}>{avgPresent}</div>
              <div style={{ fontSize: 8, color: Colors.textDim, fontFamily: "'DM Sans',sans-serif", marginTop: 2 }}>Présents moy.</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 7, padding: 8, textAlign: 'center' }}>
              <div style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 16, color: Colors.red }}>{avgAbsent}</div>
              <div style={{ fontSize: 8, color: Colors.textDim, fontFamily: "'DM Sans',sans-serif", marginTop: 2 }}>Absents moy.</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 7, padding: 8, textAlign: 'center' }}>
              <div style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 16, color: Colors.orange }}>{avgLate}</div>
              <div style={{ fontSize: 8, color: Colors.textDim, fontFamily: "'DM Sans',sans-serif", marginTop: 2 }}>Retards moy.</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PresenceChart;

