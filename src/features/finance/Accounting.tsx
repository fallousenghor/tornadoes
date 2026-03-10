// Accounting Page - Finance Module
// Complete accounting module with General Ledger, Balance Sheet, Income Statement, and Journal - Backend API Integration

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, Button, Badge, SearchInput } from '../../components/common';
import { Colors } from '../../constants/theme';
import accountingService, { AccountingAccount, JournalEntry, JournalEntryLine } from '../../services/accountingService';
import { JournalEntryForm } from './components';
import type { JournalEntryFormData } from './components/JournalEntryForm';
import { formatCurrency } from '../../utils/currency';

export const Accounting: React.FC = () => {
  // State for backend data
  const [accounts, setAccounts] = useState<AccountingAccount[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from backend
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch accounting data from backend service
      const accountingData = await accountingService.getAccountingData();
      setAccounts(accountingData.accounts);
      setJournalEntries(accountingData.journalEntries);
    } catch (err) {
      console.error('Error fetching accounting data:', err);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // State
  const [activeTab, setActiveTab] = useState<'journal' | 'ledger' | 'balance' | 'income'>('journal');
  const [searchQuery, setSearchQuery] = useState('');
  const [accountTypeFilter, setAccountTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);
  const itemsPerPage = 10;

  // Filter accounts
  const filteredAccounts = useMemo(() => {
    return accounts.filter(account => {
      const matchesSearch = 
        account.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        account.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = accountTypeFilter === 'all' || account.type === accountTypeFilter;
      
      return matchesSearch && matchesType;
    });
  }, [accounts, searchQuery, accountTypeFilter]);

  // Calculate totals for balance sheet
  const balanceSheet = useMemo(() => {
    const assets = accounts.filter(a => a.type === 'actif').reduce((sum, a) => sum + a.balance, 0);
    const liabilities = accounts.filter(a => a.type === 'passif').reduce((sum, a) => sum + a.balance, 0);
    return { assets, liabilities, netAssets: assets - liabilities };
  }, [accounts]);

  // Calculate income statement
  const incomeStatement = useMemo(() => {
    const revenues = accounts.filter(a => a.type === 'produit').reduce((sum, a) => sum + a.balance, 0);
    const expenses = accounts.filter(a => a.type === 'charge').reduce((sum, a) => sum + a.balance, 0);
    return { revenues, expenses, result: revenues - expenses };
  }, [accounts]);

  // General ledger data
  const ledgerData = useMemo(() => {
    const ledgers: Record<string, { code: string; name: string; type: string; initial: number; debit: number; credit: number; final: number }> = {};
    
    accounts.forEach(account => {
      ledgers[account.code] = {
        code: account.code,
        name: account.name,
        type: account.type,
        initial: 0,
        debit: account.debit,
        credit: account.credit,
        final: account.balance,
      };
    });
    
    return Object.values(ledgers);
  }, [accounts]);

  // Pagination for journal
  const totalPages = Math.ceil(journalEntries.length / itemsPerPage);
  const paginatedEntries = journalEntries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Handle form submission
  const handleJournalEntrySubmit = (data: JournalEntryFormData) => {
    console.log('Journal entry data submitted:', data);
    // Here you would typically call an API to submit the journal entry
  };

  // Format date
  const formatDate = (date: Date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Account type badge
  const getAccountTypeBadge = (type: string) => {
    const styles: Record<string, { bg: string; color: string; label: string }> = {
      actif: { bg: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e', label: 'Actif' },
      passif: { bg: 'rgba(100, 140, 255, 0.15)', color: '#6490ff', label: 'Passif' },
      charge: { bg: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', label: 'Charge' },
      produit: { bg: 'rgba(167, 139, 250, 0.15)', color: '#a78bfa', label: 'Produit' },
    };
    return styles[type] || styles.actif;
  };

  // Handle view entry details
  const handleViewEntry = (entry: JournalEntry) => {
    setSelectedEntry(entry);
    setIsModalOpen(true);
  };

  // Tab styles
  const tabs = [
    { id: 'journal', label: 'Journal des écritures', icon: '📒' },
    { id: 'ledger', label: 'Grand Livre', icon: '📗' },
    { id: 'balance', label: 'Bilan', icon: '⚖️' },
    { id: 'income', label: 'Compte de Résultat', icon: '📊' },
  ];

  // Loading state
  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: Colors.textMuted }}>
        Chargement des données comptables...
      </div>
    );
  }

  // Error state
  if (error && accounts.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <div style={{ color: Colors.danger, marginBottom: 16 }}>{error}</div>
        <Button variant="primary" onClick={fetchData}>
          Réessayer
        </Button>
      </div>
    );
  }

  // No data state
  const hasNoData = accounts.length === 0 && journalEntries.length === 0;

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: Colors.text, marginBottom: 4 }}>
            Comptabilité
          </h1>
          <p style={{ fontSize: 13, color: Colors.textMuted }}>
            Journal · Grand Livre · Bilan · Compte de Résultat
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
            ↺ Rapprochement
          </Button>
          <Button variant="primary" onClick={() => setIsNewEntryOpen(true)}>
            + Nouvelle écriture
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: 'rgba(100, 140, 255, 0.05)', padding: 4, borderRadius: 10, width: 'fit-content' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '10px 18px',
              borderRadius: 8,
              border: 'none',
              background: activeTab === tab.id ? 'rgba(100, 140, 255, 0.15)' : 'transparent',
              color: activeTab === tab.id ? Colors.accent : Colors.textMuted,
              fontSize: 12,
              fontWeight: activeTab === tab.id ? 600 : 400,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.2s',
            }}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* No Data Message */}
      {hasNoData && (
        <Card style={{ padding: 40, textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: Colors.text, marginBottom: 8 }}>
            Aucune donnée comptable disponible
          </h3>
          <p style={{ fontSize: 14, color: Colors.textMuted, marginBottom: 16 }}>
            Les données comptables apparaîtront ici une fois les factures et dépenses enregistrées.
          </p>
          <Button variant="primary" onClick={fetchData}>
            Actualiser
          </Button>
        </Card>
      )}

      {/* Journal des écritures */}
      {activeTab === 'journal' && !hasNoData && (
        <>
          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
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
                  📒
                </div>
                <div>
                  <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Écritures
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                    {journalEntries.length}
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
                  ↓
                </div>
                <div>
                  <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Total Débit
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                    {formatCurrency(journalEntries.reduce((sum, e) => sum + e.totalDebit, 0))}
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
                  ↑
                </div>
                <div>
                  <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Total Crédit
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                    {formatCurrency(journalEntries.reduce((sum, e) => sum + e.totalCredit, 0))}
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
                  background: 'rgba(167, 139, 250, 0.15)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: 20,
                  color: '#a78bfa',
                }}>
                  ⚖
                </div>
                <div>
                  <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Comptes
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                    {accounts.length}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Journal Table */}
          {journalEntries.length === 0 ? (
            <Card style={{ padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📒</div>
              <p style={{ color: Colors.textMuted }}>Aucune écriture comptable trouvée</p>
            </Card>
          ) : (
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(100, 140, 255, 0.05)' }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Référence</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Libellé</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Débit</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Crédit</th>
                      <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedEntries.map((entry, index) => (
                      <tr 
                        key={entry.id} 
                        style={{ 
                          borderBottom: `1px solid ${Colors.border}`,
                          background: index % 2 === 0 ? 'transparent' : 'rgba(100, 140, 255, 0.02)',
                        }}
                      >
                        <td style={{ padding: '14px 16px', fontSize: 13, color: Colors.textMuted }}>
                          {formatDate(entry.date)}
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 12, fontFamily: 'monospace', fontWeight: 600, color: Colors.accent }}>
                          {entry.reference}
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: Colors.text, maxWidth: 300 }}>
                          {entry.description}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 14, fontWeight: 600, fontFamily: "'DM Serif Display', serif", color: '#e05050' }}>
                          {formatCurrency(entry.totalDebit)}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 14, fontWeight: 600, fontFamily: "'DM Serif Display', serif", color: '#3ecf8e' }}>
                          {formatCurrency(entry.totalCredit)}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          <button 
                            onClick={() => handleViewEntry(entry)}
                            style={{ 
                              padding: '6px 12px', 
                              borderRadius: 6, 
                              border: `1px solid ${Colors.border}`, 
                              background: 'transparent', 
                              color: Colors.textMuted, 
                              fontSize: 11, 
                              cursor: 'pointer',
                            }}
                          >
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
                  Affichage de {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, journalEntries.length)} sur {journalEntries.length}
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
          )}
        </>
      )}

      {/* Grand Livre (General Ledger) */}
      {activeTab === 'ledger' && !hasNoData && (
        <>
          {/* Filters */}
          <Card style={{ marginBottom: 20, padding: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, alignItems: 'end' }}>
              <SearchInput 
                placeholder="Rechercher par code ou nom de compte..."
                value={searchQuery}
                onChange={(value) => { setSearchQuery(value); handleFilterChange(); }}
              />
              <div>
                <label style={{ display: 'block', fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>
                  Type de compte
                </label>
                <select 
                  value={accountTypeFilter}
                  onChange={(e) => { setAccountTypeFilter(e.target.value); handleFilterChange(); }}
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
                  <option value="actif">Actif</option>
                  <option value="passif">Passif</option>
                  <option value="charge">Charge</option>
                  <option value="produit">Produit</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Ledger Table */}
          {filteredAccounts.length === 0 ? (
            <Card style={{ padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📗</div>
              <p style={{ color: Colors.textMuted }}>Aucun compte trouvé</p>
            </Card>
          ) : (
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(100, 140, 255, 0.05)' }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Compte</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nom</th>
                      <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Débit</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Crédit</th>
                      <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Solde</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAccounts.map((account, index) => {
                      const typeStyle = getAccountTypeBadge(account.type);
                      return (
                        <tr 
                          key={account.id} 
                          style={{ 
                            borderBottom: `1px solid ${Colors.border}`,
                            background: index % 2 === 0 ? 'transparent' : 'rgba(100, 140, 255, 0.02)',
                          }}
                        >
                          <td style={{ padding: '14px 16px', fontSize: 13, fontFamily: 'monospace', fontWeight: 600, color: Colors.accent }}>
                            {account.code}
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: 13, color: Colors.text }}>
                            {account.name}
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                            <span style={{ 
                              padding: '4px 10px', 
                              borderRadius: 6, 
                              fontSize: 11, 
                              fontWeight: 500,
                              background: typeStyle.bg, 
                              color: typeStyle.color,
                            }}>
                              {typeStyle.label}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 14, fontWeight: 600, fontFamily: "'DM Serif Display', serif", color: '#e05050' }}>
                            {formatCurrency(account.debit)}
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 14, fontWeight: 600, fontFamily: "'DM Serif Display', serif", color: '#3ecf8e' }}>
                            {formatCurrency(account.credit)}
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 14, fontWeight: 600, fontFamily: "'DM Serif Display', serif", color: account.balance >= 0 ? Colors.text : '#e05050' }}>
                            {formatCurrency(account.balance)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Totals */}
          <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
            <Card style={{ flex: 1, padding: 16 }}>
              <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 8 }}>TOTAL ACTIF</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#3ecf8e', fontFamily: "'DM Serif Display', serif" }}>
                {formatCurrency(accounts.filter(a => a.type === 'actif').reduce((sum, a) => sum + a.balance, 0))}
              </div>
            </Card>
            <Card style={{ flex: 1, padding: 16 }}>
              <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 8 }}>TOTAL PASSIF</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#6490ff', fontFamily: "'DM Serif Display', serif" }}>
                {formatCurrency(accounts.filter(a => a.type === 'passif').reduce((sum, a) => sum + a.balance, 0))}
              </div>
            </Card>
            <Card style={{ flex: 1, padding: 16 }}>
              <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 8 }}>TOTAL CHARGES</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#fb923c', fontFamily: "'DM Serif Display', serif" }}>
                {formatCurrency(accounts.filter(a => a.type === 'charge').reduce((sum, a) => sum + a.balance, 0))}
              </div>
            </Card>
            <Card style={{ flex: 1, padding: 16 }}>
              <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 8 }}>TOTAL PRODUITS</div>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#a78bfa', fontFamily: "'DM Serif Display', serif" }}>
                {formatCurrency(accounts.filter(a => a.type === 'produit').reduce((sum, a) => sum + a.balance, 0))}
              </div>
            </Card>
          </div>
        </>
      )}

      {/* Bilan (Balance Sheet) */}
      {activeTab === 'balance' && !hasNoData && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Actif */}
          <Card style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#3ecf8e', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>📗</span> ACTIF
            </h3>
            
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: Colors.text, marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${Colors.border}` }}>
                Actif Immobilisé
              </div>
              {accounts.filter(a => a.type === 'actif' && parseInt(a.code) < 200).map((account, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed rgba(100,140,255,0.1)' }}>
                  <span style={{ fontSize: 12, color: Colors.textMuted }}>{account.name}</span>
                  <span style={{ fontSize: 12, fontFamily: "'DM Serif Display', serif", color: Colors.text }}>{formatCurrency(account.balance)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', marginTop: 8, borderTop: `1px solid ${Colors.border}`, background: 'rgba(62, 207, 142, 0.05)', paddingLeft: 8, paddingRight: 8, borderRadius: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: Colors.text }}>Total Actif Immobilisé</span>
                <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "'DM Serif Display', serif", color: '#3ecf8e' }}>
                  {formatCurrency(accounts.filter(a => a.type === 'actif' && parseInt(a.code) < 200).reduce((sum, a) => sum + a.balance, 0))}
                </span>
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: Colors.text, marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${Colors.border}` }}>
                Actif Circulant
              </div>
              {accounts.filter(a => a.type === 'actif' && parseInt(a.code) >= 400 && parseInt(a.code) < 600).map((account, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed rgba(100,140,255,0.1)' }}>
                  <span style={{ fontSize: 12, color: Colors.textMuted }}>{account.name}</span>
                  <span style={{ fontSize: 12, fontFamily: "'DM Serif Display', serif", color: Colors.text }}>{formatCurrency(account.balance)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', marginTop: 8, borderTop: `1px solid ${Colors.border}`, background: 'rgba(62, 207, 142, 0.05)', paddingLeft: 8, paddingRight: 8, borderRadius: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: Colors.text }}>Total Actif Circulant</span>
                <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "'DM Serif Display', serif", color: '#3ecf8e' }}>
                  {formatCurrency(accounts.filter(a => a.type === 'actif' && parseInt(a.code) >= 400 && parseInt(a.code) < 600).reduce((sum, a) => sum + a.balance, 0))}
                </span>
              </div>
            </div>
            
            <div style={{ marginTop: 20, padding: 16, background: 'rgba(62, 207, 142, 0.1)', borderRadius: 10, border: '1px solid rgba(62, 207, 142, 0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#3ecf8e' }}>TOTAL ACTIF</span>
                <span style={{ fontSize: 20, fontWeight: 700, fontFamily: "'DM Serif Display', serif", color: '#3ecf8e' }}>
                  {formatCurrency(balanceSheet.assets)}
                </span>
              </div>
            </div>
          </Card>

          {/* Passif */}
          <Card style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#6490ff', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>📕</span> PASSIF
            </h3>
            
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: Colors.text, marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${Colors.border}` }}>
                Capitaux Propres
              </div>
              {accounts.filter(a => a.type === 'passif' && parseInt(a.code) < 200).map((account, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed rgba(100,140,255,0.1)' }}>
                  <span style={{ fontSize: 12, color: Colors.textMuted }}>{account.name}</span>
                  <span style={{ fontSize: 12, fontFamily: "'DM Serif Display', serif", color: Colors.text }}>{formatCurrency(account.balance)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', marginTop: 8, borderTop: `1px solid ${Colors.border}`, background: 'rgba(100, 140, 255, 0.05)', paddingLeft: 8, paddingRight: 8, borderRadius: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: Colors.text }}>Total Capitaux Propres</span>
                <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "'DM Serif Display', serif", color: '#6490ff' }}>
                  {formatCurrency(accounts.filter(a => a.type === 'passif' && parseInt(a.code) < 200).reduce((sum, a) => sum + a.balance, 0))}
                </span>
              </div>
            </div>
            
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: Colors.text, marginBottom: 12, paddingBottom: 8, borderBottom: `1px solid ${Colors.border}` }}>
                Dettes
              </div>
              {accounts.filter(a => a.type === 'passif' && parseInt(a.code) >= 400).map((account, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed rgba(100,140,255,0.1)' }}>
                  <span style={{ fontSize: 12, color: Colors.textMuted }}>{account.name}</span>
                  <span style={{ fontSize: 12, fontFamily: "'DM Serif Display', serif", color: Colors.text }}>{formatCurrency(account.balance)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', marginTop: 8, borderTop: `1px solid ${Colors.border}`, background: 'rgba(100, 140, 255, 0.05)', paddingLeft: 8, paddingRight: 8, borderRadius: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: Colors.text }}>Total Dettes</span>
                <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "'DM Serif Display', serif", color: '#6490ff' }}>
                  {formatCurrency(accounts.filter(a => a.type === 'passif' && parseInt(a.code) >= 400).reduce((sum, a) => sum + a.balance, 0))}
                </span>
              </div>
            </div>
            
            <div style={{ marginTop: 20, padding: 16, background: 'rgba(100, 140, 255, 0.1)', borderRadius: 10, border: '1px solid rgba(100, 140, 255, 0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#6490ff' }}>TOTAL PASSIF</span>
                <span style={{ fontSize: 20, fontWeight: 700, fontFamily: "'DM Serif Display', serif", color: '#6490ff' }}>
                  {formatCurrency(balanceSheet.liabilities)}
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Compte de Résultat (Income Statement) */}
      {activeTab === 'income' && !hasNoData && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          {/* Charges */}
          <Card style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#fb923c', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>📉</span> CHARGES
            </h3>
            
            <div>
              {accounts.filter(a => a.type === 'charge').map((account, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed rgba(100,140,255,0.1)' }}>
                  <span style={{ fontSize: 12, color: Colors.textMuted }}>{account.name}</span>
                  <span style={{ fontSize: 12, fontFamily: "'DM Serif Display', serif", color: '#fb923c' }}>{formatCurrency(account.balance)}</span>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: 20, padding: 16, background: 'rgba(251, 146, 60, 0.1)', borderRadius: 10, border: '1px solid rgba(251, 146, 60, 0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#fb923c' }}>TOTAL CHARGES</span>
                <span style={{ fontSize: 20, fontWeight: 700, fontFamily: "'DM Serif Display', serif", color: '#fb923c' }}>
                  {formatCurrency(incomeStatement.expenses)}
                </span>
              </div>
            </div>
          </Card>

          {/* Produits */}
          <Card style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#a78bfa', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>📈</span> PRODUITS
            </h3>
            
            <div>
              {accounts.filter(a => a.type === 'produit').map((account, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px dashed rgba(100,140,255,0.1)' }}>
                  <span style={{ fontSize: 12, color: Colors.textMuted }}>{account.name}</span>
                  <span style={{ fontSize: 12, fontFamily: "'DM Serif Display', serif", color: '#a78bfa' }}>{formatCurrency(account.balance)}</span>
                </div>
              ))}
            </div>
            
            <div style={{ marginTop: 20, padding: 16, background: 'rgba(167, 139, 250, 0.1)', borderRadius: 10, border: '1px solid rgba(167, 139, 250, 0.2)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#a78bfa' }}>TOTAL PRODUITS</span>
                <span style={{ fontSize: 20, fontWeight: 700, fontFamily: "'DM Serif Display', serif", color: '#a78bfa' }}>
                  {formatCurrency(incomeStatement.revenues)}
                </span>
              </div>
            </div>
          </Card>

          {/* Result */}
          <Card style={{ gridColumn: '1 / -1', padding: 24, background: incomeStatement.result >= 0 ? 'rgba(62, 207, 142, 0.08)' : 'rgba(224, 80, 80, 0.08)', border: `1px solid ${incomeStatement.result >= 0 ? 'rgba(62, 207, 142, 0.2)' : 'rgba(224, 80, 80, 0.2)'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: Colors.textMuted, marginBottom: 4 }}>
                  RÉSULTAT DE L'EXERCICE
                </div>
                <div style={{ fontSize: 12, color: Colors.textMuted }}>
                  {incomeStatement.result >= 0 ? 'Bénéfice' : 'Perte'}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 32, fontWeight: 700, fontFamily: "'DM Serif Display', serif", color: incomeStatement.result >= 0 ? '#3ecf8e' : '#e05050' }}>
                  {formatCurrency(Math.abs(incomeStatement.result))}
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Journal Entry Form Modal */}
      <JournalEntryForm
        isOpen={isNewEntryOpen}
        onClose={() => setIsNewEntryOpen(false)}
        onSubmit={handleJournalEntrySubmit}
      />
    </div>
  );
};

export default Accounting;

