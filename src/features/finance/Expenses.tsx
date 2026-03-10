// Expenses Page - Finance Module
// Complete expense management with CRUD operations - Backend API Integration

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, Button, Badge, SearchInput, Modal } from '../../components/common';
import { Colors } from '../../constants/theme';
import expenseService from '../../services/expenseService';
import departmentService from '../../services/departmentService';
import type { Expense, ExpenseStatus, Department } from '../../types';
import { formatCurrency } from '../../utils/currency';

// Expense display type
interface ExpenseDisplay {
  id: string;
  title: string;
  description: string;
  category: string;
  amount: number;
  currency: string;
  expenseDate: Date;
  status: ExpenseStatus;
  submittedByName: string;
  approvedByName?: string;
  departmentId?: string;
  receiptReference?: string;
}

const EXPENSE_CATEGORIES = [
  { value: 'Salaires', label: 'Salaires' },
  { value: 'Loyer', label: 'Loyer' },
  { value: 'Services', label: 'Services' },
  { value: 'Fournitures', label: 'Fournitures' },
  { value: 'Déplacement', label: 'Déplacement' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Équipement', label: 'Équipement' },
  { value: 'Formation', label: 'Formation' },
  { value: 'Autre', label: 'Autre' },
];

export const Expenses: React.FC = () => {
  // State
  const [expenses, setExpenses] = useState<ExpenseDisplay[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<ExpenseDisplay | null>(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Autre',
    amount: 0,
    expenseDate: new Date().toISOString().split('T')[0],
    departmentId: '',
    receiptReference: '',
  });
  const itemsPerPage = 10;

  // Fetch expenses from API
  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const status = statusFilter !== 'all' ? statusFilter as ExpenseStatus : undefined;
      const category = categoryFilter !== 'all' ? categoryFilter : undefined;
      
      const response = await expenseService.getExpenses({ 
        pageSize: 50,
        status,
        category,
      });
      
      const mappedExpenses: ExpenseDisplay[] = response.data.map(exp => ({
        id: exp.id,
        title: exp.title,
        description: exp.description || '',
        category: exp.category,
        amount: exp.amount,
        currency: exp.currency,
        expenseDate: exp.expenseDate,
        status: exp.status,
        submittedByName: exp.submittedByName,
        approvedByName: exp.approvedByName,
        departmentId: exp.departmentId,
        receiptReference: exp.receiptReference,
      }));
      
      setExpenses(mappedExpenses);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError('Erreur lors du chargement des dépenses');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter]);

  // Fetch departments
  const fetchDepartments = useCallback(async () => {
    try {
      const response = await departmentService.getDepartments();
      setDepartments(response.data);
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    fetchExpenses();
    fetchDepartments();
  }, [fetchExpenses, fetchDepartments]);

  // Filter expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const matchesSearch = 
        expense.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        expense.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || expense.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
      
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [expenses, searchQuery, statusFilter, categoryFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);
    const pending = expenses.filter(exp => exp.status === 'en_attente').reduce((sum, exp) => sum + exp.amount, 0);
    const approved = expenses.filter(exp => exp.status === 'approuve').reduce((sum, exp) => sum + exp.amount, 0);
    const paid = expenses.filter(exp => exp.status === 'paye').reduce((sum, exp) => sum + exp.amount, 0);
    const rejected = expenses.filter(exp => exp.status === 'rejete').reduce((sum, exp) => sum + exp.amount, 0);
    
    return { total, pending, approved, paid, rejected };
  }, [expenses]);

  // Pagination
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage) || 1;
  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Status badge
  const getStatusBadge = (status: ExpenseStatus) => {
    const styles: Record<string, { bg: string; color: string; label: string }> = {
      en_attente: { bg: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', label: 'En attente' },
      approuve: { bg: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e', label: 'Approuvé' },
      paye: { bg: 'rgba(100, 140, 255, 0.15)', color: '#6490ff', label: 'Payé' },
      rejete: { bg: 'rgba(224, 80, 80, 0.15)', color: '#e05050', label: 'Rejeté' },
    };
    return styles[status] || styles.en_attente;
  };

  // Category badge
  const getCategoryBadge = (category: string) => {
    const categoryColors: Record<string, string> = {
      'Salaires': '#e05050',
      'Loyer': '#fb923c',
      'Services': '#6490ff',
      'Fournitures': '#3ecf8e',
      'Déplacement': '#a78bfa',
      'Marketing': '#f472b6',
      'Équipement': '#34d399',
      'Formation': '#60a5fa',
      'Autre': '#9ca3af',
    };
    return categoryColors[category] || '#9ca3af';
  };

  // Handle view details
  const handleViewDetails = (expense: ExpenseDisplay) => {
    setSelectedExpense(expense);
    setIsViewMode(true);
    setIsModalOpen(true);
  };

  // Handle edit
  const handleEdit = (expense: ExpenseDisplay) => {
    setSelectedExpense(expense);
    setFormData({
      title: expense.title,
      description: expense.description,
      category: expense.category,
      amount: expense.amount,
      expenseDate: expense.expenseDate.toISOString().split('T')[0],
      departmentId: expense.departmentId || '',
      receiptReference: expense.receiptReference || '',
    });
    setIsViewMode(false);
    setIsModalOpen(true);
  };

  // Handle create expense
  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await expenseService.createExpense({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        amount: formData.amount,
        expenseDate: formData.expenseDate,
        departmentId: formData.departmentId || undefined,
        receiptReference: formData.receiptReference || undefined,
      });
      fetchExpenses();
      setIsModalOpen(false);
      setSelectedExpense(null);
      resetForm();
    } catch (err) {
      console.error('Error creating expense:', err);
      alert('Erreur lors de la création de la dépense');
    }
  };

  // Handle update expense
  const handleUpdateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExpense) return;
    
    try {
      await expenseService.updateExpense(selectedExpense.id, {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        amount: formData.amount,
        expenseDate: formData.expenseDate,
        departmentId: formData.departmentId || undefined,
        receiptReference: formData.receiptReference || undefined,
      });
      fetchExpenses();
      setIsModalOpen(false);
      setSelectedExpense(null);
      resetForm();
    } catch (err) {
      console.error('Error updating expense:', err);
      alert('Erreur lors de la mise à jour de la dépense');
    }
  };

  // Handle delete expense
  const handleDeleteExpense = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette dépense ?')) return;
    
    try {
      await expenseService.deleteExpense(id);
      fetchExpenses();
      setIsModalOpen(false);
      setSelectedExpense(null);
    } catch (err) {
      console.error('Error deleting expense:', err);
      alert('Erreur lors de la suppression de la dépense');
    }
  };

  // Handle approve
  const handleApprove = async (id: string) => {
    try {
      await expenseService.approveExpense(id);
      fetchExpenses();
    } catch (err) {
      console.error('Error approving expense:', err);
      alert('Erreur lors de l\'approbation de la dépense');
    }
  };

  // Handle reject
  const handleReject = async (id: string) => {
    try {
      await expenseService.rejectExpense(id);
      fetchExpenses();
    } catch (err) {
      console.error('Error rejecting expense:', err);
      alert('Erreur lors du rejet de la dépense');
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Autre',
      amount: 0,
      expenseDate: new Date().toISOString().split('T')[0],
      departmentId: '',
      receiptReference: '',
    });
  };

  // Handle form change
  const handleFormChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Category breakdown for chart
  const categoryBreakdown = useMemo(() => {
    const categoryMap = new Map<string, number>();
    
    expenses.forEach(exp => {
      const existing = categoryMap.get(exp.category) || 0;
      categoryMap.set(exp.category, existing + exp.amount);
    });
    
    return Array.from(categoryMap.entries())
      .map(([name, value]) => ({ name, value, color: getCategoryBadge(name) }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: Colors.text, marginBottom: 4 }}>
            Gestion des Dépenses
          </h1>
          <p style={{ fontSize: 13, color: Colors.textMuted }}>
            Enregistrement · Approbation · Suivi des dépenses
          </p>
        </div>
        <Button variant="primary" onClick={() => { setSelectedExpense(null); setIsViewMode(false); setIsModalOpen(true); resetForm(); }}>
          + Nouvelle dépense
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ 
          padding: '12px 16px', 
          background: 'rgba(224, 80, 80, 0.1)', 
          border: '1px solid rgba(224, 80, 80, 0.3)',
          borderRadius: 8,
          marginBottom: 20,
          color: '#e05050',
          fontSize: 13,
        }}>
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
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
              color: '#6490ff',
            }}>
              ₣
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {loading ? '...' : formatCurrency(stats.total)}
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
              background: 'rgba(251, 146, 60, 0.15)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: 20,
              color: '#fb923c',
            }}>
              ⏳
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                En attente
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {loading ? '...' : formatCurrency(stats.pending)}
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
              background: 'rgba(62, 207, 142, 0.15)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: 20,
              color: '#3ecf8e',
            }}>
              ✓
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Approuvé
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {loading ? '...' : formatCurrency(stats.approved)}
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
              color: '#6490ff',
            }}>
              💳
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Payé
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {loading ? '...' : formatCurrency(stats.paid)}
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
              background: stats.rejected > 0 ? 'rgba(224, 80, 80, 0.15)' : 'rgba(62, 207, 142, 0.15)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: 20,
              color: stats.rejected > 0 ? '#e05050' : '#3ecf8e',
            }}>
              ✕
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Rejeté
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text }}>
                {loading ? '...' : formatCurrency(stats.rejected)}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Category Breakdown & Status Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 24 }}>
        <Card style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: Colors.text, marginBottom: 16 }}>
            Répartition par Catégorie
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {categoryBreakdown.slice(0, 5).map((cat, idx) => {
              const percentage = stats.total > 0 ? (cat.value / stats.total) * 100 : 0;
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: Colors.textMuted }}>{cat.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: cat.color }}>
                      {formatCurrency(cat.value)}
                    </span>
                  </div>
                  <div style={{ 
                    height: 6, 
                    background: 'rgba(100, 140, 255, 0.1)', 
                    borderRadius: 3, 
                    overflow: 'hidden',
                  }}>
                    <div style={{ 
                      width: `${percentage}%`, 
                      height: '100%', 
                      background: cat.color,
                      borderRadius: 3,
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
        
        <Card style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: Colors.text, marginBottom: 16 }}>
            Répartition par Statut
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { label: 'En attente', value: stats.pending, total: stats.total, color: '#fb923c' },
              { label: 'Approuvé', value: stats.approved, total: stats.total, color: '#3ecf8e' },
              { label: 'Payé', value: stats.paid, total: stats.total, color: '#6490ff' },
              { label: 'Rejeté', value: stats.rejected, total: stats.total, color: '#e05050' },
            ].map((item, idx) => {
              const percentage = stats.total > 0 ? (item.value / stats.total) * 100 : 0;
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: Colors.textMuted }}>{item.label}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: item.color }}>
                      {formatCurrency(item.value)}
                    </span>
                  </div>
                  <div style={{ 
                    height: 8, 
                    background: 'rgba(100, 140, 255, 0.1)', 
                    borderRadius: 4, 
                    overflow: 'hidden',
                  }}>
                    <div style={{ 
                      width: `${percentage}%`, 
                      height: '100%', 
                      background: item.color,
                      borderRadius: 4,
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Filters Card */}
      <Card style={{ marginBottom: 20, padding: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, alignItems: 'end' }}>
          <SearchInput 
            placeholder="Rechercher par titre, description, catégorie..."
            value={searchQuery}
            onChange={(value: string) => { setSearchQuery(value); handleFilterChange(); }}
          />
          <div>
            <label style={{ display: 'block', fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>
              Statut
            </label>
            <select 
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); handleFilterChange(); }}
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
              <option value="all">Tous les statuts</option>
              <option value="en_attente">En attente</option>
              <option value="approuve">Approuvé</option>
              <option value="paye">Payé</option>
              <option value="rejete">Rejeté</option>
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
              {EXPENSE_CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Expenses Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: Colors.textMuted }}>
            Chargement des dépenses...
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(100, 140, 255, 0.05)' }}>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Titre</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Catégorie</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Soumis par</th>
                    <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Montant</th>
                    <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Statut</th>
                    <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedExpenses.map((expense, index) => {
                    const statusStyle = getStatusBadge(expense.status);
                    const categoryColor = getCategoryBadge(expense.category);
                    
                    return (
                      <tr 
                        key={expense.id} 
                        style={{ 
                          borderBottom: `1px solid ${Colors.border}`,
                          background: index % 2 === 0 ? 'transparent' : 'rgba(100, 140, 255, 0.02)',
                        }}
                      >
                        <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: Colors.text }}>
                          {expense.title}
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ 
                            padding: '4px 10px', 
                            borderRadius: 6, 
                            fontSize: 11, 
                            fontWeight: 500,
                            background: `${categoryColor}20`, 
                            color: categoryColor,
                          }}>
                            {expense.category}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: Colors.textMuted }}>
                          {expense.expenseDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: Colors.textMuted }}>
                          {expense.submittedByName}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 14, fontWeight: 600, fontFamily: "'DM Serif Display', serif", color: Colors.text }}>
                          {formatCurrency(expense.amount)}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          <span style={{ 
                            padding: '4px 10px', 
                            borderRadius: 6, 
                            fontSize: 11, 
                            fontWeight: 500,
                            background: statusStyle.bg, 
                            color: statusStyle.color,
                          }}>
                            {statusStyle.label}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                            <button 
                              onClick={() => handleViewDetails(expense)}
                              style={{ 
                                padding: '6px 10px', 
                                borderRadius: 6, 
                                border: `1px solid ${Colors.border}`, 
                                background: 'transparent', 
                                color: Colors.textMuted, 
                                fontSize: 11, 
                                cursor: 'pointer',
                              }}
                            >
                              👁
                            </button>
                            <button 
                              onClick={() => handleEdit(expense)}
                              style={{ 
                                padding: '6px 10px', 
                                borderRadius: 6, 
                                border: `1px solid ${Colors.border}`, 
                                background: 'transparent', 
                                color: Colors.textMuted, 
                                fontSize: 11, 
                                cursor: 'pointer',
                              }}
                            >
                              ✎
                            </button>
                            {expense.status === 'en_attente' && (
                              <>
                                <button 
                                  onClick={() => handleApprove(expense.id)}
                                  style={{ 
                                    padding: '6px 10px', 
                                    borderRadius: 6, 
                                    border: 'none', 
                                    background: 'rgba(62, 207, 142, 0.15)', 
                                    color: '#3ecf8e', 
                                    fontSize: 11, 
                                    cursor: 'pointer',
                                  }}
                                  title="Approuver"
                                >
                                  ✓
                                </button>
                                <button 
                                  onClick={() => handleReject(expense.id)}
                                  style={{ 
                                    padding: '6px 10px', 
                                    borderRadius: 6, 
                                    border: 'none', 
                                    background: 'rgba(224, 80, 80, 0.15)', 
                                    color: '#e05050', 
                                    fontSize: 11, 
                                    cursor: 'pointer',
                                  }}
                                  title="Rejeter"
                                >
                                  ✕
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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
                Affichage de {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, filteredExpenses.length)} sur {filteredExpenses.length}
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
          </>
        )}
      </Card>

      {/* Modal for Create/Edit/View */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setSelectedExpense(null); }} 
        title={isViewMode ? selectedExpense?.title : (selectedExpense ? 'Modifier la dépense' : 'Nouvelle dépense')}
        size="lg"
      >
        {isViewMode && selectedExpense ? (
          // View Mode
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>STATUT</div>
                <span style={{ 
                  padding: '4px 10px', 
                  borderRadius: 6, 
                  fontSize: 11, 
                  fontWeight: 500,
                  background: getStatusBadge(selectedExpense.status).bg, 
                  color: getStatusBadge(selectedExpense.status).color,
                }}>
                  {getStatusBadge(selectedExpense.status).label}
                </span>
              </div>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>CATÉGORIE</div>
                <span style={{ 
                  padding: '4px 10px', 
                  borderRadius: 6, 
                  fontSize: 11, 
                  fontWeight: 500,
                  background: `${getCategoryBadge(selectedExpense.category)}20`, 
                  color: getCategoryBadge(selectedExpense.category),
                }}>
                  {selectedExpense.category}
                </span>
              </div>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>DATE</div>
                <div style={{ fontSize: 14, color: Colors.text }}>{selectedExpense.expenseDate.toLocaleDateString('fr-FR')}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>MONTANT</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: Colors.accent, fontFamily: "'DM Serif Display', serif" }}>
                  {formatCurrency(selectedExpense.amount)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>SOUMIS PAR</div>
                <div style={{ fontSize: 14, color: Colors.text }}>{selectedExpense.submittedByName}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>APPROUVÉ PAR</div>
                <div style={{ fontSize: 14, color: Colors.text }}>{selectedExpense.approvedByName || '—'}</div>
              </div>
              {selectedExpense.receiptReference && (
                <div>
                  <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>RÉFÉRENCE REÇU</div>
                  <div style={{ fontSize: 14, color: Colors.text }}>{selectedExpense.receiptReference}</div>
                </div>
              )}
            </div>
            
            {selectedExpense.description && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>DESCRIPTION</div>
                <div style={{ fontSize: 14, color: Colors.text, padding: 12, background: 'rgba(100, 140, 255, 0.05)', borderRadius: 8 }}>
                  {selectedExpense.description}
                </div>
              </div>
            )}
            
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              {selectedExpense.status === 'en_attente' && (
                <>
                  <Button variant="secondary" onClick={() => handleReject(selectedExpense.id)} style={{ background: 'rgba(224, 80, 80, 0.15)', color: '#e05050' }}>
                    Rejeter
                  </Button>
                  <Button variant="primary" onClick={() => handleApprove(selectedExpense.id)} style={{ background: '#3ecf8e' }}>
                    Approuver
                  </Button>
                </>
              )}
              <Button variant="secondary" onClick={() => { setIsModalOpen(false); setSelectedExpense(null); }}>
                Fermer
              </Button>
            </div>
          </div>
        ) : (
          // Create/Edit Form
          <form onSubmit={selectedExpense ? handleUpdateExpense : handleCreateExpense}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Titre *</label>
                <input 
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  placeholder="Titre de la dépense"
                  required
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
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Catégorie *</label>
                <select 
                  name="category"
                  value={formData.category}
                  onChange={(e) => handleFormChange('category', e.target.value)}
                  required
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
                  {EXPENSE_CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Date *</label>
                <input 
                  type="date" 
                  name="expenseDate"
                  value={formData.expenseDate}
                  onChange={(e) => handleFormChange('expenseDate', e.target.value)}
                  required
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
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Montant *</label>
                <input 
                  type="number" 
                  name="amount"
                  value={formData.amount}
                  onChange={(e) => handleFormChange('amount', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  required
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
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Département</label>
                <select 
                  name="departmentId"
                  value={formData.departmentId}
                  onChange={(e) => handleFormChange('departmentId', e.target.value)}
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
                  <option value="">Sélectionner un département</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Référence reçu</label>
                <input 
                  type="text" 
                  name="receiptReference"
                  value={formData.receiptReference}
                  onChange={(e) => handleFormChange('receiptReference', e.target.value)}
                  placeholder="N° recu, facture..."
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
                  name="description"
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder="Description de la dépense..."
                  rows={3}
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
              {selectedExpense && (
                <Button 
                  variant="secondary" 
                  type="button" 
                  onClick={() => handleDeleteExpense(selectedExpense.id)}
                  style={{ background: 'rgba(224, 80, 80, 0.15)', color: '#e05050' }}
                >
                  Supprimer
                </Button>
              )}
              <Button variant="secondary" type="button" onClick={() => { setIsModalOpen(false); setSelectedExpense(null); }}>
                Annuler
              </Button>
              <Button variant="primary" type="submit">
                {selectedExpense ? 'Mettre à jour' : 'Créer la dépense'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Expenses;

