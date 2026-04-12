// Teachers Page - Formation & Education Module
// Management of trainers and instructors - Full API integration

import React, { useState, useEffect, useMemo } from 'react';
import { Colors, BorderRadius } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import teacherService from '../../services/teacherService';
import TeacherForm, { TeacherFormData } from './teachers/components/TeacherForm';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import type { Teacher } from '../../types';

const Teachers: React.FC = () => {
  const { colors } = useTheme();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState<string>('all');
  
  // Modal states
  const [formOpen, setFormOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; teacher: Teacher | null }>({ open: false, teacher: null });

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const result = await teacherService.getTeachers({ page: 0, pageSize: 200 });
      setTeachers(result.data);
    } catch (error) {
      console.error('Error loading teachers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (data: TeacherFormData) => {
    try {
      await teacherService.createTeacher({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        specialization: data.specialties[0] || '',
      });
      await loadTeachers();
    } catch (error) {
      console.error('Error creating teacher:', error);
    }
  };

  const handleEdit = async (data: TeacherFormData) => {
    if (!editingTeacher) return;
    try {
      await teacherService.updateTeacher(editingTeacher.id, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        specialization: data.specialties[0] || '',
      });
      await loadTeachers();
      setEditingTeacher(null);
    } catch (error) {
      console.error('Error updating teacher:', error);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.teacher) return;
    try {
      // TODO: Add delete endpoint to backend when ready
      // await teacherService.deleteTeacher(deleteModal.teacher.id);
      setTeachers(prev => prev.filter(t => t.id !== deleteModal.teacher?.id));
    } catch (error) {
      console.error('Error deleting teacher:', error);
    } finally {
      setDeleteModal({ open: false, teacher: null });
    }
  };

  const filteredTeachers = useMemo(() => {
    return teachers.filter(teacher => {
      const fullName = `${teacher.firstName} ${teacher.lastName}`.toLowerCase();
      const spec = (teacher.specialties?.[0] || '').toLowerCase();
      const matchesSearch = fullName.includes(searchQuery.toLowerCase()) || 
                           teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           spec.includes(searchQuery.toLowerCase());
      const matchesSpec = specializationFilter === 'all' || 
                         teacher.specialties?.includes(specializationFilter);
      return matchesSearch && matchesSpec;
    });
  }, [teachers, searchQuery, specializationFilter]);

  const specializations = Array.from(new Set(teachers.flatMap(t => t.specialties || [])));

  // Styles
  const containerStyle: React.CSSProperties = { padding: 24, background: colors.bg, minHeight: '100vh' };
  const headerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, gap: 16, flexWrap: 'wrap' };
  const titleStyle: React.CSSProperties = { fontSize: 24, fontWeight: 700, color: colors.text, margin: 0 };
  const subtitleStyle: React.CSSProperties = { fontSize: 14, color: colors.textMuted, margin: '4px 0 0' };
  const statsStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 };
  const statCardStyle: React.CSSProperties = { background: colors.bg, padding: 16, borderRadius: BorderRadius.md, border: `1px solid ${colors.border}`, textAlign: 'center' };
  const statValueStyle: React.CSSProperties = { fontSize: 28, fontWeight: 700, color: colors.primary, margin: '0 0 4px' };
  const statLabelStyle: React.CSSProperties = { fontSize: 13, color: colors.textMuted, margin: 0 };
  const filterBarStyle: React.CSSProperties = { display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' };
  const gridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 };
  const cardStyle: React.CSSProperties = { background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: BorderRadius.md, padding: 20, display: 'flex', flexDirection: 'column', gap: 16 };
  const avatarStyle: React.CSSProperties = { width: 60, height: 60, borderRadius: '50%', background: colors.primaryMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 };
  const nameStyle: React.CSSProperties = { fontSize: 16, fontWeight: 700, color: colors.text };
  const infoRowStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', fontSize: 12, color: colors.textMuted };
  const infoLabelStyle: React.CSSProperties = { fontWeight: 500 };
  const infoValueStyle: React.CSSProperties = { fontWeight: 600, color: colors.text };
  const emptyStyle: React.CSSProperties = { padding: 48, textAlign: 'center', color: colors.textMuted };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>👨‍🏫 Formateurs</h1>
          <p style={subtitleStyle}>Gérez les instructeurs et formateurs</p>
        </div>
        <button onClick={() => { setEditingTeacher(null); setFormOpen(true); }} style={{
          padding: '10px 18px', borderRadius: BorderRadius.md, background: colors.primary, color: 'white',
          border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer',
        }}>
          ➕ Nouveau Formateur
        </button>
      </div>

      {/* Stats */}
      <div style={statsStyle}>
        <div style={statCardStyle}>
          <div style={statValueStyle}>{teachers.length}</div>
          <p style={statLabelStyle}>Total</p>
        </div>
        <div style={statCardStyle}>
          <div style={statValueStyle}>{specializations.length}</div>
          <p style={statLabelStyle}>Spécialités</p>
        </div>
        <div style={statCardStyle}>
          <div style={statValueStyle}>{teachers.filter(t => t.email).length}</div>
          <p style={statLabelStyle}>Actifs</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={filterBarStyle}>
        <input type="text" placeholder="Rechercher par nom ou spécialité..." value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: '10px 14px', borderRadius: BorderRadius.md,
            border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text, fontSize: 13,
          }}
        />
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: colors.textMuted }}>Spécialité :</span>
          <select value={specializationFilter} onChange={(e) => setSpecializationFilter(e.target.value)}
            style={{ padding: '6px 12px', borderRadius: 6, border: `1px solid ${Colors.border}`,
              background: Colors.bg, color: Colors.text, fontSize: 12, fontWeight: 500, cursor: 'pointer',
            }}
          >
            <option value="all">Tous</option>
            {specializations.map(spec => (<option key={spec} value={spec}>{spec}</option>))}
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: Colors.textMuted }}>⏳ Chargement...</div>
      ) : filteredTeachers.length === 0 ? (
        <div style={emptyStyle}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
          <p>Aucun formateur trouvé</p>
        </div>
      ) : (
        <div style={gridStyle}>
          {filteredTeachers.map((teacher) => (
            <div key={teacher.id} style={{
              ...cardStyle, boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              transition: 'all 0.2s ease',
            }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={avatarStyle}>👨‍🏫</div>
                <div style={{ flex: 1 }}>
                  <div style={nameStyle}>{teacher.firstName} {teacher.lastName}</div>
                  <div style={{ fontSize: 12, color: Colors.primary, fontWeight: 500, marginTop: 2 }}>
                    {teacher.specialties?.[0] || 'Non assigné'}
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={infoRowStyle}>
                  <span style={infoLabelStyle}>📧 Email</span>
                  <span style={infoValueStyle}>{teacher.email}</span>
                </div>
                <div style={infoRowStyle}>
                  <span style={infoLabelStyle}>📱 Téléphone</span>
                  <span style={infoValueStyle}>{teacher.phone || '—'}</span>
                </div>
              </div>

              {/* Actions */}
              <div style={{ paddingTop: 12, borderTop: `1px solid ${Colors.border}`, display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <button onClick={() => { setEditingTeacher(teacher); setFormOpen(true); }} style={{
                  flex: 1, padding: '6px 12px', borderRadius: 4, background: Colors.primaryMuted,
                  color: Colors.primary, border: 'none', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                }}>✏️ Modifier</button>
                <button onClick={() => setDeleteModal({ open: true, teacher })} style={{
                  flex: 1, padding: '6px 12px', borderRadius: 4, background: Colors.dangerMuted || '#fee2e2',
                  color: Colors.danger || '#dc2626', border: 'none', fontSize: 12, fontWeight: 500, cursor: 'pointer',
                }}>🗑️ Supprimer</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Teacher Form Modal */}
      <TeacherForm
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditingTeacher(null); }}
        onSubmit={editingTeacher ? handleEdit : handleCreate}
        teacher={editingTeacher}
      />

      {/* Delete Confirmation */}
      <DeleteConfirmModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, teacher: null })}
        onConfirm={handleDelete}
        title="Supprimer le formateur"
        message={`Êtes-vous sûr de vouloir supprimer ${deleteModal.teacher ? `${deleteModal.teacher.firstName} ${deleteModal.teacher.lastName}` : ''} ?`}
      />
    </div>
  );
};

export default Teachers;
