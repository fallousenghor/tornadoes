// Student Details Component - Students Module
// Reusable component for viewing student details

import React from 'react';
import { Modal, Button, ProgressBar } from '../../../components/common';
import { Colors } from '../../../constants/theme';

// Status colors
const statusColors: Record<string, { bg: string; color: string; label: string }> = {
  inscrit: { bg: 'rgba(100, 140, 255, 0.15)', color: '#6490ff', label: 'Inscrit' },
  actif: { bg: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e', label: 'Actif' },
  attente: { bg: 'rgba(201, 168, 76, 0.15)', color: '#c9a84c', label: 'En attente' },
  diplome: { bg: 'rgba(167, 139, 250, 0.15)', color: '#a78bfa', label: 'Diplômé' },
  abandon: { bg: 'rgba(224, 80, 80, 0.15)', color: '#e05050', label: 'Abandon' },
};

// Program colors
const programColors: Record<string, string> = {
  'Développement Web': '#6490ff',
  'Data Science': '#3ecf8e',
  'Cybersécurité': '#a78bfa',
  'Marketing Digital': '#fb923c',
};

interface StudentDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  student: any | null;
}

const StudentDetails: React.FC<StudentDetailsProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  if (!student) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const status = statusColors[student.status];
  const progColor = programColors[student.program] || Colors.accent;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${student.firstName} ${student.lastName}`}
      size="lg"
    >
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, marginBottom: 24 }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <div style={{ 
              width: 80, 
              height: 80, 
              borderRadius: '50%', 
              background: progColor,
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: '#fff',
              fontSize: 28,
              fontWeight: 600,
            }}>
              {student.firstName[0]}{student.lastName[0]}
            </div>
            <span style={{ 
              padding: '6px 14px', 
              borderRadius: 20, 
              fontSize: 12, 
              fontWeight: 500,
              background: status?.bg, 
              color: status?.color,
            }}>
              {status?.label}
            </span>
          </div>
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>EMAIL</div>
                <div style={{ fontSize: 13, color: Colors.text }}>{student.email}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>TÉLÉPHONE</div>
                <div style={{ fontSize: 13, color: Colors.text }}>{student.phone}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>PROGRAMME</div>
                <span style={{ 
                  padding: '4px 10px', 
                  borderRadius: 6, 
                  fontSize: 12, 
                  fontWeight: 500,
                  background: `${progColor}20`, 
                  color: progColor,
                }}>
                  {student.program}
                </span>
              </div>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>DATE D'INSCRIPTION</div>
                <div style={{ fontSize: 13, color: Colors.text }}>{formatDate(student.enrollmentDate)}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ borderTop: `1px solid ${Colors.border}`, paddingTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: Colors.text }}>Progression du programme</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: progColor }}>
              {student.progress}%
            </span>
          </div>
          <ProgressBar 
            value={student.progress} 
            color={progColor}
            height={10}
          />
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
          <Button variant="secondary" onClick={onClose}>
            Fermer
          </Button>
          <Button variant="primary">
            Modifier
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default StudentDetails;

