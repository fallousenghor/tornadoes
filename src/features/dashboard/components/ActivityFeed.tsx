// Activity Feed Component - Activités Récentes
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import dashboardService, { type ActivityItem } from '../../../services/dashboardService';

const ActivityFeed: React.FC = () => {
  const { isDark } = useTheme();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await dashboardService.getRecentActivity();
        setActivities(data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
      leave: '📅',
      invoice: '📄',
      employee: '👤',
      payment: '💰',
      project: '🎯',
      document: '📁',
      student: '🎓',
      default: '📌',
    };
    return icons[type] || icons.default;
  };

  const getActivityColor = (type: string) => {
    const colors: Record<string, string> = {
      leave: '#a78bfa',
      invoice: '#fb923c',
      employee: '#3ecf8e',
      payment: '#2dd4bf',
      project: '#6490ff',
      document: '#c9a84c',
      student: '#e05050',
    };
    return colors[type] || '#64748b';
  };

  const formatTimeAgo = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "à l'instant";
    if (diffInSeconds < 3600) return `il y a ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `il y a ${Math.floor(diffInSeconds / 3600)} h`;
    if (diffInSeconds < 604800) return `il y a ${Math.floor(diffInSeconds / 86400)} j`;
    return date.toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <div style={{
        background: isDark ? '#1e293b' : 'white',
        borderRadius: 16,
        padding: 24,
        border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
      }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#f1f5f9' : '#1e293b', marginBottom: 16 }}>
          🔔 Activités Récentes
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{
              display: 'flex',
              gap: 12,
              padding: 12,
              background: isDark ? '#0f172a' : '#f8fafc',
              borderRadius: 8,
              marginBottom: 8,
            }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: isDark ? '#334155' : '#e2e8f0',
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: 12, width: '60%', background: isDark ? '#334155' : '#e2e8f0', borderRadius: 4, marginBottom: 6 }} />
                <div style={{ height: 10, width: '40%', background: isDark ? '#334155' : '#e2e8f0', borderRadius: 4 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: isDark ? '#1e293b' : 'white',
      borderRadius: 16,
      padding: 24,
      border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
      boxShadow: isDark
        ? '0 4px 20px rgba(0,0,0,0.3)'
        : '0 4px 20px rgba(0,0,0,0.08)',
    }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#f1f5f9' : '#1e293b', marginBottom: 4 }}>
          🔔 Activités Récentes
        </h3>
        <p style={{ fontSize: 11, color: isDark ? '#64748b' : '#94a3b8' }}>
          {activities.length} activités ces 7 derniers jours
        </p>
      </div>

      {activities.length === 0 ? (
        <div style={{
          height: 120,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: isDark ? '#64748b' : '#94a3b8',
        }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>📭</div>
          <div style={{ fontSize: 12 }}>Aucune activité récente</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {activities.slice(0, 5).map((activity, index) => (
            <div
              key={activity.id}
              style={{
                display: 'flex',
                gap: 12,
                padding: 12,
                background: isDark ? '#0f172a' : '#f8fafc',
                borderRadius: 8,
                marginBottom: 8,
                transition: 'background 0.2s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isDark ? '#334155' : '#e2e8f0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isDark ? '#0f172a' : '#f8fafc';
              }}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: `${getActivityColor(activity.type)}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                flexShrink: 0,
              }}>
                {getActivityIcon(activity.type)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: isDark ? '#f1f5f9' : '#1e293b',
                  marginBottom: 4,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {activity.message}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 11, color: isDark ? '#64748b' : '#94a3b8' }}>
                    {activity.user && (
                      <span style={{ marginRight: 8 }}>
                        👤 {activity.user}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 10, color: isDark ? '#475569' : '#cbd5e1' }}>
                    {formatTimeAgo(activity.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activities.length > 0 && (
        <div style={{
          marginTop: 16,
          paddingTop: 16,
          borderTop: `1px solid ${isDark ? '#334155' : '#f1f5f9'}`,
          textAlign: 'center',
        }}>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: isDark ? '#6490ff' : '#6490ff',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              padding: '8px 16px',
              borderRadius: 6,
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isDark ? '#1e293b' : '#eff6ff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'none';
            }}
          >
            Voir toutes les activités →
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
