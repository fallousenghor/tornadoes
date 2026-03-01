// Leave Request Form Component - RH Module
// Reusable form for creating and editing leave requests

import React from 'react';
import { Modal, Button } from '../../../components/common';
import { Colors } from '../../../constants/theme';
import { employeesData } from '../../../data/mockData';

interface LeaveRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeaveRequestFormData) => void;
}

export interface LeaveRequestFormData {
  employeeId: string;
  type: 'annuel' | 'maladie' | 'maternite' | 'sans_solde' | 'exceptionnel';
  days: number;
  startDate: string;
  endDate: string;
  reason: string;
}

const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: LeaveRequestFormData = {
      employeeId: formData.get('employeeId') as string,
      type: formData.get('type') as LeaveRequestFormData['type'],
      days: Number(formData.get('days')),
      startDate: formData.get('startDate') as string,
      endDate: formData.get('endDate') as string,
      reason: formData.get('reason') as string,
    };
    
    onSubmit(data);
    onClose();
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    borderRadius: 8,
    border: `1px solid ${Colors.border}`,
    background: Colors.bg,
    color: Colors.text,
    fontSize: 13,
    fontFamily: "'DM Sans', sans-serif",
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 6,
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nouvelle demande de congé"
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Employé *</label>
            <select 
              name="employeeId"
              style={inputStyle}
              required
            >
              <option value="">Sélectionner un employé</option>
              {employeesData.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Type de congé *</label>
            <select 
              name="type"
              style={inputStyle}
              required
            >
              <option value="annuel">Congé annuel</option>
              <option value="maladie">Congé maladie</option>
              <option value="maternite">Congé maternité</option>
              <option value="sans_solde">Congé sans solde</option>
              <option value="exceptionnel">Congé exceptionnel</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Nombre de jours *</label>
            <input 
              name="days"
              type="number"
              min="1"
              style={inputStyle}
              placeholder="Nombre de jours"
              required
            />
          </div>
          <div>
            <label style={labelStyle}>Date de début *</label>
            <input 
              name="startDate"
              type="date" 
              style={inputStyle}
              required
            />
          </div>
          <div>
            <label style={labelStyle}>Date de fin *</label>
            <input 
              name="endDate"
              type="date" 
              style={inputStyle}
              required
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Motif</label>
            <textarea 
              name="reason"
              placeholder="Raison du congé..."
              rows={3}
              style={{
                ...inputStyle,
                resize: 'vertical',
              }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
          <Button variant="secondary" type="button" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="primary" type="submit">
            Soumettre la demande
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default LeaveRequestForm;

