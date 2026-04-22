// Reviews Table Component - Performance Module
// Displays performance reviews in a table format with pagination

import React from 'react';
import { Card } from '../../../../components/common';
import { Colors } from '../../../../constants/theme';
import type { PerformanceReview } from '../types';
import { formatDate, renderStars, getRatingBadge, getReviewStatusBadge } from '../utils/formatters';
import { formatReviewerName, isMissing } from '../utils/nullableValueFormatter';

interface ReviewsTableProps {
  reviews: PerformanceReview[];
  loading: boolean;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onEdit: (review: PerformanceReview) => void;
  onDelete: (review: PerformanceReview) => void;
}

export const ReviewsTable: React.FC<ReviewsTableProps> = ({
  reviews,
  loading,
  currentPage,
  itemsPerPage,
  onPageChange,
  onEdit,
  onDelete,
}) => {
  const totalPages = Math.ceil(reviews.length / itemsPerPage) || 1;
  const paginatedReviews = reviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) {
    return (
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: 40, textAlign: 'center', color: Colors.textMuted }}>
          Chargement des évaluations...
        </div>
      </Card>
    );
  }

  if (reviews.length === 0) {
    return (
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: 40, textAlign: 'center', color: Colors.textMuted }}>
          Aucune évaluation trouvée. Cliquez sur "+ Nouvelle évaluation" pour commencer.
        </div>
      </Card>
    );
  }

  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(100, 140, 255, 0.05)' }}>
              <th style={thStyle}>Employé</th>
              <th style={thStyle}>Période</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Note</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Objectifs</th>
              <th style={thStyle}>Évaluateur</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Statut</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedReviews.map((review, index) => {
              const statusBadge = getReviewStatusBadge(review.status);
              
              return (
                <tr 
                  key={review.id} 
                  style={{ 
                    borderBottom: `1px solid ${Colors.border}`,
                    background: index % 2 === 0 ? 'transparent' : 'rgba(100, 140, 255, 0.02)',
                  }}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={avatarStyle}>
                        {isMissing(review.employeeName) ? '?' : review.employeeName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 500, color: isMissing(review.employeeName) ? '#64748b' : Colors.text }}>
                          {isMissing(review.employeeName) ? <span style={{ fontStyle: 'italic' }}>Non spécifié</span> : review.employeeName}
                        </div>
                        <div style={{ fontSize: 12, color: isMissing(review.department) ? '#f59e0b' : Colors.textMuted }}>
                          {isMissing(review.department) ? <span style={{ fontStyle: 'italic' }}>Département inconnu</span> : review.department}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: Colors.text }}>
                    {review.period}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                      {renderStars(review.rating)}
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: 13, color: Colors.text }}>
                    <span style={{ color: review.objectivesCompleted >= review.objectivesTotal * 0.8 ? '#3ecf8e' : Colors.text }}>
                      {review.objectivesCompleted}
                    </span>
                    <span style={{ color: Colors.textMuted }}>/{review.objectivesTotal}</span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: review.reviewer === 'Non assigné' ? Colors.textMuted : Colors.text }}>
                    {review.reviewer === 'Non assigné' ? <span style={{ color: '#f59e0b', fontStyle: 'italic' }}>⚠ {review.reviewer}</span> : review.reviewer}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: 6, 
                      fontSize: 11, 
                      fontWeight: 500,
                      background: statusBadge.bg, 
                      color: statusBadge.color 
                    }}>
                      {statusBadge.label}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                      <button 
                        onClick={() => onEdit(review)}
                        style={actionButtonStyle}
                      >
                        ✎
                      </button>
                      <button 
                        onClick={() => onDelete(review)}
                        style={deleteButtonStyle}
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div style={paginationStyle}>
        <div style={{ fontSize: 12, color: Colors.textMuted }}>
          Affichage de {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, reviews.length)} sur {reviews.length}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button 
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            style={paginationButtonStyle(currentPage === 1)}
          >
            ← Précédent
          </button>
          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              style={pageButtonStyle(page === currentPage)}
            >
              {page}
            </button>
          ))}
          <button 
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            style={pageButtonStyle(false)}
          >
            Suivant →
          </button>
        </div>
      </div>
    </Card>
  );
};

// Styles
const thStyle: React.CSSProperties = {
  padding: '14px 16px',
  textAlign: 'left',
  fontSize: 11,
  fontWeight: 600,
  color: Colors.textMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const avatarStyle: React.CSSProperties = {
  width: 36,
  height: 36,
  borderRadius: '50%',
  background: 'rgba(100, 140, 255, 0.15)',
  border: '1px solid rgba(100, 140, 255, 0.3)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 12,
  fontWeight: 600,
  color: Colors.accent,
};

const actionButtonStyle: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: 6,
  border: `1px solid ${Colors.border}`,
  background: 'transparent',
  color: Colors.textMuted,
  fontSize: 11,
  cursor: 'pointer',
};

const deleteButtonStyle: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: 6,
  border: '1px solid rgba(224, 80, 80, 0.3)',
  background: 'rgba(224, 80, 80, 0.05)',
  color: '#e05050',
  fontSize: 11,
  cursor: 'pointer',
};

const paginationStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '16px 20px',
  borderTop: `1px solid ${Colors.border}`,
};

const paginationButtonStyle = (disabled: boolean): React.CSSProperties => ({
  padding: '8px 14px',
  borderRadius: 6,
  border: `1px solid ${Colors.border}`,
  background: 'transparent',
  color: disabled ? Colors.textMuted : Colors.text,
  fontSize: 12,
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.5 : 1,
});

const pageButtonStyle = (isActive: boolean): React.CSSProperties => ({
  padding: '8px 12px',
  borderRadius: 6,
  border: isActive ? `1px solid ${Colors.accent}` : `1px solid ${Colors.border}`,
  background: isActive ? 'rgba(100, 140, 255, 0.15)' : 'transparent',
  color: isActive ? Colors.accent : Colors.text,
  fontSize: 12,
  cursor: 'pointer',
});

export default ReviewsTable;
