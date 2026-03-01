// Dashboard Header Component
import React from 'react';
import { Colors } from '../../../constants/theme';
import { useAppStore } from '../../../store';

interface DashboardHeaderProps {
  activeItem: { label: string } | undefined;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ activeItem }) => {
  const { activeView, setActiveView, isSidebarOpen, toggleSidebar } = useAppStore();

  return (
    <header style={{ 
      height: 58, background: Colors.bg, borderBottom: `1px solid ${Colors.border}`,
      display: 'flex', alignItems: 'center', padding: '0 26px', gap: 12, flexShrink: 0 
    }}>
      <div style={{ flex: 1 }}>
        <h1 style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 18,
          fontWeight: 700, color: Colors.text }}>
          {activeItem?.label || "Tableau de Bord"}
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
        <div style={{ width: 5, height: 5, borderRadius: '50%', background: Colors.green }} />
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

      {/* AI Badge */}
      <div style={{ padding: '4px 10px', borderRadius: 6,
        background: 'rgba(100,140,255,0.1)', border: '1px solid rgba(100,140,255,0.2)',
        fontSize: 9, color: Colors.accent, fontFamily: "'DM Sans',sans-serif",
        display: 'flex', alignItems: 'center', gap: 5 }}>
        <span>🤖</span> IA Activée
      </div>
    </header>
  );
};

export default DashboardHeader;

