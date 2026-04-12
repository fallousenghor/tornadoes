// Product Details Component - Stock Module
// Reusable component for viewing product details

import React from 'react';
import { Modal, Button } from '../../../components/common';
import { Colors } from '../../../constants/theme';

interface ProductDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  product: any | null;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  if (!product) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product.name}
      size="md"
    >
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>RÉFÉRENCE</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: Colors.accent, fontFamily: 'monospace' }}>{product.reference}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>CATÉGORIE</div>
            <div style={{ fontSize: 14, color: Colors.text, textTransform: 'capitalize' }}>{product.category}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>QUANTITÉ TOTALE</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>{product.quantity}</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>STOCK MINIMUM</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>{product.minQuantity}</div>
          </div>
        </div>
        
        <div style={{ borderTop: `1px solid ${Colors.border}`, paddingTop: 16 }}>
          <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 12 }}>RÉPARTITION</div>
          <div style={{ display: 'flex', gap: 24 }}>
            <div style={{ flex: 1, textAlign: 'center', padding: 16, background: 'rgba(62, 207, 142, 0.1)', borderRadius: 10 }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#3ecf8e', fontFamily: "'DM Serif Display', serif" }}>{product.available}</div>
              <div style={{ fontSize: 11, color: Colors.textMuted }}>Disponibles</div>
            </div>
            <div style={{ flex: 1, textAlign: 'center', padding: 16, background: 'rgba(167, 139, 250, 0.1)', borderRadius: 10 }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#a78bfa', fontFamily: "'DM Serif Display', serif" }}>{product.assigned}</div>
              <div style={{ fontSize: 11, color: Colors.textMuted }}>Affectés</div>
            </div>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
          <Button variant="secondary" onClick={onClose}>
            Fermer
          </Button>
          <Button variant="primary">
            Modifier
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ProductDetails;

