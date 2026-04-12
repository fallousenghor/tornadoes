// Stats Cards Component - Performance Module
// Displays key performance metrics in a card layout

import React from 'react';
import { Card } from '../../../../components/common';
import { Colors } from '../../../../constants/theme';
import type { PerformanceStats } from '../types';

interface StatsCardsProps {
  stats: PerformanceStats;
  loading: boolean;
  atRiskObjectives: number;
}

interface StatCardData {
  label: string;
  value: string | number;
  icon: string;
  iconBg: string;
  iconColor: string;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, loading, atRiskObjectives }) => {
  const cards: StatCardData[] = [
    {
      label: 'Évaluations',
      value: loading ? '...' : stats.totalReviews,
      icon: '☰',
      iconBg: 'rgba(100, 140, 255, 0.15)',
      iconColor: '#6490ff',
    },
    {
      label: 'Note Moyenne',
      value: loading ? '...' : stats.avgRating,
      icon: '★',
      iconBg: 'rgba(251, 191, 36, 0.15)',
      iconColor: '#fbbf24',
    },
    {
      label: 'Excellents',
      value: loading ? '...' : stats.excellentReviews,
      icon: '✓',
      iconBg: 'rgba(62, 207, 142, 0.15)',
      iconColor: '#3ecf8e',
    },
    {
      label: 'En attente',
      value: loading ? '...' : stats.pendingReviews,
      icon: '⏳',
      iconBg: 'rgba(251, 146, 60, 0.15)',
      iconColor: '#fb923c',
    },
    {
      label: 'Objectifs',
      value: loading ? '...' : stats.totalObjectives,
      icon: '◎',
      iconBg: 'rgba(45, 212, 191, 0.15)',
      iconColor: '#2dd4bf',
    },
    {
      label: 'À risque',
      value: loading ? '...' : atRiskObjectives,
      icon: '⚠',
      iconBg: atRiskObjectives > 0 ? 'rgba(224, 80, 80, 0.15)' : 'rgba(62, 207, 142, 0.15)',
      iconColor: atRiskObjectives > 0 ? '#e05050' : '#3ecf8e',
    },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16, marginBottom: 24 }}>
      {cards.map((card, index) => (
        <Card key={index} style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ 
              width: 48, 
              height: 48, 
              borderRadius: 12, 
              background: card.iconBg, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: 20,
              color: card.iconColor,
            }}>
              {card.icon}
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {card.label}
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: Colors.text }}>
                {card.value}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsCards;

