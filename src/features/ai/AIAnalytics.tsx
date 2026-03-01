// AI Analytics Feature - AEVUM Enterprise ERP
// AI-powered analytics and insights module

import React, { useState, useMemo } from 'react';
import { Card, Button, Modal } from '../../components/common';
import { Colors } from '../../constants/theme';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
} from 'recharts';

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

// Mock AI Insights
const mockInsights: AIInsight[] = [
  { id: '1', type: 'prediction', title: 'Hausse du CA prévue', description: 'Les tendances actuelles suggèrent une augmentation de 22% du chiffre d\'affaires au Q1 2025.', confidence: 92, impact: 'high', category: 'Finance', timestamp: new Date() },
  { id: '2', type: 'anomaly', title: 'Dépenses opérationnelles élevées', description: 'Une augmentation anormale de 18% des dépenses opérationnelles a été détectée ce mois-ci.', confidence: 87, impact: 'high', category: 'Finance', timestamp: new Date() },
  { id: '3', type: 'recommendation', title: 'Optimisation des stocks', description: 'Réduction potentielle de 15% des coûts de stockage en optimisant les niveaux de stock.', confidence: 78, impact: 'medium', category: 'Opérations', timestamp: new Date() },
  { id: '4', type: 'alert', title: 'Factures en attente', description: '3 factures arrivent à échéance dans 48h pour un total de 31 200 €.', confidence: 100, impact: 'medium', category: 'Finance', timestamp: new Date() },
  { id: '5', type: 'prediction', title: 'Tendance recrutement', description: 'Le besoin en développeurs devrait augmenter de 25% dans les 6 prochains mois.', confidence: 73, impact: 'medium', category: 'RH', timestamp: new Date() },
  { id: '6', type: 'recommendation', title: 'Formation recommandée', description: 'Module de cybersécurité suggéré pour 15 apprenants du programme DW.', confidence: 85, impact: 'low', category: 'Formation', timestamp: new Date() },
];

// Mock Predictions
const mockPredictions: AIPrediction[] = [
  { id: '1', metric: 'Chiffre d\'affaires', current: 7.8, predicted: 9.2, trend: 'up', period: 'Q1 2025', confidence: 92 },
  { id: '2', metric: 'Apprenants actifs', current: 1247, predicted: 1450, trend: 'up', period: 'Juin 2025', confidence: 88 },
  { id: '3', metric: 'Taux de présence', current: 91.4, predicted: 93.5, trend: 'up', period: 'Mars 2025', confidence: 76 },
  { id: '4', metric: 'Dépenses', current: 450, predicted: 520, trend: 'up', period: 'Février 2025', confidence: 81 },
];

// Mock Anomalies
const mockAnomalies: AIAnomaly[] = [
  { id: '1', metric: 'Dépenses marketing', value: 85000, expected: 65000, deviation: 30.8, date: new Date(), severity: 'warning' },
  { id: '2', metric: 'Absentéisme', value: 12, expected: 8, deviation: 50, date: new Date(), severity: 'critical' },
  { id: '3', metric: 'Factures impayées', value: 23, expected: 15, deviation: 53.3, date: new Date(), severity: 'warning' },
];

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

// Revenue prediction data
const revenuePredictionData = [
  { month: 'Jan', actual: 7.2, predicted: 7.1 },
  { month: 'Fév', actual: 6.8, predicted: 7.0 },
  { month: 'Mar', actual: 7.5, predicted: 7.4 },
  { month: 'Avr', predicted: 7.8 },
  { month: 'Mai', predicted: 8.2 },
  { month: 'Juin', predicted: 9.2 },
];

// Training performance data
const trainingPerformanceData = [
  { subject: 'DW', completion: 89, prediction: 92 },
  { subject: 'DS', completion: 76, prediction: 81 },
  { subject: 'CYB', completion: 84, prediction: 88 },
  { subject: 'MKD', completion: 91, prediction: 94 },
];

// Engagement data
const engagementData = [
  { name: 'Connexions', value: 45 },
  { name: 'Cours suivis', value: 32 },
  { name: 'Projets', value: 18 },
  { name: 'Examens', value: 5 },
];

export const AIAnalytics: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<'overview' | 'predictions' | 'anomalies' | 'assistant'>('overview');
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Stats
  const stats = useMemo(() => {
    return {
      insightsCount: mockInsights.length,
      predictionsCount: mockPredictions.length,
      anomaliesCount: mockAnomalies.length,
      avgConfidence: Math.round(mockInsights.reduce((acc, i) => acc + i.confidence, 0) / mockInsights.length),
    };
  }, []);

  // Filter insights by type
  const insightsByType = useMemo(() => {
    return {
      predictions: mockInsights.filter(i => i.type === 'prediction'),
      anomalies: mockInsights.filter(i => i.type === 'anomaly'),
      recommendations: mockInsights.filter(i => i.type === 'recommendation'),
      alerts: mockInsights.filter(i => i.type === 'alert'),
    };
  }, []);

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
                <h3 style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 4 }}>Prédiction de CA - Q1/Q2 2025</h3>
                <p style={{ fontSize: 12, color: Colors.textMuted }}>Basé sur les tendances historiques et l'IA</p>
              </div>
              <div style={{ display: 'flex', gap: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: Colors.accent }} />
                  <span style={{ fontSize: 11, color: Colors.textMuted }}>Réel</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: '#a78bfa' }} />
                  <span style={{ fontSize: 11, color: Colors.textMuted }}>Prédit</span>
                </div>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={revenuePredictionData}>
                <defs>
                  <linearGradient id="gPred" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,140,255,0.06)" />
                <XAxis dataKey="month" tick={{ fill: '#5a6480', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={(v: number) => `${v}M€`} tick={{ fill: '#5a6480', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ background: Colors.card, border: '1px solid rgba(100,140,255,0.2)', borderRadius: 8 }}
                  formatter={(value: number) => [`${value}M€`, '']}
                />
                <Area type="monotone" dataKey="actual" stroke={Colors.accent} strokeWidth={2} fill="none" name="Réel" />
                <Area type="monotone" dataKey="predicted" stroke="#a78bfa" strokeWidth={2} fill="url(#gPred)" name="Prédit" strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* AI Insights Grid */}
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 16 }}>Insights IA Récents</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {mockInsights.slice(0, 4).map(insight => {
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
              {mockPredictions.map(pred => (
                <div key={pred.id} style={{ padding: 16, background: 'rgba(100, 140, 255, 0.03)', borderRadius: 10, border: '1px solid rgba(100, 140, 255, 0.08)' }}>
                  <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 8 }}>{pred.metric}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontSize: 24, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>{pred.predicted}</span>
                    <span style={{ fontSize: 12, color: pred.trend === 'up' ? '#3ecf8e' : pred.trend === 'down' ? '#e05050' : Colors.textMuted }}>
                      {pred.trend === 'up' ? '↑' : pred.trend === 'down' ? '↓' : '→'} {Math.abs(((pred.predicted - pred.current) / pred.current * 100)).toFixed(1)}%
                    </span>
                  </div>
                  <div style={{ fontSize: 10, color: Colors.textMuted, marginTop: 4 }}>{pred.period}</div>
                  <div style={{ marginTop: 8, height: 4, background: 'rgba(100, 140, 255, 0.1)', borderRadius: 2 }}>
                    <div style={{ height: '100%', width: `${pred.confidence}%`, background: pred.confidence > 80 ? '#3ecf8e' : pred.confidence > 60 ? '#fb923c' : '#e05050', borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Predictions Tab */}
      {activeTab === 'predictions' && (
        <div style={{ display: 'grid', gap: 20 }}>
          <Card style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 20 }}>Toutes les Prédictions</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
              {mockPredictions.map(pred => (
                <div key={pred.id} style={{ padding: 20, background: 'rgba(100, 140, 255, 0.03)', borderRadius: 10, border: `1px solid ${Colors.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: Colors.text }}>{pred.metric}</div>
                      <div style={{ fontSize: 11, color: Colors.textMuted }}>{pred.period}</div>
                    </div>
                    <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 500, background: pred.trend === 'up' ? 'rgba(62, 207, 142, 0.15)' : pred.trend === 'down' ? 'rgba(224, 80, 80, 0.15)' : 'rgba(100, 140, 255, 0.15)', color: pred.trend === 'up' ? '#3ecf8e' : pred.trend === 'down' ? '#e05050' : Colors.accent }}>
                      {pred.trend === 'up' ? '↑ Hausse' : pred.trend === 'down' ? '↓ Baisse' : '→ Stable'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, color: Colors.textMuted, marginBottom: 4 }}>Actuel</div>
                      <div style={{ fontSize: 18, fontWeight: 600, color: Colors.text }}>{typeof pred.current === 'number' && pred.current > 100 ? Math.round(pred.current).toLocaleString() : pred.current}M€</div>
                    </div>
                    <div style={{ fontSize: 20, color: Colors.textMuted }}>→</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 10, color: Colors.textMuted, marginBottom: 4 }}>Prédit</div>
                      <div style={{ fontSize: 18, fontWeight: 600, color: '#a78bfa' }}>{typeof pred.predicted === 'number' && pred.predicted > 100 ? Math.round(pred.predicted).toLocaleString() : pred.predicted}M€</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: Colors.textMuted }}>Confiance</span>
                      <span style={{ fontSize: 10, color: Colors.accent }}>{pred.confidence}%</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(100, 140, 255, 0.1)', borderRadius: 3 }}>
                      <div style={{ height: '100%', width: `${pred.confidence}%`, background: pred.confidence > 80 ? '#3ecf8e' : '#fb923c', borderRadius: 3 }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Anomalies Tab */}
      {activeTab === 'anomalies' && (
        <div style={{ display: 'grid', gap: 20 }}>
          <Card style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 20 }}>Anomalies Détectées</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {mockAnomalies.map(anomaly => {
                const severity = getSeverityColor(anomaly.severity);
                return (
                  <div key={anomaly.id} style={{ display: 'flex', alignItems: 'center', padding: 16, background: 'rgba(100, 140, 255, 0.03)', borderRadius: 10, border: `1px solid ${Colors.border}` }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: severity.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
                      <span style={{ fontSize: 18 }}>{anomaly.severity === 'critical' ? '🚨' : '⚠️'}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: Colors.text }}>{anomaly.metric}</div>
                      <div style={{ fontSize: 12, color: Colors.textMuted }}>
                        Valeur: <span style={{ color: severity.color, fontWeight: 600 }}>{anomaly.value.toLocaleString()}</span> vs attendu: {anomaly.expected.toLocaleString()} 
                        <span style={{ color: severity.color, marginLeft: 8 }}>(+{anomaly.deviation}%)</span>
                      </div>
                    </div>
                    <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 500, background: severity.bg, color: severity.color }}>
                      {anomaly.severity === 'critical' ? 'Critique' : anomaly.severity === 'warning' ? 'Avertissement' : 'Info'}
                    </span>
                  </div>
                );
              })}
            </div>
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

