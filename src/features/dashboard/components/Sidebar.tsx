// Dashboard Sidebar Component
import React from 'react';
import { Colors } from '../../../constants/theme';
import { useAppStore } from '../../../store';
import { NavSection } from '../../../types';

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  collapsedSections: Record<string, boolean>;
  toggleSection: (label: string) => void;
  navSections: NavSection[];
}

const Sidebar: React.FC<SidebarProps> = ({
  isSidebarOpen,
  toggleSidebar,
  collapsedSections,
  toggleSection,
  navSections,
}) => {
  const { activeNav, setActiveNav } = useAppStore();

  return (
    <aside style={{ 
      width: isSidebarOpen ? 250 : 64, 
      background: Colors.card,
      borderRight: `1px solid ${Colors.border}`, 
      display: 'flex', 
      flexDirection: 'column',
      transition: 'width 0.28s cubic-bezier(0.4,0,0.2,1)', 
      flexShrink: 0,
      position: 'relative', 
      zIndex: 20, 
      height: '100vh', 
      overflow: 'hidden' 
    }}>
      {/* Logo */}
      <div style={{ padding: '22px 16px 18px', borderBottom: `1px solid ${Colors.border}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ 
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg,#6490ff,#3b5bdb)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 17, fontWeight: 700,
            color: '#fff', boxShadow: '0 4px 16px rgba(100,140,255,0.4)' 
          }}>N</div>
          {isSidebarOpen && (
            <div>
              <div style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 16,
                fontWeight: 700, color: Colors.text, letterSpacing: '0.01em' }}>Nexus ERP</div>
              <div style={{ fontSize: 9, color: Colors.textDim, letterSpacing: '0.12em',
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
              <div
                onClick={() => isSidebarOpen && toggleSection(section.label)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: isSidebarOpen ? '8px 10px 4px' : '6px 0 2px',
                  cursor: isSidebarOpen ? 'pointer' : 'default',
                  borderRadius: 6,
                }}
              >
                {isSidebarOpen ? (
                  <>
                    <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.14em',
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

              <div style={{
                overflow: 'hidden',
                maxHeight: (!isSidebarOpen || !isCollapsed) ? '400px' : '0px',
                opacity: (!isSidebarOpen || !isCollapsed) ? 1 : 0,
                transition: 'max-height 0.3s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease',
              }}>
                {section.items.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => setActiveNav(item.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 9,
                      padding: '10px 12px', borderRadius: 8, marginBottom: 2,
                      background: activeNav === item.id ? 'rgba(100,140,255,0.12)' : 'transparent',
                      color: activeNav === item.id ? Colors.accent : '#5a6480',
                      fontSize: 14, fontFamily: "'DM Sans',sans-serif",
                      fontWeight: activeNav === item.id ? 600 : 400,
                      borderLeft: activeNav === item.id ? `3px solid ${Colors.accent}` : '3px solid transparent',
                      cursor: 'pointer',
                      transition: 'all 0.18s',
                    }}
                  >
                    <span style={{ fontSize: 16, flexShrink: 0, width: 18, textAlign: 'center' }}>{item.icon}</span>
                    {isSidebarOpen && (
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.label}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: '12px 14px', borderTop: `1px solid ${Colors.border}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
            background: 'rgba(100,140,255,0.15)', border: '1px solid rgba(100,140,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 700, color: Colors.accent, fontFamily: "'DM Sans',sans-serif" }}>DG</div>
          {isSidebarOpen && (
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: 13, color: '#c0b8e8', fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>Directeur Général</div>
              <div style={{ fontSize: 11, color: Colors.textDim, fontFamily: "'DM Sans',sans-serif" }}>dg@nexus-erp.sn</div>
            </div>
          )}
          {isSidebarOpen && <div style={{ 
            width: 6, height: 6, borderRadius: '50%',
            background: Colors.green, flexShrink: 0
          }} />}
        </div>
      </div>

      {/* Toggle */}
      <div 
        onClick={toggleSidebar}
        style={{ 
          position: 'absolute', top: 28, right: -12, width: 24, height: 24,
          borderRadius: '50%', background: '#151622', border: `1px solid ${Colors.border}`,
          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, color: Colors.accent, zIndex: 21 
        }}
      >
        {isSidebarOpen ? '◀' : '▶'}
      </div>
    </aside>
  );
};

export default Sidebar;

