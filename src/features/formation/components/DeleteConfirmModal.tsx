// Delete Confirmation Modal - Formation Module

import React from 'react';
import { Modal, Button } from '../../../components/common';
import { Colors } from '../../../constants/theme';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p style={{ color: Colors.textMuted, margin: 0 }}>{message}</p>
        
        <div style={{ 
          padding: 12, 
          backgroundColor: 'rgba(220, 38, 38, 0.05)',
          borderRadius: 8,
          borderLeft: `4px solid ${Colors.danger}`
        }}>
          <p style={{ margin: 0, fontSize: 12, color: Colors.danger }}>
            ⚠️ Cette action est irréversible.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
          <Button 
            variant="secondary" 
            onClick={onClose}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button 
            variant="danger" 
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Suppression...' : 'Supprimer'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
