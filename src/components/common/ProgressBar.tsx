// Progress Bar Component - AEVUM Enterprise ERP

import React from 'react';
import { Colors, BorderRadius, Transitions } from '../../constants/theme';

interface ProgressBarProps {
  value: number;
  color?: string;
  height?: number;
  showLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  color = Colors.accent,
  height = 6,
  showLabel = false,
  className = '',
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const containerStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: BorderRadius.full,
    height,
    overflow: 'hidden',
  };

  const fillStyle: React.CSSProperties = {
    width: `${clampedValue}%`,
    height: '100%',
    background: color,
    borderRadius: BorderRadius.full,
    boxShadow: `0 0 8px ${color}66`,
    transition: `width 1s ease`,
  };

  return (
    <div className={className}>
      <div style={containerStyle}>
        <div style={fillStyle} />
      </div>
      {showLabel && (
        <div style={{ 
          fontSize: 9, 
          color: Colors.textMuted, 
          marginTop: 4,
          textAlign: 'right' 
        }}>
          {clampedValue}%
        </div>
      )}
    </div>
  );
};

export default ProgressBar;

