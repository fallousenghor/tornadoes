// Employee Form Component - RH Module
// Reusable form for creating and editing employees

import React from 'react';
import { Modal, Button } from '../../../components/common';
import { Colors } from '../../../constants/theme';
import { deptPerformance } from '../../../data/mockData';
import type { Employee, ContractType } from '../../../types';

interface EmployeeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeFormData) => void;
  employee?: Employee | null;
}

export interface EmployeeFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  poste: string;
  departmentId: string;
  contractType: ContractType;
  salary: number;
  startDate: string;
  notes: string;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  employee,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: EmployeeFormData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      poste: formData.get('poste') as string,
      departmentId: formData.get('departmentId') as string,
      contractType: formData.get('contractType') as ContractType,
      salary: Number(formData.get('salary')),
      startDate: formData.get('startDate') as string,
      notes: formData.get('notes') as string,
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
      title={employee ? "Modifier l'employé" : "Nouvel Employé"}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={labelStyle}>Prénom *</label>
            <input 
              name="firstName"
              style={inputStyle}
              placeholder="Prénom" 
              defaultValue={employee?.firstName} 
              required 
            />
          </div>
          <div>
            <label style={labelStyle}>Nom *</label>
            <input 
              name="lastName"
              style={inputStyle}
              placeholder="Nom" 
              defaultValue={employee?.lastName} 
              required 
            />
          </div>
          <div>
            <label style={labelStyle}>Email *</label>
            <input 
              name="email"
              type="email"
              style={inputStyle}
              placeholder="email@exemple.sn" 
              defaultValue={employee?.email} 
              required 
            />
          </div>
          <div>
            <label style={labelStyle}>Téléphone</label>
            <input 
              name="phone"
              type="tel"
              style={inputStyle}
              placeholder="+221 77 XXX XX XX" 
              defaultValue={employee?.phone} 
            />
          </div>
          <div>
            <label style={labelStyle}>Poste *</label>
            <input 
              name="poste"
              style={inputStyle}
              placeholder="Développeur, Manager..." 
              defaultValue={employee?.poste} 
              required 
            />
          </div>
          <div>
            <label style={labelStyle}>Département</label>
            <select 
              name="departmentId"
              defaultValue={employee?.departmentId || '1'}
              style={inputStyle}
            >
              {deptPerformance.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Type de contrat</label>
            <select 
              name="contractType"
              defaultValue={employee?.contractType || 'CDI'}
              style={inputStyle}
            >
              <option value="CDI">CDI</option>
              <option value="CDD">CDD</option>
              <option value="Freelance">Freelance</option>
              <option value="Stage">Stage</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Salaire (FCFA) *</label>
            <input 
              name="salary"
              type="number"
              style={inputStyle}
              placeholder="50000" 
              defaultValue={employee?.salary} 
              required 
            />
          </div>
          <div>
            <label style={labelStyle}>Date de début</label>
            <input 
              name="startDate"
              type="date" 
              defaultValue={employee?.startDate ? new Date(employee.startDate).toISOString().split('T')[0] : ''}
              style={inputStyle}
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Notes</label>
            <textarea 
              name="notes"
              placeholder="Notes supplémentaires..."
              defaultValue={employee?.notes}
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
            {employee ? 'Enregistrer' : "Créer l'employé"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EmployeeForm;

