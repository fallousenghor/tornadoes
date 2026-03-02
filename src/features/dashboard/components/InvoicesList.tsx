// Invoices List Component - Factures Récentes
import React, { useState, useEffect } from 'react';
import { Button, Badge, SectionTitle } from '../../../components/common';
import { Colors } from '../../../constants/theme';
import { formatCurrency } from '../../../utils';
import invoiceService from '../../../services/invoiceService';
import type { Invoice } from '@/types';

export const InvoicesList: React.FC = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const { data } = await invoiceService.getInvoices({ pageSize: 5 });
        setInvoices(data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  // Calculate totals
  const totalIssued = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = invoices
    .filter(inv => inv.status === 'paye')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const totalPending = invoices
    .filter(inv => inv.status === 'en_attente' || inv.status === 'partiel')
    .reduce((sum, inv) => sum + inv.amount, 0);

  return (
    <div style={{
      background: Colors.card,
      border: `1px solid ${Colors.border}`,
      borderRadius: 16,
      padding: 24,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <SectionTitle icon="⬡" title="Factures Récentes" sub="Statut des paiements" />
        <Button variant="primary" size="sm">+ Créer</Button>
      </div>
      {loading ? (
        <div style={{ padding: 20, textAlign: 'center', color: Colors.textMuted }}>Chargement...</div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {invoices.map((f, i) => (
              <div key={f.id || i} style={{ display: 'flex', alignItems: 'center',
                padding: '10px 12px', borderRadius: 9, border: '1px solid rgba(100,140,255,0.07)',
                background: 'rgba(255,255,255,0.01)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, color: Colors.text, fontFamily: "'DM Sans',sans-serif" }}>{f.reference}</div>
                  <div style={{ fontSize: 9, color: Colors.textDim, fontFamily: "'DM Sans',sans-serif" }}>{f.clientName} · {f.date instanceof Date ? f.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : new Date(f.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</div>
                </div>
                <div style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 13, color: Colors.text, marginRight: 10 }}>{formatCurrency(f.amount)}</div>
                <Badge type="status">{f.status === 'paye' ? 'Payé' : f.status === 'en_attente' ? 'En attente' : 'Partiel'}</Badge>
                <button style={{ marginLeft: 8, padding: '3px 8px', border: `1px solid ${Colors.border}`,
                  borderRadius: 5, background: 'transparent', color: Colors.textMuted, fontSize: 8, cursor: 'pointer',
                  fontFamily: "'DM Sans',sans-serif" }}>PDF ↓</button>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 12 }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 7, padding: '8px 10px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 13, color: Colors.text }}>{formatCurrency(totalIssued)}</div>
              <div style={{ fontSize: 8, color: Colors.textDim, fontFamily: "'DM Sans',sans-serif", marginTop: 2 }}>Total émis</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 7, padding: '8px 10px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 13, color: Colors.green }}>{formatCurrency(totalPaid)}</div>
              <div style={{ fontSize: 8, color: Colors.textDim, fontFamily: "'DM Sans',sans-serif", marginTop: 2 }}>Payé</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 7, padding: '8px 10px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 13, color: Colors.orange }}>{formatCurrency(totalPending)}</div>
              <div style={{ fontSize: 8, color: Colors.textDim, fontFamily: "'DM Sans',sans-serif", marginTop: 2 }}>En attente</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InvoicesList;

