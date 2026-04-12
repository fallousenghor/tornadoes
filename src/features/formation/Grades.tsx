// Grades & Evaluations Page - Formation & Education Module
// Student performance tracking and grade management

import React, { useEffect, useState, useMemo } from 'react';
import { Colors, BorderRadius } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { getGradeColor } from '../../utils/colorMapper';
import gradeService from '../../services/gradeService';

interface GradeDisplay {
  id: string;
  studentId: string;
  studentName: string;
  moduleId: string;
  moduleName: string;
  programId: string;
  programName: string;
  value: number;
  type: 'exam' | 'quiz' | 'project' | 'participation';
  date: string;
}

interface GradeFormData {
  studentId: string;
  moduleId: string;
  value: string;
  type: 'exam' | 'quiz' | 'project' | 'participation';
}

const Grades: React.FC = () => {
  const { colors } = useTheme();
  const [grades, setGrades] = useState<GradeDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'passed' | 'failed'>('all');
  const [sortBy, setSortBy] = useState<'grade' | 'name' | 'date'>('grade');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGrade, setEditingGrade] = useState<GradeDisplay | null>(null);
  const [formData, setFormData] = useState<GradeFormData>({
    studentId: '',
    moduleId: '',
    value: '',
    type: 'exam',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadGrades();
  }, []);

  const loadGrades = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await gradeService.getGrades({ page: 0, size: 200 });

      // Map backend data to display format
      const mapped: GradeDisplay[] = data.map((g: any) => ({
        id: g.id,
        studentId: g.studentId,
        studentName: g.studentName || g.studentId,
        moduleId: g.moduleId,
        moduleName: g.moduleName || g.moduleId,
        programId: g.programId,
        programName: g.programName || g.programId,
        value: g.value,
        type: g.type || 'exam',
        date: g.date,
      }));

      setGrades(mapped);
    } catch (err) {
      console.error('Error loading grades:', err);
      setError('Erreur lors du chargement des notes');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveGrade = async () => {
    const score = parseFloat(formData.value);
    if (!formData.studentId || !formData.moduleId || isNaN(score)) {
      setFormError('Tous les champs sont obligatoires et la note doit etre un nombre');
      return;
    }
    if (score < 0 || score > 20) {
      setFormError('La note doit etre entre 0 et 20');
      return;
    }
    try {
      setSubmitting(true);
      setFormError(null);

      if (editingGrade) {
        // For edit: delete old and create new (API doesn't have update)
        await gradeService.deleteGrade(editingGrade.id);
      }

      const result = await gradeService.saveGrade({
        studentId: formData.studentId,
        moduleId: formData.moduleId,
        value: score,
        type: formData.type,
      });

      if (result) {
        setShowCreateModal(false);
        setEditingGrade(null);
        setFormData({ studentId: '', moduleId: '', value: '', type: 'exam' });
        await loadGrades();
      } else {
        setFormError('Erreur lors de l\'enregistrement de la note');
      }
    } catch (err) {
      console.error('Error saving grade:', err);
      setFormError('Erreur lors de l\'enregistrement de la note');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Supprimer cette note ?')) return;
    try {
      await gradeService.deleteGrade(id);
      await loadGrades();
    } catch (err) {
      console.error('Error deleting grade:', err);
      setError('Erreur lors de la suppression de la note');
    }
  };

  const openEditModal = (grade: GradeDisplay) => {
    setEditingGrade(grade);
    setFormData({
      studentId: grade.studentId,
      moduleId: grade.moduleId,
      value: grade.value.toString(),
      type: grade.type,
    });
    setFormError(null);
    setShowCreateModal(true);
  };

  const openCreateModal = () => {
    setEditingGrade(null);
    setFormData({ studentId: '', moduleId: '', value: '', type: 'exam' });
    setFormError(null);
    setShowCreateModal(true);
  };

  const filteredGrades = useMemo(() => {
    let filtered = grades.filter(grade => {
      const matchesSearch =
        grade.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grade.moduleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grade.moduleId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        grade.programName.toLowerCase().includes(searchQuery.toLowerCase());

      const isPassed = grade.value >= 10;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'passed' && isPassed) ||
        (statusFilter === 'failed' && !isPassed);

      return matchesSearch && matchesStatus;
    });

    if (sortBy === 'grade') {
      filtered.sort((a, b) => b.value - a.value);
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.studentName.localeCompare(b.studentName));
    } else if (sortBy === 'date') {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return filtered;
  }, [grades, searchQuery, statusFilter, sortBy]);

  const stats = useMemo(() => {
    const passed = grades.filter(g => g.value >= 10).length;
    const failed = grades.filter(g => g.value < 10).length;
    const avgGrade = grades.length > 0
      ? (grades.reduce((sum, g) => sum + g.value, 0) / grades.length).toFixed(2)
      : '0';
    return { passed, failed, avgGrade };
  }, [grades]);

  const getStatusBadgeStyle = (value: number) => {
    return value >= 10 
      ? { 
          bg: colors.successMuted, 
          color: colors.success, 
          text: 'Reussi', 
          icon: 'OK' 
        }
      : { 
          bg: colors.dangerMuted, 
          color: colors.danger, 
          text: 'Echoue', 
          icon: 'X' 
        };
  };

  const getGradeColorStyle = (grade: number) => {
    return getGradeColor(grade, colors).color;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      exam: 'Examen',
      quiz: 'Quiz',
      project: 'Projet',
      participation: 'Participation',
    };
    return labels[type] || type;
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
  const filterBarStyle: React.CSSProperties = { display: 'flex', gap: 12, marginBottom: 24, alignItems: 'center', flexWrap: 'wrap' };
  const tableStyle: React.CSSProperties = { width: '100%', borderCollapse: 'collapse', background: Colors.bg, borderRadius: BorderRadius.md, border: `1px solid ${Colors.border}`, overflow: 'hidden' };
  const thStyle: React.CSSProperties = { padding: 14, background: Colors.bgSecondary, borderBottom: `1px solid ${Colors.border}`, textAlign: 'left', fontSize: 12, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' };
  const tdStyle: React.CSSProperties = { padding: 14, borderBottom: `1px solid ${Colors.border}`, fontSize: 13, color: Colors.text };
  const emptyStyle: React.CSSProperties = { padding: 48, textAlign: 'center', color: Colors.textMuted, background: Colors.bg, borderRadius: BorderRadius.md };
  const overlayStyle: React.CSSProperties = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
  const modalStyle: React.CSSProperties = { background: Colors.bg, borderRadius: BorderRadius.md, padding: 24, width: '100%', maxWidth: 480, maxHeight: '90vh', overflowY: 'auto' };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 14px', borderRadius: BorderRadius.md, border: `1px solid ${Colors.border}`, background: Colors.bgSecondary, color: Colors.text, fontSize: 13, boxSizing: 'border-box' as const };
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 600, color: Colors.text, marginBottom: 6 };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Notes & Evaluations</h1>
          <p style={subtitleStyle}>Suivi des performances et des resultats</p>
        </div>
        <button
          onClick={openCreateModal}
          style={{ padding: '10px 18px', borderRadius: BorderRadius.md, background: Colors.primary, color: 'white', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          + Ajouter une Note
        </button>
      </div>

      {/* Stats */}
      <div style={statsStyle}>
        <div style={statCardStyle}>
          <div style={statValueStyle}>{grades.length}</div>
          <p style={statLabelStyle}>Total Evaluations</p>
        </div>
        <div style={statCardStyle}>
          <div style={{ ...statValueStyle, color: '#16A34A' }}>{stats.passed}</div>
          <p style={statLabelStyle}>Reussis</p>
        </div>
        <div style={statCardStyle}>
          <div style={{ ...statValueStyle, color: '#DC2626' }}>{stats.failed}</div>
          <p style={statLabelStyle}>Echoues</p>
        </div>
        <div style={statCardStyle}>
          <div style={statValueStyle}>{stats.avgGrade}</div>
          <p style={statLabelStyle}>Moyenne Generale</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={filterBarStyle}>
        <input
          type="text"
          placeholder="Rechercher par etudiant, module ou code..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, minWidth: 250, padding: '10px 14px', borderRadius: BorderRadius.md, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}
        />
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: Colors.textMuted }}>Statut :</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            style={{ padding: '6px 12px', borderRadius: 6, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}
          >
            <option value="all">Tous</option>
            <option value="passed">Reussis</option>
            <option value="failed">Echoues</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: Colors.textMuted }}>Trier :</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{ padding: '6px 12px', borderRadius: 6, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 12, fontWeight: 500, cursor: 'pointer' }}
          >
            <option value="grade">Par note</option>
            <option value="name">Par nom</option>
            <option value="date">Par date</option>
          </select>
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
        <div style={{ textAlign: 'center', padding: 48, color: Colors.textMuted }}>Chargement...</div>
      ) : filteredGrades.length === 0 ? (
        <div style={emptyStyle}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>Aucune note trouvee</div>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Etudiant</th>
                <th style={thStyle}>Programme</th>
                <th style={thStyle}>Module</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Note</th>
                <th style={thStyle}>Statut</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredGrades.map((grade) => {
                const statusBadge = getStatusBadgeStyle(grade.value);
                return (
                  <tr key={grade.id} style={{ transition: 'background 0.2s' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = colors.bgSecondary; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 500, color: colors.text }}>{grade.studentName}</div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontSize: 12, color: colors.textMuted }}>{grade.programName}</div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 500 }}>{grade.moduleId}</div>
                      <div style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>{grade.moduleName}</div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: 11, color: colors.textMuted }}>{getTypeLabel(grade.type)}</span>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: getGradeColorStyle(grade.value) }}>
                        {grade.value}/20
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'inline-block', padding: '4px 10px', background: statusBadge.bg, color: statusBadge.color, borderRadius: 12, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {statusBadge.icon} {statusBadge.text}
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ fontSize: 12, color: Colors.textMuted }}>
                        {new Date(grade.date).toLocaleDateString('fr-FR')}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => openEditModal(grade)}
                        style={{ padding: '4px 10px', marginRight: 6, borderRadius: 4, background: Colors.primaryMuted, color: Colors.primary, border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                      >
                        Editer
                      </button>
                      <button
                        onClick={() => handleDelete(grade.id)}
                        style={{ padding: '4px 10px', borderRadius: 4, background: '#FEF2F2', color: '#DC2626', border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
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

      {/* Create/Edit Grade Modal */}
      {showCreateModal && (
        <div style={overlayStyle} onClick={() => { setShowCreateModal(false); setEditingGrade(null); }}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 20px', fontSize: 18, color: Colors.text }}>
              {editingGrade ? 'Modifier la Note' : 'Nouvelle Note'}
            </h2>
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
              <label style={labelStyle}>ID Module</label>
              <input
                type="text"
                value={formData.moduleId}
                onChange={(e) => setFormData(prev => ({ ...prev, moduleId: e.target.value }))}
                placeholder="ex: 1"
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={labelStyle}>Note (sur 20)</label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                placeholder="ex: 15"
                min="0"
                max="20"
                step="0.5"
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Type d'evaluation</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                style={inputStyle}
              >
                <option value="exam">Examen</option>
                <option value="quiz">Quiz</option>
                <option value="project">Projet</option>
                <option value="participation">Participation</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setShowCreateModal(false); setEditingGrade(null); }}
                style={{ padding: '10px 18px', borderRadius: BorderRadius.md, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 14, fontWeight: 500, cursor: 'pointer' }}
              >
                Annuler
              </button>
              <button
                onClick={handleSaveGrade}
                disabled={submitting}
                style={{ padding: '10px 18px', borderRadius: BorderRadius.md, background: submitting ? Colors.textMuted : Colors.primary, color: 'white', border: 'none', fontSize: 14, fontWeight: 600, cursor: submitting ? 'not-allowed' : 'pointer' }}
              >
                {submitting ? 'Enregistrement...' : (editingGrade ? 'Modifier' : 'Enregistrer')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Grades;
