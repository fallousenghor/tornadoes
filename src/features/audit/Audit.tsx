// Audit & Logs Feature - Tornadoes Job System Module
// Connected to backend API

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, Button, Modal } from '../../components/common';
import { Colors } from '../../constants/theme';
import auditService from '../../services/auditService';

// Types
interface AuditLog {
  id: string;
  timestamp: Date;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
  status: 'success' | 'warning' | 'error';
}

// Action types
const actionTypes = [
  { id: 'login', label: 'Connexion', icon: '🔑', color: '#3ecf8e' },
  { id: 'create', label: 'Création', icon: '➕', color: '#6490ff' },
  { id: 'update', label: 'Modification', icon: '✏️', color: '#fb923c' },
  { id: 'delete', label: 'Suppression', icon: '🗑️', color: '#e05050' },
  { id: 'view', label: 'Consultation', icon: '👁️', color: '#a78bfa' },
];

// Modules
const modules = [
  { id: 'dashboard', label: 'Tableau de bord' },
  { id: 'employees', label: 'Employés' },
  { id: 'departments', label: 'Départements' },
  { id: 'presence', label: 'Présence' },
  { id: 'conges', label: 'Congés' },
  { id: 'performance', label: 'Performance' },
  { id: 'treasury', label: 'Trésorerie' },
  { id: 'invoices', label: 'Facturation' },
  { id: 'accounting', label: 'Comptabilité' },
  { id: 'stock', label: 'Stock' },
  { id: 'projects', label: 'Projets' },
  { id: 'documents', label: 'Documents' },
  { id: 'students', label: 'Apprenants' },
  { id: 'teachers', label: 'Professeurs' },
  { id: 'schedule', label: 'Plannings' },
  { id: 'grades', label: 'Notes' },
  { id: 'roles', label: 'Rôles & Accès' },
  { id: 'audit', label: 'Audit & Logs' },
];

// Get action info
const getActionInfo = (action: string) => {
  return actionTypes.find(a => action.toLowerCase().includes(a.label.toLowerCase())) || actionTypes[0];
};

// Get status color
const getStatusColor = (status: string): { bg: string; color: string; label: string } => {
  switch (status) {
    case 'success': return { bg: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e', label: 'Succès' };
    case 'warning': return { bg: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', label: 'Avertissement' };
    case 'error': return { bg: 'rgba(224, 80, 80, 0.15)', color: '#e05050', label: 'Erreur' };
    default: return { bg: 'rgba(100, 140, 255, 0.15)', color: '#6490ff', label: 'Inconnu' };
  }
};

// Format date
const formatDate = (date: Date): string => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'À l\'instant';
  if (minutes < 60) return `Il y a ${minutes} min`;
  if (hours < 24) return `Il y a ${hours}h`;
  if (days < 7) return `Il y a ${days} jour(s)`;
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

export const Audit: React.FC = () => {
  // State
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const itemsPerPage = 15;

  // Fetch data from API
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await auditService.getAuditLogs({
        page: currentPage - 1,
        size: itemsPerPage,
        module: selectedModule !== 'all' ? selectedModule : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
      });

      const logs: AuditLog[] = result.data.map(log => ({
        id: log.id,
        timestamp: new Date(log.timestamp),
        userName: log.userName,
        userRole: log.userRole,
        action: log.action,
        module: log.module,
        details: log.details,
        ipAddress: log.ipAddress,
        status: log.status,
      }));

      setAuditLogs(logs);
      setTotalLogs(result.total);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, selectedModule, selectedStatus]);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        await auditService.getAuditStats();
      } catch (error) {
        console.error('Error fetching audit stats:', error);
      }
    };
    fetchStats();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedModule, selectedAction, selectedStatus, searchQuery]);

  // Summary stats
  const stats = useMemo(() => {
    return {
      totalLogs: totalLogs,
      todayLogs: auditLogs.filter(l => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return l.timestamp >= today;
      }).length,
      errors: auditLogs.filter(l => l.status === 'error').length,
      warnings: auditLogs.filter(l => l.status === 'warning').length,
    };
  }, [auditLogs, totalLogs]);

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: Colors.text, marginBottom: 4 }}>
            Audit & Logs
          </h1>
          <p style={{ fontSize: 13, color: Colors.textMuted }}>
            Journal d'activité · Traçabilité · Historique système
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="secondary" onClick={() => alert('Export des logs bientôt disponible!')}>
            ↺ Exporter
          </Button>
          <Button variant="primary" onClick={() => alert('Fonctionnalité de purge bientôt disponible!')}>
            🗑️ Purger
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(100, 140, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#6490ff' }}>
              📋
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Logs
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {isLoading ? '...' : totalLogs}
              </div>
            </div>
          </div>
        </Card>
        
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(62, 207, 142, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#3ecf8e' }}>
              📅
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Aujourd'hui
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {isLoading ? '...' : stats.todayLogs}
              </div>
            </div>
          </div>
        </Card>
        
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(224, 80, 80, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#e05050' }}>
              ⚠️
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Erreurs
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {isLoading ? '...' : stats.errors}
              </div>
            </div>
          </div>
        </Card>
        
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(251, 146, 60, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#fb923c' }}>
              ⚡
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Avertissements
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {isLoading ? '...' : stats.warnings}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: 20, padding: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <select 
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}
          >
            <option value="all">Tous les modules</option>
            {modules.map(m => (<option key={m.id} value={m.id}>{m.label}</option>))}
          </select>
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}
          >
            <option value="all">Tous les statuts</option>
            <option value="success">Succès</option>
            <option value="warning">Avertissement</option>
            <option value="error">Erreur</option>
          </select>
        </div>
      </Card>

      {/* Logs Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center', color: Colors.textMuted }}>
            Chargement des logs...
          </div>
        ) : auditLogs.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 8 }}>Aucun résultat</div>
            <div style={{ fontSize: 13, color: Colors.textMuted }}>Aucun log d'audit trouvé</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(100, 140, 255, 0.05)' }}>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Horodatage</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Utilisateur</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Action</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Module</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Détails</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => {
                  const actionInfo = getActionInfo(log.action);
                  const statusInfo = getStatusColor(log.status);
                  const moduleInfo = modules.find(m => m.id === log.module);
                  return (
                    <tr 
                      key={log.id} 
                      style={{ 
                        borderBottom: `1px solid ${Colors.border}`, 
                        cursor: 'pointer',
                      }}
                      onClick={() => { setSelectedLog(log); setIsModalOpen(true); }}
                    >
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: 12, color: Colors.textMuted }}>
                          {formatDate(log.timestamp)}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(100, 140, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: Colors.accent }}>
                            {log.userName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 500, color: Colors.text }}>{log.userName}</div>
                            <div style={{ fontSize: 10, color: Colors.textMuted }}>{log.userRole}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 14 }}>{actionInfo.icon}</span>
                          <span style={{ fontSize: 12, color: actionInfo.color }}>{log.action}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 500, background: 'rgba(100, 140, 255, 0.1)', color: Colors.accent }}>
                          {moduleInfo?.label || log.module}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: 12, color: Colors.textLight, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {log.details}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 500, background: statusInfo.bg, color: statusInfo.color }}>
                          {statusInfo.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Log Details Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setSelectedLog(null); }} 
        title="Détails de l'action" 
        size="md"
      >
        {selectedLog && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>UTILISATEUR</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(100, 140, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: Colors.accent }}>
                    {selectedLog.userName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: Colors.text }}>{selectedLog.userName}</div>
                    <div style={{ fontSize: 11, color: Colors.textMuted }}>{selectedLog.userRole}</div>
                  </div>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>STATUT</div>
                <div style={{ marginTop: 8 }}>
                  <span style={{ padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: getStatusColor(selectedLog.status).bg, color: getStatusColor(selectedLog.status).color }}>
                    {getStatusColor(selectedLog.status).label}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => { setIsModalOpen(false); setSelectedLog(null); }}>Fermer</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Audit;

