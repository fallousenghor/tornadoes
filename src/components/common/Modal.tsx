// Modal Component - AEVUM Enterprise ERP
// Corporate Professional Theme - B2B SaaS Design System

import React, { useEffect } from 'react';
import { BorderRadius, Transitions, Spacing, FontSizes, FontWeights, Shadows } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'danger' | 'success';
  showCloseButton?: boolean;
  closeOnOverlay?: boolean;
  footer?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = 'md',
  variant = 'default',
  showCloseButton = true,
  closeOnOverlay = true,
  footer,
  className = '',
  style,
}) => {
  const { colors } = useTheme();

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeStyles = {
    sm: { maxWidth: 400 },
    md: { maxWidth: 560 },
    lg: { maxWidth: 720 },
    xl: { maxWidth: 900 },
    full: { maxWidth: 'calc(100vw - 48px)', width: '100%' },
  };

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'danger':
        return {
          borderTop: `3px solid ${colors.danger}`,
        };
      case 'success':
        return {
          borderTop: `3px solid ${colors.success}`,
        };
      default:
        return {
          borderTop: `3px solid ${colors.primary}`,
        };
    }
  };

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxl,
    animation: 'modalFadeIn 0.2s ease forwards',
  };

  const backdropStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(4px)',
    cursor: closeOnOverlay ? 'pointer' : 'default',
    animation: 'backdropFadeIn 0.2s ease forwards',
  };

  const modalStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    ...sizeStyles[size],
    maxHeight: 'calc(100vh - 48px)',
    background: colors.card,
    borderRadius: BorderRadius.xxl,
    border: `1px solid ${colors.border}`,
    boxShadow: Shadows.cardElevated,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    animation: 'modalSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
    ...getVariantStyles(),
    ...style,
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: `${Spacing.xxl}px ${Spacing.xxl}px ${Spacing.lg}px`,
    borderBottom: `1px solid ${colors.border}`,
    gap: Spacing.md,
  };

  const titleContainerStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.semibold,
    color: colors.text,
    fontFamily: "'DM Sans', sans-serif",
    margin: 0,
    lineHeight: 1.3,
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: FontSizes.sm,
    color: colors.textSecondary,
    marginTop: Spacing.xs,
    lineHeight: 1.4,
  };

  const closeButtonStyle: React.CSSProperties = {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.lg,
    border: 'none',
    background: colors.bgSecondary,
    color: colors.textSecondary,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: Transitions.fast,
  };

  const contentStyle: React.CSSProperties = {
    padding: `${Spacing.lg}px ${Spacing.xxl}px`,
    overflowY: 'auto',
    flex: 1,
    minHeight: 0,
  };

  const footerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Spacing.sm,
    padding: `${Spacing.lg}px ${Spacing.xxl}px`,
    borderTop: `1px solid ${colors.border}`,
    background: colors.bgSecondary,
    flexShrink: 0,
  };

  const handleBackdropClick = () => {
    if (closeOnOverlay) {
      onClose();
    }
  };

  return (
    <div style={overlayStyle} className={className}>
      <div style={backdropStyle} onClick={handleBackdropClick} />
      
      <div style={modalStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div style={titleContainerStyle}>
            <h2 style={titleStyle}>{title}</h2>
            {subtitle && <div style={subtitleStyle}>{subtitle}</div>}
          </div>
          
          {showCloseButton && (
            <button
              onClick={onClose}
              style={closeButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = colors.border;
                e.currentTarget.style.color = colors.text;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = colors.bgSecondary;
                e.currentTarget.style.color = colors.textSecondary;
              }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Content */}
        <div style={contentStyle}>{children}</div>

        {/* Footer */}
        {footer && <div style={footerStyle}>{footer}</div>}
      </div>

      <style>{`
        @keyframes modalFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes backdropFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Modal;

