// AppLayout Component - AEVUM Enterprise ERP
// Main layout with Sidebar, Header, and Outlet for nested routes

import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store';
import { Colors, Spacing, BorderRadius } from '../../constants/theme';
import { getNavItems, getNavSections } from '../../routes';
import { navSections } from '../../data/mockData';

// Animation keyframes
const keyframes = `
  @keyframes upfade {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes sh {
    0% { background-position: -200%; }
    100% { background-position: 200%; }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.3; }
  }
  .kpi-a {
    animation: upfade 0.5s ease forwards;
  }
`;

export const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const store = useAppStore();
  const { 
    isSidebarOpen, 
    toggleSidebar, 
    collapsedSections, 
    toggleSection, 
    setNavSections,
    activeView,
    setActiveView,
    logout 
  } = store;

  // Set nav sections from mock data on mount
  useEffect(() => {
    setNavSections(navSections);
  }, []);

  // Get nav items and sections
  const navItems = getNavItems();
  const navSectionsData = getNavSections();
  
  // Determine active nav based on current path
  const activeNav = React.useMemo(() => {
    const currentItem = navItems.find(item => item.path === location.pathname);
    return currentItem?.id || 'dashboard';
  }, [location.pathname, navItems]);

  // Get current section for header title
  const currentItem = navItems.find(item => item.path === location.pathname);

  // Handle navigation
  const handleNavClick = (path: string) => {
    navigate(path);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ 
      fontFamily: "'Georgia',serif", 
      background: Colors.bg, 
      height: '100vh',
      color: Colors.text, 
      display: 'flex', 
      overflow: 'hidden', 
      position: 'fixed', 
      inset: 0 
    }}>
      <style>{keyframes}</style>

      {/* ==================== SIDEBAR ==================== */}
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
          {/* Use store navSections if available, otherwise use our routes */}
          {store.navSections.length > 0 ? (
            store.navSections.map((section) => {
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
                    {section.items.map((item) => {
                      const navItem = navItems.find(n => n.id === item.id);
                      return (
                        <div 
                          key={item.id} 
                          onClick={() => navItem && handleNavClick(navItem.path)}
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
                      );
                    })}
                  </div>
                </div>
              );
            })
          ) : (
            // Fallback: Use routes-based navigation
            Object.entries(navSectionsData).map(([sectionName, items]) => {
              const isCollapsed = !!collapsedSections[sectionName];
              const hasActive = items.some(i => i.id === activeNav);
              return (
                <div key={sectionName} style={{ marginBottom: 2 }}>
                  <div
                    onClick={() => isSidebarOpen && toggleSection(sectionName)}
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
                          {sectionName}
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
                    {items.map((item) => (
                      <div 
                        key={item.id} 
                        onClick={() => handleNavClick(item.path)}
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
            })
          )}
        </nav>

        {/* User */}
        <div style={{ padding: '12px 14px', borderTop: `1px solid ${Colors.border}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0,
              background: 'rgba(100,140,255,0.15)', border: '1px solid rgba(100,140,255,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 700, color: Colors.accent, fontFamily: "'DM Sans',sans-serif" }}>
              {store.currentUser?.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </div>
            {isSidebarOpen && (
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ fontSize: 13, color: '#c0c8e8', fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>
                  {store.currentUser?.name || 'Utilisateur'}
                </div>
                <div style={{ fontSize: 11, color: Colors.textDim, fontFamily: "'DM Sans',sans-serif" }}>
                  {store.currentUser?.email || 'user@nexus-erp.sn'}
                </div>
              </div>
            )}
            {isSidebarOpen && <div style={{ 
              width: 6, height: 6, borderRadius: '50%',
              background: Colors.green, flexShrink: 0, animation: 'pulse 2s infinite'
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

      {/* ==================== MAIN CONTENT ==================== */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Header */}
        <header style={{ height: 58, background: Colors.bg, borderBottom: `1px solid ${Colors.border}`,
          display: 'flex', alignItems: 'center', padding: '0 26px', gap: 12, flexShrink: 0 }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 18,
              fontWeight: 700, color: Colors.text }}>
              {currentItem?.label || "Tableau de Bord"}
            </h1>
            <div style={{ fontSize: 9, color: Colors.textDim, fontFamily: "'DM Sans',sans-serif", marginTop: 1 }}>
              Exercice 2024–2025 · Données en temps réel · Dakar, Sénégal
            </div>
          </div>

          {/* View Toggle */}
          <div style={{ display: 'flex', gap: 2, background: '#111320',
            border: `1px solid ${Colors.border}`, borderRadius: 8, padding: 3 }}>
            {['DG', 'RH', 'Finance'].map(v => (
              <button 
                key={v} 
                onClick={() => setActiveView(v)}
                style={{
                  padding: '5px 12px', borderRadius: 6, border: 'none',
                  background: activeView === v ? 'rgba(100,140,255,0.15)' : 'transparent',
                  color: activeView === v ? Colors.accent : Colors.textMuted, cursor: 'pointer',
                  fontWeight: activeView === v ? 600 : 400, fontSize: 11,
                  fontFamily: "'DM Sans',sans-serif", transition: 'all 0.2s',
                }}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#0f1020',
            border: `1px solid ${Colors.border}`, borderRadius: 8, padding: '6px 12px', width: 190 }}>
            <span style={{ color: Colors.textDim, fontSize: 12 }}>⌕</span>
            <input 
              placeholder="Rechercher…" 
              style={{ 
                background: 'none', border: 'none',
                color: '#a0b0d0', fontSize: 11, fontFamily: "'DM Sans',sans-serif", width: '100%' 
              }} 
            />
          </div>

          {/* System Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px',
            background: 'rgba(62,207,142,0.08)', borderRadius: 6,
            border: '1px solid rgba(62,207,142,0.15)' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: Colors.green, animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: 9, color: Colors.green, fontFamily: "'DM Sans',sans-serif" }}>Système actif</span>
          </div>

          {/* Notifications */}
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#0f1020',
            border: `1px solid ${Colors.border}`, display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', position: 'relative', fontSize: 13 }}>
            🔔
            <div style={{ position: 'absolute', top: 4, right: 4, width: 7, height: 7,
              borderRadius: '50%', background: Colors.accent, border: `2px solid ${Colors.bg}` }} />
          </div>

          {/* Logout */}
          <div 
            onClick={handleLogout}
            style={{ 
              display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
              background: 'rgba(224,80,80,0.08)', borderRadius: 8,
              border: '1px solid rgba(224,80,80,0.15)',
              cursor: 'pointer', fontSize: 11, color: Colors.red,
              fontFamily: "'DM Sans',sans-serif", transition: 'all 0.2s',
            }}
            title="Déconnexion"
          >
            <span>🚪</span>
            <span>Déconnexion</span>
          </div>

          {/* AI Badge */}
          <div style={{ padding: '4px 10px', borderRadius: 6,
            background: 'rgba(100,140,255,0.1)', border: '1px solid rgba(100,140,255,0.2)',
            fontSize: 9, color: Colors.accent, fontFamily: "'DM Sans',sans-serif",
            display: 'flex', alignItems: 'center', gap: 5 }}>
            <span>🤖</span> IA Activée
          </div>
        </header>

        {/* Main Scrollable Content - Outlet for nested routes */}
        <main style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

