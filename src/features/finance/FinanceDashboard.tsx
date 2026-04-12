// Finance Dashboard - Simplified overview page
import React, { useState, useEffect, useCallback } from 'react';
import { Card, Button } from '../../components/common';
import { Colors } from '../../constants/theme';
import { formatCurrency } from '../../utils/currency';
import transactionService from '../../services/transactionService';
import type { TreasurySummary } from '../../types';

export const FinanceDashboard: React.FC = () => {
  const [treasuryData, setTreasuryData] = useState<TreasurySummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const summary = await transactionService.getTreasurySummary();
      setTreasuryData(summary);
    } catch (err) {
      console.error('Error fetching treasury data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: Colors.textMuted }}>
        Chargement du tableau de bord financier...
      </div>
    );
  }

  const totalIncome = treasuryData?.totalIncome || 0;
  const totalExpenses = treasuryData?.totalExpenses || 0;
  const netBalance = totalIncome - totalExpenses;

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: Colors.text, marginBottom: 4 }}>
          Tableau de Bord Financier
        </h1>
        <p style={{ fontSize: 13, color: Colors.textMuted }}>
          Vue d'ensemble · Revenus · Dépenses · Trésorerie
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'rgba(62, 207, 142, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              color: '#3ecf8e',
            }}>
              ↓
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Revenus
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {formatCurrency(totalIncome)}
              </div>
              <div style={{ fontSize: 11, color: Colors.textMuted, marginTop: 4 }}>
                {treasuryData?.incomeCount || 0} transactions
              </div>
            </div>
          </div>
        </Card>

        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'rgba(224, 80, 80, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              color: '#e05050',
            }}>
              ↑
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Dépenses
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {formatCurrency(totalExpenses)}
              </div>
              <div style={{ fontSize: 11, color: Colors.textMuted, marginTop: 4 }}>
                {treasuryData?.expenseCount || 0} transactions
              </div>
            </div>
          </div>
        </Card>

        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: netBalance >= 0 ? 'rgba(100, 140, 255, 0.15)' : 'rgba(224, 80, 80, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              color: netBalance >= 0 ? '#6490ff' : '#e05050',
            }}>
              ◆
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Solde Net
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: netBalance >= 0 ? Colors.text : '#e05050', fontFamily: "'DM Serif Display', serif" }}>
                {formatCurrency(netBalance)}
              </div>
              <div style={{ fontSize: 11, color: netBalance >= 0 ? '#3ecf8e' : '#e05050', marginTop: 4 }}>
                {netBalance >= 0 ? '↑ Positif' : '↓ Négatif'}
              </div>
            </div>
          </div>
        </Card>

        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'rgba(100, 140, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
            }}>
              ⚡
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Actions Rapides
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <Button size="sm" variant="primary" onClick={() => window.location.href = '/finance/invoices'}>
                  Factures
                </Button>
                <Button size="sm" variant="secondary" onClick={() => window.location.href = '/finance/expenses'}>
                  Dépenses
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Transactions & Category Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <Card style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: Colors.text, marginBottom: 16 }}>
            Transactions Récentes
          </h3>
          {treasuryData?.recentTransactions && treasuryData.recentTransactions.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(100, 140, 255, 0.05)' }}>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted }}>Date</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted }}>Description</th>
                    <th style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted }}>Catégorie</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right', fontSize: 11, fontWeight: 600, color: Colors.textMuted }}>Montant</th>
                  </tr>
                </thead>
                <tbody>
                  {treasuryData.recentTransactions.slice(0, 10).map((txn) => (
                    <tr key={txn.id} style={{ borderBottom: `1px solid ${Colors.border}` }}>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: Colors.textMuted }}>
                        {new Date(txn.transactionDate).toLocaleDateString('fr-FR')}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 13, color: Colors.text }}>
                        {txn.description}
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: Colors.textMuted }}>
                        {txn.category}
                      </td>
                      <td style={{ 
                        padding: '12px 16px', 
                        fontSize: 14, 
                        fontWeight: 600, 
                        fontFamily: "'DM Serif Display', serif",
                        textAlign: 'right',
                        color: txn.type === 'INCOME' ? '#3ecf8e' : '#e05050'
                      }}>
                        {txn.type === 'INCOME' ? '+' : '-'}{formatCurrency(txn.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: Colors.textMuted, padding: 20 }}>
              Aucune transaction disponible
            </div>
          )}
        </Card>

        <Card style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: Colors.text, marginBottom: 16 }}>
            Revenus par Catégorie
          </h3>
          {treasuryData?.incomeByCategory && Object.keys(treasuryData.incomeByCategory).length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Object.entries(treasuryData.incomeByCategory).map(([category, amount]) => {
                const percentage = totalIncome > 0 ? (amount / totalIncome) * 100 : 0;
                return (
                  <div key={category}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: Colors.textMuted }}>{category}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: '#3ecf8e' }}>
                        {formatCurrency(amount)}
                      </span>
                    </div>
                    <div style={{
                      height: 8,
                      background: 'rgba(62, 207, 142, 0.1)',
                      borderRadius: 4,
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        width: `${percentage}%`,
                        height: '100%',
                        background: '#3ecf8e',
                        borderRadius: 4,
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', color: Colors.textMuted, padding: 20 }}>
              Aucune donnée de revenus
            </div>
          )}

          <div style={{ marginTop: 24, paddingTop: 16, borderTop: `1px solid ${Colors.border}` }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: Colors.text, marginBottom: 16 }}>
              Dépenses par Catégorie
            </h3>
            {treasuryData?.expensesByCategory && Object.keys(treasuryData.expensesByCategory).length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {Object.entries(treasuryData.expensesByCategory).map(([category, amount]) => {
                  const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                  return (
                    <div key={category}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: Colors.textMuted }}>{category}</span>
                        <span style={{ fontSize: 12, fontWeight: 600, color: '#e05050' }}>
                          {formatCurrency(amount)}
                        </span>
                      </div>
                      <div style={{
                        height: 8,
                        background: 'rgba(224, 80, 80, 0.1)',
                        borderRadius: 4,
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          width: `${percentage}%`,
                          height: '100%',
                          background: '#e05050',
                          borderRadius: 4,
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: Colors.textMuted, padding: 20 }}>
                Aucune donnée de dépenses
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FinanceDashboard;
