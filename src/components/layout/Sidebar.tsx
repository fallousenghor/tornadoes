// Sidebar Component - AEVUM Enterprise ERP

import React from 'react';
import { Colors, Spacing, Transitions, Layout } from '../../constants/theme';
import type { NavSection, NavItem } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeNav: string;
  onNavChange: (id: string) => void;
  navSections: NavSection[];
  collapsedSections: Record<string, boolean>;
  onToggleSection: (label: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onToggle,
  activeNav,
  onNavChange,
  navSections,
  collapsedSections,
  onToggleSection,
}) => {
  const sidebarStyle: React.CSSProperties = {
    width: isOpen ? Layout.sidebarWidth : Layout.sidebarCollapsed,
    background: Colors.card,
    borderRight: `1px solid ${Colors.border}`,
    display: 'flex',
    flexDirection: 'column',
    transition: Transitions.slow,
    flexShrink: 0,
    position: 'relative',
    zIndex: 20,
    height: '100vh',
    overflow: 'hidden',
  };

  return (
    <aside style={sidebarStyle}>
      {/* Logo */}
      <div style={{ padding: '22px 16px 18px', borderBottom: `1px solid ${Colors.border}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ 
            width: 48, 
            height: 48, 
            borderRadius: 12, 
            flexShrink: 0,
            background: 'linear-gradient(135deg,#6490ff,#3b5bdb)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontFamily: "'DM Serif Display',Georgia,serif", 
            fontSize: 24, 
            fontWeight: 700,
            color: '#fff', 
            boxShadow: '0 4px 16px rgba(100,140,255,0.4)' 
          }}>N</div>
          {isOpen && (
            <div>
              <div style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 22,
                fontWeight: 700, color: Colors.text, letterSpacing: '0.01em' }}>Nexus ERP</div>
              <div style={{ fontSize: 12, color: Colors.textDim, letterSpacing: '0.12em',
                fontFamily: "'DM Sans',sans-serif", textTransform: 'uppercase' }}>Enterprise Suite</div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '8px 8px', overflowY: 'auto', overflowX: 'hidden' }}>
        {navSections.map((section) => {
          const isCollapsed = !!collapsedSections[section.label];
          const hasActive = section.items.some(i => i.id === activeNav);
          return (
            <div key={section.label} style={{ marginBottom: 2 }}>
              {/* Section Header */}
              <div
                onClick={() => isOpen && onToggleSection(section.label)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: isOpen ? '10px 12px 6px' : '8px 0 4px',
                  cursor: isOpen ? 'pointer' : 'default',
                  borderRadius: 6,
                  transition: 'background 0.15s',
                }}
              >
                {isOpen ? (
                  <>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
                      color: hasActive ? Colors.accent + 'bb' : Colors.textMuted,
                      fontFamily: "'DM Sans',sans-serif", textTransform: 'uppercase' }}>
                      {section.label}
                    </span>
                    <span style={{ fontSize: 12, color: isCollapsed ? Colors.textMuted : Colors.textDim,
                      display: 'inline-block', lineHeight: 1,
                      transition: 'transform 0.25s ease',
                      transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}>▾</span>
                  </>
                ) : (
                  <div style={{ width: 28, height: 1, background: 'rgba(100,140,255,0.1)', margin: '0 auto' }} />
                )}
              </div>

              {/* Items */}
              <div style={{
                overflow: 'hidden',
                maxHeight: (!isOpen || !isCollapsed) ? '400px' : '0px',
                opacity: (!isOpen || !isCollapsed) ? 1 : 0,
                transition: 'max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease',
              }}>
                {section.items.map((item) => (
                  <NavItemComponent
                    key={item.id}
                    item={item}
                    isActive={activeNav === item.id}
                    isOpen={isOpen}
                    onClick={() => onNavChange(item.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User Section */}
      <div style={{ padding: '16px 18px', borderTop: `1px solid ${Colors.border}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: '50%', flexShrink: 0,
            background: 'rgba(100,140,255,0.15)', border: '1px solid rgba(100,140,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: Colors.accent, fontFamily: "'DM Sans',sans-serif" }}>DG</div>
          {isOpen && (
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: 14, color: '#c0c8e8', fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>Directeur Général</div>
              <div style={{ fontSize: 12, color: Colors.textDim, fontFamily: "'DM Sans',sans-serif" }}>dg@nexus-erp.sn</div>
            </div>
          )}
          {isOpen && <div style={{ 
            width: 6, height: 6, borderRadius: '50%',
            background: Colors.green, flexShrink: 0,
            animation: 'pulse 2s infinite'
          }} />}
        </div>
      </div>

      {/* Toggle Button */}
      <div 
        onClick={onToggle}
        style={{ 
          position: 'absolute', 
          top: 34, 
          right: -14, 
          width: 28, 
          height: 28,
          borderRadius: '50%', 
          background: '#151622', 
          border: `1px solid ${Colors.border}`,
          cursor: 'pointer', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          fontSize: 12, 
          color: Colors.accent, 
          zIndex: 21 
        }}
      >
        {isOpen ? '◀' : '▶'}
      </div>
    </aside>
  );
};

// Nav Item Component
interface NavItemComponentProps {
  item: NavItem;
  isActive: boolean;
  isOpen: boolean;
  onClick: () => void;
}

const NavItemComponent: React.FC<NavItemComponentProps> = ({ item, isActive, isOpen, onClick }) => {
  const style: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 14px',
    borderRadius: 8,
    marginBottom: 2,
    background: isActive ? 'rgba(100,140,255,0.12)' : 'transparent',
    color: isActive ? Colors.accent : '#6a7488',
    fontSize: 14,
    fontFamily: "'DM Sans',sans-serif",
    fontWeight: isActive ? 600 : 400,
    borderLeft: isActive ? `3px solid ${Colors.accent}` : '3px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.18s',
  };

  return (
    <div onClick={onClick} style={style}>
      <span style={{ fontSize: 18, flexShrink: 0, width: 20, textAlign: 'center' }}>{item.icon}</span>
      {isOpen && (
        <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {item.label}
        </span>
      )}
    </div>
  );
};

export default Sidebar;

