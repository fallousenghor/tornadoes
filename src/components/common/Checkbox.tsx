// Checkbox & Radio Components - AEVUM Enterprise ERP
// Corporate Professional Theme - B2B SaaS Design System

import React from 'react';
import { BorderRadius, Transitions, Spacing, FontSizes, FontWeights } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { Check, Minus } from 'lucide-react';

// ==================== CHECKBOX ====================
export interface CheckboxProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  indeterminate?: boolean;
  error?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  indeterminate = false,
  error = false,
  className = '',
  style,
}) => {
  const { colors } = useTheme();

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    ...style,
  };

  const checkboxStyle: React.CSSProperties = {
    width: 18,
    height: 18,
    minWidth: 18,
    borderRadius: BorderRadius.sm,
    border: `1px solid ${error ? colors.danger : (checked ? colors.primary : colors.border)}`,
    background: checked ? colors.primary : colors.inputBg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: Transitions.fast,
    flexShrink: 0,
    marginTop: 2,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: FontSizes.md,
    color: colors.textPrimary,
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: 1.4,
  };

  const handleClick = () => {
    if (!disabled) {
      onChange?.(!checked);
    }
  };

  return (
    <div style={containerStyle} className={className} onClick={handleClick}>
      <div style={checkboxStyle}>
        {indeterminate ? (
          <Minus size={12} color="#FFFFFF" strokeWidth={3} />
        ) : checked ? (
          <Check size={14} color="#FFFFFF" strokeWidth={3} />
        ) : null}
      </div>
      {label && <div style={labelStyle}>{label}</div>}
    </div>
  );
};

// ==================== RADIO ====================
export interface RadioProps {
  checked: boolean;
  onChange?: () => void;
  label?: React.ReactNode;
  disabled?: boolean;
  error?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const Radio: React.FC<RadioProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  error = false,
  className = '',
  style,
}) => {
  const { colors } = useTheme();

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    ...style,
  };

  const radioStyle: React.CSSProperties = {
    width: 18,
    height: 18,
    minWidth: 18,
    borderRadius: BorderRadius.full,
    border: `1px solid ${error ? colors.danger : (checked ? colors.primary : colors.border)}`,
    background: colors.inputBg,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: Transitions.fast,
    flexShrink: 0,
    marginTop: 2,
    padding: 3,
  };

  const indicatorStyle: React.CSSProperties = {
    width: 10,
    height: 10,
    borderRadius: BorderRadius.full,
    background: checked ? colors.primary : 'transparent',
    transition: Transitions.fast,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: FontSizes.md,
    color: colors.textPrimary,
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: 1.4,
  };

  const handleClick = () => {
    if (!disabled) {
      onChange?.();
    }
  };

  return (
    <div style={containerStyle} className={className} onClick={handleClick}>
      <div style={radioStyle}>
        <div style={indicatorStyle} />
      </div>
      {label && <div style={labelStyle}>{label}</div>}
    </div>
  );
};

// ==================== TOGGLE / SWITCH ====================
export interface ToggleProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

export const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
  className = '',
  style,
}) => {
  const { colors } = useTheme();

  const sizeStyles = {
    sm: { width: 36, height: 20, thumb: 16 },
    md: { width: 44, height: 24, thumb: 20 },
    lg: { width: 56, height: 32, thumb: 28 },
  };

  const { width, height, thumb } = sizeStyles[size];

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: Spacing.sm,
    cursor: disabled ? 'not-allowed' : 'pointer',
    ...style,
  };

  const toggleStyle: React.CSSProperties = {
    width,
    height,
    borderRadius: height / 2,
    background: checked ? colors.primary : colors.border,
    display: 'flex',
    alignItems: 'center',
    padding: (height - thumb) / 2,
    transition: Transitions.fast,
    flexShrink: 0,
    opacity: disabled ? 0.5 : 1,
  };

  const thumbStyle: React.CSSProperties = {
    width: thumb,
    height: thumb,
    borderRadius: thumb / 2,
    background: '#FFFFFF',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
    transition: Transitions.fast,
    transform: checked ? `translateX(${width - thumb - (height - thumb)})` : 'translateX(0)',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: FontSizes.md,
    color: colors.textPrimary,
    fontFamily: "'DM Sans', sans-serif",
    lineHeight: 1.4,
  };

  const handleClick = () => {
    if (!disabled) {
      onChange?.(!checked);
    }
  };

  return (
    <div style={containerStyle} className={className} onClick={handleClick}>
      <div style={toggleStyle}>
        <div style={thumbStyle} />
      </div>
      {label && <div style={labelStyle}>{label}</div>}
    </div>
  );
};

// ==================== CHECKBOX GROUP ====================
export interface CheckboxGroupOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface CheckboxGroupProps {
  options: CheckboxGroupOption[];
  values: string[];
  onChange?: (values: string[]) => void;
  label?: string;
  disabled?: boolean;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
  style?: React.CSSProperties;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  options,
  values,
  onChange,
  label,
  disabled = false,
  orientation = 'vertical',
  className = '',
  style,
}) => {
  const { colors } = useTheme();

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: orientation === 'horizontal' ? 'row' : 'column',
    gap: orientation === 'horizontal' ? Spacing.md : Spacing.sm,
    ...style,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: colors.textSecondary,
    marginBottom: Spacing.xs,
  };

  const handleChange = (value: string, checked: boolean) => {
    const newValues = checked
      ? [...values, value]
      : values.filter(v => v !== value);
    onChange?.(newValues);
  };

  return (
    <div style={containerStyle} className={className}>
      {label && <div style={labelStyle}>{label}</div>}
      <div style={{
        display: 'flex',
        flexDirection: orientation === 'horizontal' ? 'row' : 'column',
        gap: orientation === 'horizontal' ? Spacing.md : Spacing.sm,
      }}>
        {options.map((option) => (
          <Checkbox
            key={option.value}
            checked={values.includes(option.value)}
            onChange={(checked) => handleChange(option.value, checked)}
            label={option.label}
            disabled={disabled || option.disabled}
          />
        ))}
      </div>
    </div>
  );
};

// ==================== RADIO GROUP ====================
export interface RadioGroupOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  options: RadioGroupOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  disabled?: boolean;
  orientation?: 'vertical' | 'horizontal';
  className?: string;
  style?: React.CSSProperties;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  options,
  value,
  onChange,
  label,
  disabled = false,
  orientation = 'vertical',
  className = '',
  style,
}) => {
  const { colors } = useTheme();

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: orientation === 'horizontal' ? 'row' : 'column',
    gap: orientation === 'horizontal' ? Spacing.md : Spacing.sm,
    ...style,
  };

  const labelStyle: React.CSSProperties = {
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.medium,
    color: colors.textSecondary,
    marginBottom: Spacing.xs,
  };

  return (
    <div style={containerStyle} className={className}>
      {label && <div style={labelStyle}>{label}</div>}
      <div style={{
        display: 'flex',
        flexDirection: orientation === 'horizontal' ? 'row' : 'column',
        gap: orientation === 'horizontal' ? Spacing.md : Spacing.sm,
      }}>
        {options.map((option) => (
          <Radio
            key={option.value}
            checked={value === option.value}
            onChange={() => !disabled && !option.disabled && onChange?.(option.value)}
            label={option.label}
            disabled={disabled || option.disabled}
          />
        ))}
      </div>
    </div>
  );
};

export default Checkbox;
