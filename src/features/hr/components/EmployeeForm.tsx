// Employee Form Component - RH Module
// Reusable form for creating and editing employees with photo upload

import React, { useState, useRef } from 'react';
import { Modal, Button } from '../../../components/common';
import { LoadingSpinner } from '../../../components/common/Loading';
import { Colors } from '../../../constants/theme';
import type { Employee, ContractType, Department } from '../../../types';

interface EmployeeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EmployeeFormData, photoFile?: File) => Promise<void>;
  employee?: Employee | null;
  departments?: Department[];
  isLoading?: boolean;
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
  departments = [],
  isLoading = false,
}) => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(employee?.photoUrl || null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoPreview(null);
    setPhotoFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return; // Prevent double submission
    
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
    
    // Pass both data and optional photo file and wait for completion
    try {
      await onSubmit(data, photoFile || undefined);
      
      // Reset form after successful submission
      setPhotoPreview(null);
      setPhotoFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      // Error is handled by parent, just don't reset the form
      console.error('Form submission error:', error);
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
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          zIndex: 1000,
          backdropFilter: 'blur(2px)',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
          }}>
            <LoadingSpinner size="lg" />
            <span style={{
              fontSize: 14,
              fontWeight: 500,
              color: Colors.text,
            }}>
              {employee ? 'Mise à jour en cours...' : 'Création en cours...'}
            </span>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} style={{ opacity: isLoading ? 0.5 : 1, pointerEvents: isLoading ? 'none' : 'auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          
          {/* Photo Upload Section */}
          <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 8 }}>
            <label style={{ ...labelStyle, textAlign: 'center', marginBottom: 12 }}>
              Photo de profil (optionnel)
            </label>
            <div style={{ position: 'relative' }}>
              {photoPreview ? (
                <div style={{ position: 'relative' }}>
                  <img 
                    src={photoPreview} 
                    alt="Preview" 
                    style={{
                      width: 100,
                      height: 100,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: `3px solid ${Colors.accent}`,
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    disabled={isLoading}
                    style={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: '#e05050',
                      color: 'white',
                      border: 'none',
                      cursor: isLoading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      opacity: isLoading ? 0.5 : 1,
                    }}
                    title="Supprimer la photo"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => !isLoading && fileInputRef.current?.click()}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    border: `2px dashed ${Colors.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    background: 'rgba(100, 140, 255, 0.05)',
                    flexDirection: 'column',
                    gap: 4,
                    opacity: isLoading ? 0.5 : 1,
                  }}
                >
                  <span style={{ fontSize: 24, color: Colors.textMuted }}>📷</span>
                  <span style={{ fontSize: 10, color: Colors.textMuted }}>Ajouter</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                disabled={isLoading}
                style={{ display: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Prénom *</label>
            <input 
              name="firstName"
              style={inputStyle}
              placeholder="Prénom" 
              defaultValue={employee?.firstName} 
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
          <div>
            <label style={labelStyle}>Poste *</label>
            <input 
              name="poste"
              style={inputStyle}
              placeholder="Développeur, Manager..." 
              defaultValue={employee?.poste} 
              disabled={isLoading}
              required 
            />
          </div>
          <div>
            <label style={labelStyle}>Département</label>
            <select 
              name="departmentId"
              defaultValue={employee?.departmentId || ''}
              style={inputStyle}
              disabled={isLoading}
            >
              <option value="">Sélectionner un département</option>
              {(departments.length > 0 ? departments : []).map(dept => (
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
              disabled={isLoading}
            >
              <option value="CDI">CDI</option>
              <option value="CDD">CDD</option>
              <option value="Freelance">Freelance</option>
              <option value="Stage">Stage</option>
              <option value="Part_time">Part Time</option>
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
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Notes</label>
            <textarea 
              name="notes"
              placeholder="Notes supplémentaires..."
              defaultValue={employee?.notes}
              disabled={isLoading}
              rows={3}
              style={{
                ...inputStyle,
                resize: 'vertical',
              }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
          <Button variant="secondary" type="button" onClick={onClose} disabled={isLoading}>
            Annuler
          </Button>
          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>{employee ? 'Mise à jour...' : 'Création...'}</span>
              </>
            ) : (
              employee ? 'Enregistrer' : "Créer l'employé"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EmployeeForm;

