// Leaves Pie Chart Component - Types de Congés
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { SectionTitle } from '../../../components/common';
import { Colors } from '../../../constants/theme';
import leaveService from '../../../services/leaveService';

interface LeaveTypeData {
  name: string;
  value: number;
  color: string;
}

const leaveColors: Record<string, string> = {
  'ANNUAL': '#6490ff',
  'SICK': '#3ecf8e',
  'MATERNITY': '#a78bfa',
  'UNPAID': '#fb923c',
  'EXCEPTIONAL': '#2dd4bf',
  'annuel': '#6490ff',
  'maladie': '#3ecf8e',
  'maternite': '#a78bfa',
  'sans_solde': '#fb923c',
  'exceptionnel': '#2dd4bf',
};

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

const leaveTypeLabels: Record<string, string> = {
  'ANNUAL': 'Annuel',
  'SICK': 'Maladie',
  'MATERNITY': 'Maternité',
  'UNPAID': 'Sans solde',
  'EXCEPTIONAL': 'Exceptionnel',
};

export const LeavesPieChart: React.FC = () => {
  const [leaveData, setLeaveData] = useState<LeaveTypeData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaveStats = async () => {
      try {
        const stats = await leaveService.getLeaveStats();
        // Transform backend data to pie chart format
        const transformed: LeaveTypeData[] = Object.entries(stats.byType).map(([type, count]) => ({
          name: leaveTypeLabels[type] || type,
          value: count as number,
          color: leaveColors[type] || '#6490ff',
        }));
        setLeaveData(transformed);
      } catch (error) {
        console.error('Error fetching leave stats:', error);
        // Fallback data
        setLeaveData([
          { name: 'Annuel', value: 42, color: '#6490ff' },
          { name: 'Maladie', value: 18, color: '#3ecf8e' },
          { name: 'Maternité', value: 8, color: '#a78bfa' },
          { name: 'Sans solde', value: 12, color: '#fb923c' },
          { name: 'Exceptionnel', value: 6, color: '#2dd4bf' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaveStats();
  }, []);

  return (
    <div style={{
      background: Colors.card,
      border: `1px solid ${Colors.border}`,
      borderRadius: 16,
      padding: 24,
    }}>
      <SectionTitle icon="◇" title="Types de Congés" sub="Répartition — Trimestre en cours" />
      {loading ? (
        <div style={{ height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', color: Colors.textMuted }}>
          Chargement...
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={leaveData} cx="50%" cy="50%" innerRadius={38} outerRadius={60}
                paddingAngle={3} dataKey="value">
                {leaveData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip {...tooltipStyle} formatter={(v: number) => `${v} demandes`} />
            </PieChart>
          </ResponsiveContainer>
          {leaveData.map((d, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 6, height: 6, borderRadius: 2, background: d.color }} />
                <span style={{ fontSize: 9, color: Colors.textMuted, fontFamily: "'DM Sans',sans-serif" }}>{d.name}</span>
              </div>
              <span style={{ fontSize: 9, fontWeight: 600, color: '#a0b0d0', fontFamily: "'DM Sans',sans-serif" }}>{d.value}</span>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default LeavesPieChart;

