// Currency Utilities - AEVUM Enterprise ERP
// Devise en franc CFA (XOF) pour l'Afrique de l'Ouest

export type CurrencyCode = 'XOF' | 'EUR' | 'USD' | 'GBP';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  name: string;
  locale: string;
  decimals: number;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  XOF: {
    code: 'XOF',
    symbol: 'FCFA',
    name: 'Franc CFA',
    locale: 'fr-SN',
    decimals: 0,
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    locale: 'fr-FR',
    decimals: 2,
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'Dollar US',
    locale: 'en-US',
    decimals: 2,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'Livre Sterling',
    locale: 'en-GB',
    decimals: 2,
  },
};

export const DEFAULT_CURRENCY: CurrencyCode = 'XOF';

export const formatCurrency = (value: number, currency: CurrencyCode = DEFAULT_CURRENCY): string => {
  const config = CURRENCIES[currency];
  
  if (currency === 'XOF') {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value) + ' ' + config.symbol;
  }
  
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  }).format(value);
};

export const formatCompactCurrency = (value: number, currency: CurrencyCode = DEFAULT_CURRENCY): string => {
  const config = CURRENCIES[currency];
  
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(1)}M ${config.symbol}`;
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(1)}M ${config.symbol}`;
  }
  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(0)}K ${config.symbol}`;
  }
  
  return `${value} ${config.symbol}`;
};

export const parseCurrency = (value: string): number => {
  const cleaned = value
    .replace(/[^\d,.-]/g, '')
    .replace(/\s/g, '')
    .replace(',', '.');
  
  return parseFloat(cleaned) || 0;
};

export const getCurrencySymbol = (currency: CurrencyCode = DEFAULT_CURRENCY): string => {
  return CURRENCIES[currency].symbol;
};

export const getCurrencyConfig = (currency: CurrencyCode = DEFAULT_CURRENCY): CurrencyConfig => {
  return CURRENCIES[currency];
};

export const formatAmountInWords = (value: number): string => {
  if (value === 0) return 'zéro';
  return new Intl.NumberFormat('fr-FR').format(value);
};

export const formatPrice = (value: number, currency: CurrencyCode = DEFAULT_CURRENCY): string => {
  const config = CURRENCIES[currency];
  
  if (currency === 'XOF') {
    return new Intl.NumberFormat('fr-FR', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.round(value)) + ' ' + config.symbol;
  }
  
  return new Intl.NumberFormat(config.locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: config.decimals,
    maximumFractionDigits: config.decimals,
  }).format(value);
};

export default {
  formatCurrency,
  formatCompactCurrency,
  parseCurrency,
  getCurrencySymbol,
  getCurrencyConfig,
  formatAmountInWords,
  formatPrice,
  CURRENCIES,
  DEFAULT_CURRENCY,
};

