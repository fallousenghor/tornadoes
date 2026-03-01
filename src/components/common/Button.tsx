// Button Component - AEVUM Enterprise ERP

import React from 'react';
import { Colors, BorderRadius, Transitions, Spacing, FontSizes } from '../../constants/theme';

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

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: Colors.accentMuted,
    color: Colors.accent,
    border: 'none',
  },
  secondary: {
    background: 'transparent',
    color: Colors.textMuted,
    border: `1px solid ${Colors.border}`,
  },
  ghost: {
    background: 'transparent',
    color: Colors.textMuted,
    border: 'none',
  },
  danger: {
    background: Colors.redMuted,
    color: Colors.red,
    border: 'none',
  },
};

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: {
    padding: `${Spacing.xs}px ${Spacing.sm}px`,
    fontSize: FontSizes.sm,
  },
  md: {
    padding: `${Spacing.sm}px ${Spacing.lg}px`,
    fontSize: FontSizes.md,
  },
  lg: {
    padding: `${Spacing.md}px ${Spacing.xl}px`,
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

  const baseStyle: React.CSSProperties = {
    borderRadius: BorderRadius.lg,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: Transitions.fast,
    opacity: disabled ? 0.5 : isHovered ? 0.8 : 1,
    fontFamily: "'DM Sans', sans-serif",
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    ...variantStyles[variant],
    ...sizeStyles[size],
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

