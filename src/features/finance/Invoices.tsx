// Invoicing Page - Finance Module
// Complete invoice management with client tracking, payments, and analytics

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, Button, Badge, SearchInput, Modal } from '../../components/common';
import { Colors } from '../../constants/theme';
import invoiceService from '../../services/invoiceService';
import type { Invoice, InvoiceStatus } from '../../types';
import { formatCurrency } from '../../utils/currency';

// Invoice type
interface InvoiceDisplay {
  id: string;
  reference: string;
  clientId: string;
  clientName: string;
  amount: number;
  date: Date;
  dueDate?: Date;
  status: InvoiceStatus;
  paidAmount?: number;
  items: { description: string; quantity: number; unitPrice: number; total: number }[];
}

export const Invoices: React.FC = () => {
  // State
  const [invoices, setInvoices] = useState<InvoiceDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDisplay | null>(null);
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    dueDate: '',
    description: '',
    amount: 0,
    taxRate: 18,
  });
  const itemsPerPage = 10;

  // Fetch invoices from API
  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await invoiceService.getInvoices({ pageSize: 50 });
      
      const mappedInvoices: InvoiceDisplay[] = response.data.map(inv => ({
        id: inv.id,
        reference: inv.reference,
        clientId: inv.clientId,
        clientName: inv.clientName,
        amount: inv.amount,
        date: inv.date,
        dueDate: inv.dueDate,
        status: inv.status,
        paidAmount: 0,
        items: inv.items || [],
      }));
      
      setInvoices(mappedInvoices);
    } catch (err) {
      console.error('Error fetching invoices:', err);
      setError('Erreur lors du chargement des factures');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

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
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage) || 1;
  const paginatedInvoices = filteredInvoices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Status badge
  const getStatusBadge = (status: InvoiceStatus) => {
    const styles: Record<string, { bg: string; color: string; label: string }> = {
      paye: { bg: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e', label: 'Payé' },
      en_attente: { bg: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', label: 'En attente' },
      partiel: { bg: 'rgba(100, 140, 255, 0.15)', color: '#6490ff', label: 'Partiel' },
    };
    return styles[status] || styles.en_attente;
  };

  // Handle view details
  const handleViewDetails = async (invoice: InvoiceDisplay) => {
    try {
      const fullInvoice = await invoiceService.getInvoice(invoice.id);
      setSelectedInvoice({
        ...fullInvoice,
        reference: fullInvoice.reference,
      });
      setIsModalOpen(true);
    } catch (err) {
      console.error('Error fetching invoice details:', err);
      setSelectedInvoice(invoice);
      setIsModalOpen(true);
    }
  };

  // Handle create invoice
  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await invoiceService.createInvoice({
        clientName: formData.clientName,
        clientEmail: formData.clientEmail,
        clientAddress: '',
        items: [
          { description: formData.description, quantity: 1, unitPrice: formData.amount }
        ],
        dueDate: formData.dueDate || undefined,
        currency: 'XOF',
        taxRate: formData.taxRate,
      });
      fetchInvoices();
      setIsModalOpen(false);
      setSelectedInvoice(null);
      setFormData({
        clientName: '',
        clientEmail: '',
        dueDate: '',
        description: '',
        amount: 0,
        taxRate: 18,
      });
    } catch (err) {
      console.error('Error creating invoice:', err);
      alert('Erreur lors de la création de la facture');
    }
  };

  // Handle payment
  const handlePayment = async (invoiceId: string) => {
    try {
      const invoice = invoices.find(inv => inv.id === invoiceId);
      if (!invoice) {
        alert('Facture non trouvée');
        return;
      }
      
      // Check if invoice is in DRAFT status - need to send it first
      // Backend requires invoice to be in SENT status before processing payment
      if (invoice.status === 'en_attente') {
        // Need to send the invoice first - but we need to check if it's actually DRAFT
        // The frontend status 'en_attente' maps to backend DRAFT or SENT
        // Let's try to process payment first - if it fails, we'll handle the error
      }
      
      await invoiceService.processPayment(invoiceId, {
        amount: invoice.amount,
        paymentMethod: 'bank_transfer',
      });
      fetchInvoices();
      setIsModalOpen(false);
      setSelectedInvoice(null);
    } catch (err: unknown) {
      console.error('Error processing payment:', err);
      // Provide more detailed error message
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      if (errorMessage.includes('SENT')) {
        alert('La facture doit d\'abord être envoyée au client avant d\'enregistrer un paiement.');
      } else if (errorMessage.includes('transition')) {
        alert('Impossible d\'enregistrer le paiement pour cette facture. Vérifiez le statut de la facture.');
      } else {
        alert('Erreur lors du traitement du paiement: ' + errorMessage);
      }
    }
  };

  // Handle form change
  const handleFormChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Calculate top clients from real data
  const topClients = useMemo(() => {
    const clientMap = new Map<string, { amount: number; count: number }>();
    
    invoices.forEach(inv => {
      const existing = clientMap.get(inv.clientName) || { amount: 0, count: 0 };
      clientMap.set(inv.clientName, {
        amount: existing.amount + inv.amount,
        count: existing.count + 1,
      });
    });
    
    return Array.from(clientMap.entries())
      .map(([name, data]) => ({ name, amount: data.amount, invoices: data.count }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
  }, [invoices]);

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
        <Button variant="primary" onClick={() => { setSelectedInvoice(null); setIsModalOpen(true); }}>
          + Nouvelle facture
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
              ☰
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
                {loading ? '...' : formatCurrency(stats.partial)}
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
                {loading ? '...' : stats.overdue}
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
        
        <Card style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: Colors.text, marginBottom: 16 }}>
            Top Clients
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
            {topClients.map((client, idx) => (
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
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: Colors.textMuted }}>
            Chargement des factures...
          </div>
        ) : (
          <>
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
                              <button 
                                onClick={() => handlePayment(invoice.id)}
                                style={{ 
                                  padding: '6px 12px', 
                                  borderRadius: 6, 
                                  border: 'none', 
                                  background: 'rgba(62, 207, 142, 0.15)', 
                                  color: '#3ecf8e', 
                                  fontSize: 11, 
                                  cursor: 'pointer',
                                  fontWeight: 500,
                                }}
                              >
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
          </>
        )}
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
                <Button variant="primary" onClick={() => handlePayment(selectedInvoice.id)}>
                  Enregistrer paiement
                </Button>
              )}
            </div>
          </div>
        ) : (
          // New Invoice Form
          <form onSubmit={handleCreateInvoice}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Client *</label>
                <input 
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={(e) => handleFormChange('clientName', e.target.value)}
                  placeholder="Nom du client"
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
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Email client</label>
                <input 
                  type="email"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={(e) => handleFormChange('clientEmail', e.target.value)}
                  placeholder="client@exemple.com"
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
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={(e) => handleFormChange('dueDate', e.target.value)}
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
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Description *</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder="Description des services..."
                  rows={3}
                  required
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
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>TVA (%)</label>
                <input 
                  type="number" 
                  name="taxRate"
                  value={formData.taxRate}
                  onChange={(e) => handleFormChange('taxRate', parseFloat(e.target.value) || 0)}
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
              <Button variant="secondary" type="button" onClick={() => { setIsModalOpen(false); setSelectedInvoice(null); }}>
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

