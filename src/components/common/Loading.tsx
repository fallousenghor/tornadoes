// Loading Components - AEVUM Enterprise ERP
// Professional Loading States

import React from 'react';
import { Spacing, FontSizes, BorderRadius, Colors } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

// ==================== LOADING SPINNER ====================
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  style,
}) => {
  const { colors } = useTheme();

  const sizeValues = {
    sm: 20,
    md: 32,
    lg: 48,
  };

  const spinnerStyle: React.CSSProperties = {
    width: sizeValues[size],
    height: sizeValues[size],
    border: `3px solid ${colors.border}`,
    borderTopColor: colors.primary,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    ...style,
  };

  return (
    <div style={spinnerStyle} className={className} />
  );
};

// ==================== LOADING OVERLAY ====================
export interface LoadingOverlayProps {
  loading: boolean;
  children: React.ReactNode;
  message?: string;
  opaque?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  loading,
  children,
  message,
  opaque = false,
}) => {
  const { colors } = useTheme();

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    background: opaque ? colors.card : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: opaque ? 'none' : 'blur(4px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    zIndex: 1000,
    transition: 'opacity 0.2s ease',
    opacity: loading ? 1 : 0,
    pointerEvents: loading ? 'all' : 'none',
  };

  const messageStyle: React.CSSProperties = {
    fontSize: FontSizes.md,
    color: colors.textSecondary,
    fontWeight: 500,
  };

  return (
    <div style={{ position: 'relative' }}>
      {children}
      {loading && (
        <div style={overlayStyle}>
          <LoadingSpinner size="lg" />
          {message && <div style={messageStyle}>{message}</div>}
        </div>
      )}
    </div>
  );
};

// ==================== SKELETON LOADING ====================
export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  variant?: 'rect' | 'circular' | 'text';
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = 16,
  borderRadius = 4,
  variant = 'rect',
  className = '',
  style,
}) => {
  const { colors } = useTheme();

  const skeletonStyle: React.CSSProperties = {
    width,
    height,
    borderRadius: variant === 'circular' ? '50%' : borderRadius,
    background: `linear-gradient(90deg, ${colors.bgSecondary} 25%, ${colors.bgTertiary} 50%, ${colors.bgSecondary} 75%)`,
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
    ...style,
  };

  return <div style={skeletonStyle} className={className} />;
};

// ==================== SKELETON CARD ====================
export interface SkeletonCardProps {
  lines?: number;
  showImage?: boolean;
  showAvatar?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  lines = 3,
  showImage = false,
  showAvatar = false,
  className = '',
  style,
}) => {
  const { colors } = useTheme();

  const cardStyle: React.CSSProperties = {
    background: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xxl,
    ...style,
  };

  return (
    <div style={cardStyle} className={className}>
      {showImage && (
        <Skeleton
          height={160}
          borderRadius={8}
          style={{ marginBottom: Spacing.lg }}
        />
      )}
      
      {showAvatar && (
        <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.lg }}>
          <Skeleton width={40} height={40} variant="circular" />
          <div style={{ flex: 1 }}>
            <Skeleton width={120} height={14} style={{ marginBottom: 6 }} />
            <Skeleton width={80} height={12} />
          </div>
        </div>
      )}

      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={14}
          style={{ 
            marginBottom: i === lines - 1 ? 0 : Spacing.sm,
            width: i === lines - 1 ? '60%' : '100%',
          }}
        />
      ))}
    </div>
  );
};

// ==================== SKELETON TABLE ====================
export interface SkeletonTableProps {
  rows?: number;
  columns?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const SkeletonTable: React.FC<SkeletonTableProps> = ({
  rows = 5,
  columns = 4,
  className = '',
  style,
}) => {
  const { colors } = useTheme();

  const tableStyle: React.CSSProperties = {
    background: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    ...style,
  };

  return (
    <div style={tableStyle} className={className}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        gap: Spacing.lg, 
        marginBottom: Spacing.lg,
        paddingBottom: Spacing.lg,
        borderBottom: `1px solid ${colors.border}`,
      }}>
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} height={12} width={80} />
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} style={{ 
          display: 'flex', 
          gap: Spacing.lg, 
          marginBottom: Spacing.md,
        }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} height={14} width={100} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default LoadingSpinner;
