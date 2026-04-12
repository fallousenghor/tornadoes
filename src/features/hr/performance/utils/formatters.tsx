// Performance Module Utilities - Formatters and Helpers
// Helper functions for formatting dates, ratings, and status badges

import { Colors } from '../../../../constants/theme';
import type { ReviewStatus, ObjectiveStatus } from '../types';

// ==================== Date Formatting ====================

/**
 * Format a date to French locale string
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });
};

/**
 * Format date for input field (YYYY-MM-DD)
 */
export const formatDateForInput = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().split('T')[0];
};

// ==================== Rating Formatting ====================

/**
 * Render star rating (display only)
 */
export const renderStars = (rating: number): JSX.Element[] => {
  return Array.from({ length: 5 }, (_, i) => (
    <span 
      key={i} 
      style={{ 
        color: i < rating ? '#fbbf24' : Colors.border, 
        fontSize: 14,
      }}
    >
      ★
    </span>
  ));
};

/**
 * Get rating badge styles
 */
export const getRatingBadge = (rating: number): { bg: string; color: string; label: string } => {
  if (rating >= 4) return { bg: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e', label: 'Excellent' };
  if (rating >= 3) return { bg: 'rgba(100, 140, 255, 0.15)', color: '#6490ff', label: 'Bon' };
  if (rating >= 2) return { bg: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', label: 'Moyen' };
  return { bg: 'rgba(224, 80, 80, 0.15)', color: '#e05050', label: 'À améliorer' };
};

// ==================== Status Formatting ====================

/**
 * Get review status badge styles
 */
export const getReviewStatusBadge = (status: ReviewStatus): { bg: string; color: string; label: string } => {
  switch (status) {
    case 'completed':
      return { bg: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e', label: 'Complété' };
    case 'in_progress':
      return { bg: 'rgba(100, 140, 255, 0.15)', color: '#6490ff', label: 'En cours' };
    default:
      return { bg: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', label: 'En attente' };
  }
};

/**
 * Get objective status styles
 */
export const getObjectiveStatus = (status: ObjectiveStatus): { bg: string; color: string; label: string } => {
  const styles: Record<ObjectiveStatus, { bg: string; color: string; label: string }> = {
    achieved: { bg: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e', label: 'Atteint' },
    exceeded: { bg: 'rgba(167, 139, 250, 0.15)', color: '#a78bfa', label: 'Dépassé' },
    pending: { bg: 'rgba(100, 140, 255, 0.15)', color: '#6490ff', label: 'En cours' },
    at_risk: { bg: 'rgba(224, 80, 80, 0.15)', color: '#e05050', label: 'À risque' },
  };
  return styles[status] || styles.pending;
};

// ==================== Progress Calculation ====================

/**
 * Calculate progress percentage
 */
export const calculateProgress = (achieved: number, target: number): number => {
  return Math.min((achieved / target) * 100, 100);
};

/**
 * Get progress bar color based on status
 */
export const getProgressColor = (progress: number): string => {
  if (progress >= 100) return '#3ecf8e';
  if (progress >= 80) return '#6490ff';
  if (progress >= 50) return '#fb923c';
  return '#e05050';
};

// ==================== Pagination Helpers ====================

/**
 * Calculate pagination range
 */
export const calculatePagination = (
  currentPage: number,
  totalItems: number,
  itemsPerPage: number
) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);
  
  return {
    totalPages,
    startIndex,
    endIndex,
  };
};

/**
 * Generate page numbers for pagination UI
 */
export const generatePageNumbers = (currentPage: number, totalPages: number, maxPages = 5): number[] => {
  const pages: number[] = [];
  const half = Math.floor(maxPages / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, start + maxPages - 1);
  
  if (end - start < maxPages - 1) {
    start = Math.max(1, end - maxPages + 1);
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  
  return pages;
};

