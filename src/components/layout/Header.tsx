// Header Component - AEVUM Enterprise ERP

import React from 'react';
import { Colors, Spacing, Layout, BorderRadius } from '../../constants/theme';
import { SearchInput } from '../common';

interface HeaderProps {
  title: string;
  subtitle?: string;
  activeView: string;
  onViewChange: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle = "Exercice 2024–2025 · Données en temps réel · Dakar, Sénégal",
  activeView,
  onViewChange,
}) => {
  const headerStyle: React.CSSProperties = {
    height: Layout.headerHeight,
    background: Colors.bg,
    borderBottom: `1px solid ${Colors.border}`,
    display: 'flex',
    alignItems: 'center',
    padding: `0 ${Spacing.xxl + 6}px`,
    gap: Spacing.md,
    flexShrink: 0,
  };

  const viewButtons = ['DG', 'RH', 'Finance'];

  return (
    <header style={headerStyle}>
      {/* Title */}
      <div style={{ flex: 1 }}>
        <h1 style={{ 
          fontFamily: "'DM Serif Display',Georgia,serif", 
          fontSize: 18,
          fontWeight: 700, 
          color: Colors.text 
        }}>
          {title}
        </h1>
        <div style={{ fontSize: 9, color: Colors.textDim, fontFamily: "'DM Sans',sans-serif", marginTop: 1 }}>
          {subtitle}
        </div>
      </div>

      {/* View Toggle */}
      <div style={{ display: 'flex', gap: 2, background: Colors.header,
        border: `1px solid ${Colors.border}`, borderRadius: BorderRadius.lg, padding: 3 }}>
        {viewButtons.map(v => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            style={{
              padding: '5px 12px',
              borderRadius: 6,
              border: 'none',
              background: activeView === v ? 'rgba(100,140,255,0.15)' : 'transparent',
              color: activeView === v ? Colors.accent : Colors.textMuted,
              cursor: 'pointer',
              fontWeight: activeView === v ? 600 : 400,
              fontSize: 11,
              fontFamily: "'DM Sans',sans-serif",
              transition: 'all 0.2s',
            }}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Search */}
      <SearchInput />

      {/* Notifications */}
      <div style={{ width: 32, height: 32, borderRadius: 8, background: Colors.input,
        border: `1px solid ${Colors.border}`, display: 'flex', alignItems: 'center',
        justifyContent: 'center', cursor: 'pointer', position: 'relative', fontSize: 13 }}>
        🔔
        <div style={{ position: 'absolute', top: 4, right: 4, width: 7, height: 7,
          borderRadius: '50%', background: Colors.accent, border: `2px solid ${Colors.bg}` }} />
      </div>
    </header>
  );
};

export default Header;

