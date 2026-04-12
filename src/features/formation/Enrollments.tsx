// Enrollments Page - Formation & Education Module
// Manage student enrollments in training programs

import React, { useEffect, useState, useMemo } from 'react';
import { Colors, BorderRadius } from '../../constants/theme';
import enrollmentService from '../../services/enrollmentService';

// Backend enrollment response type
interface EnrollmentResponse {
  id: string;
  studentId: string;
  studentName: string;
  studentCode: string;
  programId: string;
  programTitle: string;
  enrollmentDate: string;
  completionDate?: string;
  status: string;
  finalAverage?: number;
  finalLetterGrade?: string;
  passed?: boolean;
  grades: {
    moduleId: string;
    moduleTitle: string;
    score: number;
    maxScore: number;
    letterGrade: string;
    passed: boolean;
  }[];
  createdAt: string;
}

interface EnrollmentFormData {
  studentId: string;
  programId: string;
  enrollmentDate: string;
}

const Enrollments: React.FC = () => {
  const [enrollments, setEnrollments] = useState<EnrollmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ENROLLED' | 'ACTIVE' | 'COMPLETED' | 'DROPPED' | 'SUSPENDED'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState<EnrollmentResponse | null>(null);
  const [formData, setFormData] = useState<EnrollmentFormData>({
    studentId: '',
    programId: '',
    enrollmentDate: new Date().toISOString().split('T')[0],
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadEnrollments();
  }, []);

  const loadEnrollments = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await enrollmentService.getEnrollments();
      setEnrollments(data);
    } catch (err) {
      console.error('Error loading enrollments:', err);
      setError('Erreur lors du chargement des inscriptions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    if (!formData.studentId || !formData.programId) {
      setFormError('L\'etudiant et le programme sont obligatoires');
      return;
    }
    try {
      setSubmitting(true);
      setFormError(null);
      await enrollmentService.enrollStudent({
        studentId: formData.studentId,
        programId: formData.programId,
        enrollmentDate: formData.enrollmentDate,
      });
      setShowCreateModal(false);
      setFormData({ studentId: '', programId: '', enrollmentDate: new Date().toISOString().split('T')[0] });
      await loadEnrollments();
    } catch (err) {
      console.error('Error creating enrollment:', err);
      setFormError('Erreur lors de la creation de l\'inscription');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer cette inscription ?')) return;
    // Note: deleteEnrollment endpoint not yet available in the service
    // TODO: Add delete endpoint to backend and service
    console.warn('Delete enrollment not yet implemented in backend:', id);
    setError('La suppression n\'est pas encore disponible');
  };

  const filteredEnrollments = useMemo(() => {
    return enrollments.filter(e => {
      const matchesSearch =
        e.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.studentCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.programTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [enrollments, searchQuery, statusFilter]);

  const getStatusBadge = (status: string): { bg: string; color: string; text: string } => {
    const badges: Record<string, { bg: string; color: string; text: string }> = {
      'ENROLLED': { bg: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6', text: 'Inscrit' },
      'ACTIVE': { bg: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', text: 'En cours' },
      'COMPLETED': { bg: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', text: 'Termine' },
      'DROPPED': { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', text: 'Abandon' },
      'SUSPENDED': { bg: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', text: 'Suspendu' },
    };
    return badges[status] || badges['ENROLLED'];
  };

  // Styles
  const containerStyle: React.CSSProperties = { padding: 24, background: Colors.bgSecondary, minHeight: '100vh' };
  const headerStyle: React.CSSProperties = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, gap: 16, flexWrap: 'wrap' };
  const titleStyle: React.CSSProperties = { fontSize: 24, fontWeight: 700, color: Colors.text, margin: 0 };
  const subtitleStyle: React.CSSProperties = { fontSize: 14, color: Colors.textMuted, margin: '4px 0 0' };
  const statsStyle: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 };
  const statCardStyle: React.CSSProperties = { background: Colors.bg, padding: 16, borderRadius: BorderRadius.md, border: `1px solid ${Colors.border}`, textAlign: 'center' };
  const statValueStyle: React.CSSProperties = { fontSize: 28, fontWeight: 700, color: Colors.primary, margin: '0 0 4px' };
  const statLabelStyle: React.CSSProperties = { fontSize: 13, color: Colors.textMuted, margin: 0 };
  const filterBarStyle: React.CSSProperties = { display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' };
  const tableContainerStyle: React.CSSProperties = { background: Colors.bg, borderRadius: BorderRadius.md, border: `1px solid ${Colors.border}`, overflow: 'hidden' };
  const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', fontSize: 13 };
  const thStyle: React.CSSProperties = { padding: 16, textAlign: 'left', backgroundColor: Colors.bgSecondary, fontWeight: 600, color: Colors.textMuted, fontSize: 12, borderBottom: `1px solid ${Colors.border}`, textTransform: 'uppercase' };
  const tdStyle: React.CSSProperties = { padding: 16, borderBottom: `1px solid ${Colors.border}`, color: Colors.text };
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
          <h1 style={titleStyle}>Inscriptions</h1>
          <p style={subtitleStyle}>Geerez les inscriptions aux formations</p>
        </div>
        <button
          onClick={() => { setShowCreateModal(true); setFormError(null); setFormData({ studentId: '', programId: '', enrollmentDate: new Date().toISOString().split('T')[0] }); }}
          style={{ padding: '10px 18px', borderRadius: BorderRadius.md, background: Colors.primary, color: 'white', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          + Nouvelle Inscription
        </button>
      </div>

      {/* Stats */}
      <div style={statsStyle}>
        <div style={statCardStyle}>
          <div style={statValueStyle}>{enrollments.length}</div>
          <p style={statLabelStyle}>Total</p>
        </div>
        <div style={statCardStyle}>
          <div style={{ ...statValueStyle, color: '#22c55e' }}>
            {enrollments.filter(e => e.status === 'ACTIVE' || e.status === 'ENROLLED').length}
          </div>
          <p style={statLabelStyle}>En cours</p>
        </div>
        <div style={statCardStyle}>
          <div style={{ ...statValueStyle, color: '#a855f7' }}>
            {enrollments.filter(e => e.status === 'COMPLETED').length}
          </div>
          <p style={statLabelStyle}>Termines</p>
        </div>
        <div style={statCardStyle}>
          <div style={statValueStyle}>
            {enrollments.filter(e => e.passed).length}
          </div>
          <p style={statLabelStyle}>Admis</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={filterBarStyle}>
        <input
          type="text"
          placeholder="Rechercher par nom, code ou programme..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: '10px 14px', borderRadius: BorderRadius.md, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}
        />
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: Colors.textMuted }}>Statut :</span>
          {(['all', 'ENROLLED', 'ACTIVE', 'COMPLETED', 'DROPPED', 'SUSPENDED'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{
                padding: '6px 12px', borderRadius: 6,
                border: statusFilter === status ? 'none' : `1px solid ${Colors.border}`,
                background: statusFilter === status ? Colors.primary : Colors.bg,
                color: statusFilter === status ? 'white' : Colors.text,
                fontSize: 12, fontWeight: 500, cursor: 'pointer',
              }}
            >
              {status === 'all' ? 'Tous' : status === 'ENROLLED' ? 'Inscrits' : status === 'ACTIVE' ? 'En cours' : status === 'COMPLETED' ? 'Termines' : status === 'DROPPED' ? 'Abandons' : 'Suspendus'}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ padding: 12, marginBottom: 24, backgroundColor: 'rgba(220, 38, 38, 0.1)', border: `1px solid ${Colors.danger}`, borderRadius: BorderRadius.md, color: Colors.danger, fontSize: 13 }}>
          {error}
          <button onClick={() => setError(null)} style={{ marginLeft: 12, background: 'none', border: 'none', color: Colors.danger, cursor: 'pointer', fontWeight: 700 }}>x</button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div style={loadingStyle}>Chargement des inscriptions...</div>
      ) : filteredEnrollments.length === 0 ? (
        <div style={emptyStyle}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>Aucune inscription trouvee</div>
        </div>
      ) : (
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Etudiant</th>
                <th style={thStyle}>Programme</th>
                <th style={thStyle}>Inscription</th>
                <th style={thStyle}>Statut</th>
                <th style={thStyle}>Moyenne</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEnrollments.map((enrollment) => {
                const statusBadge = getStatusBadge(enrollment.status);
                return (
                  <tr key={enrollment.id}>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 600, color: Colors.text }}>{enrollment.studentName}</div>
                      <div style={{ fontSize: 11, color: Colors.textMuted, marginTop: 2 }}>{enrollment.studentCode}</div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontWeight: 500, color: Colors.primary }}>{enrollment.programTitle}</span>
                    </td>
                    <td style={tdStyle}>{new Date(enrollment.enrollmentDate).toLocaleDateString('fr-FR')}</td>
                    <td style={tdStyle}>
                      <span style={{ padding: '4px 8px', borderRadius: 4, display: 'inline-block', fontSize: 11, fontWeight: 500, backgroundColor: statusBadge.bg, color: statusBadge.color }}>
                        {statusBadge.text}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {enrollment.finalAverage !== undefined && enrollment.finalAverage !== null ? (
                        <div style={{ fontWeight: 700, color: enrollment.finalAverage >= 10 ? Colors.success : Colors.danger }}>
                          {enrollment.finalAverage}/20 {enrollment.passed && '✓'}
                        </div>
                      ) : (
                        <span style={{ color: Colors.textMuted }}>--</span>
                      )}
                    </td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => setEditingEnrollment(enrollment)}
                        style={{ padding: '6px 12px', marginRight: 6, borderRadius: 4, background: Colors.primaryMuted, color: Colors.primary, border: 'none', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}
                      >
                        Voir
                      </button>
                      <button
                        onClick={() => handleDelete(enrollment.id)}
                        style={{ padding: '6px 12px', borderRadius: 4, background: 'rgba(239, 68, 68, 0.1)', color: Colors.danger, border: 'none', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Enrollment Modal */}
      {showCreateModal && (
        <div style={overlayStyle} onClick={() => setShowCreateModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 20px', fontSize: 18, color: Colors.text }}>Nouvelle Inscription</h2>
            {formError && (
              <div style={{ padding: 10, marginBottom: 16, backgroundColor: 'rgba(220, 38, 38, 0.1)', borderRadius: BorderRadius.md, color: Colors.danger, fontSize: 13 }}>
                {formError}
              </div>
            )}
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>ID Etudiant</label>
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) => setFormData(prev => ({ ...prev, studentId: e.target.value }))}
                placeholder="ex: 1"
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>ID Programme</label>
              <input
                type="text"
                value={formData.programId}
                onChange={(e) => setFormData(prev => ({ ...prev, programId: e.target.value }))}
                placeholder="ex: 1"
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Date d'inscription</label>
              <input
                type="date"
                value={formData.enrollmentDate}
                onChange={(e) => setFormData(prev => ({ ...prev, enrollmentDate: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{ padding: '10px 18px', borderRadius: BorderRadius.md, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
              >
                Annuler
              </button>
              <button
                onClick={handleCreate}
                disabled={submitting}
                style={{ padding: '10px 18px', borderRadius: BorderRadius.md, background: submitting ? Colors.textMuted : Colors.primary, color: 'white', border: 'none', fontSize: 14, fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer' }}
              >
                {submitting ? 'Creation...' : 'Inscrire'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Enrollment Detail Modal */}
      {editingEnrollment && (
        <div style={overlayStyle} onClick={() => setEditingEnrollment(null)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 20px', fontSize: 18, color: Colors.text }}>Detail de l'inscription</h2>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: Colors.textMuted, marginBottom: 4 }}>Etudiant</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: Colors.text }}>{editingEnrollment.studentName} ({editingEnrollment.studentCode})</div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: Colors.textMuted, marginBottom: 4 }}>Programme</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: Colors.primary }}>{editingEnrollment.programTitle}</div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: Colors.textMuted, marginBottom: 4 }}>Date d'inscription</div>
              <div style={{ fontSize: 14, color: Colors.text }}>{new Date(editingEnrollment.enrollmentDate).toLocaleDateString('fr-FR')}</div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: Colors.textMuted, marginBottom: 4 }}>Statut</div>
              <div style={{ fontSize: 14, color: Colors.text }}>{getStatusBadge(editingEnrollment.status).text}</div>
            </div>
            {editingEnrollment.finalAverage !== undefined && editingEnrollment.finalAverage !== null && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 12, color: Colors.textMuted, marginBottom: 4 }}>Moyenne finale</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: editingEnrollment.finalAverage >= 10 ? Colors.success : Colors.danger }}>
                  {editingEnrollment.finalAverage}/20 {editingEnrollment.passed ? '(Admis)' : '(Non admis)'}
                </div>
              </div>
            )}
            {editingEnrollment.grades && editingEnrollment.grades.length > 0 && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${Colors.border}` }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: Colors.text, marginBottom: 8 }}>Notes ({editingEnrollment.grades.length})</div>
                {editingEnrollment.grades.map((g, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13 }}>
                    <span style={{ color: Colors.textMuted }}>{g.moduleTitle}</span>
                    <span style={{ fontWeight: 600, color: g.score >= 10 ? Colors.success : Colors.danger }}>{g.score}/{g.maxScore}</span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
              <button
                onClick={() => setEditingEnrollment(null)}
                style={{ padding: '10px 18px', borderRadius: BorderRadius.md, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Enrollments;
