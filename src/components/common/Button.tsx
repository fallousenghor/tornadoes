// Button Component - AEVUM Enterprise ERP
// Corporate Professional Theme - B2B SaaS Design System

import React from 'react';
import { Colors, BorderRadius, Transitions, Spacing, FontSizes } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
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
  const { colors } = useTheme();
  const [isHovered, setIsHovered] = React.useState(false);

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          background: colors.primary,
          color: colors.textInverse,
          border: 'none',
        };
      case 'secondary':
        return {
          background: colors.bgSecondary,
          color: colors.textPrimary,
          border: `1px solid ${colors.border}`,
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: colors.textSecondary,
          border: 'none',
        };
      case 'danger':
        return {
          background: colors.danger,
          color: colors.textInverse,
          border: 'none',
        };
      default:
        return {};
    }
  };

  const getHoverStyles = (): React.CSSProperties => {
    if (disabled) return {};
    
    switch (variant) {
      case 'primary':
        return {
          background: colors.primaryLight,
        };
      case 'secondary':
        return {
          background: colors.bgTertiary,
        };
      case 'ghost':
        return {
          background: colors.hover,
        };
      case 'danger':
        return {
          background: colors.dangerLight,
        };
      default:
        return {};
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return {
          padding: `${Spacing.xs}px ${Spacing.sm}px`,
          fontSize: FontSizes.sm,
        };
      case 'md':
        return {
          padding: `${Spacing.sm}px ${Spacing.lg}px`,
          fontSize: FontSizes.md,
        };
      case 'lg':
        return {
          padding: `${Spacing.md}px ${Spacing.xl}px`,
          fontSize: FontSizes.lg,
        };
      default:
        return {};
    }
  };

  const baseStyle: React.CSSProperties = {
    borderRadius: BorderRadius.lg,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: Transitions.fast,
    opacity: disabled ? 0.5 : isHovered ? 0.9 : 1,
    fontFamily: "'DM Sans', sans-serif",
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    fontWeight: 500,
    boxShadow: variant === 'primary' ? '0 2px 4px rgba(30, 58, 138, 0.2)' : 'none',
    ...getVariantStyles(),
    ...getSizeStyles(),
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

