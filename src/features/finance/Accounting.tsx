// Accounting Page - Finance Module
// Complete accounting module with General Ledger, Balance Sheet, Income Statement, and Journal

import React, { useState, useMemo } from 'react';
import { Card, Button, Badge, SearchInput } from '../../components/common';
import { Colors } from '../../constants/theme';
import { cashFlowData, invoicesData, employeesData, deptPerformance } from '../../data/mockData';
import { JournalEntryForm } from './components';
import type { JournalEntryFormData } from './components/JournalEntryForm';

// Account types (local interface for accounting)
interface AccountingAccount {
  id: string;
  code: string;
  name: string;
  type: 'actif' | 'passif' | 'charge' | 'produit';
  parentCode?: string;
  balance: number;
  debit: number;
  credit: number;
}

interface JournalEntry {
  id: string;
  date: Date;
  reference: string;
  description: string;
  accounts: { code: string; name: string; debit: number; credit: number }[];
  totalDebit: number;
  totalCredit: number;
}

// Generate mock chart of accounts
const generateAccounts = (): AccountingAccount[] => [
  // Passif (Liabilities)
  { id: '1', code: '101', name: 'Capital', type: 'passif', balance: 5000000, debit: 0, credit: 0 },
  { id: '2', code: '110', name: 'Report à nouveau', type: 'passif', balance: 850000, debit: 0, credit: 0 },
  { id: '3', code: '120', name: 'Résultat de l\'exercice', type: 'passif', balance: 3100000, debit: 0, credit: 0 },
  { id: '4', code: '160', name: 'Emprunts', type: 'passif', balance: 1200000, debit: 0, credit: 0 },
  { id: '5', code: '401', name: 'Fournisseurs', type: 'passif', balance: 450000, debit: 0, credit: 0 },
  // Actif (Assets)
  { id: '6', code: '411', name: 'Clients', type: 'actif', balance: 1850000, debit: 0, credit: 0 },
  { id: '7', code: '420', name: 'Personnel - Rémunérations', type: 'actif', balance: 0, debit: 0, credit: 0 },
  { id: '8', code: '430', name: 'Sécurité sociale', type: 'actif', balance: 125000, debit: 0, credit: 0 },
  { id: '9', code: '501', name: 'Caisse', type: 'actif', balance: 75000, debit: 0, credit: 0 },
  { id: '10', code: '512', name: 'Banque', type: 'actif', balance: 4250000, debit: 0, credit: 0 },
  { id: '11', code: '521', name: 'Virements internes', type: 'actif', balance: 0, debit: 0, credit: 0 },
  // Charges (Expenses)
  { id: '12', code: '601', name: 'Achats de marchandises', type: 'charge', balance: 1250000, debit: 1250000, credit: 0 },
  { id: '13', code: '602', name: 'Achats de matières premières', type: 'charge', balance: 380000, debit: 380000, credit: 0 },
  { id: '14', code: '604', name: 'Achats non stockés', type: 'charge', balance: 245000, debit: 245000, credit: 0 },
  { id: '15', code: '606', name: 'Fournitures', type: 'charge', balance: 180000, debit: 180000, credit: 0 },
  { id: '16', code: '621', name: 'Salaires et appointements', type: 'charge', balance: 4200000, debit: 4200000, credit: 0 },
  { id: '17', code: '623', name: 'Charges sociales', type: 'charge', balance: 1680000, debit: 1680000, credit: 0 },
  { id: '18', code: '626', name: 'Loyer', type: 'charge', balance: 480000, debit: 480000, credit: 0 },
  { id: '19', code: '627', name: 'Assurances', type: 'charge', balance: 95000, debit: 95000, credit: 0 },
  { id: '20', code: '628', name: 'Transports', type: 'charge', balance: 215000, debit: 215000, credit: 0 },
  { id: '21', code: '630', name: 'Impôts et taxes', type: 'charge', balance: 320000, debit: 320000, credit: 0 },
  { id: '22', code: '635', name: 'Taxe professionnelle', type: 'charge', balance: 180000, debit: 180000, credit: 0 },
  { id: '23', code: '640', name: 'Services extérieurs', type: 'charge', balance: 145000, debit: 145000, credit: 0 },
  { id: '24', code: '661', name: 'Frais bancaires', type: 'charge', balance: 45000, debit: 45000, credit: 0 },
  { id: '25', code: '671', name: 'Intérêts bancaires', type: 'charge', balance: 85000, debit: 85000, credit: 0 },
  { id: '26', code: '681', name: 'Dotations aux amortissements', type: 'charge', balance: 520000, debit: 520000, credit: 0 },
  { id: '27', code: '691', name: 'Dotations aux provisions', type: 'charge', balance: 0, debit: 0, credit: 0 },
  // Produits (Revenue)
  { id: '28', code: '701', name: 'Ventes de marchandises', type: 'produit', balance: 8500000, debit: 0, credit: 8500000 },
  { id: '29', code: '706', name: 'Prestations de services', type: 'produit', balance: 3200000, debit: 0, credit: 3200000 },
  { id: '30', code: '708', name: 'Produits des activités annexes', type: 'produit', balance: 450000, debit: 0, credit: 450000 },
  { id: '31', code: '740', name: 'Subventions d\'exploitation', type: 'produit', balance: 0, debit: 0, credit: 0 },
  { id: '32', code: '751', name: 'Redevances', type: 'produit', balance: 180000, debit: 0, credit: 180000 },
  { id: '33', code: '761', name: 'Produits financiers', type: 'produit', balance: 125000, debit: 0, credit: 125000 },
  { id: '34', code: '771', name: 'Excédents d\'apport', type: 'produit', balance: 0, debit: 0, credit: 0 },
  { id: '35', code: '781', name: 'Reprises sur amortissements', type: 'produit', balance: 0, debit: 0, credit: 0 },
  { id: '36', code: '791', name: 'Transferts de charges', type: 'produit', balance: 0, debit: 0, credit: 0 },
];

// Generate mock journal entries
const generateJournalEntries = (): JournalEntry[] => {
  const entries: JournalEntry[] = [
    {
      id: '1',
      date: new Date('2025-01-05'),
      reference: 'OD-001',
      description: 'Acompte fournisseurs - Acquisition équipement',
      accounts: [
        { code: '238', name: 'Avances acomptes versés', debit: 250000, credit: 0 },
        { code: '512', name: 'Banque', debit: 0, credit: 250000 },
      ],
      totalDebit: 250000,
      totalCredit: 250000,
    },
    {
      id: '2',
      date: new Date('2025-01-10'),
      reference: 'OD-002',
      description: 'Paiement salaire janvier',
      accounts: [
        { code: '421', name: 'Personnel - Rémunérations dues', debit: 3500000, credit: 0 },
        { code: '431', name: 'URSSAF', debit: 0, credit: 1400000 },
        { code: '437', name: 'Autres organismes sociaux', debit: 0, credit: 350000 },
        { code: '512', name: 'Banque', debit: 0, credit: 1750000 },
      ],
      totalDebit: 3500000,
      totalCredit: 3500000,
    },
    {
      id: '3',
      date: new Date('2025-01-15'),
      reference: 'VT-001',
      description: 'Facture #INV-2045 - Sonatel SA',
      accounts: [
        { code: '411', name: 'Clients', debit: 1220000, credit: 0 },
        { code: '701', name: 'Ventes de marchandises', debit: 0, credit: 1000000 },
        { code: '445', name: 'TVA collectée', debit: 0, credit: 220000 },
      ],
      totalDebit: 1220000,
      totalCredit: 1220000,
    },
    {
      id: '4',
      date: new Date('2025-01-20'),
      reference: 'AC-001',
      description: 'Achat fournitures bureau',
      accounts: [
        { code: '606', name: 'Fournitures', debit: 45000, credit: 0 },
        { code: '445', name: 'TVA déductible', debit: 9000, credit: 0 },
        { code: '401', name: 'Fournisseurs', debit: 0, credit: 54000 },
      ],
      totalDebit: 54000,
      totalCredit: 54000,
    },
    {
      id: '5',
      date: new Date('2025-01-25'),
      reference: 'BQ-001',
      description: 'Frais bancaires - Janvier',
      accounts: [
        { code: '661', name: 'Frais bancaires', debit: 3500, credit: 0 },
        { code: '512', name: 'Banque', debit: 0, credit: 3500 },
      ],
      totalDebit: 3500,
      totalCredit: 3500,
    },
    {
      id: '6',
      date: new Date('2025-02-01'),
      reference: 'OD-003',
      description: 'Loyer février',
      accounts: [
        { code: '626', name: 'Loyer', debit: 240000, credit: 0 },
        { code: '445', name: 'TVA déductible', debit: 48000, credit: 0 },
        { code: '512', name: 'Banque', debit: 0, credit: 288000 },
      ],
      totalDebit: 288000,
      totalCredit: 288000,
    },
    {
      id: '7',
      date: new Date('2025-02-05'),
      reference: 'VT-002',
      description: 'Facture #INV-2046 - BNK Group',
      accounts: [
        { code: '411', name: 'Clients', debit: 610000, credit: 0 },
        { code: '706', name: 'Prestations de services', debit: 0, credit: 500000 },
        { code: '445', name: 'TVA collectée', debit: 0, credit: 110000 },
      ],
      totalDebit: 610000,
      totalCredit: 610000,
    },
    {
      id: '8',
      date: new Date('2025-02-10'),
      reference: 'AC-002',
      description: 'Achat matière première',
      accounts: [
        { code: '601', name: 'Achats de marchandises', debit: 380000, credit: 0 },
        { code: '445', name: 'TVA déductible', debit: 76000, credit: 0 },
        { code: '401', name: 'Fournisseurs', debit: 0, credit: 456000 },
      ],
      totalDebit: 456000,
      totalCredit: 456000,
    },
    {
      id: '9',
      date: new Date('2025-02-15'),
      reference: 'OD-004',
      description: 'Charges sociales janvier',
      accounts: [
        { code: '645', name: 'Charges sociales', debit: 1400000, credit: 0 },
        { code: '431', name: 'URSSAF', debit: 0, credit: 980000 },
        { code: '437', name: 'Autres organismes', debit: 0, credit: 420000 },
      ],
      totalDebit: 1400000,
      totalCredit: 1400000,
    },
    {
      id: '10',
      date: new Date('2025-02-20'),
      reference: 'VT-003',
      description: 'Facture #INV-2047 - Dakar Airport',
      accounts: [
        { code: '411', name: 'Clients', debit: 427500, credit: 0 },
        { code: '708', name: 'Produits des activités', debit: 0, credit: 350000 },
        { code: '445', name: 'TVA collectée', debit: 0, credit: 77500 },
      ],
      totalDebit: 427500,
      totalCredit: 427500,
    },
    {
      id: '11',
      date: new Date('2025-02-25'),
      reference: 'OD-005',
      description: 'Amortissement équipements',
      accounts: [
        { code: '681', name: 'Dotations aux amortissements', debit: 125000, credit: 0 },
        { code: '281', name: 'Amortissements', debit: 0, credit: 125000 },
      ],
      totalDebit: 125000,
      totalCredit: 125000,
    },
    {
      id: '12',
      date: new Date('2025-02-28'),
      reference: 'CA-001',
      description: 'Règlement client Sonatel',
      accounts: [
        { code: '512', name: 'Banque', debit: 1220000, credit: 0 },
        { code: '411', name: 'Clients', debit: 0, credit: 1220000 },
      ],
      totalDebit: 1220000,
      totalCredit: 1220000,
    },
  ];
  return entries.sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const Accounting: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<'journal' | 'ledger' | 'balance' | 'income'>('journal');
  const [searchQuery, setSearchQuery] = useState('');
  const [accountTypeFilter, setAccountTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isNewEntryOpen, setIsNewEntryOpen] = useState(false);
  const itemsPerPage = 10;

  // Generate mock data
  const accounts = useMemo(() => generateAccounts(), []);
  const journalEntries = useMemo(() => generateJournalEntries(), []);

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

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
  };

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
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

      {/* Journal des écritures */}
      {activeTab === 'journal' && (
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
        </>
      )}

      {/* Grand Livre (General Ledger) */}
      {activeTab === 'ledger' && (
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
      {activeTab === 'balance' && (
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
      {activeTab === 'income' && (
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

