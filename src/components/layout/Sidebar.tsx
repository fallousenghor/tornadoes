// Sidebar Component - AEVUM Enterprise ERP
// Professional Sidebar with Clear Typography

import React from 'react';
import * as LucideIcons from 'lucide-react';
import { Spacing, Transitions, Layout } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
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
  const { colors, mode } = useTheme();

  const sidebarStyle: React.CSSProperties = {
    width: isOpen ? Layout.sidebarWidth : Layout.sidebarCollapsed,
    background: colors.card,
    borderRight: `1px solid ${colors.border}`,
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
      <div style={{ padding: '24px 20px', borderBottom: `1px solid ${colors.border}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            flexShrink: 0,
            background: mode === 'dark'
              ? 'linear-gradient(135deg,#3B82F6,#1E40AF)'
              : 'linear-gradient(135deg,#6490ff,#3b5bdb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 24,
            fontWeight: 700,
            color: '#fff',
            boxShadow: mode === 'dark'
              ? '0 4px 16px rgba(59,130,246,0.4)'
              : '0 4px 16px rgba(100,140,255,0.4)'
          }}>T</div>
          {isOpen && (
            <div>
              <div style={{ 
                fontFamily: "'Plus Jakarta Sans', sans-serif", 
                fontSize: 20,
                fontWeight: 700, 
                color: colors.text, 
                letterSpacing: '-0.02em',
                lineHeight: 1.2
              }}>Tornadoes</div>
              <div style={{ 
                fontSize: 11, 
                color: colors.textMuted, 
                letterSpacing: '0.15em', 
                fontFamily: "'Plus Jakarta Sans', sans-serif", 
                textTransform: 'uppercase',
                fontWeight: 600,
                marginTop: 2
              }}>Job Afrique</div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 12px', overflowY: 'auto', overflowX: 'hidden' }}>
        {navSections.map((section) => {
          const isCollapsed = !!collapsedSections[section.label];
          const hasActive = section.items.some(i => i.id === activeNav);
          return (
            <div key={section.label} style={{ marginBottom: 4 }}>
              {/* Section Header */}
              <div
                onClick={() => isOpen && onToggleSection(section.label)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: isOpen ? '12px 14px 8px' : '10px 0 8px',
                  cursor: isOpen ? 'pointer' : 'default',
                  borderRadius: 8,
                  transition: 'background 0.15s',
                  marginBottom: 4,
                }}
                onMouseEnter={(e) => {
                  if (isOpen) {
                    e.currentTarget.style.background = mode === 'dark' ? 'rgba(59,130,246,0.08)' : 'rgba(100,140,255,0.06)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                {isOpen ? (
                  <>
                    <span style={{ 
                      fontSize: 11, 
                      fontWeight: 700, 
                      letterSpacing: '0.18em',
                      color: hasActive ? colors.accent : colors.textMuted,
                      fontFamily: "'Plus Jakarta Sans', sans-serif", 
                      textTransform: 'uppercase',
                      lineHeight: 1
                    }}>
                      {section.label}
                    </span>
                    <span style={{ 
                      fontSize: 10, 
                      color: isCollapsed ? colors.textMuted : colors.textDim,
                      display: 'inline-block', 
                      lineHeight: 1,
                      transition: 'transform 0.25s ease',
                      transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                      fontWeight: 600
                    }}>▾</span>
                  </>
                ) : (
                  <div style={{ width: 28, height: 2, background: mode === 'dark' ? 'rgba(59,130,246,0.2)' : 'rgba(100,140,255,0.2)', margin: '0 auto', borderRadius: 1 }} />
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
      <div style={{ padding: '18px 16px', borderTop: `1px solid ${colors.border}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ 
            width: 44, 
            height: 44, 
            borderRadius: '50%', 
            flexShrink: 0,
            background: mode === 'dark' ? 'rgba(59,130,246,0.2)' : 'rgba(100,140,255,0.15)',
            border: mode === 'dark' ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(100,140,255,0.2)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: 15, 
            fontWeight: 700, 
            color: colors.accent, 
            fontFamily: "'Plus Jakarta Sans', sans-serif" 
          }}>DG</div>
          {isOpen && (
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ 
                fontSize: 14, 
                color: mode === 'dark' ? '#F1F5F9' : '#1E293B', 
                fontFamily: "'Plus Jakarta Sans', sans-serif", 
                fontWeight: 600,
                lineHeight: 1.3
              }}>Directeur Général</div>
              <div style={{ 
                fontSize: 12, 
                color: colors.textMuted, 
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 400,
                marginTop: 1
              }}>tornadoes.job.sn</div>
            </div>
          )}
          {isOpen && <div style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: colors.green,
            flexShrink: 0,
            boxShadow: mode === 'dark' ? '0 0 0 2px rgba(34,197,94,0.2)' : '0 0 0 2px rgba(34,197,94,0.15)',
            animation: 'pulse 2s infinite'
          }} />}
        </div>
      </div>

      {/* Toggle Button */}
      <div
        onClick={onToggle}
        style={{
          position: 'absolute',
          top: 36,
          right: -14,
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: mode === 'dark' ? '#1E293B' : '#FFFFFF',
          border: `1px solid ${colors.border}`,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          color: colors.accent,
          zIndex: 21,
          boxShadow: mode === 'dark' ? '0 2px 8px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.12)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.1)';
          e.currentTarget.style.background = mode === 'dark' ? '#334155' : '#F8FAFC';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.background = mode === 'dark' ? '#1E293B' : '#FFFFFF';
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
  const { colors, mode } = useTheme();

  // Get the Lucide icon component from the icon name
  const IconComponent = (LucideIcons as unknown as Record<string, React.FC<any>>)[item.icon] || LucideIcons.Circle;

  const style: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '13px 16px',
    borderRadius: 10,
    marginBottom: 3,
    background: isActive
      ? (mode === 'dark'
          ? 'linear-gradient(90deg, rgba(59,130,246,0.15) 0%, rgba(59,130,246,0.08) 100%)'
          : 'linear-gradient(90deg, rgba(100,140,255,0.15) 0%, rgba(100,140,255,0.08) 100%)')
      : 'transparent',
    color: isActive ? colors.accent : (mode === 'dark' ? '#CBD5E1' : '#475569'),
    fontSize: 14,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontWeight: isActive ? 600 : 500,
    borderLeft: isActive ? `3px solid ${colors.accent}` : '3px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: isActive
      ? (mode === 'dark' ? '0 2px 8px rgba(59,130,246,0.15)' : '0 2px 8px rgba(100,140,255,0.1)')
      : 'none',
  };

  return (
    <div
      onClick={onClick}
      style={style}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = mode === 'dark' ? 'rgba(59,130,246,0.08)' : 'rgba(100,140,255,0.08)';
          e.currentTarget.style.transform = 'translateX(2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.transform = 'translateX(0)';
        }
      }}
    >
      <span style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        width: 22,
        lineHeight: 1
      }}>
        <IconComponent size={18} strokeWidth={isActive ? 2.25 : 1.75} />
      </span>
      {isOpen && (
        <span style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          letterSpacing: '-0.01em'
        }}>
          {item.label}
        </span>
      )}
    </div>
  );
};

export default Sidebar;
