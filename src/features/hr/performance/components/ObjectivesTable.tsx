// Objectives Table Component - Performance Module
// Displays objectives in a table format

import React from 'react';
import { Card } from '../../../../components/common';
import { Colors } from '../../../../constants/theme';
import type { Objective } from '../types';
import { formatDate, getObjectiveStatus, calculateProgress } from '../utils/formatters';
import { isMissing } from '../utils/nullableValueFormatter';

interface ObjectivesTableProps {
  objectives: Objective[];
  loading: boolean;
  onEdit: (objective: Objective) => void;
  onDelete: (objective: Objective) => void;
}

export const ObjectivesTable: React.FC<ObjectivesTableProps> = ({
  objectives,
  loading,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: 40, textAlign: 'center', color: Colors.textMuted }}>
          Chargement des objectifs...
        </div>
      </Card>
    );
  }

  if (objectives.length === 0) {
    return (
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: 40, textAlign: 'center', color: Colors.textMuted }}>
          Aucun objectif trouvé. Cliquez sur "+ Nouvel objectif" pour commencer.
        </div>
      </Card>
    );
  }

  return (
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'rgba(100, 140, 255, 0.05)' }}>
              <th style={thStyle}>Objectif</th>
              <th style={thStyle}>Employé</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Progression</th>
              <th style={thStyle}>Échéance</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Statut</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {objectives.map((objective, index) => {
              const statusStyle = getObjectiveStatus(objective.status);
              const progress = calculateProgress(objective.achieved, objective.target);
              
              return (
                <tr 
                  key={objective.id} 
                  style={{ 
                    borderBottom: `1px solid ${Colors.border}`,
                    background: index % 2 === 0 ? 'transparent' : 'rgba(100, 140, 255, 0.02)',
                  }}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 500, color: Colors.text }}>
                        {objective.title}
                      </div>
                      <div style={{ fontSize: 12, color: Colors.textMuted }}>
                        {objective.description}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: isMissing(objective.employeeName) ? '#f59e0b' : Colors.text }}>
                    {isMissing(objective.employeeName) ? <span style={{ fontStyle: 'italic' }}>Non spécifié</span> : objective.employeeName}
                  </td>
                  <td style={{ padding: '14px 16px', width: 200 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={progressBarContainerStyle}>
                        <div style={{ 
                          width: `${progress}%`, 
                          height: '100%', 
                          background: statusStyle.color,
                          borderRadius: 4,
                        }} />
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 500, color: Colors.text, minWidth: 40 }}>
                        {objective.achieved}/{objective.target}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 13, color: Colors.textMuted }}>
                    {formatDate(objective.dueDate)}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: 6, 
                      fontSize: 11, 
                      fontWeight: 500,
                      background: statusStyle.bg, 
                      color: statusStyle.color 
                    }}>
                      {statusStyle.label}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                      <button 
                        onClick={() => onEdit(objective)}
                        style={actionButtonStyle}
                      >
                        ✎
                      </button>
                      <button 
                        onClick={() => onDelete(objective)}
                        style={deleteButtonStyle}
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

// Styles
const thStyle: React.CSSProperties = {
  padding: '14px 16px',
  textAlign: 'left',
  fontSize: 11,
  fontWeight: 600,
  color: Colors.textMuted,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const progressBarContainerStyle: React.CSSProperties = {
  flex: 1,
  height: 8,
  background: 'rgba(100, 140, 255, 0.1)',
  borderRadius: 4,
  overflow: 'hidden',
};

const actionButtonStyle: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: 6,
  border: `1px solid ${Colors.border}`,
  background: 'transparent',
  color: Colors.textMuted,
  fontSize: 11,
  cursor: 'pointer',
};

const deleteButtonStyle: React.CSSProperties = {
  padding: '6px 12px',
  borderRadius: 6,
  border: '1px solid rgba(224, 80, 80, 0.3)',
  background: 'rgba(224, 80, 80, 0.05)',
  color: '#e05050',
  fontSize: 11,
  cursor: 'pointer',
};

export default ObjectivesTable;

