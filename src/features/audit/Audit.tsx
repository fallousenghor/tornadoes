// Audit & Logs Feature - AEVUM Enterprise ERP
// Complete audit trail and system logs module

import React, { useState, useMemo } from 'react';
import { Card, Button, Modal } from '../../components/common';
import { Colors } from '../../constants/theme';

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
  { id: 'export', label: 'Export', icon: '📤', color: '#2dd4bf' },
  { id: 'import', label: 'Import', icon: '📥', color: '#c9a84c' },
  { id: 'permission', label: 'Permission', icon: '🔐', color: '#f472b6' },
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

// Mock audit logs
const generateAuditLogs = (): AuditLog[] => {
  const logs: AuditLog[] = [];
  const users = [
    { name: 'Fatou Diallo', role: 'RH' },
    { name: 'Moussa Sow', role: 'Finance' },
    { name: 'Aïcha Ndiaye', role: 'DG' },
    { name: 'Omar Ba', role: 'Tech' },
    { name: 'Sara Mendy', role: 'Admin' },
    { name: 'Ibou Gaye', role: 'Commercial' },
    { name: 'Rokhaya Fall', role: 'Formateur' },
  ];

  const actions = [
    { action: 'Connexion au système', module: 'dashboard', details: 'Authentification réussie' },
    { action: 'Création employé', module: 'employees', details: 'Nouveau contrat signé - Ingénieur Backend' },
    { action: 'Modification fiche', module: 'employees', details: 'Mise à jour informations personnelles' },
    { action: 'Validation facture', module: 'invoices', details: 'Facture #INV-2045 validée' },
    { action: 'Export données', module: 'stock', details: 'Export Excel inventaire Q1' },
    { action: 'Import notes', module: 'grades', details: 'Import bulk notes examen Python' },
    { action: 'Modification planning', module: 'schedule', details: 'Créneau ajouté - React & Next.js' },
    { action: 'Création projet', module: 'projects', details: 'Nouveau projet: Formation Python' },
    { action: 'Attribution rôle', module: 'roles', details: 'Rôle Formateur assigné' },
    { action: 'Consultation rapport', module: 'dashboard', details: 'Rapport mensuelle consulté' },
    { action: 'Suppression document', module: 'documents', details: 'Ancien contrat archivé' },
    { action: 'Ajout stock', module: 'stock', details: '10 MacBook Pro ajoutés' },
  ];

  for (let i = 0; i < 50; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const act = actions[Math.floor(Math.random() * actions.length)];
    const status: 'success' | 'warning' | 'error' = Math.random() > 0.9 ? (Math.random() > 0.5 ? 'warning' : 'error') : 'success';
    
    logs.push({
      id: `log-${i + 1}`,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      userName: user.name,
      userRole: user.role,
      action: act.action,
      module: act.module,
      details: act.details,
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      status,
    });
  }

  return logs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};

const mockAuditLogs = generateAuditLogs();

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
  const itemsPerPage = 15;

  // Filter logs
  const filteredLogs = useMemo(() => {
    return mockAuditLogs.filter(log => {
      const matchesModule = selectedModule === 'all' || log.module === selectedModule;
      const matchesAction = selectedAction === 'all' || log.action.toLowerCase().includes(selectedAction.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || log.status === selectedStatus;
      const matchesSearch = searchQuery === '' || 
        log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesModule && matchesAction && matchesStatus && matchesSearch;
    });
  }, [selectedModule, selectedAction, selectedStatus, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(start, start + itemsPerPage);
  }, [filteredLogs, currentPage]);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedModule, selectedAction, selectedStatus, searchQuery]);

  // Summary stats
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayLogs = mockAuditLogs.filter(l => l.timestamp >= today);
    const errors = mockAuditLogs.filter(l => l.status === 'error').length;
    const warnings = mockAuditLogs.filter(l => l.status === 'warning').length;
    
    return {
      totalLogs: mockAuditLogs.length,
      todayLogs: todayLogs.length,
      errors,
      warnings,
    };
  }, []);

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
                {stats.totalLogs}
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
                {stats.todayLogs}
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
                {stats.errors}
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
                {stats.warnings}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: 20, padding: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <input 
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13, width: 200 }}
          />
          <select 
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}
          >
            <option value="all">Tous les modules</option>
            {modules.map(m => (<option key={m.id} value={m.id}>{m.label}</option>))}
          </select>
          <select 
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}
          >
            <option value="all">Toutes les actions</option>
            {actionTypes.map(a => (<option key={a.id} value={a.label}>{a.label}</option>))}
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
              {paginatedLogs.map((log) => {
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
        
        {/* Pagination */}
        {filteredLogs.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderTop: `1px solid ${Colors.border}` }}>
            <div style={{ fontSize: 12, color: Colors.textMuted }}>
              Affichage de {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, filteredLogs.length)} sur {filteredLogs.length} résultat(s)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ 
                  padding: '8px 12px', 
                  borderRadius: 6, 
                  border: `1px solid ${Colors.border}`, 
                  background: currentPage === 1 ? Colors.textDim : Colors.card, 
                  color: currentPage === 1 ? Colors.textDark : Colors.text,
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontSize: 12,
                }}
              >
                ← Précédent
              </button>
              <div style={{ display: 'flex', gap: 4 }}>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 6,
                        border: 'none',
                        background: currentPage === pageNum ? Colors.accent : 'transparent',
                        color: currentPage === pageNum ? '#fff' : Colors.textMuted,
                        cursor: 'pointer',
                        fontSize: 12,
                        fontWeight: currentPage === pageNum ? 600 : 400,
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{ 
                  padding: '8px 12px', 
                  borderRadius: 6, 
                  border: `1px solid ${Colors.border}`, 
                  background: currentPage === totalPages ? Colors.textDim : Colors.card, 
                  color: currentPage === totalPages ? Colors.textDark : Colors.text,
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontSize: 12,
                }}
              >
                Suivant →
              </button>
            </div>
          </div>
        )}
        
        {filteredLogs.length === 0 && (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 8 }}>Aucun résultat</div>
            <div style={{ fontSize: 13, color: Colors.textMuted }}>Essayez de modifier vos critères de recherche</div>
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
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>HORODATAGE</div>
                <div style={{ fontSize: 14, color: Colors.text, marginTop: 8 }}>
                  {selectedLog.timestamp.toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </div>
              </div>
              <div>
<div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>ADRESSE IP</div>
                <div style={{ fontSize: 14, color: Colors.text, marginTop: 8, fontFamily: 'monospace' }}>
                  {selectedLog.ipAddress}
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>DÉTAILS</div>
                <div style={{ fontSize: 13, color: Colors.text, marginTop: 8, padding: 12, background: 'rgba(100, 140, 255, 0.05)', borderRadius: 8 }}>
                  {selectedLog.details}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => { setIsModalOpen(false); setSelectedLog(null); }}>Fermer</Button>
              <Button variant="primary">Signaler un problème</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Audit;

