import React, { useState, useEffect } from 'react';
import { Colors, BorderRadius, Spacing } from '../../../constants/theme';
import type { Teacher } from '../../../types';

export interface TeacherFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  specialties: string[];
}

interface TeacherFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TeacherFormData) => Promise<void>;
  teacher?: Teacher | null;
}

const TeacherForm: React.FC<TeacherFormProps> = ({ isOpen, onClose, onSubmit, teacher }) => {
  const [formData, setFormData] = useState<TeacherFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialties: [],
  });
  const [specialtyInput, setSpecialtyInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (teacher) {
      setFormData({
        firstName: teacher.firstName,
        lastName: teacher.lastName,
        email: teacher.email,
        phone: teacher.phone || '',
        specialties: teacher.specialties || [],
      });
    } else {
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        specialties: [],
      });
    }
  }, [teacher, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting teacher:', error);
    } finally {
      setLoading(false);
    }
  };

  const addSpecialty = () => {
    if (specialtyInput.trim() && !formData.specialties.includes(specialtyInput.trim())) {
      setFormData({ ...formData, specialties: [...formData.specialties, specialtyInput.trim()] });
      setSpecialtyInput('');
    }
  };

  const removeSpecialty = (index: number) => {
    setFormData({ ...formData, specialties: formData.specialties.filter((_, i) => i !== index) });
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        background: Colors.card,
        borderRadius: BorderRadius.lg,
        padding: Spacing.xl,
        width: '100%',
        maxWidth: 500,
        maxHeight: '90vh',
        overflow: 'auto',
      }}>
        <h2 style={{ margin: `0 0 ${Spacing.lg}`, color: Colors.text, fontSize: 20, fontWeight: 600 }}>
          {teacher ? 'Modifier le formateur' : 'Ajouter un formateur'}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: Spacing.md }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: Spacing.md }}>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: Spacing.xs, color: Colors.text }}>
                Prénom
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: Spacing.sm,
                  border: `1px solid ${Colors.border}`,
                  borderRadius: BorderRadius.md,
                  fontSize: 14,
                  backgroundColor: Colors.input,
                  color: Colors.text,
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: Spacing.xs, color: Colors.text }}>
                Nom
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: Spacing.sm,
                  border: `1px solid ${Colors.border}`,
                  borderRadius: BorderRadius.md,
                  fontSize: 14,
                  backgroundColor: Colors.input,
                  color: Colors.text,
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: Spacing.xs, color: Colors.text }}>
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              style={{
                width: '100%',
                padding: Spacing.sm,
                border: `1px solid ${Colors.border}`,
                borderRadius: BorderRadius.md,
                fontSize: 14,
                backgroundColor: Colors.input,
                color: Colors.text,
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: Spacing.xs, color: Colors.text }}>
              Téléphone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={{
                width: '100%',
                padding: Spacing.sm,
                border: `1px solid ${Colors.border}`,
                borderRadius: BorderRadius.md,
                fontSize: 14,
                backgroundColor: Colors.input,
                color: Colors.text,
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, marginBottom: Spacing.xs, color: Colors.text }}>
              Spécialités
            </label>
            <div style={{ display: 'flex', gap: Spacing.xs, marginBottom: Spacing.sm }}>
              <input
                type="text"
                value={specialtyInput}
                onChange={(e) => setSpecialtyInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSpecialty(); } }}
                placeholder="Ajouter une spécialité"
                style={{
                  flex: 1,
                  padding: Spacing.sm,
                  border: `1px solid ${Colors.border}`,
                  borderRadius: BorderRadius.md,
                  fontSize: 14,
                  backgroundColor: Colors.input,
                  color: Colors.text,
                }}
              />
              <button
                type="button"
                onClick={addSpecialty}
                style={{
                  padding: `${Spacing.sm} ${Spacing.md}`,
                  background: Colors.primary,
                  color: '#fff',
                  border: 'none',
                  borderRadius: BorderRadius.md,
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                Ajouter
              </button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: Spacing.xs }}>
              {formData.specialties.map((spec, index) => (
                <span
                  key={index}
                  style={{
                    padding: `${Spacing.xs} ${Spacing.sm}`,
                    background: Colors.primaryMuted,
                    color: Colors.primary,
                    borderRadius: BorderRadius.sm,
                    fontSize: 12,
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: Spacing.xs,
                  }}
                >
                  {spec}
                  <button
                    type="button"
                    onClick={() => removeSpecialty(index)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: Colors.primary,
                      cursor: 'pointer',
                      padding: 0,
                      fontSize: 14,
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: Spacing.md, marginTop: Spacing.lg }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: `${Spacing.sm} ${Spacing.lg}`,
                background: Colors.bgSecondary,
                color: Colors.text,
                border: `1px solid ${Colors.border}`,
                borderRadius: BorderRadius.md,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: `${Spacing.sm} ${Spacing.lg}`,
                background: loading ? Colors.textMuted : Colors.primary,
                color: '#fff',
                border: 'none',
                borderRadius: BorderRadius.md,
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              {loading ? 'Enregistrement...' : teacher ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherForm;
