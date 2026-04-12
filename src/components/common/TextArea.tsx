// TextArea Component - AEVUM Enterprise ERP
// Corporate Professional Theme - B2B SaaS Design System

import React from 'react';
import { BorderRadius, Transitions, Spacing, FontSizes, FontWeights } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

export interface TextAreaProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  rows?: number;
  resizable?: boolean;
  maxLength?: number;
  fullWidth?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const TextArea: React.FC<TextAreaProps> = ({
  placeholder = '',
  value,
  onChange,
  label,
  error,
  helperText,
  disabled = false,
  rows = 4,
  resizable = true,
  maxLength,
  fullWidth = true,
  className = '',
  style,
}) => {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = React.useState(false);

  const hasError = !!error;
  const charCount = value?.length || 0;
  const showCharCount = !!maxLength;

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: Spacing.xs,
    width: fullWidth ? '100%' : 'auto',
    ...style,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: hasError ? colors.danger : colors.textSecondary,
    letterSpacing: '0.01em',
  };

  const textareaStyle: React.CSSProperties = {
    background: disabled ? colors.bgSecondary : colors.inputBg,
    border: `1px solid ${hasError ? colors.danger : colors.border}`,
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
    resize: resizable ? 'vertical' : 'none',
    minHeight: rows * 24 + Spacing.sm * 2,
    boxShadow: isFocused && !hasError ? `0 0 0 3px ${colors.primaryMuted}` : 'none',
    borderColor: isFocused && !hasError ? colors.primary : (hasError ? colors.danger : colors.border),
  };

  const helperTextStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: FontSizes.sm,
    color: hasError ? colors.danger : colors.textMuted,
    marginTop: 2,
  };

  return (
    <div style={containerStyle} className={className}>
      {label && <label style={labelStyle}>{label}</label>}
      
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        rows={rows}
        style={textareaStyle}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        maxLength={maxLength}
      />

      {(helperText || error || showCharCount) && (
        <div style={helperTextStyle}>
          <span>{error || helperText}</span>
          {showCharCount && (
            <span style={{ fontSize: FontSizes.xs }}>
              {charCount}/{maxLength}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default TextArea;
