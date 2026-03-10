// CurrencyDisplay - AEVUM Enterprise ERP
// React component for displaying currency values
// Devise en franc CFA (XOF) pour l'Afrique de l'Ouest

import React from 'react';
import { formatCurrency, formatCompactCurrency, DEFAULT_CURRENCY, CurrencyCode } from '../../utils/currency';

interface CurrencyDisplayProps {
  value: number;
  currency?: CurrencyCode;
  compact?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * React component to display currency values
 * @param value - The numeric value
 * @param currency - The currency code (default: XOF)
 * @param compact - Use compact format (default: false)
 * @param className - Optional CSS class
 * @example <CurrencyDisplay value={100000} />
 * @example <CurrencyDisplay value={1000000} compact />
 */
export const CurrencyDisplay: React.FC<CurrencyDisplayProps> = ({
  value,
  currency = DEFAULT_CURRENCY,
  compact = false,
  className,
  style,
}) => {
  const formatted = compact 
    ? formatCompactCurrency(value, currency)
    : formatCurrency(value, currency);
    
  return (
    <span className={className} style={style}>
      {formatted}
    </span>
  );
};

export default CurrencyDisplay;

