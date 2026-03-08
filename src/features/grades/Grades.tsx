// Grades Feature - Tornadoes Job Education Module
// Connected to backend API

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, Button, Modal, FilterBar, PaginationControls } from '../../components/common';
import { Colors } from '../../constants/theme';
import gradeService from '../../services/gradeService';

// Grade colors based on score
const getGradeColor = (score: number): { bg: string; color: string; label: string } => {
  if (score >= 16) return { bg: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e', label: 'Excellent' };
  if (score >= 14) return { bg: 'rgba(100, 140, 255, 0.15)', color: '#6490ff', label: 'Très Bien' };
  if (score >= 12) return { bg: 'rgba(167, 139, 250, 0.15)', color: '#a78bfa', label: 'Bien' };
  if (score >= 10) return { bg: 'rgba(201, 168, 76, 0.15)', color: '#c9a84c', label: 'Passable' };
  return { bg: 'rgba(224, 80, 80, 0.15)', color: '#e05050', label: 'Insuffisant' };
};

// Program colors
const programColors: Record<string, string> = {
  'Développement Web': '#6490ff',
  'Data Science': '#3ecf8e',
  'Cybersécurité': '#a78bfa',
  'Marketing Digital': '#fb923c',
};

// Filter options
const programOptions = [
  { value: '', label: 'Tous les programmes' },
  { value: 'Développement Web', label: 'Développement Web' },
  { value: 'Data Science', label: 'Data Science' },
  { value: 'Cybersécurité', label: 'Cybersécurité' },
  { value: 'Marketing Digital', label: 'Marketing Digital' },
];

export const Grades: React.FC = () => {
  // State
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'students' | 'modules'>('students');
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [stats, setStats] = useState({ average: 0, highest: 0, lowest: 0, passRate: 0, totalStudents: 0 });

  // Fetch data from API
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [studentsData, statsData] = await Promise.all([
        gradeService.getStudentsWithAverages(selectedProgram || undefined),
        gradeService.getGradeStats(selectedProgram || undefined),
      ]);
      setStudents(studentsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching grades data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [selectedProgram]);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter options
  const filteredStudents = useMemo(() => {
    if (!selectedProgram) return students;
    return students.filter(s => s.program === selectedProgram);
  }, [students, selectedProgram]);

  // Sorted students by average
  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => (b.average || 0) - (a.average || 0));
  }, [filteredStudents]);

  // Handle filter change
  const handleFilterChange = (key: string, value: string) => {
    if (key === 'program') {
      setSelectedProgram(value);
    }
  };

  // Handle search
  const handleSearch = (query: string) => {
    // Could implement client-side search here
    console.log('Search:', query);
  };

  // Handle grade submission
  const handleGradeSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    try {
      await gradeService.saveGrade({
        studentId: formData.get('studentId') as string,
        moduleId: formData.get('moduleId') as string,
        value: parseFloat(formData.get('value') as string),
        type: formData.get('type') as 'exam' | 'quiz' | 'project' | 'participation',
      });
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving grade:', error);
    }
  };

  // Get student by ID
  const getStudent = (id: string) => {
    return students.find(s => s.id === id);
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: Colors.text, marginBottom: 4 }}>
            Notes & Bulletins
          </h1>
          <p style={{ fontSize: 13, color: Colors.textMuted }}>
            Gestion des notes · Bulletins · Statistiques
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="secondary" onClick={() => alert('Fonctionnalité d\'exportation bientôt disponible!')}>
            ↺ Exporter
          </Button>
          <Button variant="primary" onClick={() => { setSelectedStudent(null); setIsModalOpen(true); }}>
            + Saisir notes
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(100, 140, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#6490ff' }}>
              📊
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Moyenne Générale
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {isLoading ? '...' : `${stats.average}/20`}
              </div>
            </div>
          </div>
        </Card>
        
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(62, 207, 142, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#3ecf8e' }}>
              ↗
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Plus Haute
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {isLoading ? '...' : `${stats.highest}/20`}
              </div>
            </div>
          </div>
        </Card>
        
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(224, 80, 80, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#e05050' }}>
              ↘
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Plus Basse
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {isLoading ? '...' : `${stats.lowest}/20`}
              </div>
            </div>
          </div>
        </Card>
        
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(167, 139, 250, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#a78bfa' }}>
              ✓
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Taux de Réussite
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {isLoading ? '...' : `${stats.passRate}%`}
              </div>
            </div>
          </div>
        </Card>
        
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(251, 146, 60, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#fb923c' }}>
              🎓
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Apprenants
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {isLoading ? '...' : stats.totalStudents}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* View Mode Toggle & Filters */}
      <Card style={{ marginBottom: 20, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 4, background: 'rgba(100, 140, 255, 0.05)', padding: 4, borderRadius: 8 }}>
              <button onClick={() => setViewMode('students')} style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: viewMode === 'students' ? 'rgba(100, 140, 255, 0.15)' : 'transparent', color: viewMode === 'students' ? Colors.accent : Colors.textMuted, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Par Apprenant</button>
              <button onClick={() => setViewMode('modules')} style={{ padding: '8px 16px', borderRadius: 6, border: 'none', background: viewMode === 'modules' ? 'rgba(100, 140, 255, 0.15)' : 'transparent', color: viewMode === 'modules' ? Colors.accent : Colors.textMuted, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Par Module</button>
            </div>
            <FilterBar
              filters={[
                { key: 'program', type: 'select', options: programOptions, placeholder: 'Programme' },
              ]}
              values={{ program: selectedProgram }}
              onChange={handleFilterChange}
              onSearch={handleSearch}
              searchValue=""
              searchPlaceholder="Rechercher..."
            />
          </div>
        </div>
      </Card>

      {/* Students View */}
      {viewMode === 'students' && (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {isLoading ? (
            <div style={{ padding: 40, textAlign: 'center', color: Colors.textMuted }}>
              Chargement des notes...
            </div>
          ) : sortedStudents.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: Colors.textMuted }}>
              Aucun apprenant trouvé
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(100, 140, 255, 0.05)' }}>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Apprenant</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Programme</th>
                    <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Notes</th>
                    <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Moyenne</th>
                    <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Rang</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedStudents.map((student, index) => {
                    const avg = student.average || 0;
                    const gradeColor = getGradeColor(avg);
                    return (
                      <tr 
                        key={student.id} 
                        style={{ 
                          borderBottom: `1px solid ${Colors.border}`, 
                          background: index % 2 === 0 ? 'transparent' : 'rgba(100, 140, 255, 0.02)',
                          cursor: 'pointer',
                        }}
                        onClick={() => { setSelectedStudent(student); setIsModalOpen(true); }}
                      >
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 40, height: 40, borderRadius: '50%', background: programColors[student.program] || '#6490ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 600 }}>
                              {student.avatar}
                            </div>
                            <div>
                              <div style={{ fontSize: 13, fontWeight: 600, color: Colors.text }}>{student.firstName} {student.lastName}</div>
                              <div style={{ fontSize: 11, color: Colors.textMuted }}>{student.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 500, background: `${programColors[student.program] || '#6490ff'}20`, color: programColors[student.program] || '#6490ff' }}>
                            {student.program}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          <span style={{ fontSize: 12, color: Colors.textMuted }}>
                            {student.gradesCount} notes
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          <span style={{ padding: '6px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600, background: gradeColor.bg, color: gradeColor.color }}>
                            {avg}/20
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: 14, fontWeight: 600, color: index < 3 ? '#c9a84c' : Colors.text }}>
                          #{index + 1}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* Modules View - Placeholder */}
      {viewMode === 'modules' && (
        <Card style={{ padding: 40, textAlign: 'center', color: Colors.textMuted }}>
          Vue par module - À implémenter avec les données du backend
        </Card>
      )}

      {/* Student Details Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setSelectedStudent(null); }} 
        title={selectedStudent ? `Bulletin - ${selectedStudent.firstName} ${selectedStudent.lastName}` : 'Saisie des notes'} 
        size="lg"
      >
        {selectedStudent ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, marginBottom: 24 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: programColors[selectedStudent.program] || '#6490ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 28, fontWeight: 600 }}>
                  {selectedStudent.avatar}
                </div>
                <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: `${programColors[selectedStudent.program] || '#6490ff'}20`, color: programColors[selectedStudent.program] || '#6490ff' }}>
                  {selectedStudent.program}
                </span>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: getGradeColor(selectedStudent.average || 0).color, fontFamily: "'DM Serif Display', serif" }}>
                    {selectedStudent.average || 0}/20
                  </div>
                  <div style={{ fontSize: 11, color: Colors.textMuted }}>Moyenne générale</div>
                </div>
              </div>
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div><div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>EMAIL</div><div style={{ fontSize: 13, color: Colors.text }}>{selectedStudent.email}</div></div>
                  <div><div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>NOTES SAISIES</div><div style={{ fontSize: 13, fontWeight: 600, color: Colors.text }}>{selectedStudent.gradesCount || 0} modules</div></div>
                </div>
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${Colors.border}`, paddingTop: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: Colors.text, marginBottom: 12 }}>Notes par module</div>
              <div style={{ padding: 20, textAlign: 'center', color: Colors.textMuted }}>
                Détails des notes - À charger depuis l'API
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
              <Button variant="secondary" onClick={() => { setIsModalOpen(false); setSelectedStudent(null); }}>Fermer</Button>
              <Button variant="primary">Imprimer Bulletin</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleGradeSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Module</label>
                <select name="moduleId" style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}>
                  <option value="">Sélectionner...</option>
                  <option value="1">React & Next.js</option>
                  <option value="2">Python pour Data Science</option>
                  <option value="3">Sécurité Informatiques</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Apprenant</label>
                <select name="studentId" style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}>
                  <option value="">Sélectionner...</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Type de note</label>
                <select name="type" style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}>
                  <option value="exam">Examen</option>
                  <option value="project">Projet</option>
                  <option value="quiz">Quiz</option>
                  <option value="participation">Participation</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Note (0-20)</label>
                <input name="value" type="number" step="0.1" min="0" max="20" placeholder="0-20" style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
              <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Annuler</Button>
              <Button variant="primary" type="submit">Enregistrer</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Grades;

