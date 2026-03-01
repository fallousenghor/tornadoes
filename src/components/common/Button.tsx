// Button Component - AEVUM Enterprise ERP
// Corporate Professional Button Component

import React from 'react';
import { Colors, BorderRadius, Transitions, Spacing, FontSizes } from '../../constants/theme';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  style?: React.CSSProperties;
}

// Corporate professional button variants
const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: Colors.primary,
    color: Colors.textInverse,
    border: 'none',
  },
  secondary: {
    background: Colors.bgSecondary,
    color: Colors.textPrimary,
    border: `1px solid ${Colors.border}`,
  },
  ghost: {
    background: 'transparent',
    color: Colors.textSecondary,
    border: 'none',
  },
  danger: {
    background: Colors.danger,
    color: Colors.textInverse,
    border: 'none',
  },
  outline: {
    background: 'transparent',
    color: Colors.primary,
    border: `1px solid ${Colors.primary}`,
  },
};

// Size configurations - Professional sizing
const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: {
    padding: `${Spacing.xs + 2}px ${Spacing.sm + 4}px`,
    fontSize: FontSizes.sm,
  },
  md: {
    padding: `${Spacing.sm + 2}px ${Spacing.lg}px`,
    fontSize: FontSizes.md,
  },
  lg: {
    padding: `${Spacing.md}px ${Spacing.xl + 4}px`,
    fontSize: FontSizes.lg,
  },
};

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
  style,
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const getHoverStyles = () => {
    if (disabled) return {};
    
    switch (variant) {
      case 'primary':
        return {
          background: Colors.primaryLight,
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(30, 58, 138, 0.3)',
        };
      case 'secondary':
        return {
          background: Colors.bgTertiary,
          borderColor: Colors.borderDark,
        };
      case 'ghost':
        return {
          background: Colors.hover,
          color: Colors.primary,
        };
      case 'danger':
        return {
          background: Colors.dangerLight,
          transform: 'translateY(-1px)',
          boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
        };
      case 'outline':
        return {
          background: Colors.primaryMuted,
        };
      default:
        return {};
    }
  };

  const baseStyle: React.CSSProperties = {
    borderRadius: BorderRadius.lg,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: Transitions.fast,
    opacity: disabled ? 0.5 : isHovered ? 1 : 1,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    boxShadow: variant === 'primary' || variant === 'danger' ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
    ...variantStyles[variant],
    ...sizeStyles[size],
    ...(isHovered && !disabled ? getHoverStyles() : {}),
    ...style,
  };

  return (
    <button
      className={`btn ${className}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={baseStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </button>
  );
};

export default Button;

