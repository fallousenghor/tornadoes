// Roles & Access Feature - Tornadoes Job System Module
// Connected to backend API

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, Button, Modal, Toggle } from '../../components/common';
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
  { id: 'dashboard', label: 'Dashboard', icon: '⬡' },
  { id: 'employees', label: 'Employees', icon: '▦' },
  { id: 'departments', label: 'Departments', icon: '◉' },
  { id: 'presence', label: 'Presence', icon: '◎' },
  { id: 'conges', label: 'Leave', icon: '◇' },
  { id: 'performance', label: 'Performance', icon: '▣' },
  { id: 'treasury', label: 'Treasury', icon: '◆' },
  { id: 'invoices', label: 'Invoicing', icon: '⬡' },
  { id: 'accounting', label: 'Accounting', icon: '▦' },
  { id: 'stock', label: 'Stock', icon: '◈' },
  { id: 'projects', label: 'Projects', icon: '▣' },
  { id: 'documents', label: 'Documents', icon: '◎' },
  { id: 'students', label: 'Learners', icon: '◉' },
  { id: 'teachers', label: 'Teachers', icon: '◆' },
  { id: 'schedule', label: 'Schedules', icon: '⬡' },
  { id: 'grades', label: 'Grades', icon: '◇' },
  { id: 'roles', label: 'Roles & Access', icon: '▦' },
  { id: 'audit', label: 'Audit & Logs', icon: '◈' },
];

const permissionActions = ['read', 'create', 'update', 'delete'];

export const Roles: React.FC = () => {
  // State
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions'>('roles');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; description: string; color: string; permissions: string[] }>({
    name: '',
    description: '',
    color: '#6490ff',
    permissions: [],
  });
  const [editActiveModule, setEditActiveModule] = useState<string>('');

  // Fetch roles from API
  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await rolesService.getRoles();

      if (!Array.isArray(data)) {
        console.error('getRoles did not return an array:', data);
        setRoles([]);
        return;
      }

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
      setRoles([]);
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
    const totalUsers = roles.reduce((acc, r) => {
      const count = Number(r.userCount) || 0;
      return acc + count;
    }, 0);

    return {
      totalRoles: roles.length || 0,
      totalUsers: totalUsers || 0,
      adminUsers: roles.find(r => r.name === 'Administrateur')?.userCount || 0,
      customRoles: roles.filter(r => !r.isDefault).length || 0,
    };
  }, [roles]);

  // Check if module has permission
  const hasModulePermission = (role: Role, moduleId: string): boolean => {
    return role.permissions.includes(moduleId);
  };

  // Check if a specific permission is enabled for editing role
  const hasEditPermission = (moduleId: string, action: string): boolean => {
    return editForm.permissions.includes(`${moduleId}_${action}`);
  };

  // Toggle a permission in the edit form
  const toggleEditPermission = (moduleId: string, action: string) => {
    const permKey = `${moduleId}_${action}`;
    setEditForm(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permKey)
        ? prev.permissions.filter(p => p !== permKey)
        : [...prev.permissions, permKey],
    }));
  };

  // Toggle all permissions for a module
  const toggleModulePermission = (moduleId: string) => {
    const allPerms = permissionActions.map(a => `${moduleId}_${a}`);
    const allEnabled = allPerms.every(p => editForm.permissions.includes(p));

    setEditForm(prev => ({
      ...prev,
      permissions: allEnabled
        ? prev.permissions.filter(p => !allPerms.includes(p))
        : [...new Set([...prev.permissions, ...allPerms])],
    }));
  };

  // Check if all module permissions are enabled
  const areAllModulePermsEnabled = (moduleId: string): boolean => {
    return permissionActions.every(a => editForm.permissions.includes(`${moduleId}_${a}`));
  };

  // Check if any module permission is enabled
  const hasAnyModulePerm = (moduleId: string): boolean => {
    return permissionActions.some(a => editForm.permissions.includes(`${moduleId}_${a}`));
  };

  // Export roles to CSV
  const exportRolesToCSV = () => {
    if (roles.length === 0) return;

    const headers = ['ID', 'Nom', 'Description', 'Couleur', 'Utilisateurs', 'Defaut', 'Permissions'];
    const csvRows = [headers.join(',')];

    roles.forEach(role => {
      const row = [
        role.id,
        `"${role.name.replace(/"/g, '""')}"`,
        `"${(role.description || '').replace(/"/g, '""')}"`,
        role.color,
        role.userCount,
        role.isDefault ? 'Oui' : 'Non',
        `"${role.permissions.join('; ')}"`,
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = '\uFEFF' + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `roles_export_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
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

  // Open edit modal
  const openEditModal = (role: Role) => {
    setEditingRole(role);
    setEditForm({
      name: role.name,
      description: role.description,
      color: role.color,
      permissions: [...role.permissions],
    });
    setEditActiveModule(modules[0]?.id || '');
    setIsEditModalOpen(true);
  };

  // Save edited role
  const handleSaveEdit = async () => {
    if (!editingRole) return;

    const result = await rolesService.updateRole(editingRole.id, {
      name: editForm.name,
      description: editForm.description,
      color: editForm.color,
      permissions: editForm.permissions,
    });

    if (result) {
      setIsEditModalOpen(false);
      setEditingRole(null);
      fetchRoles();
    }
  };

  // Get active module info
  const activeModuleInfo = modules.find(m => m.id === editActiveModule);

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: Colors.text, marginBottom: 4 }}>
            Roles & Access
          </h1>
          <p style={{ fontSize: 13, color: Colors.textMuted }}>
            Role management . Permissions . User access
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="secondary" onClick={exportRolesToCSV}>
            Export CSV
          </Button>
          <Button variant="primary" onClick={() => { setSelectedRole(null); setIsModalOpen(true); }}>
            + New Role
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(100, 140, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#6490ff' }}>
              Roles
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Roles
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
              Users
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Users
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
              Admin
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Admins
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
              Custom
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Custom Roles
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
              <button onClick={() => setActiveTab('roles')} style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: activeTab === 'roles' ? 'rgba(100, 140, 255, 0.15)' : 'transparent', color: activeTab === 'roles' ? Colors.accent : Colors.textMuted, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Roles</button>
              <button onClick={() => setActiveTab('permissions')} style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: activeTab === 'permissions' ? 'rgba(100, 140, 255, 0.15)' : 'transparent', color: activeTab === 'permissions' ? Colors.accent : Colors.textMuted, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Permission Matrix</button>
            </div>
          </div>
          {activeTab === 'roles' && (
            <input
              type="text"
              placeholder="Search for a role..."
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
              Loading roles...
            </div>
          ) : filteredRoles.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: 40, textAlign: 'center', color: Colors.textMuted }}>
              No roles found
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
                        <div style={{ fontSize: 11, color: Colors.textMuted }}>{role.userCount} user(s)</div>
                      </div>
                    </div>
                    {role.isDefault && (
                      <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 500, background: 'rgba(100, 140, 255, 0.15)', color: Colors.accent }}>
                        Default
                      </span>
                    )}
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 8 }}>DESCRIPTION</div>
                    <div style={{ fontSize: 12, color: Colors.textLight, lineHeight: 1.5 }}>
                      {role.description || 'No description'}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {role.permissions.slice(0, 4).map(perm => (
                      <span key={perm} style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, background: 'rgba(100, 140, 255, 0.08)', color: Colors.accent }}>
                        {perm}
                      </span>
                    ))}
                    {role.permissions.length > 4 && (
                      <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 10, background: 'rgba(100, 140, 255, 0.08)', color: Colors.textMuted }}>
                        +{role.permissions.length - 4}
                      </span>
                    )}
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
              Loading matrix...
            </div>
          ) : roles.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: Colors.textMuted }}>
              No roles available
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
                            title={hasModulePermission(role, module.id) ? 'Access granted' : 'Access denied'}
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
        title={selectedRole ? selectedRole.name : 'New Role'}
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
                  {selectedRole.userCount} user(s)
                </span>
                {selectedRole.isDefault && (
                  <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 500, background: 'rgba(100, 140, 255, 0.15)', color: Colors.accent }}>
                    Default role
                  </span>
                )}
              </div>
              <div>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>DESCRIPTION</div>
                  <div style={{ fontSize: 13, color: Colors.text }}>{selectedRole.description || 'No description'}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 8 }}>PERMISSIONS ({selectedRole.permissions.length})</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {selectedRole.permissions.map(perm => (
                      <span key={perm} style={{ padding: '3px 10px', borderRadius: 4, fontSize: 11, background: 'rgba(100, 140, 255, 0.08)', color: Colors.accent }}>
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
              <Button variant="secondary" onClick={() => { setIsModalOpen(false); setSelectedRole(null); }}>Close</Button>
              {!selectedRole.isDefault && (
                <Button variant="primary" onClick={() => { setIsModalOpen(false); openEditModal(selectedRole); }}>Edit Role</Button>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateRole}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Role name</label>
                <input name="name" type="text" placeholder="e.g.: Training Manager" style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Description</label>
                <input name="description" type="text" placeholder="Role description" style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Color</label>
                <select name="color" style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}>
                  <option value="#6490ff">Blue</option>
                  <option value="#3ecf8e">Green</option>
                  <option value="#a78bfa">Purple</option>
                  <option value="#fb923c">Orange</option>
                  <option value="#e05050">Red</option>
                  <option value="#c9a84c">Gold</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
              <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button variant="primary" type="submit">Create Role</Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Role Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setEditingRole(null); }}
        title={editingRole ? `Edit: ${editingRole.name}` : 'Edit Role'}
        size="lg"
      >
        {editingRole && (
          <div>
            {/* Basic Info */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Role name</label>
                <input
                  value={editForm.name}
                  onChange={e => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Color</label>
                <select
                  value={editForm.color}
                  onChange={e => setEditForm(prev => ({ ...prev, color: e.target.value }))}
                  style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}
                >
                  <option value="#6490ff">Blue</option>
                  <option value="#3ecf8e">Green</option>
                  <option value="#a78bfa">Purple</option>
                  <option value="#fb923c">Orange</option>
                  <option value="#e05050">Red</option>
                  <option value="#c9a84c">Gold</option>
                </select>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Description</label>
                <input
                  value={editForm.description}
                  onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                  style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}
                />
              </div>
            </div>

            {/* Permissions Editor */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: Colors.text, marginBottom: 12 }}>Permissions</div>

              {/* Module tabs */}
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 16, padding: 4, background: 'rgba(100, 140, 255, 0.04)', borderRadius: 8 }}>
                {modules.map(mod => {
                  const isActive = editActiveModule === mod.id;
                  const hasAny = hasAnyModulePerm(mod.id);
                  return (
                    <button
                      key={mod.id}
                      onClick={() => setEditActiveModule(mod.id)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: 6,
                        border: 'none',
                        background: isActive ? 'rgba(100, 140, 255, 0.15)' : 'transparent',
                        color: isActive ? Colors.accent : (hasAny ? Colors.text : Colors.textMuted),
                        fontSize: 11,
                        fontWeight: isActive ? 600 : 400,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <span style={{ fontSize: 12 }}>{mod.icon}</span>
                      {mod.label}
                      {hasAny && !isActive && (
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: Colors.accent, display: 'inline-block' }} />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Permission toggles for selected module */}
              {activeModuleInfo && (
                <div style={{ padding: 16, background: 'rgba(100, 140, 255, 0.03)', borderRadius: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 18 }}>{activeModuleInfo.icon}</span>
                      <span style={{ fontSize: 14, fontWeight: 600, color: Colors.text }}>{activeModuleInfo.label}</span>
                    </div>
                    <Toggle
                      checked={areAllModulePermsEnabled(activeModuleInfo.id)}
                      onChange={() => toggleModulePermission(activeModuleInfo.id)}
                      label="All permissions"
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                    {permissionActions.map(action => {
                      const enabled = hasEditPermission(activeModuleInfo.id, action);
                      const actionLabels: Record<string, string> = {
                        read: 'Read',
                        create: 'Create',
                        update: 'Update',
                        delete: 'Delete',
                      };
                      const actionIcons: Record<string, string> = {
                        read: '👁️',
                        create: '➕',
                        update: '✏️',
                        delete: '🗑️',
                      };
                      return (
                        <div
                          key={action}
                          onClick={() => toggleEditPermission(activeModuleInfo.id, action)}
                          style={{
                            padding: '12px 14px',
                            borderRadius: 8,
                            border: `1px solid ${enabled ? Colors.accent : Colors.border}`,
                            background: enabled ? 'rgba(100, 140, 255, 0.08)' : Colors.card,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            transition: 'all 0.2s',
                          }}
                        >
                          <div style={{
                            width: 18,
                            height: 18,
                            borderRadius: 4,
                            border: `1.5px solid ${enabled ? Colors.accent : Colors.border}`,
                            background: enabled ? Colors.accent : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}>
                            {enabled && <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>✓</span>}
                          </div>
                          <span style={{ fontSize: 14 }}>{actionIcons[action]}</span>
                          <span style={{ fontSize: 12, fontWeight: 500, color: enabled ? Colors.accent : Colors.textMuted }}>
                            {actionLabels[action]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
              <Button variant="secondary" onClick={() => { setIsEditModalOpen(false); setEditingRole(null); }}>Cancel</Button>
              <Button variant="primary" onClick={handleSaveEdit}>Save Changes</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Roles;
