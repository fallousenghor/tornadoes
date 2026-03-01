// Utility Functions - AEVUM Enterprise ERP
// Reusable helper functions (DRY Principle)

// ==================== Formatters ====================

/**
 * Format a number as currency (Euros)
 * @param value - The numeric value
 * @returns Formatted currency string
 * @example 1000000 => "1M €"
 */
export const formatCurrency = (value: number): string => {
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M €`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(0)}K €`;
  return `${value} €`;
};

/**
 * Format a number with thousand separators
 * @param value - The numeric value
 * @returns Formatted number string
 * @example 1000000 => "1 000 000"
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('fr-FR').format(value);
};

/**
 * Format a percentage
 * @param value - The decimal value (0-100)
 * @returns Formatted percentage string
 * @example 85.5 => "85,5%"
 */
export const formatPercent = (value: number): string => {
  return `${value.toFixed(1).replace('.', ',')} %`;
};

/**
 * Format a date to French locale
 * @param date - The date to format
 * @returns Formatted date string
 * @example new Date() => "22 fév. 2025"
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

/**
 * Format a date to short French locale
 * @param date - The date to format
 * @returns Short formatted date string
 * @example new Date() => "22 Fév"
 */
export const formatDateShort = (date: Date): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
  }).format(date);
};

/**
 * Format time ago
 * @param date - The date to compare
 * @returns Time ago string
 * @example new Date(Date.now() - 120000) => "2 min"
 */
export const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'À l\'instant';
  if (diffMins < 60) return `${diffMins} min`;
  if (diffHours < 24) return `${diffHours}h`;
  return `${diffDays}j`;
};

/**
 * Get initials from a name
 * @param name - Full name
 * @returns Initials
 * @example "John Doe" => "JD"
 */
export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

// ==================== Validators ====================

/**
 * Validate email format
 * @param email - Email string
 * @returns Boolean indicating validity
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (French format)
 * @param phone - Phone number string
 * @returns Boolean indicating validity
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+33|0)[1-9]\d{8}$/;
  return phoneRegex.test(phone);
};

/**
 * Check if a string is not empty
 * @param value - String to check
 * @returns Boolean indicating if not empty
 */
export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

// ==================== Calculations ====================

/**
 * Calculate percentage
 * @param value - Current value
 * @param total - Total value
 * @returns Percentage (0-100)
 */
export const calculatePercent = (value: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};

/**
 * Calculate average from array
 * @param values - Array of numbers
 * @returns Average value
 */
export const calculateAverage = (values: number[]): number => {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return Math.round((sum / values.length) * 100) / 100;
};

/**
 * Calculate change percentage
 * @param current - Current value
 * @param previous - Previous value
 * @returns Change percentage
 */
export const calculateChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100 * 10) / 10;
};

/**
 * Calculate budget usage percentage
 * @param spent - Amount spent
 * @param budget - Total budget
 * @returns Usage percentage (0-100)
 */
export const calculateBudgetUsage = (spent: number, budget: number): number => {
  if (budget === 0) return 0;
  return Math.round((spent / budget) * 100);
};

// ==================== Data Processing ====================

/**
 * Group array by a key
 * @param array - Array to group
 * @param key - Key to group by
 * @returns Grouped object
 */
export const groupBy = <T>(array: T[], key: keyof T): Record<string, T[]> => {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {} as Record<string, T[]>);
};

/**
 * Sort array by key
 * @param array - Array to sort
 * @param key - Key to sort by
 * @param direction - Sort direction
 * @returns Sorted array
 */
export const sortBy = <T>(
  array: T[],
  key: keyof T,
  direction: 'asc' | 'desc' = 'asc'
): T[] => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

/**
 * Filter array by search term
 * @param array - Array to filter
 * @param searchTerm - Search term
 * @param keys - Keys to search in
 * @returns Filtered array
 */
export const filterBySearch = <T>(
  array: T[],
  searchTerm: string,
  keys: (keyof T)[]
): T[] => {
  const lower = searchTerm.toLowerCase();
  return array.filter(item =>
    keys.some(key => {
      const value = item[key];
      return typeof value === 'string' && value.toLowerCase().includes(lower);
    })
  );
};

/**
 * Paginate array
 * @param array - Array to paginate
 * @param page - Current page (1-indexed)
 * @param pageSize - Items per page
 * @returns Paginated array
 */
export const paginate = <T>(
  array: T[],
  page: number,
  pageSize: number
): T[] => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return array.slice(start, end);
};

// ==================== UI Helpers ====================

/**
 * Get status color
 * @param status - Status string
 * @returns Color hex code
 */
export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    // Employee status
    'Actif': '#3ecf8e',
    'Congé': '#fb923c',
    'Inactif': '#e05050',
    'Suspendu': '#e05050',
    
    // Invoice status
    'Payé': '#3ecf8e',
    'En attente': '#fb923c',
    'Partiel': '#6490ff',
    
    // Project status
    'Démarrage': '#6490ff',
    'En cours': '#fb923c',
    'Finalisation': '#a78bfa',
    'Terminé': '#3ecf8e',
    
    // Leave status
    'approved': '#3ecf8e',
    'pending': '#fb923c',
    'rejected': '#e05050',
    
    // Priority
    'Haute': '#e05050',
    'Critique': '#e05050',
    'Urgente': '#fb923c',
    'Moyenne': '#6490ff',
    'Basse': '#7a84a0',
  };
  
  return statusColors[status] || '#6490ff';
};

/**
 * Get contract type color
 * @param contract - Contract type
 * @returns Color hex code
 */
export const getContractColor = (contract: string): string => {
  const colors: Record<string, string> = {
    'CDI': '#3ecf8e',
    'CDD': '#fb923c',
    'Freelance': '#a78bfa',
    'Stage': '#2dd4bf',
  };
  return colors[contract] || '#6490ff';
};

/**
 * Truncate text
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
};

/**
 * Generate unique ID
 * @returns Unique string ID
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

// ==================== Date Helpers ====================

/**
 * Get start of month
 * @param date - Date object
 * @returns Start of month date
 */
export const startOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

/**
 * Get end of month
 * @param date - Date object
 * @returns End of month date
 */
export const endOfMonth = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
};

/**
 * Get number of days between dates
 * @param start - Start date
 * @param end - End date
 * @returns Number of days
 */
export const daysBetween = (start: Date, end: Date): number => {
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Check if date is today
 * @param date - Date to check
 * @returns Boolean indicating if today
 */
export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

// Export all utilities
export default {
  formatCurrency,
  formatNumber,
  formatPercent,
  formatDate,
  formatDateShort,
  formatTimeAgo,
  getInitials,
  isValidEmail,
  isValidPhone,
  isNotEmpty,
  calculatePercent,
  calculateAverage,
  calculateChange,
  calculateBudgetUsage,
  groupBy,
  sortBy,
  filterBySearch,
  paginate,
  getStatusColor,
  getContractColor,
  truncateText,
  generateId,
  startOfMonth,
  endOfMonth,
  daysBetween,
  isToday,
};

