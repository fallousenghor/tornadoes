// SummaryCard - AEVUM Enterprise ERP
// Reusable summary statistics card component - DRY Principle

import React from 'react';
import { Card } from './Card';
import { useTheme } from '../../contexts/ThemeContext';

export interface SummaryCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  iconColor?: string;
  iconBg?: string;
  change?: number;
  changeLabel?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  format?: 'number' | 'currency' | 'percent' | 'text';
  currency?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

// Variant color configurations
const variantStyles = {
  default: { color: '#6490ff', bg: 'rgba(100, 140, 255, 0.15)', iconColor: '#6490ff' },
  success: { color: '#3ecf8e', bg: 'rgba(62, 207, 142, 0.15)', iconColor: '#3ecf8e' },
  warning: { color: '#c9a84c', bg: 'rgba(201, 168, 76, 0.15)', iconColor: '#c9a84c' },
  danger: { color: '#e05050', bg: 'rgba(224, 80, 80, 0.15)', iconColor: '#e05050' },
  info: { color: '#6490ff', bg: 'rgba(100, 140, 255, 0.15)', iconColor: '#6490ff' },
};

// Size configurations
const sizeStyles = {
  sm: { padding: 12, iconSize: 32, valueSize: 16, titleSize: 10 },
  md: { padding: 16, iconSize: 40, valueSize: 20, titleSize: 11 },
  lg: { padding: 20, iconSize: 48, valueSize: 28, titleSize: 12 },
};

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  icon,
  iconColor,
  iconBg,
  change,
  changeLabel,
  variant = 'default',
  size = 'md',
  format = 'text',
  currency = 'FCFA',
  onClick,
  style,
}) => {
  const { colors, mode } = useTheme();
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  // Use theme colors when available
  const getVariantColor = (type: 'color' | 'bg' | 'iconColor'): string => {
    if (variant === 'default' || variant === 'info') {
      return mode === 'dark' ? colors.primary : variantStyle[type];
    }
    if (variant === 'success') {
      return mode === 'dark' ? colors.success : variantStyle[type];
    }
    if (variant === 'warning') {
      return mode === 'dark' ? colors.warning : variantStyle[type];
    }
    if (variant === 'danger') {
      return mode === 'dark' ? colors.danger : variantStyle[type];
    }
    return variantStyle[type];
  };

  // Format the value based on format type
  const formatValue = (val: string | number): string => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'currency':
        return `${val.toLocaleString('fr-FR')} ${currency}`;
      case 'percent':
        return `${val}%`;
      case 'number':
        return val.toLocaleString('fr-FR');
      default:
        return String(val);
    }
  };

  // Determine if change is positive or negative
  const isPositive = change !== undefined && change >= 0;
  const changeColor = isPositive 
    ? (mode === 'dark' ? colors.success : '#3ecf8e') 
    : (mode === 'dark' ? colors.danger : '#e05050');
  const changeIcon = isPositive ? '↑' : '↓';

  return (
    <Card 
      style={{ 
        padding: sizeStyle.padding,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s',
        ...style,
      }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        {/* Icon */}
        {icon && (
          <div 
            style={{ 
              width: sizeStyle.iconSize, 
              height: sizeStyle.iconSize, 
              borderRadius: 12, 
              background: iconBg || (mode === 'dark' ? `${colors.primary}20` : variantStyle.bg), 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: sizeStyle.iconSize * 0.5,
              color: iconColor || (mode === 'dark' ? colors.primary : variantStyle.iconColor),
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div 
            style={{ 
              fontSize: sizeStyle.titleSize, 
              color: mode === 'dark' ? colors.textMuted : '#6B7280', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em',
              marginBottom: 4,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {title}
          </div>
          
          <div 
            style={{ 
              fontSize: sizeStyle.valueSize, 
              fontWeight: 700, 
              color: mode === 'dark' ? colors.text : variantStyle.color, 
              fontFamily: "'DM Serif Display', serif",
              lineHeight: 1.2,
            }}
          >
            {formatValue(value)}
          </div>

          {/* Change indicator */}
          {change !== undefined && (
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 4, 
                marginTop: 6,
                fontSize: 11,
                color: changeColor,
              }}
            >
              <span>{changeIcon}</span>
              <span style={{ fontWeight: 500 }}>{Math.abs(change)}%</span>
              {changeLabel && (
                <span style={{ color: mode === 'dark' ? colors.textMuted : '#6B7280', marginLeft: 4 }}>
                  {changeLabel}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

// Helper to create a grid of summary cards
export interface SummaryCardGridProps {
  cards: SummaryCardProps[];
  columns?: number;
  gap?: number;
}

export const SummaryCardGrid: React.FC<SummaryCardGridProps> = ({
  cards,
  columns = 4,
  gap = 16,
}) => {
  return (
    <div 
      style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${columns}, 1fr)`, 
        gap,
        marginBottom: 24,
      }}
    >
      {cards.map((card, index) => (
        <SummaryCard key={index} {...card} />
      ))}
    </div>
  );
};

export default SummaryCard;

