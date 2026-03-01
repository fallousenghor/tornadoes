// Input Component - AEVUM Enterprise ERP
// Corporate Professional Theme - B2B SaaS Design System

import React from 'react';
import { Colors, BorderRadius, Transitions, Spacing, FontSizes } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

interface InputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number';
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

export const Input: React.FC<InputProps> = ({
  placeholder = '',
  value,
  onChange,
  type = 'text',
  className = '',
  style,
  disabled = false,
}) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = React.useState(false);

  const baseStyle: React.CSSProperties = {
    background: colors.inputBg,
    border: `1px solid ${colors.border}`,
    borderRadius: BorderRadius.lg,
    color: colors.textPrimary,
    fontSize: FontSizes.md,
    fontFamily: "'DM Sans', sans-serif",
    width: '100%',
    outline: 'none',
    padding: `${Spacing.sm}px ${Spacing.md}px`,
    transition: Transitions.fast,
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'text',
    ...(isFocused && {
      borderColor: colors.primary,
      boxShadow: `0 0 0 3px ${colors.primaryMuted}`,
    }),
    ...style,
  };

  return (
    <input
      className={className}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      style={baseStyle}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      disabled={disabled}
    />
  );
};

// Search Input with icon
interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Rechercher…',
  value,
  onChange,
}) => {
  const { colors } = useTheme();
  
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: Spacing.sm,
    background: colors.inputBg,
    border: `1px solid ${colors.border}`,
    borderRadius: BorderRadius.lg,
    padding: `${Spacing.sm}px ${Spacing.md}px`,
    width: 220,
    transition: Transitions.fast,
  };

  const inputStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: colors.textPrimary,
    fontSize: FontSizes.md,
    fontFamily: "'DM Sans', sans-serif",
    width: '100%',
    outline: 'none',
  };

  return (
    <div style={containerStyle}>
      <span style={{ color: colors.textMuted, fontSize: 14 }}>⌕</span>
      <input 
        placeholder={placeholder} 
        value={value} 
        onChange={(e) => onChange?.(e.target.value)}
        style={inputStyle}
      />
    </div>
  );
};

export default Input;

