// Dashboard AI Alerts Component - Theme Support
import React from 'react';
import { useTheme } from '../../../contexts/ThemeContext';

interface Alert {
  icon: string;
  text: string;
  btn: string;
  color: string;
  border: string;
}

interface AIAlertsProps {
  alerts: Alert[];
}

const AIAlerts: React.FC<AIAlertsProps> = ({ alerts }) => {
  const { colors } = useTheme();

  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
      {alerts.map((a, i) => (
        <div 
          key={i} 
          style={{ 
            flex: 1, 
            background: a.color, 
            border: `1px solid ${a.border}`,
            borderRadius: 10, 
            padding: '10px 14px', 
            display: 'flex', 
            alignItems: 'center', 
            gap: 10 
          }}
        >
          <span style={{ fontSize: 16 }}>{a.icon}</span>
          <span style={{ 
            fontSize: 10, 
            color: colors.textSecondary, 
            fontFamily: "'DM Sans', sans-serif", 
            flex: 1 
          }}>
            {a.text}
          </span>
          <button style={{ 
            padding: '4px 10px', 
            borderRadius: 5, 
            border: 'none',
            background: colors.primaryMuted, 
            color: colors.primary, 
            fontSize: 9,
            cursor: 'pointer', 
            fontFamily: "'DM Sans', sans-serif", 
            whiteSpace: 'nowrap' 
          }}>
            {a.btn} →
          </button>
        </div>
      ))}
    </div>
  );
};

export default AIAlerts;

