// Dashboard KPI Card Component
import React from 'react';
import { StatBadge } from '../../../components/common';
import { Sparkline } from '../../../components/charts';
import { Colors, BorderRadius, Spacing } from '../../../constants/theme';

interface KPICardProps {
  label: string;
  value: string;
  change: number;
  icon: string;
  color: string;
  sparkData: number[];
  index: number;
}

const cardStyle = {
  background: Colors.card,
  border: `1px solid ${Colors.border}`,
  borderRadius: BorderRadius.xxl,
  padding: Spacing.xxl,
} as React.CSSProperties;

const KPICard: React.FC<KPICardProps> = ({ label, value, change, icon, color, sparkData, index }) => {
  return (
    <div 
      style={{ 
        ...cardStyle, 
        position: 'relative',
        overflow: 'hidden',
        opacity: 0,
        animationDelay: `${index * 0.05}s`,
      }}
    >
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        borderRadius: BorderRadius.xxl,
        background: 'linear-gradient(90deg, transparent, rgba(100,140,255,0.03%), transparent)',
        backgroundSize: '200%',
      }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 7,
          background: `${color}18`, border: `1px solid ${color}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, color
        }}>{icon}</div>
        <StatBadge value={change} />
      </div>
      <div style={{ 
        fontFamily: "'DM Serif Display',Georgia,serif", 
        fontSize: 20,
        fontWeight: 700, 
        color: Colors.text, 
        marginBottom: 2 
      }}>{value}</div>
      <div style={{ fontSize: 9, color: Colors.textMuted, fontFamily: "'DM Sans',sans-serif", marginBottom: 8 }}>{label}</div>
      <Sparkline data={sparkData} color={change > 0 ? color : Colors.red} />
    </div>
  );
};

export default KPICard;

