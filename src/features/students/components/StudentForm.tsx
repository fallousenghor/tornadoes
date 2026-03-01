// Student Form Component - Students Module
// Reusable form for creating and editing students

import React from 'react';
import { Modal, Button } from '../../../components/common';
import { Colors } from '../../../constants/theme';

interface StudentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: StudentFormData) => void;
  student?: any | null;
}

export interface StudentFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  program: string;
}

const StudentForm: React.FC<StudentFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  student,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: StudentFormData = {
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      program: formData.get('program') as string,
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
      title={student ? `${student.firstName} ${student.lastName}` : 'Nouvel apprenant'}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={labelStyle}>Prénom *</label>
            <input 
              name="firstName"
              type="text"
              style={inputStyle}
              placeholder="Prénom"
              defaultValue={student?.firstName}
              required
            />
          </div>
          <div>
            <label style={labelStyle}>Nom *</label>
            <input 
              name="lastName"
              type="text"
              style={inputStyle}
              placeholder="Nom"
              defaultValue={student?.lastName}
              required
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Email *</label>
            <input 
              name="email"
              type="email"
              style={inputStyle}
              placeholder="email@aevum.sn"
              defaultValue={student?.email}
              required
            />
          </div>
          <div>
            <label style={labelStyle}>Programme *</label>
            <select 
              name="program"
              defaultValue={student?.program || ''}
              style={inputStyle}
              required
            >
              <option value="">Sélectionner...</option>
              <option value="Développement Web">Développement Web</option>
              <option value="Data Science">Data Science</option>
              <option value="Cybersécurité">Cybersécurité</option>
              <option value="Marketing Digital">Marketing Digital</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Téléphone</label>
            <input 
              name="phone"
              type="tel"
              style={inputStyle}
              placeholder="+221 77 123 45 67"
              defaultValue={student?.phone}
            />
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
          <Button variant="secondary" type="button" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="primary" type="submit">
            {student ? 'Enregistrer' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default StudentForm;

