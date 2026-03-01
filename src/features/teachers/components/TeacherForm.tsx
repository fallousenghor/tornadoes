// Teacher Form Component - Teachers Module
// Reusable form for creating and editing teachers

import React from 'react';
import { Modal, Button } from '../../../components/common';
import { Colors } from '../../../constants/theme';

interface TeacherFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TeacherFormData) => void;
  teacher?: any | null;
}

export interface TeacherFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialties: string[];
  status: string;
  hourlyRate: number;
}

const specialtyOptions = [
  'Développement Web',
  'Data Science',
  'Cybersécurité',
  'Marketing Digital',
  'Gestion de projet',
  'Base de données',
];

const TeacherForm: React.FC<TeacherFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  teacher,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: TeacherFormData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      specialties: [formData.get('specialty') as string],
      status: formData.get('status') as string,
      hourlyRate: Number(formData.get('hourlyRate')),
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
      title={teacher ? `${teacher.firstName} ${teacher.lastName}` : 'Nouveau professeur'}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={labelStyle}>Prénom *</label>
            <input name="firstName" type="text" style={inputStyle} placeholder="Prénom" defaultValue={teacher?.firstName} required />
          </div>
          <div>
            <label style={labelStyle}>Nom *</label>
            <input name="lastName" type="text" style={inputStyle} placeholder="Nom" defaultValue={teacher?.lastName} required />
          </div>
          <div>
            <label style={labelStyle}>Email *</label>
            <input name="email" type="email" style={inputStyle} placeholder="email@aevum.sn" defaultValue={teacher?.email} required />
          </div>
          <div>
            <label style={labelStyle}>Téléphone</label>
            <input name="phone" type="tel" style={inputStyle} placeholder="+221 77 xxx xx xx" defaultValue={teacher?.phone} />
          </div>
          <div>
            <label style={labelStyle}>Spécialité *</label>
            <select name="specialty" defaultValue={teacher?.specialties?.[0] || ''} style={inputStyle} required>
              <option value="">Sélectionner...</option>
              {specialtyOptions.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Statut *</label>
            <select name="status" defaultValue={teacher?.status || 'actif'} style={inputStyle} required>
              <option value="actif">Actif</option>
              <option value="inactif">Inactif</option>
              <option value="conge">Congé</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Taux horaire (CFA) *</label>
            <input name="hourlyRate" type="number" style={inputStyle} placeholder="15000" defaultValue={teacher?.hourlyRate} required />
          </div>
          <div>
            <label style={labelStyle}>Date d'embauche</label>
            <input name="hireDate" type="date" style={inputStyle} defaultValue={teacher?.hireDate ? new Date(teacher.hireDate).toISOString().split('T')[0] : ''} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
          <Button variant="secondary" type="button" onClick={onClose}>Annuler</Button>
          <Button variant="primary" type="submit">{teacher ? 'Enregistrer' : 'Créer'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default TeacherForm;

