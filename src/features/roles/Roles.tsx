// Roles & Access Feature - AEVUM Enterprise ERP
// Complete role and permission management module

import React, { useState, useMemo } from 'react';
import { Card, Button, Modal } from '../../components/common';
import { Colors } from '../../constants/theme';

// Types
interface Role {
  id: string;
  name: string;
  description: string;
  color: string;
  userCount: number;
  permissions: string[];
  isDefault?: boolean;
}

interface Permission {
  id: string;
  module: string;
  actions: string[];
}

// Module types
const modules = [
  { id: 'dashboard', label: 'Tableau de bord', icon: '⬡' },
  { id: 'employees', label: 'Employés', icon: '▦' },
  { id: 'departments', label: 'Départements', icon: '◉' },
  { id: 'presence', label: 'Présence', icon: '◎' },
  { id: 'conges', label: 'Congés', icon: '◇' },
  { id: 'performance', label: 'Performance', icon: '▣' },
  { id: 'treasury', label: 'Trésorerie', icon: '◆' },
  { id: 'invoices', label: 'Facturation', icon: '⬡' },
  { id: 'accounting', label: 'Comptabilité', icon: '▦' },
  { id: 'stock', label: 'Stock', icon: '◈' },
  { id: 'projects', label: 'Projets', icon: '▣' },
  { id: 'documents', label: 'Documents', icon: '◎' },
  { id: 'students', label: 'Apprenants', icon: '◉' },
  { id: 'teachers', label: 'Professeurs', icon: '◆' },
  { id: 'schedule', label: 'Plannings', icon: '⬡' },
  { id: 'grades', label: 'Notes', icon: '◇' },
  { id: 'roles', label: 'Rôles & Accès', icon: '▦' },
  { id: 'audit', label: 'Audit & Logs', icon: '◈' },
];

// Permission actions
const actions = ['create', 'read', 'update', 'delete'];

// Mock roles data
const mockRoles: Role[] = [
  { id: '1', name: 'Administrateur', description: 'Accès complet à toutes les fonctionnalités', color: '#e05050', userCount: 3, permissions: modules.map(m => m.id), isDefault: false },
  { id: '2', name: 'Direction Générale', description: 'Accès à toutes les données stratégiques', color: '#c9a84c', userCount: 5, permissions: ['dashboard', 'employees', 'departments', 'treasury', 'invoices', 'accounting', 'stock', 'projects', 'students', 'teachers', 'schedule', 'grades', 'audit'] },
  { id: '3', name: 'RH', description: 'Gestion des ressources humaines', color: '#6490ff', userCount: 4, permissions: ['dashboard', 'employees', 'departments', 'presence', 'conges', 'performance', 'students', 'teachers', 'schedule', 'grades'] },
  { id: '4', name: 'Finance', description: 'Gestion financière et comptable', color: '#3ecf8e', userCount: 6, permissions: ['dashboard', 'treasury', 'invoices', 'accounting', 'stock'] },
  { id: '5', name: 'Formateur', description: 'Gestion des cours et apprenants', color: '#a78bfa', userCount: 12, permissions: ['dashboard', 'students', 'teachers', 'schedule', 'grades'] },
  { id: '6', name: 'Commercial', description: 'Gestion des ventes et projets', color: '#fb923c', userCount: 8, permissions: ['dashboard', 'projects', 'invoices', 'stock'] },
  { id: '7', name: 'Employé', description: 'Accès de base aux fonctionnalités', color: '#2dd4bf', userCount: 45, permissions: ['dashboard', 'presence', 'conges', 'documents'] },
];

// Action labels
const actionLabels: Record<string, string> = {
  create: 'Créer',
  read: 'Lire',
  update: 'Modifier',
  delete: 'Supprimer',
};

// Get action color
const getActionColor = (action: string): string => {
  switch (action) {
    case 'create': return '#3ecf8e';
    case 'read': return '#6490ff';
    case 'update': return '#fb923c';
    case 'delete': return '#e05050';
    default: return '#6490ff';
  }
};

export const Roles: React.FC = () => {
  // State
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions'>('roles');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter roles
  const filteredRoles = useMemo(() => {
    if (!searchQuery) return mockRoles;
    return mockRoles.filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Get permission matrix
  const getRolePermissions = (role: Role, moduleId: string) => {
    return actions.map(action => ({
      action,
      enabled: role.permissions.includes(`${moduleId}_${action}`) || (role.permissions.includes(moduleId) && action === 'read'),
    }));
  };

  // Summary stats
  const stats = useMemo(() => {
    return {
      totalRoles: mockRoles.length,
      totalUsers: mockRoles.reduce((acc, r) => acc + r.userCount, 0),
      adminUsers: mockRoles.find(r => r.name === 'Administrateur')?.userCount || 0,
      customRoles: mockRoles.filter(r => !r.isDefault).length,
    };
  }, []);

  // Check if module has permission
  const hasModulePermission = (role: Role, moduleId: string): boolean => {
    return role.permissions.includes(moduleId);
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: Colors.text, marginBottom: 4 }}>
            Rôles & Accès
          </h1>
          <p style={{ fontSize: 13, color: Colors.textMuted }}>
            Gestion des rôles · Permissions · Accès utilisateurs
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="secondary" onClick={() => alert('Export des rôles bientôt disponible!')}>
            ↺ Exporter
          </Button>
          <Button variant="primary" onClick={() => { setSelectedRole(null); setIsModalOpen(true); }}>
            + Nouveau rôle
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(100, 140, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#6490ff' }}>
              👥
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Rôles
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {stats.totalRoles}
              </div>
            </div>
          </div>
        </Card>
        
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(62, 207, 142, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#3ecf8e' }}>
              ✓
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Utilisateurs
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {stats.totalUsers}
              </div>
            </div>
          </div>
        </Card>
        
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(224, 80, 80, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#e05050' }}>
              ⚡
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Administrateurs
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {stats.adminUsers}
              </div>
            </div>
          </div>
        </Card>
        
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(167, 139, 250, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#a78bfa' }}>
              🔧
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Rôles Personnalisés
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {stats.customRoles}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs & Search */}
      <Card style={{ marginBottom: 20, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 4, background: 'rgba(100, 140, 255, 0.05)', padding: 4, borderRadius: 8 }}>
              <button onClick={() => setActiveTab('roles')} style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: activeTab === 'roles' ? 'rgba(100, 140, 255, 0.15)' : 'transparent', color: activeTab === 'roles' ? Colors.accent : Colors.textMuted, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Rôles</button>
              <button onClick={() => setActiveTab('permissions')} style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: activeTab === 'permissions' ? 'rgba(100, 140, 255, 0.15)' : 'transparent', color: activeTab === 'permissions' ? Colors.accent : Colors.textMuted, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Matrice Permissions</button>
            </div>
          </div>
          {activeTab === 'roles' && (
            <input 
              type="text"
              placeholder="Rechercher un rôle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13, width: 250 }}
            />
          )}
        </div>
      </Card>

      {/* Roles List View */}
      {activeTab === 'roles' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
          {filteredRoles.map((role) => (
            <Card 
              key={role.id} 
              style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => { setSelectedRole(role); setIsModalOpen(true); }}
            >
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: `${role.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 20, color: role.color }}>👤</span>
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: Colors.text }}>
                        {role.name}
                      </div>
                      <div style={{ fontSize: 11, color: Colors.textMuted }}>{role.userCount} utilisateur(s)</div>
                    </div>
                  </div>
                  {role.isDefault && (
                    <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 500, background: 'rgba(100, 140, 255, 0.15)', color: Colors.accent }}>
                      Par défaut
                    </span>
                  )}
                </div>
                
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 8 }}>DESCRIPTION</div>
                  <div style={{ fontSize: 12, color: Colors.textLight, lineHeight: 1.5 }}>
                    {role.description}
                  </div>
                </div>
                
                <div>
                  <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 8 }}>MODULES ACCESSIBLES</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {modules.slice(0, 6).map((module) => (
                      <span 
                        key={module.id}
                        style={{ 
                          padding: '4px 8px', 
                          borderRadius: 4, 
                          fontSize: 10, 
                          fontWeight: 500, 
                          background: hasModulePermission(role, module.id) ? `${role.color}20` : 'rgba(100, 140, 255, 0.05)', 
                          color: hasModulePermission(role, module.id) ? role.color : Colors.textMuted,
                        }}
                      >
                        {module.label}
                      </span>
                    ))}
                    {role.permissions.length > 6 && (
                      <span style={{ fontSize: 10, color: Colors.textMuted, padding: '4px 8px' }}>
                        +{role.permissions.length - 6} autres
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Permissions Matrix View */}
      {activeTab === 'permissions' && (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(100, 140, 255, 0.05)' }}>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', minWidth: 200 }}>Module</th>
                  {mockRoles.map((role) => (
                    <th key={role.id} style={{ padding: '14px 12px', textAlign: 'center', fontSize: 10, fontWeight: 600, color: role.color, textTransform: 'uppercase', minWidth: 80 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                        <span>{role.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {modules.map((module) => (
                  <tr key={module.id} style={{ borderBottom: `1px solid ${Colors.border}` }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 16 }}>{module.icon}</span>
                        <span style={{ fontSize: 13, fontWeight: 500, color: Colors.text }}>{module.label}</span>
                      </div>
                    </td>
                    {mockRoles.map((role) => (
                      <td key={`${module.id}-${role.id}`} style={{ padding: '12px', textAlign: 'center' }}>
                        <div 
                          style={{ 
                            width: 20, 
                            height: 20, 
                            borderRadius: 4, 
                            margin: '0 auto',
                            background: hasModulePermission(role, module.id) ? role.color : 'rgba(100, 140, 255, 0.1)',
                            border: hasModulePermission(role, module.id) ? 'none' : `1px solid ${Colors.border}`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                          title={hasModulePermission(role, module.id) ? 'Accès autorisé' : 'Accès refusé'}
                        >
                          {hasModulePermission(role, module.id) && (
                            <span style={{ color: '#fff', fontSize: 12 }}>✓</span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Role Details Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setSelectedRole(null); }} 
        title={selectedRole ? selectedRole.name : 'Nouveau rôle'} 
        size="lg"
      >
        {selectedRole ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, marginBottom: 24 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 80, height: 80, borderRadius: 16, background: `${selectedRole.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 36, color: selectedRole.color }}>👤</span>
                </div>
                <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: `${selectedRole.color}20`, color: selectedRole.color }}>
                  {selectedRole.userCount} utilisateur(s)
                </span>
              </div>
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>DESCRIPTION</div>
                    <div style={{ fontSize: 13, color: Colors.text }}>{selectedRole.description}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>STATUT</div>
                    <div style={{ fontSize: 13, color: Colors.text }}>
                      {selectedRole.isDefault ? (
                        <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500, background: 'rgba(100, 140, 255, 0.15)', color: Colors.accent }}>Rôle par défaut</span>
                      ) : (
                        <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 500, background: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e' }}>Actif</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Permissions List */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: Colors.text, marginBottom: 12 }}>Permissions du rôle</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
                {modules.map((module) => (
                  <div 
                    key={module.id}
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 8, 
                      padding: '10px 12px', 
                      background: hasModulePermission(selectedRole, module.id) ? 'rgba(100, 140, 255, 0.05)' : 'transparent',
                      borderRadius: 8,
                      border: `1px solid ${hasModulePermission(selectedRole, module.id) ? Colors.border : 'transparent'}`,
                    }}
                  >
                    <span style={{ fontSize: 14, color: hasModulePermission(selectedRole, module.id) ? Colors.accent : Colors.textMuted }}>
                      {hasModulePermission(selectedRole, module.id) ? '✓' : '✗'}
                    </span>
                    <span style={{ fontSize: 12, color: hasModulePermission(selectedRole, module.id) ? Colors.text : Colors.textMuted }}>
                      {module.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
              <Button variant="secondary" onClick={() => { setIsModalOpen(false); setSelectedRole(null); }}>Fermer</Button>
              <Button variant="primary">Modifier le rôle</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Nom du rôle</label>
                <input type="text" placeholder="Ex: Responsable Formation" style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Description</label>
                <input type="text" placeholder="Description du rôle" style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Couleur</label>
                <select style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}>
                  <option value="#6490ff">Bleu</option>
                  <option value="#3ecf8e">Vert</option>
                  <option value="#a78bfa">Violet</option>
                  <option value="#fb923c">Orange</option>
                  <option value="#e05050">Rouge</option>
                  <option value="#c9a84c">Or</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Statut</label>
                <select style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}>
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Permissions</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, maxHeight: 200, overflowY: 'auto', padding: 12, border: `1px solid ${Colors.border}`, borderRadius: 8 }}>
                  {modules.map((module) => (
                    <label key={module.id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <input type="checkbox" defaultChecked={module.id === 'dashboard'} />
                      <span style={{ fontSize: 12, color: Colors.text }}>{module.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
              <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Annuler</Button>
              <Button variant="primary" type="submit">Créer le rôle</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Roles;

