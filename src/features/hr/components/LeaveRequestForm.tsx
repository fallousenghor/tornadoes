// Leave Request Form Component - RH Module
// Reusable form for creating and editing leave requests

import React, { useState, useEffect } from 'react';
import { Modal, Button } from '../../../components/common';
import { Colors } from '../../../constants/theme';
import employeeService from '../../../services/employeeService';
import type { Employee, LeaveType } from '../../../types';

interface LeaveRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: LeaveRequestFormData) => void;
}

export interface LeaveRequestFormData {
  employeeId: string;
  type: LeaveType;
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
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch employees on mount
  useEffect(() => {
    if (isOpen) {
      const fetchEmployees = async () => {
        try {
          setLoading(true);
          const response = await employeeService.getEmployees({ pageSize: 100 });
          setEmployees(response.data);
        } catch (err) {
          console.error('Error fetching employees:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchEmployees();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    
    // Calculate days between start and end
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    const data: LeaveRequestFormData = {
      employeeId: formData.get('employeeId') as string,
      type: formData.get('type') as LeaveType,
      days: days,
      startDate: startDate,
      endDate: endDate,
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
              disabled={loading}
            >
              <option value="">Sélectionner un employé</option>
              {employees.map(emp => (
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
          <Button variant="primary" type="submit" disabled={loading}>
            Soumettre la demande
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default LeaveRequestForm;

