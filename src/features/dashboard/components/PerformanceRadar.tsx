// Performance Radar Chart Component
import React, { useState, useEffect } from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { SectionTitle } from '../../../components/common';
import { Colors } from '../../../constants/theme';
import dashboardService from '../../../services/dashboardService';
import type { RadarDataPoint } from '@/services/dashboardService';

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

export const PerformanceRadar: React.FC = () => {
  const [radarData, setRadarData] = useState<RadarDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRadarData = async () => {
      try {
        const data = await dashboardService.getPerformanceRadar();
        setRadarData(data);
      } catch (error) {
        console.error('Error fetching radar data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRadarData();
  }, []);

  return (
    <div style={{
      background: Colors.card,
      border: `1px solid ${Colors.border}`,
      borderRadius: 16,
      padding: 24,
    }}>
      <SectionTitle icon="▣" title="Radar Performance" sub="Réel vs Objectif — par département" />
      {loading ? (
        <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: Colors.textMuted }}>
          Chargement...
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <RadarChart data={radarData} cx="50%" cy="50%" outerRadius={75}>
            <PolarGrid stroke="rgba(100,140,255,0.1)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#3a4560', fontSize: 8, fontFamily: "'DM Sans',sans-serif" }} />
            <PolarRadiusAxis tick={false} axisLine={false} />
            <Radar name="Réel" dataKey="A" stroke={Colors.accent} fill={Colors.accent} fillOpacity={0.15} strokeWidth={2} />
            <Radar name="Objectif" dataKey="B" stroke={Colors.gold} fill={Colors.gold} fillOpacity={0.1} strokeWidth={1.5} strokeDasharray="4 3" />
            <Tooltip {...tooltipStyle} />
          </RadarChart>
        </ResponsiveContainer>
      )}
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 6 }}>
        {[[Colors.accent,"Réel"],[Colors.gold,"Objectif"]].map(([c,l]) => (
          <div key={l as string} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: c as string }} />
            <span style={{ fontSize: 9, color: Colors.textDim, fontFamily: "'DM Sans',sans-serif" }}>{l as string}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceRadar;

