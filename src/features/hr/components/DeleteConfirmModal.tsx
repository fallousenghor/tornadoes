import React from 'react';
import Modal from '../../../components/common/Modal';
import { Button } from '../../../components/common';
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
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div style={{ padding: '16px 0', fontSize: 14, color: Colors.text, lineHeight: 1.6 }}>
        {message}
      </div>
      <div style={{ 
        display: 'flex', 
        gap: 12, 
        justifyContent: 'flex-end', 
        paddingTop: 16,
        borderTop: `1px solid ${Colors.border}`,
      }}>
        <Button 
          variant="ghost" 
          onClick={onClose}
          disabled={isLoading}
          style={{ flex: 1 }}
        >
          Annuler
        </Button>
        <Button 
variant="danger"
          onClick={onConfirm}
          disabled={isLoading}
          style={{ flex: 1 }}
        >
          Confirmer la suppression
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;

