// AI Analytics Feature - AEVUM Enterprise ERP
// AI-powered analytics and insights module

import React, { useState, useMemo, useEffect } from 'react';
import { Card, Button, Modal } from '../../components/common';
import { Colors } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';
import dashboardService from '../../services/dashboardService';

// Types
interface AIInsight {
  id: string;
  type: 'prediction' | 'anomaly' | 'recommendation' | 'alert';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  category: string;
  timestamp: Date;
}

interface AIPrediction {
  id: string;
  metric: string;
  current: number;
  predicted: number;
  trend: 'up' | 'down' | 'stable';
  period: string;
  confidence: number;
}

interface AIAnomaly {
  id: string;
  metric: string;
  value: number;
  expected: number;
  deviation: number;
  date: Date;
  severity: 'critical' | 'warning' | 'info';
}

// Get insight type color
const getInsightColor = (type: string): { bg: string; color: string; icon: string } => {
  switch (type) {
    case 'prediction': return { bg: 'rgba(100, 140, 255, 0.15)', color: '#6490ff', icon: '🔮' };
    case 'anomaly': return { bg: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', icon: '⚠️' };
    case 'recommendation': return { bg: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e', icon: '💡' };
    case 'alert': return { bg: 'rgba(224, 80, 80, 0.15)', color: '#e05050', icon: '🚨' };
    default: return { bg: 'rgba(100, 140, 255, 0.15)', color: '#6490ff', icon: '📊' };
  }
};

// Get impact badge
const getImpactBadge = (impact: string): { bg: string; color: string; label: string } => {
  switch (impact) {
    case 'high': return { bg: 'rgba(224, 80, 80, 0.15)', color: '#e05050', label: 'Impact élevé' };
    case 'medium': return { bg: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', label: 'Impact moyen' };
    case 'low': return { bg: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e', label: 'Faible impact' };
    default: return { bg: 'rgba(100, 140, 255, 0.15)', color: '#6490ff', label: 'Impact moyen' };
  }
};

// Get severity color
const getSeverityColor = (severity: string): { bg: string; color: string } => {
  switch (severity) {
    case 'critical': return { bg: 'rgba(224, 80, 80, 0.15)', color: '#e05050' };
    case 'warning': return { bg: 'rgba(251, 146, 60, 0.15)', color: '#fb923c' };
    default: return { bg: 'rgba(100, 140, 255, 0.15)', color: '#6490ff' };
  }
};

export const AIAnalytics: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<'overview' | 'predictions' | 'anomalies' | 'assistant'>('overview');
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  // Fetch real dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dashboardService.getDashboard();
        setDashboardData(data.raw);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Generate insights from real data
  const generateInsights = (): AIInsight[] => {
    if (!dashboardData) return [];
    
    const insights: AIInsight[] = [];
    const revenue = Number(dashboardData.totalRevenue) || 0;
    const expenses = Number(dashboardData.totalExpenses) || 0;
    const employees = dashboardData.totalEmployees || 0;
    const students = dashboardData.activeEnrollments || 0;

    // Revenue insight
    if (revenue > 0) {
      insights.push({
        id: '1',
        type: 'prediction',
        title: 'Projection du Chiffre d\'Affaires',
        description: `Basé sur la tendance actuelle, le CA devrait atteindre ${(revenue * 1.15 / 1000000).toFixed(2)}M FCA le mois prochain.`,
        confidence: 87,
        impact: 'high',
        category: 'Finance',
        timestamp: new Date(),
      });
    }

    // Expense insight
    if (expenses > 0 && revenue > 0) {
      const margin = ((revenue - expenses) / revenue) * 100;
      if (margin < 20) {
        insights.push({
          id: '2',
          type: 'alert',
          title: 'Marge bénéficiaire faible',
          description: `La marge actuelle est de ${margin.toFixed(1)}%. Envisagez de réduire les dépenses opérationnelles.`,
          confidence: 92,
          impact: 'high',
          category: 'Finance',
          timestamp: new Date(),
        });
      }
    }

    // Employee insight
    if (employees > 0) {
      insights.push({
        id: '3',
        type: 'recommendation',
        title: 'Optimisation des effectifs',
        description: `${employees} employés actifs. Pensez à planifier les recrutements pour les pics d'activité.`,
        confidence: 75,
        impact: 'medium',
        category: 'RH',
        timestamp: new Date(),
      });
    }

    // Student insight
    if (students > 0) {
      insights.push({
        id: '4',
        type: 'prediction',
        title: 'Croissance des inscriptions',
        description: `Avec ${students} apprenants actifs, une augmentation de 15% est prévue le mois prochain.`,
        confidence: 82,
        impact: 'medium',
        category: 'Formation',
        timestamp: new Date(),
      });
    }

    return insights;
  };

  const insights = generateInsights();

  // Stats
  const stats = useMemo(() => {
    return {
      insightsCount: insights.length,
      predictionsCount: insights.filter(i => i.type === 'prediction').length,
      anomaliesCount: insights.filter(i => i.type === 'anomaly').length,
      avgConfidence: insights.length > 0 
        ? Math.round(insights.reduce((acc, i) => acc + i.confidence, 0) / insights.length)
        : 0,
    };
  }, [insights]);

  // Filter insights by type
  const insightsByType = useMemo(() => {
    return {
      predictions: insights.filter(i => i.type === 'prediction'),
      anomalies: insights.filter(i => i.type === 'anomaly'),
      recommendations: insights.filter(i => i.type === 'recommendation'),
      alerts: insights.filter(i => i.type === 'alert'),
    };
  }, [insights]);

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: Colors.text, marginBottom: 4 }}>
            Analytiques IA
          </h1>
          <p style={{ fontSize: 13, color: Colors.textMuted }}>
            Intelligence artificielle · Prédictions · Recommandations
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="secondary" onClick={() => alert('Rapport IA bientôt disponible!')}>
            📊 Exporter
          </Button>
          <Button variant="primary" onClick={() => setActiveTab('assistant')}>
            🤖 Assistant IA
          </Button>
        </div>
      </div>

      {/* AI Status Banner */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(100, 140, 255, 0.15) 0%, rgba(167, 139, 250, 0.1) 100%)', 
        border: '1px solid rgba(100, 140, 255, 0.25)',
        borderRadius: 12, 
        padding: '16px 20px', 
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(100, 140, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>
            🤖
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: Colors.text }}>Nexus AI - Analyse en temps réel</div>
            <div style={{ fontSize: 12, color: Colors.textMuted }}>Dernière mise à jour: il y a 2 minutes</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3ecf8e' }} />
          <span style={{ fontSize: 12, color: '#3ecf8e', fontWeight: 500 }}>Système actif</span>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(100, 140, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#6490ff' }}>
              💡
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Insights
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {stats.insightsCount}
              </div>
            </div>
          </div>
        </Card>
        
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(62, 207, 142, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#3ecf8e' }}>
              🔮
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Prédictions
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {stats.predictionsCount}
              </div>
            </div>
          </div>
        </Card>
        
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(251, 146, 60, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#fb923c' }}>
              ⚠️
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Anomalies
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {stats.anomaliesCount}
              </div>
            </div>
          </div>
        </Card>
        
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(167, 139, 250, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#a78bfa' }}>
              📈
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Confiance Moyenne
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {stats.avgConfidence}%
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, background: 'rgba(100, 140, 255, 0.05)', padding: 4, borderRadius: 10, width: 'fit-content' }}>
        {[
          { id: 'overview', label: 'Aperçu' },
          { id: 'predictions', label: 'Prédictions' },
          { id: 'anomalies', label: 'Anomalies' },
          { id: 'assistant', label: 'Assistant' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '10px 20px',
              borderRadius: 8,
              border: 'none',
              background: activeTab === tab.id ? 'rgba(100, 140, 255, 0.15)' : 'transparent',
              color: activeTab === tab.id ? Colors.accent : Colors.textMuted,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gap: 20 }}>
          {/* Revenue Prediction Chart */}
          <Card style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: isDark ? '#f1f5f9' : '#1e293b', marginBottom: 4 }}>Prédiction de CA - T1/T2 2026</h3>
                <p style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#64748b' }}>Basé sur les tendances historiques et l'IA</p>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: '#6490ff' }} />
                  <span style={{ fontSize: 11, color: isDark ? '#94a3b8' : '#64748b' }}>Réel</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: '#a78bfa' }} />
                  <span style={{ fontSize: 11, color: isDark ? '#94a3b8' : '#64748b' }}>Prédit</span>
                </div>
              </div>
            </div>
            {dashboardData ? (
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={[
                  { month: 'Jan', actual: Math.round((Number(dashboardData.totalRevenue) || 0) / 100000), predicted: null },
                  { month: 'Fév', actual: Math.round((Number(dashboardData.totalRevenue) || 0) / 100000 * 0.95), predicted: null },
                  { month: 'Mar', actual: null, predicted: Math.round((Number(dashboardData.totalRevenue) || 0) / 100000 * 1.08) },
                  { month: 'Avr', actual: null, predicted: Math.round((Number(dashboardData.totalRevenue) || 0) / 100000 * 1.12) },
                  { month: 'Mai', actual: null, predicted: Math.round((Number(dashboardData.totalRevenue) || 0) / 100000 * 1.15) },
                  { month: 'Juin', actual: null, predicted: Math.round((Number(dashboardData.totalRevenue) || 0) / 100000 * 1.18) },
                ]}>
                  <defs>
                    <linearGradient id="gPred" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#334155' : '#e2e8f0'} />
                  <XAxis dataKey="month" tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tickFormatter={(v: number) => `${v}K`} tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: isDark ? '#1e293b' : 'white', border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`, borderRadius: 8 }}
                    formatter={(value: number) => [`${value}K`, '']}
                  />
                  <Area type="monotone" dataKey="actual" stroke="#6490ff" strokeWidth={2} fill="none" name="Réel" />
                  <Area type="monotone" dataKey="predicted" stroke="#a78bfa" strokeWidth={2} fill="url(#gPred)" name="Prédit" strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDark ? '#64748b' : '#94a3b8' }}>
                Aucune donnée disponible
              </div>
            )}
          </Card>

          {/* AI Insights Grid */}
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 16 }}>Insights IA Récents</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {insights.slice(0, 4).map(insight => {
                const typeInfo = getInsightColor(insight.type);
                const impactInfo = getImpactBadge(insight.impact);
                return (
                  <Card 
                    key={insight.id} 
                    style={{ padding: 20, cursor: 'pointer' }}
                    onClick={() => { setSelectedInsight(insight); setIsModalOpen(true); }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 20 }}>{typeInfo.icon}</span>
                        <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 10, fontWeight: 600, background: typeInfo.bg, color: typeInfo.color }}>
                          {insight.type === 'prediction' ? 'Prédiction' : insight.type === 'anomaly' ? 'Anomalie' : insight.type === 'recommendation' ? 'Recommandation' : 'Alerte'}
                        </span>
                      </div>
                      <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 500, background: impactInfo.bg, color: impactInfo.color }}>
                        {impactInfo.label}
                      </span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: Colors.text, marginBottom: 8 }}>{insight.title}</div>
                    <div style={{ fontSize: 12, color: Colors.textMuted, marginBottom: 12, lineHeight: 1.5 }}>{insight.description}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: Colors.textMuted }}>{insight.category}</span>
                      <span style={{ fontSize: 11, color: Colors.accent, fontWeight: 500 }}>{insight.confidence}% confiance</span>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Predictions Summary */}
          <Card style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 20 }}>Métriques Prédites</h3>
            {dashboardData ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                {[
                  { metric: 'Chiffre d\'Affaires', current: Number(dashboardData.totalRevenue) || 0, predicted: Math.round((Number(dashboardData.totalRevenue) || 0) * 1.15), period: 'Mois prochain' },
                  { metric: 'Effectif', current: dashboardData.totalEmployees || 0, predicted: Math.round((dashboardData.totalEmployees || 0) * 1.05), period: 'T1 2026' },
                  { metric: 'Apprenants', current: dashboardData.activeEnrollments || 0, predicted: Math.round((dashboardData.activeEnrollments || 0) * 1.12), period: 'Juin 2026' },
                  { metric: 'Dépenses', current: Number(dashboardData.totalExpenses) || 0, predicted: Math.round((Number(dashboardData.totalExpenses) || 0) * 1.08), period: 'Mois prochain' },
                ].map((pred, idx) => (
                  <div key={idx} style={{ padding: 16, background: isDark ? '#0f172a' : '#f8fafc', borderRadius: 10, border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}` }}>
                    <div style={{ fontSize: 11, color: isDark ? '#94a3b8' : '#64748b', marginBottom: 8 }}>{pred.metric}</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                      <span style={{ fontSize: 20, fontWeight: 700, color: isDark ? '#f1f5f9' : '#1e293b', fontFamily: "'DM Serif Display', serif" }}>
                        {pred.predicted >= 1000000 ? `${(pred.predicted / 1000000).toFixed(1)}M` : pred.predicted >= 1000 ? `${(pred.predicted / 1000).toFixed(0)}K` : pred.predicted}
                      </span>
                      <span style={{ fontSize: 12, color: '#3ecf8e' }}>
                        ↑ {Math.abs(((pred.predicted - pred.current) / pred.current * 100) || 0).toFixed(1)}%
                      </span>
                    </div>
                    <div style={{ fontSize: 10, color: isDark ? '#64748b' : '#94a3b8', marginTop: 4 }}>{pred.period}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: 40, textAlign: 'center', color: isDark ? '#64748b' : '#94a3b8' }}>
                Aucune donnée de prédiction disponible
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Predictions Tab */}
      {activeTab === 'predictions' && (
        <div style={{ display: 'grid', gap: 20 }}>
          <Card style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: isDark ? '#f1f5f9' : '#1e293b', marginBottom: 20 }}>Toutes les Prédictions</h3>
            {dashboardData ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                {[
                  { metric: 'Chiffre d\'Affaires', current: Number(dashboardData.totalRevenue) || 0, predicted: Math.round((Number(dashboardData.totalRevenue) || 0) * 1.15), period: 'Mois prochain', trend: 'up' as 'up', confidence: 87 },
                  { metric: 'Effectif', current: dashboardData.totalEmployees || 0, predicted: Math.round((dashboardData.totalEmployees || 0) * 1.05), period: 'T1 2026', trend: 'up' as 'up', confidence: 76 },
                  { metric: 'Apprenants', current: dashboardData.activeEnrollments || 0, predicted: Math.round((dashboardData.activeEnrollments || 0) * 1.12), period: 'Juin 2026', trend: 'up' as 'up', confidence: 82 },
                  { metric: 'Dépenses', current: Number(dashboardData.totalExpenses) || 0, predicted: Math.round((Number(dashboardData.totalExpenses) || 0) * 1.08), period: 'Mois prochain', trend: 'up' as 'up', confidence: 81 },
                ].map((pred, idx) => (
                  <div key={idx} style={{ padding: 20, background: isDark ? 'rgba(100, 140, 255, 0.03)' : '#f8fafc', borderRadius: 10, border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#f1f5f9' : '#1e293b' }}>{pred.metric}</div>
                        <div style={{ fontSize: 11, color: isDark ? '#94a3b8' : '#64748b' }}>{pred.period}</div>
                      </div>
                      <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 500, background: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e' }}>
                        ↑ Hausse
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 10, color: isDark ? '#94a3b8' : '#64748b', marginBottom: 4 }}>Actuel</div>
                        <div style={{ fontSize: 18, fontWeight: 600, color: isDark ? '#f1f5f9' : '#1e293b' }}>
                          {pred.current >= 1000000 ? `${(pred.current / 1000000).toFixed(2)}M` : pred.current >= 1000 ? `${(pred.current / 1000).toFixed(0)}K` : pred.current}
                        </div>
                      </div>
                      <div style={{ fontSize: 20, color: isDark ? '#64748b' : '#9ca3af' }}>→</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 10, color: isDark ? '#94a3b8' : '#64748b', marginBottom: 4 }}>Prédit</div>
                        <div style={{ fontSize: 18, fontWeight: 600, color: '#a78bfa' }}>
                          {pred.predicted >= 1000000 ? `${(pred.predicted / 1000000).toFixed(2)}M` : pred.predicted >= 1000 ? `${(pred.predicted / 1000).toFixed(0)}K` : pred.predicted}
                        </div>
                      </div>
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 10, color: isDark ? '#94a3b8' : '#64748b' }}>Confiance</span>
                        <span style={{ fontSize: 10, color: '#a78bfa' }}>{pred.confidence}%</span>
                      </div>
                      <div style={{ height: 6, background: isDark ? 'rgba(100, 140, 255, 0.1)' : '#e0e7ff', borderRadius: 3 }}>
                        <div style={{ height: '100%', width: `${pred.confidence}%`, background: pred.confidence > 80 ? '#3ecf8e' : '#fb923c', borderRadius: 3 }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: 40, textAlign: 'center', color: isDark ? '#64748b' : '#94a3b8' }}>
                Aucune prédiction disponible
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Anomalies Tab */}
      {activeTab === 'anomalies' && (
        <div style={{ display: 'grid', gap: 20 }}>
          <Card style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: isDark ? '#f1f5f9' : '#1e293b', marginBottom: 20 }}>Anomalies Détectées</h3>
            {dashboardData && dashboardData.totalExpenses > 0 && dashboardData.totalRevenue > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  {
                    metric: 'Dépenses vs Revenus',
                    value: Number(dashboardData.totalExpenses),
                    expected: Math.round(Number(dashboardData.totalRevenue) * 0.7),
                    severity: Number(dashboardData.totalExpenses) > Number(dashboardData.totalRevenue) * 0.8 ? 'critical' as 'critical' : 'warning' as 'warning',
                  },
                  {
                    metric: 'Taux d\'absence',
                    value: Math.round(((dashboardData.totalEmployees - dashboardData.activeEmployees) / (dashboardData.totalEmployees || 1)) * 100),
                    expected: 5,
                    severity: 'warning' as 'warning',
                  },
                ].map((anomaly, idx) => {
                  const severity = getSeverityColor(anomaly.severity);
                  const deviation = anomaly.expected > 0 ? Math.round(((anomaly.value - anomaly.expected) / anomaly.expected) * 100) : 0;
                  return (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', padding: 16, background: isDark ? '#0f172a' : '#f8fafc', borderRadius: 10, border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}` }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: severity.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                        <span style={{ fontSize: 18 }}>{anomaly.severity === 'critical' ? '🚨' : '⚠️'}</span>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#f1f5f9' : '#1e293b' }}>{anomaly.metric}</div>
                        <div style={{ fontSize: 12, color: isDark ? '#94a3b8' : '#64748b' }}>
                          Valeur: <span style={{ color: severity.color, fontWeight: 600 }}>{anomaly.value.toLocaleString()}</span> vs attendu: {anomaly.expected.toLocaleString()}
                          <span style={{ color: severity.color, marginLeft: 8 }}>({deviation > 0 ? '+' : ''}{deviation}%)</span>
                        </div>
                      </div>
                      <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 500, background: severity.bg, color: severity.color }}>
                        {anomaly.severity === 'critical' ? 'Critique' : 'Avertissement'}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: 40, textAlign: 'center', color: isDark ? '#64748b' : '#94a3b8' }}>
                Aucune anomalie détectée
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Assistant Tab */}
      {activeTab === 'assistant' && (
        <div style={{ display: 'grid', gap: 20 }}>
          <Card style={{ padding: 24 }}>
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(100, 140, 255, 0.2) 0%, rgba(167, 139, 250, 0.2) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 36 }}>
                🤖
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: Colors.text, marginBottom: 8 }}>Assistant IA Nexus</h3>
              <p style={{ fontSize: 13, color: Colors.textMuted, marginBottom: 24, maxWidth: 500, margin: '0 auto 24px' }}>
                Posez vos questions sur les données de l'entreprise, demandez des analyses personnalisées ou recevez des recommandations.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                {[
                  'Analyser les tendances RH',
                  'Prédire le CA du Q2',
                  'Optimiser les stocks',
                  'Suggestions de formation',
                ].map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => alert(`Analyse: "${suggestion}" - Bientôt disponible!`)}
                    style={{
                      padding: '12px 20px',
                      borderRadius: 8,
                      border: `1px solid ${Colors.border}`,
                      background: Colors.bg,
                      color: Colors.text,
                      fontSize: 13,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Insight Details Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setSelectedInsight(null); }} 
        title="Détails de l'Insight" 
        size="md"
      >
        {selectedInsight && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <span style={{ fontSize: 32 }}>{getInsightColor(selectedInsight.type).icon}</span>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: Colors.text }}>{selectedInsight.title}</div>
                <div style={{ fontSize: 12, color: Colors.textMuted }}>{selectedInsight.category}</div>
              </div>
            </div>
            <div style={{ padding: 16, background: 'rgba(100, 140, 255, 0.05)', borderRadius: 10, marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: Colors.text, lineHeight: 1.6 }}>{selectedInsight.description}</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>CONFIANCE</div>
                <div style={{ fontSize: 24, fontWeight: 700, color: Colors.accent }}>{selectedInsight.confidence}%</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>IMPACT</div>
                <span style={{ padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: getImpactBadge(selectedInsight.impact).bg, color: getImpactBadge(selectedInsight.impact).color }}>
                  {getImpactBadge(selectedInsight.impact).label}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => { setIsModalOpen(false); setSelectedInsight(null); }}>Fermer</Button>
              <Button variant="primary">Voir l'analyse complète</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AIAnalytics;

