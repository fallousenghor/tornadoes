// Programs Page - Formation Module
// Training programs management with grid display

import React, { useEffect, useState, useMemo } from 'react';
import { Colors, BorderRadius } from '../../constants/theme';
import programService from '../../services/programService';
import type { Program } from '../../types';

interface ProgramFormData {
  title: string;
  description: string;
  level: string;
  durationWeeks: string;
  maxStudents: string;
  passingScore: string;
}

const Programs: React.FC = () => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [viewingProgram, setViewingProgram] = useState<Program | null>(null);
  const [formData, setFormData] = useState<ProgramFormData>({
    title: '',
    description: '',
    level: 'BEGINNER',
    durationWeeks: '',
    maxStudents: '',
    passingScore: '10',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await programService.getPrograms({ page: 0, pageSize: 100 });
      setPrograms(result.data);
    } catch (err) {
      console.error('Erreur chargement programmes:', err);
      setError('Erreur lors du chargement des programmes');
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProgram = async () => {
    const durationWeeks = parseInt(formData.durationWeeks, 10);
    const maxStudents = formData.maxStudents ? parseInt(formData.maxStudents, 10) : undefined;
    const passingScore = parseFloat(formData.passingScore);

    if (!formData.title.trim()) {
      setFormError('Le titre du programme est obligatoire');
      return;
    }
    if (isNaN(durationWeeks) || durationWeeks <= 0) {
      setFormError('La durée doit être un nombre positif');
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        level: formData.level,
        durationWeeks,
        maxStudents,
        passingScore: isNaN(passingScore) ? 10 : passingScore,
      };

      if (editingProgram) {
        await programService.updateProgram(editingProgram.id, payload);
      } else {
        await programService.createProgram(payload);
      }

      setShowCreateModal(false);
      setEditingProgram(null);
      setFormData({ title: '', description: '', level: 'BEGINNER', durationWeeks: '', maxStudents: '', passingScore: '10' });
      await loadPrograms();
    } catch (err) {
      console.error('Error saving program:', err);
      setFormError('Erreur lors de l\'enregistrement du programme');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer ce programme ?')) return;
    // Note: deleteProgram endpoint not yet available in the service
    // TODO: Add delete endpoint to backend and service
    console.warn('Delete program not yet implemented in backend:', id);
    setError('La suppression n\'est pas encore disponible');
  };

  const openCreateModal = () => {
    setEditingProgram(null);
    setFormData({ title: '', description: '', level: 'BEGINNER', durationWeeks: '', maxStudents: '', passingScore: '10' });
    setFormError(null);
    setShowCreateModal(true);
  };

  const openEditModal = (program: Program) => {
    setEditingProgram(program);
    setFormData({
      title: program.name,
      description: program.description || '',
      level: 'BEGINNER',
      durationWeeks: program.duration.toString(),
      maxStudents: '',
      passingScore: '10',
    });
    setFormError(null);
    setShowCreateModal(true);
  };

  const openViewModal = (program: Program) => {
    setViewingProgram(program);
  };

  const filteredPrograms = useMemo(() => {
    return programs.filter(program => {
      const matchesSearch = program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (program.description || '').toLowerCase().includes(searchQuery.toLowerCase());
      // Since Program type doesn't have 'active' field, treat all as active for now
      const matchesStatus = statusFilter === 'all';
      return matchesSearch && matchesStatus;
    });
  }, [programs, searchQuery, statusFilter]);

  // Styles
  const containerStyle: React.CSSProperties = { padding: 24, background: Colors.bgSecondary, minHeight: '100vh' };
  const headerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, gap: 16, flexWrap: 'wrap' };
  const titleStyle: React.CSSProperties = { fontSize: 24, fontWeight: 700, color: Colors.text, margin: 0 };
  const subtitleStyle: React.CSSProperties = { fontSize: 14, color: Colors.textMuted, margin: '4px 0 0' };
  const statsContainerStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 };
  const statCardStyle: React.CSSProperties = { background: Colors.bg, padding: 16, borderRadius: BorderRadius.md, border: `1px solid ${Colors.border}`, textAlign: 'center' };
  const statValueStyle: React.CSSProperties = { fontSize: 28, fontWeight: 700, color: Colors.primary, margin: '0 0 4px' };
  const statLabelStyle: React.CSSProperties = { fontSize: 13, color: Colors.textMuted, margin: 0 };
  const filterBarStyle: React.CSSProperties = { display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' };
  const gridStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 };
  const cardStyle: React.CSSProperties = { background: Colors.bg, border: `1px solid ${Colors.border}`, borderRadius: BorderRadius.md, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.2s ease', cursor: 'pointer' };
  const cardHeaderStyle: React.CSSProperties = { padding: 16, borderBottom: `1px solid ${Colors.border}`, background: Colors.bgSecondary, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 };
  const cardTitleStyle: React.CSSProperties = { fontSize: 16, fontWeight: 600, color: Colors.text, margin: 0 };
  const cardBodyStyle: React.CSSProperties = { padding: 16, flex: 1 };
  const infoRowStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8, gap: 8 };
  const infoLabelStyle: React.CSSProperties = { color: Colors.textMuted, fontWeight: 500 };
  const infoValueStyle: React.CSSProperties = { color: Colors.text, fontWeight: 600 };
  const cardFooterStyle: React.CSSProperties = { padding: 16, borderTop: `1px solid ${Colors.border}`, background: Colors.bgSecondary, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 };
  const statsTextStyle: React.CSSProperties = { display: 'flex', gap: 12, fontSize: 12, color: Colors.textMuted };
  const actionsStyle: React.CSSProperties = { display: 'flex', gap: 8 };
  const buttonStyle: React.CSSProperties = { padding: '6px 12px', background: Colors.primaryMuted, color: Colors.primary, border: 'none', borderRadius: 4, fontSize: 12, fontWeight: 500, cursor: 'pointer' };
  const emptyStyle: React.CSSProperties = { padding: 48, textAlign: 'center', color: Colors.textMuted };
  const loadingStyle: React.CSSProperties = { padding: 48, textAlign: 'center', color: Colors.textMuted };
  const overlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
  const modalStyle: React.CSSProperties = { background: Colors.bg, borderRadius: BorderRadius.md, padding: 24, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: BorderRadius.md, border: `1px solid ${Colors.border}`, background: Colors.bgSecondary, color: Colors.text, fontSize: 13, boxSizing: 'border-box' as const };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: Colors.text, marginBottom: 6 };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Programmes de Formation</h1>
          <p style={subtitleStyle}>Geerez les programmes et cursus de formation</p>
        </div>
        <button
          onClick={openCreateModal}
          style={{ padding: '10px 18px', borderRadius: BorderRadius.md, background: Colors.primary, color: 'white', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          + Nouveau Programme
        </button>
      </div>

      {/* Stats */}
      <div style={statsContainerStyle}>
        <div style={statCardStyle}>
          <div style={statValueStyle}>{programs.length}</div>
          <p style={statLabelStyle}>Total</p>
        </div>
        <div style={statCardStyle}>
          <div style={statValueStyle}>{programs.length}</div>
          <p style={statLabelStyle}>Actifs</p>
        </div>
        <div style={statCardStyle}>
          <div style={statValueStyle}>
            {programs.length > 0 ? Math.round(programs.reduce((sum, p) => sum + (p.studentsCount || 0), 0) / programs.length) : 0}
          </div>
          <p style={statLabelStyle}>Etudiants moy.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={filterBarStyle}>
        <input
          type="text"
          placeholder="Rechercher un programme..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: '10px 14px', borderRadius: BorderRadius.md, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}
        />
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ padding: 12, marginBottom: 24, backgroundColor: 'rgba(220, 38, 38, 0.1)', border: `1px solid ${Colors.danger}`, borderRadius: BorderRadius.md, color: Colors.danger, fontSize: 13 }}>
          {error}
          <button onClick={() => setError(null)} style={{ marginLeft: 12, background: 'none', border: 'none', color: Colors.danger, cursor: 'pointer', fontWeight: 700 }}>x</button>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div style={loadingStyle}>Chargement des programmes...</div>
      ) : filteredPrograms.length === 0 ? (
        <div style={emptyStyle}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>Aucun programme trouve</div>
        </div>
      ) : (
        <div style={gridStyle}>
          {filteredPrograms.map((program) => (
            <div
              key={program.id}
              style={{
                ...cardStyle,
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              <div style={cardHeaderStyle}>
                <div style={{ flex: 1 }}>
                  <h3 style={cardTitleStyle}>{program.name}</h3>
                  <p style={{ fontSize: 12, color: Colors.textMuted, margin: '4px 0 0' }}>
                    {program.description ? program.description.slice(0, 80) + (program.description.length > 80 ? '...' : '') : 'Aucune description'}
                  </p>
                </div>
              </div>

              <div style={cardBodyStyle}>
                <div style={infoRowStyle}>
                  <span style={infoLabelStyle}>Duree</span>
                  <span style={infoValueStyle}>{program.duration} heures</span>
                </div>
                <div style={infoRowStyle}>
                  <span style={infoLabelStyle}>Prix</span>
                  <span style={infoValueStyle}>
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(program.price)}
                  </span>
                </div>
                {program.modules && program.modules.length > 0 && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${Colors.border}` }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: Colors.textMuted, marginBottom: 8, textTransform: 'uppercase' }}>
                      Modules ({program.modules.length})
                    </div>
                    {program.modules.slice(0, 3).map((mod, idx) => (
                      <div key={idx} style={{ fontSize: 12, color: Colors.text, marginBottom: 4, paddingLeft: 12 }}>
                        - {mod.name}
                      </div>
                    ))}
                    {program.modules.length > 3 && (
                      <div style={{ fontSize: 12, color: Colors.textMuted, fontStyle: 'italic', paddingLeft: 12 }}>
                        + {program.modules.length - 3} autre(s)
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div style={cardFooterStyle}>
                <div style={statsTextStyle}>
                  <span>{program.studentsCount || 0} etudiants</span>
                  <span>{program.activeStudents || 0} actifs</span>
                </div>
                <div style={actionsStyle}>
                  <button
                    onClick={() => openViewModal(program)}
                    style={buttonStyle}
                  >
                    Voir
                  </button>
                  <button
                    onClick={() => openEditModal(program)}
                    style={{ ...buttonStyle, background: 'rgba(251, 146, 60, 0.1)', color: Colors.warning }}
                  >
                    Editer
                  </button>
                  <button
                    onClick={() => handleDelete(program.id)}
                    style={{ ...buttonStyle, background: 'rgba(239, 68, 68, 0.1)', color: Colors.danger }}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Program Modal */}
      {showCreateModal && (
        <div style={overlayStyle} onClick={() => { setShowCreateModal(false); setEditingProgram(null); }}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 20px', fontSize: 18, color: Colors.text }}>
              {editingProgram ? 'Modifier le Programme' : 'Nouveau Programme'}
            </h2>
            {formError && (
              <div style={{ padding: 10, marginBottom: 16, backgroundColor: 'rgba(220, 38, 38, 0.1)', borderRadius: BorderRadius.md, color: Colors.danger, fontSize: 13 }}>
                {formError}
              </div>
            )}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Titre du programme *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="ex: Développement Full Stack"
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Description du programme..."
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' as const, fontFamily: 'inherit' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={labelStyle}>Niveau *</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                  style={inputStyle}
                >
                  <option value="BEGINNER">Débutant</option>
                  <option value="INTERMEDIATE">Intermédiaire</option>
                  <option value="ADVANCED">Avancé</option>
                  <option value="PROFESSIONAL">Professionnel</option>
                  <option value="CERTIFICATION">Certification</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Durée (semaines) *</label>
                <input
                  type="number"
                  value={formData.durationWeeks}
                  onChange={(e) => setFormData(prev => ({ ...prev, durationWeeks: e.target.value }))}
                  placeholder="ex: 12"
                  min="1"
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={labelStyle}>Nb max. étudiants</label>
                <input
                  type="number"
                  value={formData.maxStudents}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxStudents: e.target.value }))}
                  placeholder="ex: 30"
                  min="1"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Score de passage (/20)</label>
                <input
                  type="number"
                  value={formData.passingScore}
                  onChange={(e) => setFormData(prev => ({ ...prev, passingScore: e.target.value }))}
                  placeholder="10"
                  min="0"
                  max="20"
                  step="0.5"
                  style={inputStyle}
                />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setShowCreateModal(false); setEditingProgram(null); }}
                style={{ padding: '10px 18px', borderRadius: BorderRadius.md, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
              >
                Annuler
              </button>
              <button
                onClick={handleSaveProgram}
                disabled={submitting}
                style={{ padding: '10px 18px', borderRadius: BorderRadius.md, background: submitting ? Colors.textMuted : Colors.primary, color: 'white', border: 'none', fontSize: 14, fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer' }}
              >
                {submitting ? 'Enregistrement...' : (editingProgram ? 'Modifier' : 'Creer')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Program Detail Modal */}
      {viewingProgram && (
        <div style={overlayStyle} onClick={() => setViewingProgram(null)}>
          <div style={{ ...modalStyle, maxWidth: 560 }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 20px', fontSize: 18, color: Colors.text }}>{viewingProgram.name}</h2>
            {viewingProgram.description && (
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, color: Colors.textMuted, marginBottom: 4 }}>Description</div>
                <div style={{ fontSize: 14, color: Colors.text, lineHeight: 1.5 }}>{viewingProgram.description}</div>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 12, color: Colors.textMuted, marginBottom: 4 }}>Duree</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: Colors.text }}>{viewingProgram.duration} heures</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: Colors.textMuted, marginBottom: 4 }}>Prix</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: Colors.text }}>
                  {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(viewingProgram.price)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: Colors.textMuted, marginBottom: 4 }}>Etudiants inscrits</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: Colors.text }}>{viewingProgram.studentsCount || 0}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: Colors.textMuted, marginBottom: 4 }}>Etudiants actifs</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: Colors.text }}>{viewingProgram.activeStudents || 0}</div>
              </div>
              <div>
                <div style={{ fontSize: 12, color: Colors.textMuted, marginBottom: 4 }}>Taux de completion</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: Colors.text }}>{viewingProgram.completionRate || 0}%</div>
              </div>
            </div>
            {viewingProgram.modules && viewingProgram.modules.length > 0 && (
              <div style={{ paddingTop: 16, borderTop: `1px solid ${Colors.border}` }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: Colors.text, marginBottom: 8 }}>
                  Modules ({viewingProgram.modules.length})
                </div>
                {viewingProgram.modules.map((mod, idx) => (
                  <div key={mod.id || idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: `1px solid ${Colors.border}`, fontSize: 13 }}>
                    <div>
                      <div style={{ fontWeight: 500, color: Colors.text }}>{mod.name}</div>
                      {mod.teacherId && <div style={{ fontSize: 11, color: Colors.textMuted }}>Prof ID: {mod.teacherId}</div>}
                    </div>
                    <div style={{ fontWeight: 600, color: Colors.textMuted }}>{mod.duration}h</div>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
              <button
                onClick={() => setViewingProgram(null)}
                style={{ padding: '10px 18px', borderRadius: BorderRadius.md, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
              >
                Fermer
              </button>
              <button
                onClick={() => { setViewingProgram(null); openEditModal(viewingProgram); }}
                style={{ padding: '10px 18px', borderRadius: BorderRadius.md, background: Colors.primary, color: 'white', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
              >
                Modifier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Programs;
