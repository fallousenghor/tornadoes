// AppLayout Component - AEVUM Enterprise ERP
// Corporate Professional Theme - B2B SaaS Design System

import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../../store';
import { Colors, Spacing, BorderRadius, Shadows } from '../../constants/theme';
import { getNavItems, getNavSections } from '../../routes';
import { navSections } from '../../data/mockData';

// Animation keyframes
const keyframes = `
  @keyframes upfade {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
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
      fontFamily: "'DM Sans', sans-serif", 
      background: Colors.bg, 
      height: '100vh',
      color: Colors.text, 
      display: 'flex', 
      overflow: 'hidden', 
      position: 'fixed', 
      inset: 0 
    }}>
      <style>{keyframes}</style>

      {/* ==================== SIDEBAR - Corporate Gradient ==================== */}
      <aside style={{ 
        width: isSidebarOpen ? 260 : 72, 
        background: Colors.sidebarGradient,
        display: 'flex', 
        flexDirection: 'column',
        transition: 'width 0.28s cubic-bezier(0.4, 0, 0.2, 1)', 
        flexShrink: 0,
        position: 'relative', 
        zIndex: 20, 
        height: '100vh', 
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
      }}>
        {/* Logo */}
        <div style={{ 
          padding: '20px 16px 16px', 
          borderBottom: `1px solid ${Colors.sidebarBorder}`, 
          flexShrink: 0 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ 
              width: 40, 
              height: 40, 
              borderRadius: 10, 
              flexShrink: 0,
              background: 'linear-gradient(135deg, #FFFFFF 0%, #F3F4F6 100%)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontFamily: "'DM Serif Display', Georgia, serif", 
              fontSize: 20, 
              fontWeight: 700,
              color: Colors.primary,
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' 
            }}>N</div>
            {isSidebarOpen && (
              <div>
                <div style={{ 
                  fontFamily: "'DM Serif Display', Georgia, serif", 
                  fontSize: 18,
                  fontWeight: 700, 
                  color: Colors.sidebarText, 
                  letterSpacing: '0.01em' 
                }}>Nexus ERP</div>
                <div style={{ 
                  fontSize: 10, 
                  color: Colors.sidebarTextMuted, 
                  letterSpacing: '0.12em',
                  fontFamily: "'DM Sans', sans-serif", 
                  textTransform: 'uppercase' 
                }}>Enterprise Suite</div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto', overflowX: 'hidden' }}>
          {store.navSections.length > 0 ? (
            store.navSections.map((section) => {
              const isCollapsed = !!collapsedSections[section.label];
              const hasActive = section.items.some(i => i.id === activeNav);
              return (
                <div key={section.label} style={{ marginBottom: 4 }}>
                  {/* Section Header */}
                  <div
                    onClick={() => isSidebarOpen && toggleSection(section.label)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: isSidebarOpen ? '10px 12px 8px' : '8px 0 4px',
                      cursor: isSidebarOpen ? 'pointer' : 'default',
                      borderRadius: 8,
                    }}
                  >
                    {isSidebarOpen ? (
                      <>
                        <span style={{ 
                          fontSize: 11, 
                          fontWeight: 700, 
                          letterSpacing: '0.12em',
                          color: hasActive ? Colors.sidebarText : Colors.sidebarTextMuted,
                          fontFamily: "'DM Sans', sans-serif", 
                          textTransform: 'uppercase' 
                        }}>
                          {section.label}
                        </span>
                        <span style={{ 
                          fontSize: 10, 
                          color: isCollapsed ? Colors.sidebarTextMuted : Colors.sidebarText,
                          display: 'inline-block', 
                          lineHeight: 1,
                          transition: 'transform 0.25s ease',
                          transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)' 
                        }}>▾</span>
                      </>
                    ) : (
                      <div style={{ width: 32, height: 2, background: 'rgba(255,255,255,0.15)', margin: '0 auto', borderRadius: 1 }} />
                    )}
                  </div>

                  {/* Items */}
                  <div style={{
                    overflow: 'hidden',
                    maxHeight: (!isSidebarOpen || !isCollapsed) ? '500px' : '0px',
                    opacity: (!isSidebarOpen || !isCollapsed) ? 1 : 0,
                    transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease',
                  }}>
                    {section.items.map((item) => {
                      const navItem = navItems.find(n => n.id === item.id);
                      const isActive = activeNav === item.id;
                      return (
                        <div 
                          key={item.id} 
                          onClick={() => navItem && handleNavClick(navItem.path)}
                          style={{
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: 10,
                            padding: '10px 14px', 
                            borderRadius: 8, 
                            marginBottom: 2,
                            background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                            color: isActive ? Colors.sidebarText : Colors.sidebarTextMuted,
                            fontSize: 13, 
                            fontFamily: "'DM Sans', sans-serif",
                            fontWeight: isActive ? 600 : 400,
                            borderLeft: isActive ? `3px solid ${Colors.sidebarText}` : '3px solid transparent',
                            cursor: 'pointer',
                            transition: 'all 0.18s ease',
                          }}
                          onMouseEnter={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                              e.currentTarget.style.color = Colors.sidebarText;
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isActive) {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = Colors.sidebarTextMuted;
                            }
                          }}
                        >
                          <span style={{ fontSize: 16, flexShrink: 0, width: 20, textAlign: 'center' }}>{item.icon}</span>
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
                <div key={sectionName} style={{ marginBottom: 4 }}>
                  <div
                    onClick={() => isSidebarOpen && toggleSection(sectionName)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: isSidebarOpen ? '10px 12px 8px' : '8px 0 4px',
                      cursor: isSidebarOpen ? 'pointer' : 'default',
                      borderRadius: 8,
                    }}
                  >
                    {isSidebarOpen ? (
                      <>
                        <span style={{ 
                          fontSize: 11, 
                          fontWeight: 700, 
                          letterSpacing: '0.12em',
                          color: hasActive ? Colors.sidebarText : Colors.sidebarTextMuted,
                          fontFamily: "'DM Sans', sans-serif", 
                          textTransform: 'uppercase' 
                        }}>
                          {sectionName}
                        </span>
                        <span style={{ 
                          fontSize: 10, 
                          color: isCollapsed ? Colors.sidebarTextMuted : Colors.sidebarText,
                          display: 'inline-block', 
                          lineHeight: 1,
                          transition: 'transform 0.25s ease',
                          transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)' 
                        }}>▾</span>
                      </>
                    ) : (
                      <div style={{ width: 32, height: 2, background: 'rgba(255,255,255,0.15)', margin: '0 auto', borderRadius: 1 }} />
                    )}
                  </div>

                  <div style={{
                    overflow: 'hidden',
                    maxHeight: (!isSidebarOpen || !isCollapsed) ? '500px' : '0px',
                    opacity: (!isSidebarOpen || !isCollapsed) ? 1 : 0,
                    transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease',
                  }}>
                    {items.map((item) => (
                      <div 
                        key={item.id} 
                        onClick={() => handleNavClick(item.path)}
                        style={{
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 10,
                          padding: '10px 14px', 
                          borderRadius: 8, 
                          marginBottom: 2,
                          background: activeNav === item.id ? 'rgba(255,255,255,0.15)' : 'transparent',
                          color: activeNav === item.id ? Colors.sidebarText : Colors.sidebarTextMuted,
                          fontSize: 13, 
                          fontFamily: "'DM Sans', sans-serif",
                          fontWeight: activeNav === item.id ? 600 : 400,
                          borderLeft: activeNav === item.id ? `3px solid ${Colors.sidebarText}` : '3px solid transparent',
                          cursor: 'pointer',
                          transition: 'all 0.18s ease',
                        }}
                      >
                        <span style={{ fontSize: 16, flexShrink: 0, width: 20, textAlign: 'center' }}>{item.icon}</span>
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

        {/* User Section */}
        <div style={{ 
          padding: '14px 16px', 
          borderTop: `1px solid ${Colors.sidebarBorder}`, 
          flexShrink: 0 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ 
              width: 36, 
              height: 36, 
              borderRadius: '50%', 
              flexShrink: 0,
              background: 'rgba(255,255,255,0.15)', 
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: 12, 
              fontWeight: 600, 
              color: Colors.sidebarText, 
              fontFamily: "'DM Sans', sans-serif" 
            }}>
              {store.currentUser?.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
            </div>
            {isSidebarOpen && (
              <div style={{ flex: 1, overflow: 'hidden' }}>
                <div style={{ 
                  fontSize: 13, 
                  color: Colors.sidebarText, 
                  fontFamily: "'DM Sans', sans-serif", 
                  fontWeight: 600 
                }}>
                  {store.currentUser?.name || 'Utilisateur'}
                </div>
                <div style={{ 
                  fontSize: 11, 
                  color: Colors.sidebarTextMuted, 
                  fontFamily: "'DM Sans', sans-serif" 
                }}>
                  {store.currentUser?.email || 'user@nexus-erp.sn'}
                </div>
              </div>
            )}
            {isSidebarOpen && (
              <div style={{ 
                width: 8, 
                height: 8, 
                borderRadius: '50%',
                background: Colors.success, 
                flexShrink: 0, 
                boxShadow: `0 0 8px ${Colors.success}`,
                animation: 'pulse 2s infinite'
              }} />
            )}
          </div>
        </div>

        {/* Toggle Button */}
        <div 
          onClick={toggleSidebar}
          style={{ 
            position: 'absolute', 
            top: 26, 
            right: -14, 
            width: 28, 
            height: 28,
            borderRadius: '50%', 
            background: Colors.card, 
            border: `1px solid ${Colors.border}`,
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontSize: 11, 
            color: Colors.primary, 
            zIndex: 21,
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          }}
        >
          {isSidebarOpen ? '◀' : '▶'}
        </div>
      </aside>

      {/* ==================== MAIN CONTENT ==================== */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Header - Clean corporate white */}
        <header style={{ 
          height: 64, 
          background: Colors.header, 
          borderBottom: `1px solid ${Colors.border}`,
          display: 'flex', 
          alignItems: 'center', 
          padding: '0 24px', 
          gap: 16, 
          flexShrink: 0,
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
        }}>
          {/* Title */}
          <div style={{ flex: 1 }}>
            <h1 style={{ 
              fontFamily: "'DM Serif Display', Georgia, serif", 
              fontSize: 20,
              fontWeight: 700, 
              color: Colors.text,
              margin: 0,
            }}>
              {currentItem?.label || "Tableau de Bord"}
            </h1>
            <div style={{ 
              fontSize: 11, 
              color: Colors.textMuted, 
              fontFamily: "'DM Sans', sans-serif", 
              marginTop: 2 
            }}>
              Exercice 2024–2025 · Données en temps réel · Dakar, Sénégal
            </div>
          </div>

          {/* View Toggle */}
          <div style={{ 
            display: 'flex', 
            gap: 4, 
            background: Colors.bgSecondary,
            border: `1px solid ${Colors.border}`, 
            borderRadius: BorderRadius.lg, 
            padding: 4 
          }}>
            {['DG', 'RH', 'Finance'].map(v => (
              <button 
                key={v} 
                onClick={() => setActiveView(v)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 6,
                  border: 'none',
                  background: activeView === v ? Colors.primary : 'transparent',
                  color: activeView === v ? Colors.textInverse : Colors.textSecondary,
                  cursor: 'pointer',
                  fontWeight: activeView === v ? 600 : 400,
                  fontSize: 12,
                  fontFamily: "'DM Sans', sans-serif",
                  transition: 'all 0.2s ease',
                }}
              >
                {v}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8, 
            background: Colors.inputBg,
            border: `1px solid ${Colors.border}`, 
            borderRadius: BorderRadius.lg, 
            padding: '8px 14px', 
            width: 220,
          }}>
            <span style={{ color: Colors.textMuted, fontSize: 14 }}>⌕</span>
            <input 
              placeholder="Rechercher…" 
              style={{ 
                background: 'none', 
                border: 'none',
                color: Colors.textPrimary, 
                fontSize: 13, 
                fontFamily: "'DM Sans', sans-serif", 
                width: '100%',
                outline: 'none',
              }} 
            />
          </div>

          {/* System Status */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 6, 
            padding: '6px 12px',
            background: Colors.successBg, 
            borderRadius: BorderRadius.md,
            border: `1px solid ${Colors.successMuted}` 
          }}>
            <div style={{ 
              width: 6, 
              height: 6, 
              borderRadius: '50%', 
              background: Colors.success,
              animation: 'pulse 2s infinite' 
            }} />
            <span style={{ 
              fontSize: 11, 
              color: Colors.success, 
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 500,
            }}>Système actif</span>
          </div>

          {/* Notifications */}
          <div style={{ 
            width: 38, 
            height: 38, 
            borderRadius: BorderRadius.lg, 
            background: Colors.bgSecondary,
            border: `1px solid ${Colors.border}`, 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center', 
            cursor: 'pointer', 
            position: 'relative', 
            fontSize: 14,
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = Colors.bgTertiary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = Colors.bgSecondary;
          }}
          >
            🔔
            <div style={{ 
              position: 'absolute', 
              top: 6, 
              right: 6, 
              width: 8, 
              height: 8,
              borderRadius: '50%', 
              background: Colors.danger, 
              border: `2px solid ${Colors.header}` 
            }} />
          </div>

          {/* AI Badge */}
          <div style={{ 
            padding: '6px 12px', 
            borderRadius: BorderRadius.md,
            background: Colors.primaryMuted, 
            border: `1px solid ${Colors.primaryMuted}`,
            fontSize: 11, 
            color: Colors.primary, 
            fontFamily: "'DM Sans', sans-serif",
            display: 'flex', 
            alignItems: 'center', 
            gap: 5,
            fontWeight: 500,
          }}>
            <span>🤖</span> IA Activée
          </div>

          {/* Logout */}
          <div 
            onClick={handleLogout}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 6, 
              padding: '8px 14px',
              background: Colors.dangerBg, 
              borderRadius: BorderRadius.lg,
              border: `1px solid ${Colors.dangerMuted}`,
              cursor: 'pointer', 
              fontSize: 12, 
              color: Colors.danger,
              fontFamily: "'DM Sans', sans-serif", 
              transition: 'all 0.2s ease',
              fontWeight: 500,
            }}
            title="Déconnexion"
            onMouseEnter={(e) => {
              e.currentTarget.style.background = Colors.danger;
              e.currentTarget.style.color = Colors.textInverse;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = Colors.dangerBg;
              e.currentTarget.style.color = Colors.danger;
            }}
          >
            <span>🚪</span>
            <span>Déconnexion</span>
          </div>
        </header>

        {/* Main Scrollable Content - Outlet for nested routes */}
        <main style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: 24,
          background: Colors.bg,
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

