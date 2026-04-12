// Treasury Page - Finance Module
// Complete treasury management with cash flow, transactions, and analytics - Backend API Integration

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, Button, Badge, SearchInput, Modal } from '../../components/common';
import { Colors } from '../../constants/theme';
import { useToast } from '../../store/toastStore';
import dashboardService, { CashFlowDataPoint } from '../../services/dashboardService';
import invoiceService from '../../services/invoiceService';
import departmentService from '../../services/departmentService';
import type { Invoice, Department } from '../../types';
import { formatCurrency } from '../../utils/currency';

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

export const Treasury: React.FC = () => {
  // State
  const [cashFlowData, setCashFlowData] = useState<CashFlowDataPoint[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const itemsPerPage = 10;
  const toast = useToast();

  // Transaction form state
  const [formType, setFormType] = useState<'income' | 'expense'>('income');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formCategory, setFormCategory] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formCenterOfCost, setFormCenterOfCost] = useState('');
  const [formReference, setFormReference] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Fetch data from API
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch cash flow data (with error handling)
      try {
        const cashFlow = await dashboardService.getCashFlow();
        setCashFlowData(cashFlow);
      } catch (cashFlowErr) {
        console.warn('Failed to fetch cash flow data, using empty dataset:', cashFlowErr);
        setCashFlowData([]);
      }

      // Fetch invoices for transactions
      try {
        const invoicesResponse = await invoiceService.getInvoices({ pageSize: 50 });
        setInvoices(invoicesResponse.data);
      } catch (invoiceErr) {
        console.warn('Failed to fetch invoices:', invoiceErr);
        setInvoices([]);
      }

      // Fetch departments
      try {
        const deptsResponse = await departmentService.getDepartments();
        setDepartments(deptsResponse.data);
      } catch (deptErr) {
        console.warn('Failed to fetch departments:', deptErr);
        setDepartments([]);
      }
    } catch (err) {
      console.error('Error fetching treasury data:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Reset form
  const resetForm = () => {
    setFormType('income');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormCategory('');
    setFormAmount('');
    setFormCenterOfCost('');
    setFormReference('');
    setFormDescription('');
    setFormErrors({});
  };

  // Open modal
  const handleOpenModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formCategory) errors.category = 'La catégorie est requise';
    if (!formAmount || parseFloat(formAmount) <= 0) errors.amount = 'Le montant doit être supérieur à 0';
    if (!formDescription.trim()) errors.description = 'La description est requise';
    if (!formDate) errors.date = 'La date est requise';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      if (formType === 'income') {
        // Create an invoice for income transactions
        await invoiceService.createInvoice({
          clientName: formCenterOfCost || 'Trésorerie',
          clientEmail: undefined,
          clientAddress: undefined,
          items: [{
            description: formDescription,
            quantity: 1,
            unitPrice: parseFloat(formAmount),
          }],
          issueDate: formDate,
          dueDate: formDate,
          currency: 'XOF',
          taxRate: 0,
          notes: formReference ? `Référence: ${formReference}` : undefined,
        });
        toast.success('Transaction créée', 'L\'entrée a été enregistrée avec succès');
      } else {
        // For expenses, create an invoice with negative context
        // TODO: Replace with dedicated expense transaction endpoint when available
        await invoiceService.createInvoice({
          clientName: formCenterOfCost || 'Trésorerie',
          clientEmail: undefined,
          clientAddress: undefined,
          items: [{
            description: `Sortie: ${formDescription}`,
            quantity: 1,
            unitPrice: parseFloat(formAmount),
          }],
          issueDate: formDate,
          dueDate: formDate,
          currency: 'XOF',
          taxRate: 0,
          notes: formReference ? `Référence: ${formReference}` : undefined,
        });
        toast.success('Transaction créée', 'La sortie a été enregistrée avec succès');
      }
      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (err: any) {
      console.error('Error creating transaction:', err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Une erreur est survenue lors de la création de la transaction';
      toast.error('Erreur', errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Generate transactions from invoices
  const transactions = useMemo((): TransactionDisplay[] => {
    const txns: TransactionDisplay[] = [];

    // Convert invoices to transactions
    invoices.forEach((invoice, idx) => {
      txns.push({
        id: invoice.id,
        date: invoice.date,
        type: invoice.status === 'paye' ? 'income' : 'income',
        category: 'Ventes Services',
        amount: invoice.amount,
        description: `Facture ${invoice.reference}`,
        centerOfCost: 'Direction',
        reference: invoice.reference,
      });
    });

    // Sort by date descending
    return txns.sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [invoices]);

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

  // Cash flow totals from API
  const cashFlowTotals = useMemo(() => {
    const totalIncomes = cashFlowData.reduce((sum, d) => sum + (d.incomes || 0), 0);
    const totalExpenses = cashFlowData.reduce((sum, d) => sum + (d.expenses || 0), 0);
    return { totalIncomes, totalExpenses };
  }, [cashFlowData]);

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1;
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Calculate expense categories
  const expenseCategories = useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const existing = categoryMap.get(t.category) || 0;
        categoryMap.set(t.category, existing + t.amount);
      });
    
    const total = Array.from(categoryMap.values()).reduce((sum, v) => sum + v, 0);
    
    return Array.from(categoryMap.entries())
      .map(([name, value]) => ({
        name,
        value: total > 0 ? Math.round((value / total) * 100) : 0,
        amount: value,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [transactions]);

  // Loading state
  if (loading && transactions.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: Colors.textMuted }}>
        Chargement des données de trésorerie...
      </div>
    );
  }

  // Error state
  if (error && transactions.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <div style={{ color: Colors.danger }}>{error}</div>
        <Button variant="primary" onClick={fetchData} style={{ marginTop: 16 }}>
          Réessayer
        </Button>
      </div>
    );
  }

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
        <Button variant="primary" onClick={handleOpenModal}>
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
          {cashFlowData.length > 0 ? (
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: 180 }}>
              {(() => {
                // Dynamic max value from actual data, minimum 1 to avoid division by zero
                const globalMax = Math.max(1, ...cashFlowData.map(d => Math.max(d.incomes || 0, d.expenses || 0)));
                return cashFlowData.map((month, idx) => {
                  const incomeHeight = ((month.incomes || 0) / globalMax) * 140;
                  const expenseHeight = ((month.expenses || 0) / globalMax) * 140;

                  return (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 140 }}>
                        <div style={{
                          width: 32,
                          height: `${Math.max(incomeHeight, 4)}px`,
                          background: '#3ecf8e',
                          borderRadius: 4,
                        }} />
                        <div style={{
                          width: 32,
                          height: `${Math.max(expenseHeight, 4)}px`,
                          background: '#e05050',
                          borderRadius: 4,
                        }} />
                      </div>
                      <span style={{ fontSize: 11, color: Colors.textMuted, fontWeight: 500 }}>{month.month}</span>
                    </div>
                  );
                });
              })()}
            </div>
          ) : (
            <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center', color: Colors.textMuted }}>
              Aucune donnée disponible
            </div>
          )}
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
            {expenseCategories.length > 0 ? expenseCategories.map((item, idx) => (
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
                    background: '#6490ff',
                    borderRadius: 4,
                  }} />
                </div>
              </div>
            )) : (
              <div style={{ textAlign: 'center', color: Colors.textMuted, padding: 20 }}>
                Aucune donnée de dépenses disponible
              </div>
            )}
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
              {expenseCategories.map(cat => (
                <option key={cat.name} value={cat.name}>{cat.name}</option>
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
        onClose={() => { setIsModalOpen(false); resetForm(); }}
        title="Nouvelle transaction"
        size="lg"
      >
        <form onSubmit={handleSubmit}>
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
                  border: `1px solid ${formType === 'income' ? '#3ecf8e' : Colors.border}`,
                  cursor: 'pointer',
                  fontSize: 13,
                  color: formType === 'income' ? '#3ecf8e' : Colors.text,
                  background: formType === 'income' ? 'rgba(62, 207, 142, 0.05)' : 'transparent',
                }}>
                  <input
                    type="radio"
                    name="type"
                    value="income"
                    checked={formType === 'income'}
                    onChange={() => setFormType('income')}
                    style={{ marginRight: 8 }}
                  />
                  Entrée
                </label>
                <label style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px',
                  borderRadius: 8,
                  border: `1px solid ${formType === 'expense' ? '#e05050' : Colors.border}`,
                  cursor: 'pointer',
                  fontSize: 13,
                  color: formType === 'expense' ? '#e05050' : Colors.text,
                  background: formType === 'expense' ? 'rgba(224, 80, 80, 0.05)' : 'transparent',
                }}>
                  <input
                    type="radio"
                    name="type"
                    value="expense"
                    checked={formType === 'expense'}
                    onChange={() => setFormType('expense')}
                    style={{ marginRight: 8 }}
                  />
                  Sortie
                </label>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Date</label>
              <input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 8,
                  border: `1px solid ${formErrors.date ? '#e05050' : Colors.border}`,
                  background: Colors.bg,
                  color: Colors.text,
                  fontSize: 13,
                }}
              />
              {formErrors.date && (
                <span style={{ fontSize: 11, color: '#e05050', marginTop: 4, display: 'block' }}>{formErrors.date}</span>
              )}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Catégorie</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 8,
                  border: `1px solid ${formErrors.category ? '#e05050' : Colors.border}`,
                  background: Colors.bg,
                  color: Colors.text,
                  fontSize: 13,
                }}
              >
                <option value="">Sélectionner une catégorie</option>
                {formType === 'income' ? (
                  <>
                    <option value="Ventes Services">Ventes Services</option>
                    <option value="Formation">Formation</option>
                    <option value="Consulting">Consulting</option>
                  </>
                ) : (
                  <>
                    <option value="Salaires">Salaires</option>
                    <option value="Loyer">Loyer</option>
                    <option value="Fournitures">Fournitures</option>
                    <option value="Équipements">Équipements</option>
                    <option value="Marketing">Marketing</option>
                  </>
                )}
              </select>
              {formErrors.category && (
                <span style={{ fontSize: 11, color: '#e05050', marginTop: 4, display: 'block' }}>{formErrors.category}</span>
              )}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Montant</label>
              <input
                type="number"
                placeholder="0"
                min="0"
                step="0.01"
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 8,
                  border: `1px solid ${formErrors.amount ? '#e05050' : Colors.border}`,
                  background: Colors.bg,
                  color: Colors.text,
                  fontSize: 13,
                }}
              />
              {formErrors.amount && (
                <span style={{ fontSize: 11, color: '#e05050', marginTop: 4, display: 'block' }}>{formErrors.amount}</span>
              )}
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Centre de coût</label>
              <select
                value={formCenterOfCost}
                onChange={(e) => setFormCenterOfCost(e.target.value)}
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
                {departments.map(dept => (
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
                value={formReference}
                onChange={(e) => setFormReference(e.target.value)}
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
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 8,
                  border: `1px solid ${formErrors.description ? '#e05050' : Colors.border}`,
                  background: Colors.bg,
                  color: Colors.text,
                  fontSize: 13,
                  resize: 'vertical',
                  fontFamily: 'inherit',
                }}
              />
              {formErrors.description && (
                <span style={{ fontSize: 11, color: '#e05050', marginTop: 4, display: 'block' }}>{formErrors.description}</span>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
            <Button variant="secondary" type="button" onClick={() => { setIsModalOpen(false); resetForm(); }}>
              Annuler
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Treasury;

