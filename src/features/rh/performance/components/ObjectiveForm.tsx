// Objective Form Component - Performance Module
// Form for creating and editing objectives

import React from 'react';
import { Modal, Button } from '../../../../components/common';
import { Colors } from '../../../../constants/theme';
import type { Objective, ObjectiveFormData } from '../types';
import type { Employee } from '../../../../types';

interface ObjectiveFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ObjectiveFormData) => void;
  objective: Objective | null;
  employees: Employee[];
  submitting: boolean;
}

export const ObjectiveForm: React.FC<ObjectiveFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  objective,
  employees,
  submitting,
}) => {
  const [formData, setFormData] = React.useState<ObjectiveFormData>({
    employeeId: '',
    title: '',
    description: '',
    target: 100,
    dueDate: '',
  });

  React.useEffect(() => {
    if (objective) {
      setFormData({
        employeeId: objective.employeeId,
        title: objective.title,
        description: objective.description,
        target: objective.target,
        dueDate: objective.dueDate instanceof Date 
          ? objective.dueDate.toISOString().split('T')[0]
          : new Date(objective.dueDate).toISOString().split('T')[0],
      });
    } else {
      setFormData({
        employeeId: '',
        title: '',
        description: '',
        target: 100,
        dueDate: '',
      });
    }
  }, [objective, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = <K extends keyof ObjectiveFormData>(field: K, value: ObjectiveFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={objective ? 'Modifier l\'objectif' : 'Nouvel objectif'}
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
              disabled={!!objective}
            >
              <option value="">Sélectionner un employé</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Titre de l'objectif *</label>
            <input 
              type="text"
              value={formData.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Ex: Augmenter les ventes de 20%"
              required
              style={inputStyle}
            />
          </div>

          {/* Description */}
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Description</label>
            <textarea 
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Décrivez l'objectif en détail..."
              rows={3}
              style={textareaStyle}
            />
          </div>

          {/* Target */}
          <div>
            <label style={labelStyle}>Cible *</label>
            <input 
              type="number"
              min="1"
              value={formData.target}
              onChange={(e) => updateField('target', parseInt(e.target.value) || 1)}
              required
              style={inputStyle}
            />
          </div>

          {/* Due Date */}
          <div>
            <label style={labelStyle}>Date d'échéance *</label>
            <input 
              type="date"
              value={formData.dueDate}
              onChange={(e) => updateField('dueDate', e.target.value)}
              required
              style={inputStyle}
            />
          </div>
        </div>

        {/* Form Actions */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
          <Button variant="secondary" type="button" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="primary" type="submit" disabled={submitting}>
            {submitting ? 'Enregistrement...' : (objective ? 'Mettre à jour' : 'Créer l\'objectif')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

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
  width: '100%',
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

export default ObjectiveForm;

