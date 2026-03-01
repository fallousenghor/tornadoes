// Input Component - AEVUM Enterprise ERP
// Corporate Professional Input Component

import React from 'react';
import { Colors, BorderRadius, Transitions, Spacing, FontSizes } from '../../constants/theme';

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
  const [isFocused, setIsFocused] = React.useState(false);

  const baseStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: Colors.textPrimary,
    fontSize: FontSizes.md,
    fontFamily: "'DM Sans', sans-serif",
    width: '100%',
    outline: 'none',
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
  const [isFocused, setIsFocused] = React.useState(false);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: Spacing.sm,
    background: Colors.inputBg,
    border: `1px solid ${isFocused ? Colors.primary : Colors.border}`,
    borderRadius: BorderRadius.lg,
    padding: `${Spacing.sm + 2}px ${Spacing.md}px`,
    width: 220,
    transition: Transitions.fast,
    boxShadow: isFocused ? '0 0 0 3px rgba(37, 99, 235, 0.1)' : 'none',
  };

  return (
    <div 
      style={containerStyle}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
    >
      <span style={{ color: Colors.textMuted, fontSize: 14 }}>⌕</span>
      <Input 
        placeholder={placeholder} 
        value={value} 
        onChange={onChange}
      />
    </div>
  );
};

// Labeled Input with styling
interface LabeledInputProps extends InputProps {
  label?: string;
}

export const LabeledInput: React.FC<LabeledInputProps> = ({
  label,
  ...props
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {label && (
        <label style={{
          fontSize: FontSizes.sm,
          fontWeight: 500,
          color: Colors.textSecondary,
          fontFamily: "'DM Sans', sans-serif",
        }}>
          {label}
        </label>
      )}
      <div style={{
        background: Colors.inputBg,
        border: `1px solid ${Colors.border}`,
        borderRadius: BorderRadius.lg,
        padding: `${Spacing.sm + 2}px ${Spacing.md}px`,
        transition: Transitions.fast,
      }}>
        <Input {...props} />
      </div>
    </div>
  );
};

export default Input;

