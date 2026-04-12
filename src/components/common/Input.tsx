// Input Component - AEVUM Enterprise ERP
// Corporate Professional Theme - B2B SaaS Design System

import React from 'react';
import { BorderRadius, Transitions, Spacing, FontSizes, FontWeights } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { Search, X, AlertCircle, CheckCircle } from 'lucide-react';

export interface InputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'datetime-local';
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
  error?: string;
  success?: boolean;
  label?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onClear?: () => void;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Input: React.FC<InputProps> = ({
  placeholder = '',
  value,
  onChange,
  type = 'text',
  className = '',
  style,
  disabled = false,
  error,
  success,
  label,
  helperText,
  leftIcon,
  rightIcon,
  onClear,
  fullWidth = true,
  size = 'md',
}) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = React.useState(false);

  const hasError = !!error;
  const hasSuccess = success && !hasError;
  const isClearable = onClear && value && value.length > 0;

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          padding: `${Spacing.xs}px ${Spacing.sm}px`,
          fontSize: FontSizes.sm,
        };
      case 'lg':
        return {
          padding: `${Spacing.md}px ${Spacing.lg}px`,
          fontSize: FontSizes.lg,
        };
      case 'md':
      default:
        return {
          padding: `${Spacing.sm}px ${Spacing.md}px`,
          fontSize: FontSizes.md,
        };
    }
  };

  const getBorderColor = () => {
    if (hasError) return colors.danger;
    if (hasSuccess) return colors.success;
    if (isFocused) return colors.primary;
    return colors.border;
  };

  const getShadow = () => {
    if (isFocused && !hasError) {
      return `0 0 0 3px ${colors.primaryMuted}`;
    }
    if (hasError) {
      return `0 0 0 3px ${colors.dangerMuted}`;
    }
    if (hasSuccess) {
      return `0 0 0 3px ${colors.successMuted}`;
    }
    return 'none';
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: Spacing.xs,
    width: fullWidth ? '100%' : 'auto',
    ...style,
  };

  const inputWrapperStyle: React.CSSProperties = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const inputStyle: React.CSSProperties = {
    background: disabled ? colors.bgSecondary : colors.inputBg,
    border: `1px solid ${getBorderColor()}`,
    borderRadius: BorderRadius.lg,
    color: colors.textPrimary,
    fontSize: FontSizes.md,
    fontFamily: "'DM Sans', sans-serif",
    width: '100%',
    outline: 'none',
    ...getSizeStyles(),
    paddingRight: leftIcon || isClearable || rightIcon ? Spacing.xxxl : Spacing.md,
    paddingLeft: leftIcon ? Spacing.xxxl : Spacing.md,
    transition: Transitions.fast,
    opacity: disabled ? 0.5 : 1,
    cursor: disabled ? 'not-allowed' : 'text',
    boxShadow: getShadow(),
  };

  const labelStyle: React.CSSProperties = {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: hasError ? colors.danger : colors.textSecondary,
    letterSpacing: '0.01em',
  };

  const helperTextStyle: React.CSSProperties = {
    fontSize: FontSizes.sm,
    color: hasError ? colors.danger : colors.textMuted,
    marginTop: 2,
  };

  return (
    <div style={containerStyle}>
      {label && <label style={labelStyle}>{label}</label>}
      
      <div style={inputWrapperStyle}>
        {leftIcon && (
          <div
            style={{
              position: 'absolute',
              left: Spacing.sm,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.textMuted,
              pointerEvents: 'none',
            }}
          >
            {leftIcon}
          </div>
        )}

        <input
          className={className}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          style={inputStyle}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={disabled}
        />

        {isClearable && (
          <button
            onClick={onClear}
            style={{
              position: 'absolute',
              right: Spacing.sm,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.textMuted,
              borderRadius: BorderRadius.md,
              transition: Transitions.fast,
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
            <X size={14} />
          </button>
        )}

        {!isClearable && rightIcon && !hasError && !hasSuccess && (
          <div
            style={{
              position: 'absolute',
              right: Spacing.sm,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.textMuted,
            }}
          >
            {rightIcon}
          </div>
        )}

        {hasError && (
          <div
            style={{
              position: 'absolute',
              right: Spacing.sm,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.danger,
            }}
          >
            <AlertCircle size={16} />
          </div>
        )}

        {hasSuccess && (
          <div
            style={{
              position: 'absolute',
              right: Spacing.sm,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: colors.success,
            }}
          >
            <CheckCircle size={16} />
          </div>
        )}
      </div>

      {(helperText || error) && (
        <div style={helperTextStyle}>
          {error || helperText}
        </div>
      )}
    </div>
  );
};

// Search Input with icon
export interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  className?: string;
  style?: React.CSSProperties;
  fullWidth?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = 'Rechercher…',
  value,
  onChange,
  onClear,
  className = '',
  style,
  fullWidth = false,
}) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = React.useState(false);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: Spacing.sm,
    background: colors.inputBg,
    border: `1px solid ${isFocused ? colors.primary : colors.border}`,
    borderRadius: BorderRadius.lg,
    padding: `${Spacing.sm}px ${Spacing.md}px`,
    width: fullWidth ? '100%' : 240,
    transition: Transitions.fast,
    boxShadow: isFocused ? `0 0 0 3px ${colors.primaryMuted}` : 'none',
    ...style,
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
    <div style={containerStyle} className={className}>
      <Search size={16} color={colors.textMuted} />
      <input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={inputStyle}
      />
      {value && onClear && (
        <button
          onClick={onClear}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.textMuted,
          }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default Input;

