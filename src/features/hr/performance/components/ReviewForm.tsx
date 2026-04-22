// Review Form Component - Performance Module
// Form for creating and editing performance reviews

import React from 'react';
import { Modal, Button } from '../../../../components/common';
import { Colors } from '../../../../constants/theme';
import type { PerformanceReview, ReviewFormData } from '../types';
import type { Employee } from '../../../../types';
import { PERIOD_OPTIONS, RATING_OPTIONS } from '../types';
import { formatEntityName } from '../utils/nullableValueFormatter';

interface ReviewFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ReviewFormData) => void;
  review: PerformanceReview | null;
  employees: Employee[];
  submitting: boolean;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  review,
  employees,
  submitting,
}) => {
  const [formData, setFormData] = React.useState<ReviewFormData>({
    employeeId: '',
    period: 'Q1 2025',
    rating: 3,
    objectivesCompleted: 0,
    objectivesTotal: 5,
    feedback: '',
    improvementPoints: '',
  });

  // Update form when review changes
  React.useEffect(() => {
    if (review) {
      setFormData({
        employeeId: review.employeeId,
        period: review.period,
        rating: review.rating,
        objectivesCompleted: review.objectivesCompleted,
        objectivesTotal: review.objectivesTotal,
        feedback: review.feedback,
        improvementPoints: '',
      });
    } else {
      setFormData({
        employeeId: '',
        period: 'Q1 2025',
        rating: 3,
        objectivesCompleted: 0,
        objectivesTotal: 5,
        feedback: '',
        improvementPoints: '',
      });
    }
  }, [review, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = <K extends keyof ReviewFormData>(field: K, value: ReviewFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={review ? 'Modifier l\'évaluation' : 'Nouvelle évaluation de performance'}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Employee Select */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Employé *</label>
            <select 
              value={formData.employeeId}
              onChange={(e) => updateField('employeeId', e.target.value)}
              style={selectStyle}
              required
              disabled={!!review}
            >
              <option value="">Sélectionner un employé</option>
              {employees.filter(emp => emp.firstName && emp.lastName).map(emp => (
                <option key={emp.id} value={emp.id}>
                  {formatEntityName(`${emp.firstName} ${emp.lastName}`)}
                </option>
              ))}
            </select>
          </div>

          {/* Period Select */}
          <div>
            <label style={labelStyle}>Période *</label>
            <select 
              value={formData.period}
              onChange={(e) => updateField('period', e.target.value)}
              style={selectStyle}
              required
            >
              {PERIOD_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          {/* Rating Stars */}
          <div>
            <label style={labelStyle}>Note globale *</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {RATING_OPTIONS.map(rating => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => updateField('rating', rating)}
                  style={{
                    ...starButtonStyle,
                    border: formData.rating === rating ? `2px solid ${Colors.accent}` : `1px solid ${Colors.border}`,
                    background: formData.rating === rating ? 'rgba(100, 140, 255, 0.1)' : 'transparent',
                  }}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Objectives Completed */}
          <div>
            <label style={labelStyle}>Objectifs atteints</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input 
                type="number"
                min="0"
                max={formData.objectivesTotal}
                value={formData.objectivesCompleted}
                onChange={(e) => updateField('objectivesCompleted', parseInt(e.target.value) || 0)}
                style={inputStyle}
              />
              <span style={{ color: Colors.textMuted }}>/</span>
              <input 
                type="number"
                min="1"
                value={formData.objectivesTotal}
                onChange={(e) => updateField('objectivesTotal', parseInt(e.target.value) || 1)}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Feedback */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Feedback</label>
            <textarea 
              value={formData.feedback}
              onChange={(e) => updateField('feedback', e.target.value)}
              placeholder="Commentaires sur la performance..."
              rows={4}
              style={textareaStyle}
            />
          </div>

          {/* Improvement Points */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Points d'amélioration</label>
            <textarea 
              value={formData.improvementPoints}
              onChange={(e) => updateField('improvementPoints', e.target.value)}
              placeholder="Points à améliorer..."
              rows={3}
              style={textareaStyle}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
          <Button variant="secondary" type="button" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? 'Enregistrement...' : (review ? 'Mettre à jour' : 'Créer l\'évaluation')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Styles
const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 12,
  color: Colors.textMuted,
  marginBottom: 6,
};

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  borderRadius: 8,
  border: `1px solid ${Colors.border}`,
  background: Colors.bg,
  color: Colors.text,
  fontSize: 13,
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: '12px',
  borderRadius: 8,
  border: `1px solid ${Colors.border}`,
  background: Colors.bg,
  color: Colors.text,
  fontSize: 13,
};

const textareaStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  borderRadius: 8,
  border: `1px solid ${Colors.border}`,
  background: Colors.bg,
  color: Colors.text,
  fontSize: 13,
  resize: 'vertical',
  fontFamily: 'inherit',
};

const starButtonStyle: React.CSSProperties = {
  flex: 1,
  padding: '12px',
  borderRadius: 8,
  border: `1px solid ${Colors.border}`,
  background: 'transparent',
  color: '#fbbf24',
  fontSize: 20,
  cursor: 'pointer',
};

export default ReviewForm;

