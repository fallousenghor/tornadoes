// PaginationControls - AEVUM Enterprise ERP
// Reusable pagination component - DRY Principle

import React from 'react';
import { Colors } from '../../constants/theme';

export interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  showingFrom: number;
  showingTo: number;
  onPageChange: (page: number) => void;
  onNextPage?: () => void;
  onPrevPage?: () => void;
  maxVisiblePages?: number;
  showPageInfo?: boolean;
}

export const PaginationControls: React.FC<PaginationControlsProps> = ({
  currentPage,
  totalPages,
  totalItems,
  showingFrom,
  showingTo,
  onPageChange,
  onNextPage,
  onPrevPage,
  maxVisiblePages = 5,
  showPageInfo = true,
}) => {
  // Don't render if there's only one page or no items
  if (totalPages <= 1 || totalItems === 0) {
    return null;
  }

  // Calculate visible page numbers
  const getVisiblePages = (): (number | string)[] => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisiblePages / 2);
    let start = currentPage - half;
    let end = currentPage + half;

    // Adjust start and end
    if (start < 1) {
      start = 1;
      end = maxVisiblePages;
    }
    if (end > totalPages) {
      end = totalPages;
      start = totalPages - maxVisiblePages + 1;
    }

    const pages: (number | string)[] = [];
    
    // Add first page
    if (start > 1) {
      pages.push(1);
      if (start > 2) {
        pages.push('...');
      }
    }

    // Add visible pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    // Add last page
    if (end < totalPages) {
      if (end < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  const defaultOnPrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const defaultOnNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '16px 20px',
      borderTop: `1px solid ${Colors.border}`,
      flexWrap: 'wrap',
      gap: 12,
    }}>
      {/* Page Info */}
      {showPageInfo && (
        <div style={{ fontSize: 12, color: Colors.textMuted }}>
          Affichage de {showingFrom} à {showingTo} sur {totalItems}
        </div>
      )}

      {/* Pagination Buttons */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {/* Previous Button */}
        <button 
          onClick={onPrevPage || defaultOnPrev}
          disabled={currentPage === 1}
          style={{
            padding: '8px 14px',
            borderRadius: 6,
            border: `1px solid ${Colors.border}`,
            background: 'transparent',
            color: currentPage === 1 ? Colors.textMuted : Colors.text,
            fontSize: 12,
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            opacity: currentPage === 1 ? 0.5 : 1,
            transition: 'all 0.2s',
          }}
        >
          ← Précédent
        </button>

        {/* Page Numbers */}
        {visiblePages.map((page, index) => {
          if (page === '...') {
            return (
              <span 
                key={`ellipsis-${index}`}
                style={{ 
                  padding: '8px 8px', 
                  color: Colors.textMuted,
                  fontSize: 12,
                }}
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              style={{
                padding: '8px 12px',
                borderRadius: 6,
                border: isActive ? `1px solid ${Colors.accent}` : `1px solid ${Colors.border}`,
                background: isActive ? 'rgba(100, 140, 255, 0.15)' : 'transparent',
                color: isActive ? Colors.accent : Colors.text,
                fontSize: 12,
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.2s',
                minWidth: 36,
              }}
            >
              {pageNum}
            </button>
          );
        })}

        {/* Next Button */}
        <button 
          onClick={onNextPage || defaultOnNext}
          disabled={currentPage === totalPages}
          style={{
            padding: '8px 14px',
            borderRadius: 6,
            border: `1px solid ${Colors.border}`,
            background: 'transparent',
            color: currentPage === totalPages ? Colors.textMuted : Colors.text,
            fontSize: 12,
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            opacity: currentPage === totalPages ? 0.5 : 1,
            transition: 'all 0.2s',
          }}
        >
          Suivant →
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;

