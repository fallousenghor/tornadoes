// Presence Chart Component - Présence Hebdomadaire
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../../../contexts/ThemeContext';
import attendanceService from '../../../services/attendanceService';

interface PresenceData {
  jour: string;
  presents: number;
  absents: number;
  retards: number;
}

const PresenceChart: React.FC = () => {
  const { isDark } = useTheme();
  const [presenceData, setPresenceData] = useState<PresenceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPresence = async () => {
      try {
        const data = await attendanceService.getWeeklyPresence();
        const mappedData: PresenceData[] = data.map((d: any) => ({
          jour: d.dayOfWeek,
          presents: d.present,
          absents: d.absent,
          retards: d.late,
        }));
        setPresenceData(mappedData);
      } catch (error) {
        console.error('Error fetching presence:', error);
        setPresenceData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPresence();
  }, []);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          background: isDark ? '#1e293b' : 'white',
          border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
          borderRadius: 8,
          padding: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: isDark ? '#f1f5f9' : '#1e293b', marginBottom: 8 }}>
            {label}
          </div>
          {payload.map((entry: any, index: number) => (
            <div key={index} style={{
              fontSize: 11,
              color: entry.color,
              marginBottom: index < payload.length - 1 ? 4 : 0,
              display: 'flex',
              justifyContent: 'space-between',
              gap: 16,
            }}>
              <span>{entry.name}:</span>
              <span style={{ fontWeight: 600 }}>{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

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

  if (loading) {
    return (
      <div style={{
        background: isDark ? '#1e293b' : 'white',
        borderRadius: 16,
        padding: 24,
        border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
      }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#f1f5f9' : '#1e293b', marginBottom: 16 }}>
          ✅ Présence Hebdomadaire
        </h3>
        <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDark ? '#64748b' : '#94a3b8' }}>
          Chargement...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: isDark ? '#1e293b' : 'white',
      borderRadius: 16,
      padding: 24,
      border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
      boxShadow: isDark
        ? '0 4px 20px rgba(0,0,0,0.3)'
        : '0 4px 20px rgba(0,0,0,0.08)',
    }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#f1f5f9' : '#1e293b', marginBottom: 4 }}>
          ✅ Présence Hebdomadaire
        </h3>
        <p style={{ fontSize: 11, color: isDark ? '#64748b' : '#94a3b8' }}>
          Présents · Absents · Retards
        </p>
      </div>

      {presenceData.length === 0 ? (
        <div style={{
          height: 160,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: isDark ? '#64748b' : '#94a3b8',
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📅</div>
          <div style={{ fontSize: 12 }}>Aucune donnée de présence</div>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={presenceData} barSize={16}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={isDark ? '#334155' : '#e2e8f0'}
                vertical={false}
              />
              <XAxis
                dataKey="jour"
                tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="presents" fill="#3ecf8e" radius={[4, 4, 0, 0]} name="Présents" />
              <Bar dataKey="absents" fill="#e05050" radius={[4, 4, 0, 0]} name="Absents" />
              <Bar dataKey="retards" fill="#fb923c" radius={[4, 4, 0, 0]} name="Retards" />
            </BarChart>
          </ResponsiveContainer>

          {/* Summary Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 12,
            marginTop: 16,
            paddingTop: 16,
            borderTop: `1px solid ${isDark ? '#334155' : '#f1f5f9'}`,
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#3ecf8e', fontFamily: "'DM Serif Display', serif" }}>
                {avgPresent}
              </div>
              <div style={{ fontSize: 9, color: isDark ? '#64748b' : '#94a3b8', textTransform: 'uppercase', marginTop: 4 }}>
                Présents moy.
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#e05050', fontFamily: "'DM Serif Display', serif" }}>
                {avgAbsent}
              </div>
              <div style={{ fontSize: 9, color: isDark ? '#64748b' : '#94a3b8', textTransform: 'uppercase', marginTop: 4 }}>
                Absents moy.
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#fb923c', fontFamily: "'DM Serif Display', serif" }}>
                {avgLate}
              </div>
              <div style={{ fontSize: 9, color: isDark ? '#64748b' : '#94a3b8', textTransform: 'uppercase', marginTop: 4 }}>
                Retards moy.
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default PresenceChart;
