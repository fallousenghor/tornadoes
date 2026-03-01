// Treasury Page - Finance Module
// Complete treasury management with cash flow, transactions, and analytics

import React, { useState, useMemo } from 'react';
import { Card, Button, Badge, SearchInput, Modal } from '../../components/common';
import { Colors } from '../../constants/theme';
import { cashFlowData, invoicesData, employeesData, deptPerformance } from '../../data/mockData';

// Transaction type
interface TransactionDisplay {
  id: string;
  date: Date;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  centerOfCost?: string;
  reference?: string;
}

// Generate mock transactions
const generateTransactions = (): TransactionDisplay[] => {
  const categories = {
    income: ['Ventes Services', 'Formation', 'Consulting', 'Souscription', 'Autre Recette'],
    expense: ['Salaires', 'Loyer', 'Fournitures', 'Équipements', 'Marketing', 'Services', 'Transport'],
  };
  
  const transactions: TransactionDisplay[] = [];
  
  // Generate income transactions
  for (let i = 0; i < 15; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 60));
    
    transactions.push({
      id: `inc-${i}`,
      date,
      type: 'income',
      category: categories.income[Math.floor(Math.random() * categories.income.length)],
      amount: Math.floor(Math.random() * 500000) + 50000,
      description: 'Paiement client #INV-' + Math.floor(Math.random() * 3000 + 2000),
      centerOfCost: 'Direction',
      reference: 'REC-' + (Math.floor(Math.random() * 9000) + 1000),
    });
  }
  
  // Generate expense transactions
  for (let i = 0; i < 20; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 60));
    
    transactions.push({
      id: `exp-${i}`,
      date,
      type: 'expense',
      category: categories.expense[Math.floor(Math.random() * categories.expense.length)],
      amount: Math.floor(Math.random() * 300000) + 10000,
      description: 'Facture #FAC-' + Math.floor(Math.random() * 2000 + 1000),
      centerOfCost: deptPerformance[Math.floor(Math.random() * deptPerformance.length)].name,
      reference: 'DEP-' + (Math.floor(Math.random() * 9000) + 1000),
    });
  }
  
  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const Treasury: React.FC = () => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  // Generate mock data
  const transactions = useMemo(() => generateTransactions(), []);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const matchesSearch = 
        transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (transaction.reference && transaction.reference.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
      const matchesCategory = categoryFilter === 'all' || transaction.category === categoryFilter;
      
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [transactions, searchQuery, typeFilter, categoryFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpenses;
    
    // Current month stats
    const now = new Date();
    const currentMonthIncome = transactions
      .filter(t => t.type === 'income' && t.date.getMonth() === now.getMonth())
      .reduce((sum, t) => sum + t.amount, 0);
    const currentMonthExpenses = transactions
      .filter(t => t.type === 'expense' && t.date.getMonth() === now.getMonth())
      .reduce((sum, t) => sum + t.amount, 0);
    
    return { 
      totalIncome, 
      totalExpenses, 
      balance,
      currentMonthIncome,
      currentMonthExpenses,
    };
  }, [transactions]);

  // Cash flow totals
  const cashFlowTotals = useMemo(() => {
    const totalIncomes = cashFlowData.reduce((sum, d) => sum + d.incomes, 0);
    const totalExpenses = cashFlowData.reduce((sum, d) => sum + d.expenses, 0);
    return { totalIncomes, totalExpenses };
  }, []);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
  };

  // Get unique categories
  const categories = useMemo(() => {
    const cats = new Set(transactions.map(t => t.category));
    return Array.from(cats);
  }, [transactions]);

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: Colors.text, marginBottom: 4 }}>
            Gestion de la Trésorerie
          </h1>
          <p style={{ fontSize: 13, color: Colors.textMuted }}>
            Flux de trésorerie · Transactions · Soldes
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          + Nouvelle transaction
        </Button>
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
                Total Entrées
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {formatCurrency(stats.totalIncome)}
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
                Total Sorties
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {formatCurrency(stats.totalExpenses)}
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
              background: stats.balance >= 0 ? 'rgba(100, 140, 255, 0.15)' : 'rgba(224, 80, 80, 0.15)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: 20,
              color: stats.balance >= 0 ? '#6490ff' : '#e05050',
            }}>
              ◆
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Solde Net
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: stats.balance >= 0 ? Colors.text : '#e05050', fontFamily: "'DM Serif Display', serif" }}>
                {formatCurrency(stats.balance)}
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
              background: stats.currentMonthIncome - stats.currentMonthExpenses >= 0 ? 'rgba(62, 207, 142, 0.15)' : 'rgba(224, 80, 80, 0.15)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: 20,
              color: stats.currentMonthIncome - stats.currentMonthExpenses >= 0 ? '#3ecf8e' : '#e05050',
            }}>
              ◈
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Ce mois
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {formatCurrency(stats.currentMonthIncome - stats.currentMonthExpenses)}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Cash Flow Chart & Expenses by Category */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: Colors.text, marginBottom: 16 }}>
            Flux de Trésorerie (6 derniers mois)
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: 180 }}>
            {cashFlowData.map((month, idx) => {
              const maxValue = Math.max(month.incomes, month.expenses);
              const incomeHeight = (month.incomes / 1500000) * 140;
              const expenseHeight = (month.expenses / 1500000) * 140;
              
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 140 }}>
                    <div style={{ 
                      width: 32, 
                      height: `${incomeHeight}px`, 
                      background: '#3ecf8e', 
                      borderRadius: 4,
                      minHeight: 20,
                    }} />
                    <div style={{ 
                      width: 32, 
                      height: `${expenseHeight}px`, 
                      background: '#e05050', 
                      borderRadius: 4,
                      minHeight: 20,
                    }} />
                  </div>
                  <span style={{ fontSize: 11, color: Colors.textMuted, fontWeight: 500 }}>{month.month}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, background: '#3ecf8e' }} />
              <span style={{ fontSize: 10, color: Colors.textMuted }}>Entrées</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 2, background: '#e05050' }} />
              <span style={{ fontSize: 10, color: Colors.textMuted }}>Sorties</span>
            </div>
          </div>
        </Card>
        
        <Card style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: Colors.text, marginBottom: 16 }}>
            Répartition des Dépenses
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { name: 'Salaires', value: 45, color: '#6490ff' },
              { name: 'Loyer', value: 20, color: '#3ecf8e' },
              { name: 'Équipements', value: 15, color: '#fb923c' },
              { name: 'Marketing', value: 12, color: '#a78bfa' },
              { name: 'Autres', value: 8, color: '#2dd4bf' },
            ].map((item, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: Colors.textMuted }}>{item.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: Colors.text }}>{item.value}%</span>
                </div>
                <div style={{ 
                  height: 8, 
                  background: 'rgba(100, 140, 255, 0.1)', 
                  borderRadius: 4, 
                  overflow: 'hidden',
                }}>
                  <div style={{ 
                    width: `${item.value}%`, 
                    height: '100%', 
                    background: item.color,
                    borderRadius: 4,
                  }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${Colors.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: Colors.textMuted }}>Total entrées</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#3ecf8e' }}>{formatCurrency(cashFlowTotals.totalIncomes)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <span style={{ fontSize: 11, color: Colors.textMuted }}>Total sorties</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#e05050' }}>{formatCurrency(cashFlowTotals.totalExpenses)}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters Card */}
      <Card style={{ marginBottom: 20, padding: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, alignItems: 'end' }}>
          <SearchInput 
            placeholder="Rechercher par description, catégorie, référence..."
            value={searchQuery}
            onChange={(value: string) => { setSearchQuery(value); handleFilterChange(); }}
          />
          <div>
            <label style={{ display: 'block', fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>
              Type
            </label>
            <select 
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); handleFilterChange(); }}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: `1px solid ${Colors.border}`,
                background: Colors.bg,
                color: Colors.text,
                fontSize: 13,
              }}
            >
              <option value="all">Tous les types</option>
              <option value="income">Entrées</option>
              <option value="expense">Sorties</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>
              Catégorie
            </label>
            <select 
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); handleFilterChange(); }}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: `1px solid ${Colors.border}`,
                background: Colors.bg,
                color: Colors.text,
                fontSize: 13,
              }}
            >
              <option value="all">Toutes les catégories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Transactions Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(100, 140, 255, 0.05)' }}>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Référence</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Catégorie</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Centre de coût</th>
                <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Montant</th>
                <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map((transaction, index) => (
                <tr 
                  key={transaction.id} 
                  style={{ 
                    borderBottom: `1px solid ${Colors.border}`,
                    background: index % 2 === 0 ? 'transparent' : 'rgba(100, 140, 255, 0.02)',
                  }}
                >
                  <td style={{ padding: '14px 16px', fontSize: 13, color: Colors.textMuted }}>
                    {transaction.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 12, fontFamily: 'monospace', color: Colors.accent }}>
                    {transaction.reference}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: 6, 
                      fontSize: 11, 
                      fontWeight: 500,
                      background: transaction.type === 'income' ? 'rgba(62, 207, 142, 0.15)' : 'rgba(224, 80, 80, 0.15)', 
                      color: transaction.type === 'income' ? '#3ecf8e' : '#e05050',
                    }}>
                      {transaction.category}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: Colors.text }}>
                    {transaction.description}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: Colors.textMuted }}>
                    {transaction.centerOfCost || '—'}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 14, fontWeight: 600, fontFamily: "'DM Serif Display', serif", color: transaction.type === 'income' ? '#3ecf8e' : '#e05050' }}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button style={{ 
                      padding: '6px 12px', 
                      borderRadius: 6, 
                      border: `1px solid ${Colors.border}`, 
                      background: 'transparent', 
                      color: Colors.textMuted, 
                      fontSize: 11, 
                      cursor: 'pointer',
                    }}>
                      ✎ Détails
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '16px 20px',
          borderTop: `1px solid ${Colors.border}`,
        }}>
          <div style={{ fontSize: 12, color: Colors.textMuted }}>
            Affichage de {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} sur {filteredTransactions.length}
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              style={{
                padding: '8px 14px',
                borderRadius: 6,
                border: `1px solid ${Colors.border}`,
                background: 'transparent',
                color: currentPage === 1 ? Colors.textMuted : Colors.text,
                fontSize: 12,
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.5 : 1,
              }}
            >
              ← Précédent
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                style={{
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: page === currentPage ? `1px solid ${Colors.accent}` : `1px solid ${Colors.border}`,
                  background: page === currentPage ? 'rgba(100, 140, 255, 0.15)' : 'transparent',
                  color: page === currentPage ? Colors.accent : Colors.text,
                  fontSize: 12,
                  cursor: 'pointer',
                }}
              >
                {page}
              </button>
            ))}
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              style={{
                padding: '8px 14px',
                borderRadius: 6,
                border: `1px solid ${Colors.border}`,
                background: 'transparent',
                color: currentPage === totalPages ? Colors.textMuted : Colors.text,
                fontSize: 12,
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages ? 0.5 : 1,
              }}
            >
              Suivant →
            </button>
          </div>
        </div>
      </Card>

      {/* New Transaction Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Nouvelle transaction"
        size="lg"
      >
        <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Type</label>
              <div style={{ display: 'flex', gap: 12 }}>
                <label style={{ 
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px',
                  borderRadius: 8,
                  border: `1px solid ${Colors.border}`,
                  cursor: 'pointer',
                  fontSize: 13,
                  color: Colors.text,
                  background: 'rgba(62, 207, 142, 0.05)',
                }}>
                  <input type="radio" name="type" value="income" style={{ marginRight: 8 }} />
                  Entrée
                </label>
                <label style={{ 
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px',
                  borderRadius: 8,
                  border: `1px solid ${Colors.border}`,
                  cursor: 'pointer',
                  fontSize: 13,
                  color: Colors.text,
                }}>
                  <input type="radio" name="type" value="expense" style={{ marginRight: 8 }} />
                  Sortie
                </label>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Date</label>
              <input 
                type="date" 
                defaultValue={new Date().toISOString().split('T')[0]}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 8,
                  border: `1px solid ${Colors.border}`,
                  background: Colors.bg,
                  color: Colors.text,
                  fontSize: 13,
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Catégorie</label>
              <select 
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 8,
                  border: `1px solid ${Colors.border}`,
                  background: Colors.bg,
                  color: Colors.text,
                  fontSize: 13,
                }}
              >
                <option value="">Sélectionner une catégorie</option>
                <option value="income">Ventes Services</option>
                <option value="income">Formation</option>
                <option value="income">Consulting</option>
                <option value="expense">Salaires</option>
                <option value="expense">Loyer</option>
                <option value="expense">Fournitures</option>
                <option value="expense">Équipements</option>
                <option value="expense">Marketing</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Montant (€)</label>
              <input 
                type="number" 
                placeholder="0"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 8,
                  border: `1px solid ${Colors.border}`,
                  background: Colors.bg,
                  color: Colors.text,
                  fontSize: 13,
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Centre de coût</label>
              <select 
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 8,
                  border: `1px solid ${Colors.border}`,
                  background: Colors.bg,
                  color: Colors.text,
                  fontSize: 13,
                }}
              >
                <option value="">Sélectionner un centre de coût</option>
                {deptPerformance.map(dept => (
                  <option key={dept.id} value={dept.name}>{dept.name}</option>
                ))}
                <option value="Direction">Direction</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Référence</label>
              <input 
                type="text" 
                placeholder="REC-0001 ou DEP-0001"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 8,
                  border: `1px solid ${Colors.border}`,
                  background: Colors.bg,
                  color: Colors.text,
                  fontSize: 13,
                }}
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Description</label>
              <textarea 
                placeholder="Description de la transaction..."
                rows={2}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 8,
                  border: `1px solid ${Colors.border}`,
                  background: Colors.bg,
                  color: Colors.text,
                  fontSize: 13,
                  resize: 'vertical',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Enregistrer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Treasury;

