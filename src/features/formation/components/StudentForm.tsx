// Student Form Component - Formation Module
// Reusable form for creating and editing students

import React, { useState } from 'react';
import { Modal, Button } from '../../../components/common';
import { Colors } from '../../../constants/theme';
import type { Student } from '../../../types';

interface StudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StudentFormData) => void;
  student?: Student | null;
}

export interface StudentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthDate?: string;
}

const StudentForm: React.FC<StudentFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  student,
}) => {
  const [formData, setFormData] = useState<StudentFormData>({
    firstName: student?.firstName || '',
    lastName: student?.lastName || '',
    email: student?.email || '',
    phone: student?.phone || '',
    birthDate: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'Le prénom est obligatoire';
    if (!formData.lastName.trim()) newErrors.lastName = 'Le nom est obligatoire';
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est obligatoire';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      onClose();
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        birthDate: '',
      });
    }
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
    marginBottom: 8,
    fontSize: 13,
    fontWeight: 500,
    color: Colors.text,
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
    marginBottom: 16,
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={student ? '✏️ Modifier Étudiant' : '➕ Nouvel Étudiant'}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={gridStyle}>
          <div>
            <label style={labelStyle}>Prénom *</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              style={{
                ...inputStyle,
                borderColor: errors.firstName ? Colors.danger : Colors.border,
                background: errors.firstName ? 'rgba(220, 38, 38, 0.05)' : Colors.bg,
              }}
              placeholder="Kouassi"
            />
            {errors.firstName && (
              <div style={{ color: Colors.danger, fontSize: 12, marginTop: 4 }}>{errors.firstName}</div>
            )}
          </div>
          <div>
            <label style={labelStyle}>Nom *</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              style={{
                ...inputStyle,
                borderColor: errors.lastName ? Colors.danger : Colors.border,
                background: errors.lastName ? 'rgba(220, 38, 38, 0.05)' : Colors.bg,
              }}
              placeholder="N'Guessan"
            />
            {errors.lastName && (
              <div style={{ color: Colors.danger, fontSize: 12, marginTop: 4 }}>{errors.lastName}</div>
            )}
          </div>
        </div>

        <div>
          <label style={labelStyle}>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            style={{
              ...inputStyle,
              borderColor: errors.email ? Colors.danger : Colors.border,
              background: errors.email ? 'rgba(220, 38, 38, 0.05)' : Colors.bg,
            }}
            placeholder="student@example.com"
          />
          {errors.email && (
            <div style={{ color: Colors.danger, fontSize: 12, marginTop: 4 }}>{errors.email}</div>
          )}
        </div>

        <div style={gridStyle}>
          <div>
            <label style={labelStyle}>Téléphone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
              style={inputStyle}
              placeholder="+225 07 00 00 00"
            />
          </div>
          <div>
            <label style={labelStyle}>Date de naissance</label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate || ''}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
          <Button variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="primary" type="submit">
            {student ? 'Mettre à jour' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default StudentForm;
