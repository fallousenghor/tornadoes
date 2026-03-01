// Journal Entry Form Component - Finance Module
// Reusable form for creating and editing journal entries

import React from 'react';
import { Modal, Button } from '../../../components/common';
import { Colors } from '../../../constants/theme';

interface JournalEntryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: JournalEntryFormData) => void;
}

export interface JournalEntryFormData {
  date: string;
  reference: string;
  description: string;
}

const JournalEntryForm: React.FC<JournalEntryFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: JournalEntryFormData = {
      date: formData.get('date') as string,
      reference: formData.get('reference') as string,
      description: formData.get('description') as string,
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
      title="Nouvelle écriture comptable"
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={labelStyle}>Date *</label>
            <input 
              name="date"
              type="date" 
              defaultValue={new Date().toISOString().split('T')[0]}
              style={inputStyle}
              required
            />
          </div>
          <div>
            <label style={labelStyle}>Référence *</label>
            <input 
              name="reference"
              type="text"
              style={inputStyle}
              placeholder="OD-000 / VT-000 / BQ-000"
              required
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Libellé *</label>
            <textarea 
              name="description"
              placeholder="Description de l'écriture..."
              rows={2}
              style={{
                ...inputStyle,
                resize: 'vertical',
              }}
              required
            />
          </div>
        </div>
        
        <div style={{ marginTop: 24, padding: 16, background: 'rgba(100, 140, 255, 0.05)', borderRadius: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: Colors.text, marginBottom: 12 }}>
            Écritures comptables
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 12 }}>
            <select style={inputStyle}>
              <option value="">Compte</option>
              <option value="238">238 - Avances acomptes versés</option>
              <option value="411">411 - Clients</option>
              <option value="512">512 - Banque</option>
              <option value="601">601 - Achats de marchandises</option>
              <option value="606">606 - Fournitures</option>
            </select>
            <input 
              type="number"
              placeholder="Débit"
              style={inputStyle}
            />
            <input 
              type="number"
              placeholder="Crédit"
              style={inputStyle}
            />
          </div>
          <button
            type="button"
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: `1px solid ${Colors.border}`,
              background: 'transparent',
              color: Colors.textMuted,
              fontSize: 12,
              cursor: 'pointer',
            }}
          >
            + Ajouter une ligne
          </button>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
          <Button variant="secondary" type="button" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="primary" type="submit">
            Enregistrer
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default JournalEntryForm;

