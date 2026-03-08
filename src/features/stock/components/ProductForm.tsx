// Product Form Component - Stock Module
// Reusable form for creating and editing products

import React from 'react';
import { Modal, Button } from '../../../components/common';
import { Colors } from '../../../constants/theme';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
  product?: any | null;
}

export interface ProductFormData {
  name: string;
  reference: string;
  category: string;
  quantity: number;
  description?: string;
  serialNumber?: string;
  brand?: string;
  model?: string;
  location?: string;
  purchasePrice?: number;
}

const ProductForm: React.FC<ProductFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  product,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: ProductFormData = {
      name: formData.get('name') as string,
      reference: formData.get('reference') as string,
      category: formData.get('category') as string,
      quantity: Number(formData.get('quantity')),
    };
    
    onSubmit(data);
    onClose();
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    borderRadius: 8,
    border: `1px solid ${Colors.border}`,
    background: Colors.bg,
    color: Colors.text,
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 6,
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? product.name : 'Nouvel article'}
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={labelStyle}>Nom de l'article *</label>
            <input 
              name="name"
              type="text"
              style={inputStyle}
              placeholder="MacBook Pro 14"
              defaultValue={product?.name}
              required
            />
          </div>
          <div>
            <label style={labelStyle}>Référence *</label>
            <input 
              name="reference"
              type="text"
              style={inputStyle}
              placeholder="IT-001"
              defaultValue={product?.reference}
              required
            />
          </div>
          <div>
            <label style={labelStyle}>Catégorie *</label>
            <select 
              name="category"
              defaultValue={product?.category || ''}
              style={inputStyle}
              required
            >
              <option value="">Sélectionner...</option>
              <option value="informatique">Informatique</option>
              <option value="mobilier">Mobilier</option>
              <option value="equipements">Équipements</option>
              <option value="mobilite">Mobilité</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Quantité *</label>
            <input 
              name="quantity"
              type="number"
              style={inputStyle}
              placeholder="0"
              defaultValue={product?.quantity}
              required
            />
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
          <Button variant="secondary" type="button" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="primary" type="submit">
            {product ? 'Enregistrer' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductForm;

