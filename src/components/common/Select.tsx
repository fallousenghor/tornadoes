// Select Component - AEVUM Enterprise ERP
// Corporate Professional Theme - B2B SaaS Design System

import React, { useState, useRef, useEffect } from 'react';
import { BorderRadius, Transitions, Spacing, FontSizes, FontWeights, Shadows } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { ChevronDown, Check, Search } from 'lucide-react';
import { Input } from './Input';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  searchable?: boolean;
  clearable?: boolean;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: React.CSSProperties;
}

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Sélectionner...',
  label,
  error,
  helperText,
  disabled = false,
  searchable = false,
  clearable = false,
  fullWidth = true,
  size = 'md',
  className = '',
  style,
}) => {
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);
  const hasError = !!error;

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options when searching
  const filteredOptions = searchable && searchQuery
    ? options.filter(opt => 
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  const handleSelect = (option: SelectOption) => {
    if (!option.disabled) {
      onChange?.(option.value);
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.('');
  };

  const containerStyle: React.CSSProperties = {
    position: 'relative',
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

  const triggerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    background: disabled ? colors.bgSecondary : colors.inputBg,
    border: `1px solid ${hasError ? colors.danger : colors.border}`,
    borderRadius: BorderRadius.lg,
    padding: size === 'sm' 
      ? `${Spacing.xs}px ${Spacing.sm}px`
      : size === 'lg'
      ? `${Spacing.md}px ${Spacing.lg}px`
      : `${Spacing.sm}px ${Spacing.md}px`,
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: Transitions.fast,
    opacity: disabled ? 0.5 : 1,
    boxShadow: isOpen && !hasError ? `0 0 0 3px ${colors.primaryMuted}` : 'none',
    borderColor: isOpen && !hasError ? colors.primary : (hasError ? colors.danger : colors.border),
  };

  const valueStyle: React.CSSProperties = {
    flex: 1,
    fontSize: FontSizes.md,
    color: selectedOption ? colors.textPrimary : colors.textMuted,
    fontFamily: "'DM Sans', sans-serif",
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    left: 0,
    right: 0,
    background: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: BorderRadius.lg,
    boxShadow: Shadows.cardElevated,
    zIndex: 1000,
    maxHeight: 280,
    overflowY: 'auto',
    animation: 'selectDropdownSlide 0.2s ease forwards',
  };

  const getOptionStyle = (option: SelectOption, isSelected: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: `${Spacing.sm}px ${Spacing.md}px`,
    background: isSelected ? colors.primaryMutedBg : 'transparent',
    color: option.disabled ? colors.textMuted : colors.textPrimary,
    cursor: option.disabled ? 'not-allowed' : 'pointer',
    fontSize: FontSizes.md,
    fontFamily: "'DM Sans', sans-serif",
    transition: Transitions.fast,
    opacity: option.disabled ? 0.5 : 1,
  });

  return (
    <div style={containerStyle} className={className} ref={selectRef}>
      {label && <label style={labelStyle}>{label}</label>}
      
      <div
        style={triggerStyle}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <div style={valueStyle}>
          {selectedOption?.label || placeholder}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: Spacing.xs }}>
          {clearable && selectedOption && (
            <button
              onClick={handleClear}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 2,
                color: colors.textMuted,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Check size={14} />
            </button>
          )}
          <ChevronDown 
            size={18} 
            color={isOpen ? colors.primary : colors.textMuted}
            style={{ 
              transition: Transitions.fast,
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            }}
          />
        </div>
      </div>

      {isOpen && (
        <div style={dropdownStyle}>
          {searchable && (
            <div style={{ padding: Spacing.sm, borderBottom: `1px solid ${colors.border}` }}>
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={setSearchQuery}
                leftIcon={<Search size={14} />}
                size="sm"
                fullWidth
              />
            </div>
          )}
          
          {filteredOptions.length === 0 ? (
            <div
              style={{
                padding: `${Spacing.md}px ${Spacing.lg}px`,
                color: colors.textMuted,
                fontSize: FontSizes.sm,
                textAlign: 'center',
              }}
            >
              Aucun résultat
            </div>
          ) : (
            filteredOptions.map((option) => {
              const isSelected = option.value === value;
              return (
                <div
                  key={option.value}
                  style={getOptionStyle(option, isSelected)}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={(e) => {
                    if (!option.disabled) {
                      e.currentTarget.style.background = colors.bgSecondary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!option.disabled) {
                      e.currentTarget.style.background = isSelected ? colors.primaryMutedBg : 'transparent';
                    }
                  }}
                >
                  {option.icon && <span style={{ flexShrink: 0 }}>{option.icon}</span>}
                  <span style={{ flex: 1 }}>{option.label}</span>
                  {isSelected && (
                    <Check size={16} color={colors.primary} style={{ flexShrink: 0 }} />
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {(helperText || error) && (
        <div
          style={{
            fontSize: FontSizes.sm,
            color: hasError ? colors.danger : colors.textMuted,
            marginTop: 2,
          }}
        >
          {error || helperText}
        </div>
      )}

      <style>{`
        @keyframes selectDropdownSlide {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Select;
