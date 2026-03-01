// Input Component - AEVUM Enterprise ERP

import React from 'react';
import { Colors, BorderRadius, Transitions, Spacing, FontSizes } from '../../constants/theme';

interface InputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number';
  className?: string;
  style?: React.CSSProperties;
}

export const Input: React.FC<InputProps> = ({
  placeholder = '',
  value,
  onChange,
  type = 'text',
  className = '',
  style,
}) => {
  const [isFocused, setIsFocused] = React.useState(false);

  const baseStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: Colors.textLight,
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
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: Spacing.sm,
    background: Colors.input,
    border: `1px solid ${Colors.border}`,
    borderRadius: BorderRadius.lg,
    padding: `${Spacing.sm}px ${Spacing.md}px`,
    width: 190,
  };

  return (
    <div style={containerStyle}>
      <span style={{ color: Colors.textMuted, fontSize: 12 }}>⌕</span>
      <Input 
        placeholder={placeholder} 
        value={value} 
        onChange={onChange}
      />
    </div>
  );
};

export default Input;

