// Section Title Component - AEVUM Enterprise ERP

import React from 'react';
import { Colors, Spacing } from '../../constants/theme';

interface SectionTitleProps {
  icon: string;
  title: string;
  sub?: string;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  icon,
  title,
  sub,
  className = '',
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: Spacing.lg,
  };

  const iconStyle: React.CSSProperties = {
    width: 32,
    height: 32,
    borderRadius: 8,
    background: 'rgba(100,140,255,0.1)',
    border: '1px solid rgba(100,140,255,0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
  };

  const titleStyle: React.CSSProperties = {
    fontFamily: "'DM Serif Display', Georgia, serif",
    fontSize: 14,
    fontWeight: 700,
    color: Colors.text,
  };

  const subStyle: React.CSSProperties = {
    fontSize: 9,
    color: Colors.textDim,
    fontFamily: "'DM Sans', sans-serif",
    marginTop: 2,
  };

  return (
    <div className={className} style={containerStyle}>
      <div style={iconStyle}>{icon}</div>
      <div>
        <div style={titleStyle}>{title}</div>
        {sub && <div style={subStyle}>{sub}</div>}
      </div>
    </div>
  );
};

export default SectionTitle;

