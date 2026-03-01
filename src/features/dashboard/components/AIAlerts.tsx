// Dashboard AI Alerts Component
import React from 'react';
import { Colors } from '../../../constants/theme';

interface AIAert {
  icon: string;
  text: string;
  btn: string;
  color: string;
  border: string;
}

interface AIAlertsProps {
  alerts: AIAert[];
}

const AIAlerts: React.FC<AIAlertsProps> = ({ alerts }) => {
  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
      {alerts.map((a, i) => (
        <div key={i} style={{ flex: 1, background: a.color, border: `1px solid ${a.border}`,
          borderRadius: 10, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 16 }}>{a.icon}</span>
          <span style={{ fontSize: 10, color: Colors.textMuted, fontFamily: "'DM Sans',sans-serif", flex: 1 }}>{a.text}</span>
          <button style={{ padding: '4px 10px', borderRadius: 5, border: 'none',
            background: 'rgba(255,255,255,0.06)', color: Colors.text, fontSize: 9,
            cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", whiteSpace: 'nowrap' }}>{a.btn} →</button>
        </div>
      ))}
    </div>
  );
};

export default AIAlerts;

