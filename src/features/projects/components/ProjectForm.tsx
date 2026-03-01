// Project Form Component - Projects Module
// Reusable form for creating and editing projects

import React from 'react';
import { Modal, Button } from '../../../components/common';
import { Colors } from '../../../constants/theme';

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFormData) => void;
  project?: any | null;
}

export interface ProjectFormData {
  name: string;
  priority: string;
  status: string;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  project,
}) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: ProjectFormData = {
      name: formData.get('name') as string,
      priority: formData.get('priority') as string,
      status: formData.get('status') as string,
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
      title={project ? project.name : 'Nouveau projet'}
      size="lg"
    >
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Nom du projet *</label>
            <input 
              name="name"
              type="text"
              style={inputStyle}
              placeholder="Refonte CRM"
              defaultValue={project?.name}
              required
            />
          </div>
          <div>
            <label style={labelStyle}>Priorité *</label>
            <select name="priority" defaultValue={project?.priority || 'moyenne'} style={inputStyle} required>
              <option value="basse">Basse</option>
              <option value="moyenne">Moyenne</option>
              <option value="haute">Haute</option>
              <option value="critique">Critique</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Statut *</label>
            <select name="status" defaultValue={project?.status || 'demarrage'} style={inputStyle} required>
              <option value="demarrage">Démarrage</option>
              <option value="en_cours">En cours</option>
              <option value="finalisation">Finalisation</option>
              <option value="termine">Terminé</option>
            </select>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
          <Button variant="secondary" type="button" onClick={onClose}>
            Annuler
          </Button>
          <Button variant="primary" type="submit">
            {project ? 'Enregistrer' : 'Créer'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectForm;

