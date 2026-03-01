// Modal Component - AEVUM Enterprise ERP
// Reusable modal with overlay and animations

import React from 'react';
import { Colors, BorderRadius } from '../../constants/theme';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const sizeStyles = {
    sm: { maxWidth: 400 },
    md: { maxWidth: 560 },
    lg: { maxWidth: 720 },
    xl: { maxWidth: 900 },
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    }}>
      <div onClick={onClose} style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(4px)',
      }} />
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: sizeStyles[size].maxWidth,
        maxHeight: '90vh',
        background: Colors.card,
        borderRadius: BorderRadius.xl,
        border: `1px solid ${Colors.border}`,
        boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5)',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: `1px solid ${Colors.border}`,
        }}>
          <h2 style={{
            fontSize: 16,
            fontWeight: 600,
            color: Colors.text,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            {title}
          </h2>
          <button onClick={onClose} style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            border: 'none',
            background: 'rgba(255, 255, 255, 0.05)',
            color: Colors.textMuted,
            fontSize: 18,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            ✕
          </button>
        </div>
        <div style={{
          padding: 20,
          overflowY: 'auto',
          maxHeight: 'calc(90vh - 140px)',
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

