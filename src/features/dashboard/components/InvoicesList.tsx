// Invoices List Component - Factures Récentes
import React from 'react';
import { Button, Badge, SectionTitle } from '../../../components/common';
import { Colors } from '../../../constants/theme';
import { formatCurrency } from '../../../utils';
import { invoicesData } from '../../../data/mockData';

export const InvoicesList: React.FC = () => {
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {invoicesData.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center',
            padding: '10px 12px', borderRadius: 9, border: '1px solid rgba(100,140,255,0.07)',
            background: 'rgba(255,255,255,0.01)' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: Colors.text, fontFamily: "'DM Sans',sans-serif" }}>{f.reference}</div>
              <div style={{ fontSize: 9, color: Colors.textDim, fontFamily: "'DM Sans',sans-serif" }}>{f.clientName} · {f.date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}</div>
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
        {[
          { l: 'Total émis', v: '104 600 €', c: Colors.text },
          { l: 'Payé', v: '79 500 €', c: Colors.green },
          { l: 'En attente', v: '21 100 €', c: Colors.orange }
        ].map(s => (
          <div key={s.l} style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 7, padding: '8px 10px', textAlign: 'center' }}>
            <div style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 13, color: s.c }}>{s.v}</div>
            <div style={{ fontSize: 8, color: Colors.textDim, fontFamily: "'DM Sans',sans-serif", marginTop: 2 }}>{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvoicesList;

