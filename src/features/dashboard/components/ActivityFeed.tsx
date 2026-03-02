// Activity Feed Component - Journal d'Activité
import React, { useState, useEffect } from 'react';
import { Button, SectionTitle } from '../../../components/common';
import { Colors } from '../../../constants/theme';
import dashboardService from '../../../services/dashboardService';
import type { ActivityLog } from '@/types';

export const ActivityFeed: React.FC = () => {
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await dashboardService.getRecentActivity();
        // Ensure data is an array
        if (Array.isArray(data)) {
          setActivities(data);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  return (
    <div style={{
      background: Colors.card,
      border: `1px solid ${Colors.border}`,
      borderRadius: 16,
      padding: 24,
      marginBottom: 16,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <SectionTitle icon="◈" title="Journal d'Activité" sub="Dernières actions · Audit trail" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: Colors.green, animation: 'pulse 2s infinite' }} />
          <span style={{ fontSize: 9, color: Colors.green, fontFamily: "'DM Sans',sans-serif" }}>Live</span>
          <Button variant="ghost" size="sm">Voir tous les logs</Button>
        </div>
      </div>
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: Colors.textMuted }}>
          Chargement...
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {activities.map((a, i) => (
            <div key={a.id || i} style={{ display: 'flex', alignItems: 'center',
              padding: '10px 14px', borderRadius: 9,
              border: '1px solid rgba(100,140,255,0.06)',
              background: 'rgba(255,255,255,0.01)', opacity: 0,
              animation: 'upfade 0.4s ease forwards',
              animationDelay: `${i * 0.1}s`,
            }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, marginRight: 10,
                background: `${a.avatarColor || Colors.accent}22`, border: `1px solid ${a.avatarColor || Colors.accent}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 700, color: a.avatarColor || Colors.accent, fontFamily: "'DM Sans',sans-serif" }}>
                {a.avatarInitials}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: Colors.text, fontFamily: "'DM Sans',sans-serif" }}>{a.userName}</span>
                  <span style={{ fontSize: 8, padding: '1px 6px', borderRadius: 99,
                    background: 'rgba(100,140,255,0.08)', color: Colors.textMuted,
                    fontFamily: "'DM Sans',sans-serif" }}>{a.userRole}</span>
                </div>
                <div style={{ fontSize: 9, color: Colors.textMuted, fontFamily: "'DM Sans',sans-serif" }}>{a.action}</div>
              </div>
              {a.amount && (
                <div style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 14, color: Colors.gold, marginRight: 16 }}>{a.amount}</div>
              )}
              <div style={{ fontSize: 9, color: Colors.textDim, fontFamily: "'DM Sans',sans-serif", minWidth: 50, textAlign: 'right' }}>
                {Math.floor((Date.now() - new Date(a.timestamp).getTime()) / 60000) < 60 
                  ? `${Math.floor((Date.now() - new Date(a.timestamp).getTime()) / 60000)} min` 
                  : `${Math.floor((Date.now() - new Date(a.timestamp).getTime()) / 3600000)}h`} ago
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;

