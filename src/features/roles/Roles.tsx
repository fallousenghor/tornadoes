// Roles & Access Feature - Tornadoes Job System Module
// Connected to backend API

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, Button, Modal } from '../../components/common';
import { Colors } from '../../constants/theme';
import rolesService from '../../services/rolesService';

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

export const Roles: React.FC = () => {
  // State
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions'>('roles');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);

  // Fetch roles from API
  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await rolesService.getRoles();
      setRoles(data.map(role => ({
        id: role.id,
        name: role.name,
        description: role.description,
        color: role.color,
        userCount: role.userCount,
        permissions: role.permissions,
        isDefault: role.isDefault,
      })));
    } catch (error) {
      console.error('Error fetching roles:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  // Filter roles
  const filteredRoles = useMemo(() => {
    if (!searchQuery) return roles;
    return roles.filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [roles, searchQuery]);

  // Get permission matrix
  const getRolePermissions = (role: Role, moduleId: string) => {
    const actions = ['create', 'read', 'update', 'delete'];
    return actions.map(action => ({
      action,
      enabled: role.permissions.includes(`${moduleId}_${action}`) || (role.permissions.includes(moduleId) && action === 'read'),
    }));
  };

  // Summary stats
  const stats = useMemo(() => {
    return {
      totalRoles: roles.length,
      totalUsers: roles.reduce((acc, r) => acc + r.userCount, 0),
      adminUsers: roles.find(r => r.name === 'Administrateur')?.userCount || 0,
      customRoles: roles.filter(r => !r.isDefault).length,
    };
  }, [roles]);

  // Check if module has permission
  const hasModulePermission = (role: Role, moduleId: string): boolean => {
    return role.permissions.includes(moduleId);
  };

  // Handle create role
  const handleCreateRole = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      color: formData.get('color') as string,
      permissions: [],
      isDefault: false,
    };
    
    const result = await rolesService.createRole(data);
    if (result) {
      setIsModalOpen(false);
      fetchRoles();
    }
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
                {isLoading ? '...' : stats.totalRoles}
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
                {isLoading ? '...' : stats.totalUsers}
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
                {isLoading ? '...' : stats.adminUsers}
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
                {isLoading ? '...' : stats.customRoles}
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
          {isLoading ? (
            <div style={{ gridColumn: '1 / -1', padding: 40, textAlign: 'center', color: Colors.textMuted }}>
              Chargement des rôles...
            </div>
          ) : filteredRoles.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: 40, textAlign: 'center', color: Colors.textMuted }}>
              Aucun rôle trouvé
            </div>
          ) : (
            filteredRoles.map((role) => (
              <Card 
                key={role.id} 
                style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => { setSelectedRole(role); setIsModalOpen(true); }}
              >
                <div style={{ padding: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: `${role.color || '#6490ff'}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 20, color: role.color || '#6490ff' }}>👤</span>
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
                      {role.description || 'Aucune description'}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Permissions Matrix View */}
      {activeTab === 'permissions' && (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {isLoading ? (
            <div style={{ padding: 40, textAlign: 'center', color: Colors.textMuted }}>
              Chargement de la matrice...
            </div>
          ) : roles.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: Colors.textMuted }}>
              Aucun rôle disponible
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(100, 140, 255, 0.05)' }}>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', minWidth: 200 }}>Module</th>
                    {roles.map((role) => (
                      <th key={role.id} style={{ padding: '14px 12px', textAlign: 'center', fontSize: 10, fontWeight: 600, color: role.color || '#6490ff', textTransform: 'uppercase', minWidth: 80 }}>
                        {role.name}
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
                      {roles.map((role) => (
                        <td key={`${module.id}-${role.id}`} style={{ padding: '12px', textAlign: 'center' }}>
                          <div 
                            style={{ 
                              width: 20, 
                              height: 20, 
                              borderRadius: 4, 
                              margin: '0 auto',
                              background: hasModulePermission(role, module.id) ? role.color || '#6490ff' : 'rgba(100, 140, 255, 0.1)',
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
          )}
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
                <div style={{ width: 80, height: 80, borderRadius: 16, background: `${selectedRole.color || '#6490ff'}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 36, color: selectedRole.color || '#6490ff' }}>👤</span>
                </div>
                <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: `${selectedRole.color || '#6490ff'}20`, color: selectedRole.color || '#6490ff' }}>
                  {selectedRole.userCount} utilisateur(s)
                </span>
              </div>
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>DESCRIPTION</div>
                    <div style={{ fontSize: 13, color: Colors.text }}>{selectedRole.description || 'Aucune description'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
              <Button variant="secondary" onClick={() => { setIsModalOpen(false); setSelectedRole(null); }}>Fermer</Button>
              <Button variant="primary">Modifier le rôle</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateRole}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Nom du rôle</label>
                <input name="name" type="text" placeholder="Ex: Responsable Formation" style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Description</label>
                <input name="description" type="text" placeholder="Description du rôle" style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Couleur</label>
                <select name="color" style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}>
                  <option value="#6490ff">Bleu</option>
                  <option value="#3ecf8e">Vert</option>
                  <option value="#a78bfa">Violet</option>
                  <option value="#fb923c">Orange</option>
                  <option value="#e05050">Rouge</option>
                  <option value="#c9a84c">Or</option>
                </select>
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

