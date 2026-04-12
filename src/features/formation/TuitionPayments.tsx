// Tuition Payments Page - Education Module
// Gestion des paiements de formation des apprenants

import React, { useState, useEffect, useMemo } from 'react';
import { Colors, BorderRadius } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import tuitionPaymentService, { TuitionPaymentResponse } from '../../services/tuitionPaymentService';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount);
};

const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  PENDING: { bg: '#fef3c7', text: '#d97706', label: 'En attente' },
  PAID: { bg: '#dcfce7', text: '#16a34a', label: 'Payé' },
  OVERDUE: { bg: '#fee2e2', text: '#dc2626', label: 'En retard' },
  CANCELLED: { bg: '#f3f4f6', text: '#6b7280', label: 'Annulé' },
};

const paymentTypeLabels: Record<string, string> = {
  REGISTRATION: 'Inscription',
  MONTHLY: 'Mensualité',
  INSTALLMENT: 'Échéance',
  FULL_PAYMENT: 'Paiement complet',
  REFUND: 'Remboursement',
};

const TuitionPayments: React.FC = () => {
  const { colors } = useTheme();
  const [payments, setPayments] = useState<TuitionPaymentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  // Confirm payment modal
  const [confirmModal, setConfirmModal] = useState<{ open: boolean; payment: TuitionPaymentResponse | null }>({ open: false, payment: null });
  const [receiptNumber, setReceiptNumber] = useState('');

  useEffect(() => { loadPayments(); }, [page, statusFilter, typeFilter]);

  const loadPayments = async () => {
    try {
      setLoading(true);
      const result = await tuitionPaymentService.getPayments({ page, size: pageSize });
      setPayments(result.data);
      setTotal(result.total);
    } catch (error) {
      console.error('Error loading payments:', error);
    } finally { setLoading(false); }
  };

  const handleConfirm = async () => {
    if (!confirmModal.payment) return;
    try {
      await tuitionPaymentService.confirm(confirmModal.payment.id, receiptNumber);
      await loadPayments();
      setConfirmModal({ open: false, payment: null });
      setReceiptNumber('');
    } catch (error) {
      console.error('Error confirming payment:', error);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await tuitionPaymentService.cancel(id);
      await loadPayments();
    } catch (error) {
      console.error('Error cancelling payment:', error);
    }
  };

  const filteredPayments = useMemo(() => {
    return payments.filter(p => {
      const matchesSearch = p.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           p.programTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           p.reference.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
      const matchesType = typeFilter === 'all' || p.paymentType === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [payments, searchQuery, statusFilter, typeFilter]);

  const totalPaid = payments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'PENDING').reduce((sum, p) => sum + p.amount, 0);
  const totalOverdue = payments.filter(p => p.status === 'OVERDUE').length;

  const containerStyle: React.CSSProperties = { padding: 24, background: colors.bg, minHeight: '100vh' };
  const cardStyle: React.CSSProperties = { background: colors.card || colors.bg, borderRadius: BorderRadius.md, border: `1px solid ${colors.border}`, padding: 20 };
  const badgeStyle = (status: string): React.CSSProperties => ({
    display: 'inline-block', padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600,
    background: statusColors[status]?.bg || '#f3f4f6', color: statusColors[status]?.text || '#6b7280',
  });

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.text, margin: 0 }}>💰 Paiements Formation</h1>
          <p style={{ fontSize: 14, color: colors.textMuted, margin: '4px 0 0' }}>Suivi des paiements des apprenants</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total payé', value: formatCurrency(totalPaid), color: '#16a34a' },
          { label: 'En attente', value: formatCurrency(totalPending), color: '#d97706' },
          { label: 'En retard', value: totalOverdue.toString(), color: '#dc2626' },
          { label: 'Total transactions', value: total.toString(), color: colors.primary },
        ].map((stat, i) => (
          <div key={i} style={{ ...cardStyle, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <p style={{ fontSize: 13, color: colors.textMuted, margin: '4px 0 0' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        <input type="text" placeholder="Rechercher..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: '10px 14px', borderRadius: BorderRadius.md, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text }}
        />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '6px 12px', borderRadius: 6, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text }}
        >
          <option value="all">Tous les statuts</option>
          {Object.entries(statusColors).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          style={{ padding: '6px 12px', borderRadius: 6, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text }}
        >
          <option value="all">Tous les types</option>
          {Object.entries(paymentTypeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48 }}>⏳ Chargement...</div>
      ) : filteredPayments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 48, color: colors.textMuted }}>📭 Aucun paiement trouvé</div>
      ) : (
        <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                {['Référence', 'Étudiant', 'Programme', 'Type', 'Montant', 'Échéance', 'Statut', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: colors.textMuted, background: colors.bg }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map(p => (
                <tr key={p.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontFamily: 'monospace' }}>{p.reference}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600 }}>{p.studentName}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13 }}>{p.programTitle || '—'}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13 }}>{paymentTypeLabels[p.paymentType] || p.paymentType}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700, color: p.status === 'PAID' ? '#16a34a' : colors.text }}>{formatCurrency(p.amount)}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13 }}>{p.dueDate}</td>
                  <td style={{ padding: '12px 16px' }}><span style={badgeStyle(p.status)}>{statusColors[p.status]?.label}</span></td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {p.status === 'PENDING' && (
                        <button onClick={() => setConfirmModal({ open: true, payment: p })} style={{ padding: '4px 10px', borderRadius: 4, background: '#dcfce7', color: '#16a34a', border: 'none', fontSize: 12, cursor: 'pointer' }}>✓ Confirmer</button>
                      )}
                      {p.status !== 'PAID' && (
                        <button onClick={() => handleCancel(p.id)} style={{ padding: '4px 10px', borderRadius: 4, background: '#fee2e2', color: '#dc2626', border: 'none', fontSize: 12, cursor: 'pointer' }}>✕</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderTop: `1px solid ${colors.border}` }}>
            <span style={{ fontSize: 13, color: colors.textMuted }}>Page {page + 1} sur {Math.ceil(total / pageSize)}</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setPage(p => p - 1)} disabled={page === 0} style={{ padding: '6px 12px', borderRadius: 4, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, cursor: page === 0 ? 'not-allowed' : 'pointer', opacity: page === 0 ? 0.5 : 1 }}>Précédent</button>
              <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / pageSize) - 1} style={{ padding: '6px 12px', borderRadius: 4, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, cursor: page >= Math.ceil(total / pageSize) - 1 ? 'not-allowed' : 'pointer', opacity: page >= Math.ceil(total / pageSize) - 1 ? 0.5 : 1 }}>Suivant</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Payment Modal */}
      {confirmModal.open && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setConfirmModal({ open: false, payment: null })}>
          <div style={{ background: colors.bg, borderRadius: BorderRadius.md, padding: 24, minWidth: 400 }} onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 16px' }}>Confirmer le paiement</h3>
            <p style={{ fontSize: 14, color: colors.textMuted }}>Réf: {confirmModal.payment?.reference} — {formatCurrency(confirmModal.payment?.amount || 0)}</p>
            <label style={{ display: 'block', fontSize: 12, color: colors.textMuted, marginBottom: 6 }}>N° de reçu *</label>
            <input value={receiptNumber} onChange={e => setReceiptNumber(e.target.value)} placeholder="REC-2024-001"
              style={{ width: '100%', padding: 12, borderRadius: 8, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, marginBottom: 16 }}
            />
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button onClick={() => setConfirmModal({ open: false, payment: null })} style={{ padding: '8px 16px', borderRadius: 6, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, cursor: 'pointer' }}>Annuler</button>
              <button onClick={handleConfirm} style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: colors.primary, color: 'white', cursor: 'pointer' }}>Confirmer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TuitionPayments;
