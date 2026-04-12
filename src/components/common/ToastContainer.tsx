// Toast Container Component - AEVUM Enterprise ERP
// Professional Toast Notifications with Animations

import React, { useEffect } from 'react';
import { useToastStore, ToastType } from '../../store/toastStore';
import { Colors, BorderRadius, Shadows, Spacing, FontSizes } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();
  const { colors } = useTheme();

  const getToastStyles = (type: ToastType): React.CSSProperties => {
    const baseStyles: Record<ToastType, React.CSSProperties> = {
      success: {
        background: colors.successBg,
        border: `1px solid ${colors.successMuted}`,
        color: colors.success,
      },
      error: {
        background: colors.dangerBg,
        border: `1px solid ${colors.dangerMuted}`,
        color: colors.danger,
      },
      warning: {
        background: colors.warningBg,
        border: `1px solid ${colors.warningMuted}`,
        color: colors.warning,
      },
      info: {
        background: colors.primaryMutedBg,
        border: `1px solid ${colors.primaryMuted}`,
        color: colors.primary,
      },
    };
    return baseStyles[type] || baseStyles.info;
  };

  const getIcon = (type: ToastType) => {
    const icons: Record<ToastType, JSX.Element> = {
      success: <CheckCircle size={20} />,
      error: <AlertCircle size={20} />,
      warning: <AlertTriangle size={20} />,
      info: <Info size={20} />,
    };
    return icons[type] || icons.info;
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: Spacing.xxl,
        right: Spacing.xxl,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: Spacing.md,
        maxWidth: 420,
        pointerEvents: 'none',
      }}
    >
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            pointerEvents: 'auto',
            background: colors.card,
            borderRadius: BorderRadius.xl,
            border: 'none',
            boxShadow: Shadows.cardElevated,
            padding: Spacing.lg,
            display: 'flex',
            gap: Spacing.md,
            alignItems: 'flex-start',
            animation: 'slideInRight 0.3s ease forwards',
            transform: `translateY(0)`,
            transition: 'all 0.3s ease',
            opacity: 1,
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = Shadows.cardHover;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = Shadows.cardElevated;
          }}
        >
          {/* Progress bar */}
          {toast.duration && toast.duration > 0 && (
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 3,
                background: 'transparent',
              }}
            >
              <div
                style={{
                  height: '100%',
                  background: getToastStyles(toast.type).color,
                  width: '100%',
                  animation: `shrink ${toast.duration}ms linear forwards`,
                  opacity: 0.3,
                }}
              />
            </div>
          )}

          {/* Icon */}
          <div
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ...getToastStyles(toast.type),
              width: 24,
              height: 24,
              borderRadius: BorderRadius.full,
              background: getToastStyles(toast.type).background,
              color: getToastStyles(toast.type).color,
            }}
          >
            {getIcon(toast.type)}
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: FontSizes.md,
                fontWeight: 600,
                marginBottom: 4,
                color: colors.text,
              }}
            >
              {toast.title}
            </div>
            {toast.message && (
              <div
                style={{
                  fontSize: FontSizes.sm,
                  color: colors.textSecondary,
                  lineHeight: 1.4,
                }}
              >
                {toast.message}
              </div>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={() => removeToast(toast.id)}
            style={{
              flexShrink: 0,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.textMuted,
              borderRadius: BorderRadius.md,
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.bgSecondary;
              e.currentTarget.style.color = colors.text;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = colors.textMuted;
            }}
          >
            <X size={16} />
          </button>
        </div>
      ))}

      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default ToastContainer;
