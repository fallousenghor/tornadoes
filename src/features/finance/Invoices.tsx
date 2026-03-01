// Invoicing Page - Finance Module
// Complete invoice management with client tracking, payments, and analytics

import React, { useState, useMemo } from 'react';
import { Card, Button, Badge, SearchInput, Modal } from '../../components/common';
import { Colors } from '../../constants/theme';
import { invoicesData } from '../../data/mockData';

// Invoice type
interface InvoiceDisplay {
  id: string;
  reference: string;
  clientId: string;
  clientName: string;
  amount: number;
  date: Date;
  dueDate?: Date;
  status: 'paye' | 'en_attente' | 'partiel';
  paidAmount?: number;
  items: { description: string; quantity: number; unitPrice: number; total: number }[];
}

// Generate mock invoices
const generateInvoices = (): InvoiceDisplay[] => {
  const clients = [
    'Sonatel SA', 'BNK Group', 'CBAO', 'Dakar Airport', 'Orange SN',
    'Free Senegal', 'Sukala Group', 'Manhattan Corp', 'Tigo', 'Expresso'
  ];
  
  const invoices: InvoiceDisplay[] = [];
  
  for (let i = 0; i < 25; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 60));
    
    const dueDate = new Date(date);
    dueDate.setDate(dueDate.getDate() + 30);
    
    const amount = Math.floor(Math.random() * 200000) + 10000;
    const statuses: InvoiceDisplay['status'][] = ['paye', 'en_attente', 'partiel'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const paidAmount = status === 'paye' ? amount : 
                      status === 'partiel' ? Math.floor(amount * (Math.random() * 0.5 + 0.3)) : 0;
    
    invoices.push({
      id: `inv-${i}`,
      reference: `INV-${2020 + i}`,
      clientId: `c${i}`,
      clientName: clients[Math.floor(Math.random() * clients.length)],
      amount,
      date,
      dueDate,
      status,
      paidAmount,
      items: [
        { description: 'Services de consultation', quantity: Math.floor(Math.random() * 10) + 1, unitPrice: 15000, total: 0 },
        { description: 'Formation équipes', quantity: Math.floor(Math.random() * 5) + 1, unitPrice: 25000, total: 0 },
      ],
    });
  }
  
  // Calculate item totals
  invoices.forEach(inv => {
    inv.items.forEach(item => {
      item.total = item.quantity * item.unitPrice;
    });
  });
  
  return invoices.sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const Invoices: React.FC = () => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDisplay | null>(null);
  const itemsPerPage = 10;

  // Generate mock data
  const invoices = useMemo(() => generateInvoices(), []);

  // Filter invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter(invoice => {
      const matchesSearch = 
        invoice.reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchQuery, statusFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const paid = invoices.filter(inv => inv.status === 'paye').reduce((sum, inv) => sum + inv.amount, 0);
    const pending = invoices.filter(inv => inv.status === 'en_attente').reduce((sum, inv) => sum + inv.amount, 0);
    const partial = invoices.filter(inv => inv.status === 'partiel').reduce((sum, inv) => sum + inv.amount, 0);
    const overdue = invoices.filter(inv => inv.status !== 'paye' && inv.dueDate && inv.dueDate < new Date()).length;
    
    return { total, paid, pending, partial, overdue };
  }, [invoices]);

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);
  const paginatedInvoices = filteredInvoices.slice(
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

  // Status badge
  const getStatusBadge = (status: InvoiceDisplay['status']) => {
    const styles: Record<string, { bg: string; color: string; label: string }> = {
      paye: { bg: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e', label: 'Payé' },
      en_attente: { bg: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', label: 'En attente' },
      partiel: { bg: 'rgba(100, 140, 255, 0.15)', color: '#6490ff', label: 'Partiel' },
    };
    return styles[status] || styles.en_attente;
  };

  // Handle view details
  const handleViewDetails = (invoice: InvoiceDisplay) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: Colors.text, marginBottom: 4 }}>
            Gestion des Factures
          </h1>
          <p style={{ fontSize: 13, color: Colors.textMuted }}>
            Facturation · Paiements · Suivi
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          + Nouvelle facture
        </Button>
      </div>

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
              ☰
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {formatCurrency(stats.total)}
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
                Payé
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {formatCurrency(stats.paid)}
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
                {formatCurrency(stats.pending)}
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
              ∼
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Partiel
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {formatCurrency(stats.partial)}
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
              background: stats.overdue > 0 ? 'rgba(224, 80, 80, 0.15)' : 'rgba(62, 207, 142, 0.15)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: 20,
              color: stats.overdue > 0 ? '#e05050' : '#3ecf8e',
            }}>
              ⚠
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                En retard
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text }}>
                {stats.overdue}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Invoice Status Distribution & Top Clients */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 24 }}>
        <Card style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: Colors.text, marginBottom: 16 }}>
            Répartition par Statut
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              { label: 'Payé', value: stats.paid, total: stats.total, color: '#3ecf8e' },
              { label: 'En attente', value: stats.pending, total: stats.total, color: '#fb923c' },
              { label: 'Partiel', value: stats.partial, total: stats.total, color: '#6490ff' },
            ].map((item, idx) => {
              const percentage = (item.value / item.total) * 100;
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
        
        <Card style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: Colors.text, marginBottom: 16 }}>
            Top Clients
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
            {[
              { name: 'Sonatel SA', amount: 245000, invoices: 12 },
              { name: 'BNK Group', amount: 189000, invoices: 8 },
              { name: 'CBAO', amount: 156000, invoices: 6 },
              { name: 'Dakar Airport', amount: 134000, invoices: 5 },
              { name: 'Orange SN', amount: 98000, invoices: 4 },
            ].map((client, idx) => (
              <div key={idx} style={{ 
                padding: 16, 
                background: 'rgba(100, 140, 255, 0.03)', 
                borderRadius: 12,
                border: `1px solid ${Colors.border}`,
              }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: Colors.text, marginBottom: 4 }}>
                  {client.name}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: Colors.accent, fontFamily: "'DM Serif Display', serif" }}>
                  {formatCurrency(client.amount)}
                </div>
                <div style={{ fontSize: 10, color: Colors.textMuted }}>
                  {client.invoices} factures
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Filters Card */}
      <Card style={{ marginBottom: 20, padding: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, alignItems: 'end' }}>
          <SearchInput 
            placeholder="Rechercher par référence, client..."
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
              <option value="paye">Payé</option>
              <option value="en_attente">En attente</option>
              <option value="partiel">Partiel</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Invoices Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(100, 140, 255, 0.05)' }}>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Référence</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Client</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Échéance</th>
                <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Montant</th>
                <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Statut</th>
                <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedInvoices.map((invoice, index) => {
                const statusStyle = getStatusBadge(invoice.status);
                const isOverdue = invoice.status !== 'paye' && invoice.dueDate && invoice.dueDate < new Date();
                
                return (
                  <tr 
                    key={invoice.id} 
                    style={{ 
                      borderBottom: `1px solid ${Colors.border}`,
                      background: index % 2 === 0 ? 'transparent' : 'rgba(100, 140, 255, 0.02)',
                    }}
                  >
                    <td style={{ padding: '14px 16px', fontSize: 13, fontFamily: 'monospace', fontWeight: 600, color: Colors.accent }}>
                      {invoice.reference}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: Colors.text }}>
                      {invoice.clientName}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: Colors.textMuted }}>
                      {invoice.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: isOverdue ? '#e05050' : Colors.textMuted }}>
                      {invoice.dueDate ? invoice.dueDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      {isOverdue && <span style={{ marginLeft: 6, fontSize: 10, color: '#e05050' }}>(En retard)</span>}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 14, fontWeight: 600, fontFamily: "'DM Serif Display', serif", color: Colors.text }}>
                      {formatCurrency(invoice.amount)}
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
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <button 
                          onClick={() => handleViewDetails(invoice)}
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
                        {invoice.status !== 'paye' && (
                          <button style={{ 
                            padding: '6px 12px', 
                            borderRadius: 6, 
                            border: 'none', 
                            background: 'rgba(62, 207, 142, 0.15)', 
                            color: '#3ecf8e', 
                            fontSize: 11, 
                            cursor: 'pointer',
                            fontWeight: 500,
                          }}>
                            Payer
                          </button>
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
            Affichage de {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, filteredInvoices.length)} sur {filteredInvoices.length}
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

      {/* Invoice Details / New Invoice Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setSelectedInvoice(null); }} 
        title={selectedInvoice ? `Facture ${selectedInvoice.reference}` : 'Nouvelle facture'}
        size="lg"
      >
        {selectedInvoice ? (
          // Invoice Details View
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>CLIENT</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: Colors.text }}>{selectedInvoice.clientName}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>STATUT</div>
                <span style={{ 
                  padding: '4px 10px', 
                  borderRadius: 6, 
                  fontSize: 11, 
                  fontWeight: 500,
                  background: getStatusBadge(selectedInvoice.status).bg, 
                  color: getStatusBadge(selectedInvoice.status).color,
                }}>
                  {getStatusBadge(selectedInvoice.status).label}
                </span>
              </div>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>DATE</div>
                <div style={{ fontSize: 14, color: Colors.text }}>{selectedInvoice.date.toLocaleDateString('fr-FR')}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>ÉCHÉANCE</div>
                <div style={{ fontSize: 14, color: Colors.text }}>{selectedInvoice.dueDate?.toLocaleDateString('fr-FR') || '—'}</div>
              </div>
            </div>
            
            <div style={{ borderTop: `1px solid ${Colors.border}`, paddingTop: 20 }}>
              <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 12 }}>ITEMS</div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${Colors.border}` }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 10, color: Colors.textMuted }}>Description</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center', fontSize: 10, color: Colors.textMuted }}>Qté</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 10, color: Colors.textMuted }}>Prix unit.</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right', fontSize: 10, color: Colors.textMuted }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedInvoice.items.map((item, idx) => (
                    <tr key={idx} style={{ borderBottom: `1px solid ${Colors.border}` }}>
                      <td style={{ padding: '8px 12px', fontSize: 13, color: Colors.text }}>{item.description}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'center', fontSize: 13, color: Colors.text }}>{item.quantity}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'right', fontSize: 13, color: Colors.text }}>{formatCurrency(item.unitPrice)}</td>
                      <td style={{ padding: '8px 12px', textAlign: 'right', fontSize: 13, fontWeight: 600, color: Colors.text }}>{formatCurrency(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{ width: 200 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: Colors.textMuted }}>Sous-total</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: Colors.text }}>{formatCurrency(selectedInvoice.amount)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: Colors.textMuted }}>TVA (18%)</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: Colors.text }}>{formatCurrency(selectedInvoice.amount * 0.18)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, borderTop: `1px solid ${Colors.border}` }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: Colors.text }}>Total</span>
                    <span style={{ fontSize: 18, fontWeight: 700, color: Colors.accent, fontFamily: "'DM Serif Display', serif" }}>
                      {formatCurrency(selectedInvoice.amount * 1.18)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
              <Button variant="secondary" onClick={() => { setIsModalOpen(false); setSelectedInvoice(null); }}>
                Fermer
              </Button>
              {selectedInvoice.status !== 'paye' && (
                <Button variant="primary">
                  Enregistrer paiement
                </Button>
              )}
            </div>
          </div>
        ) : (
          // New Invoice Form
          <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Client</label>
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
                  <option value="">Sélectionner un client</option>
                  <option value="c1">Sonatel SA</option>
                  <option value="c2">BNK Group</option>
                  <option value="c3">CBAO</option>
                  <option value="c4">Dakar Airport</option>
                  <option value="c5">Orange SN</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Date de facturation</label>
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
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Date d'échéance</label>
                <input 
                  type="date" 
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
                  placeholder="Description des services..."
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
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>TVA (%)</label>
                <input 
                  type="number" 
                  defaultValue={18}
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
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
              <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
                Annuler
              </Button>
              <Button variant="primary" type="submit">
                Créer la facture
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Invoices;

