// Grades Feature - AEVUM Enterprise ERP
// Refactored with DRY & SOLID principles

import React, { useState, useMemo } from 'react';
import { Card, Button, Modal, FilterBar, PaginationControls } from '../../components/common';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Colors } from '../../constants/theme';
import { useFilterable } from '../../hooks/useFilterable';

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

// Mock students with grades
const mockStudents = [
  { id: '1', firstName: 'Amadou', lastName: 'Sall', email: 'amadou.sall@aevum.sn', program: 'Développement Web', avatar: 'AS' },
  { id: '2', firstName: 'Fatou', lastName: 'Ndiaye', email: 'fatou.ndiaye@aevum.sn', program: 'Data Science', avatar: 'FN' },
  { id: '3', firstName: 'Moussa', lastName: 'Sow', email: 'moussa.sow@aevum.sn', program: 'Cybersécurité', avatar: 'MS' },
  { id: '4', firstName: 'Aïcha', lastName: 'Mendy', email: 'aicha.mendy@aevum.sn', program: 'Marketing Digital', avatar: 'AM' },
  { id: '5', firstName: 'Omar', lastName: 'Ba', email: 'omar.ba@aevum.sn', program: 'Développement Web', avatar: 'OB' },
  { id: '6', firstName: 'Mariama', lastName: 'Diallo', email: 'mariama.diallo@aevum.sn', program: 'Data Science', avatar: 'MD' },
  { id: '7', firstName: 'Cheikh', lastName: 'Ndiaye', email: 'cheikh.ndiaye@aevum.sn', program: 'Cybersécurité', avatar: 'CN' },
  { id: '8', firstName: 'Rokhaya', lastName: 'Sall', email: 'rokhaya.sall@aevum.sn', program: 'Marketing Digital', avatar: 'RS' },
];

// Mock modules
const mockModules = [
  { id: '1', name: 'React & Next.js', program: 'Développement Web', coefficient: 3 },
  { id: '2', name: 'Python pour Data Science', program: 'Data Science', coefficient: 3 },
  { id: '3', name: 'Sécurité Informatiques', program: 'Cybersécurité', coefficient: 3 },
  { id: '4', name: 'SEO & Content Marketing', program: 'Marketing Digital', coefficient: 2 },
  { id: '5', name: 'Node.js Backend', program: 'Développement Web', coefficient: 2 },
  { id: '6', name: 'Machine Learning', program: 'Data Science', coefficient: 3 },
];

// Generate mock grades
const generateGrades = () => {
  const grades: any[] = [];
  mockStudents.forEach(student => {
    const modules = mockModules.filter(m => m.program === student.program);
    modules.forEach(module => {
      const examScore = Math.round((10 + Math.random() * 8 + Math.random() * 2) * 10) / 10;
      const projectScore = Math.round((10 + Math.random() * 8 + Math.random() * 2) * 10) / 10;
      const quizScore = Math.round((10 + Math.random() * 8) * 10) / 10;
      const finalScore = Math.round((examScore * 0.5 + projectScore * 0.35 + quizScore * 0.15) * 10) / 10;
      grades.push({
        id: `${student.id}-${module.id}`,
        studentId: student.id,
        moduleId: module.id,
        moduleName: module.name,
        program: student.program,
        examScore,
        projectScore,
        quizScore,
        finalScore,
        coefficient: module.coefficient,
      });
    });
  });
  return grades;
};

const mockGrades = generateGrades();

// Filter options
const programOptions = [
  { value: 'all', label: 'Tous les programmes' },
  { value: 'Développement Web', label: 'Développement Web' },
  { value: 'Data Science', label: 'Data Science' },
  { value: 'Cybersécurité', label: 'Cybersécurité' },
  { value: 'Marketing Digital', label: 'Marketing Digital' },
];

export const Grades: React.FC = () => {
  // State
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'students' | 'modules'>('students');

  // Use the filterable hook
  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
    totalItems,
    showingFrom,
    showingTo,
  } = useFilterable({
    data: mockStudents,
    itemsPerPage: 10,
    searchFields: ['firstName', 'lastName', 'email'],
  });

  // Filter grades by program
  const filteredGrades = useMemo(() => {
    const program = filters.program || 'all';
    if (program === 'all') return mockGrades;
    return mockGrades.filter(g => g.program === program);
  }, [filters.program]);

  // Calculate student averages
  const studentAverages = useMemo(() => {
    const averages: any = {};
    mockStudents.forEach(student => {
      const studentGrades = mockGrades.filter(g => g.studentId === student.id);
      if (studentGrades.length > 0) {
        const totalWeighted = studentGrades.reduce((acc, g) => acc + g.finalScore * g.coefficient, 0);
        const totalCoeff = studentGrades.reduce((acc, g) => acc + g.coefficient, 0);
        averages[student.id] = Math.round((totalWeighted / totalCoeff) * 10) / 10;
      }
    });
    return averages;
  }, []);

  // Calculate module averages
  const moduleAverages = useMemo(() => {
    const averages: any = {};
    mockModules.forEach(module => {
      const moduleGrades = mockGrades.filter(g => g.moduleId === module.id);
      if (moduleGrades.length > 0) {
        const avg = moduleGrades.reduce((acc, g) => acc + g.finalScore, 0) / moduleGrades.length;
        averages[module.id] = Math.round(avg * 10) / 10;
      }
    });
    return averages;
  }, []);

  // Summary stats
  const stats = useMemo(() => {
    const allScores = filteredGrades.map(g => g.finalScore);
    const avg = allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : 0;
    const highest = allScores.length > 0 ? Math.max(...allScores) : 0;
    const lowest = allScores.length > 0 ? Math.min(...allScores) : 0;
    const passRate = allScores.length > 0 ? (allScores.filter(s => s >= 10).length / allScores.length) * 100 : 0;
    return {
      average: Math.round(avg * 10) / 10,
      highest: Math.round(highest * 10) / 10,
      lowest: Math.round(lowest * 10) / 10,
      passRate: Math.round(passRate),
      totalStudents: mockStudents.length,
    };
  }, [filteredGrades]);

  // Modules for filter
  const modules = useMemo(() => {
    const program = filters.program || 'all';
    if (program === 'all') return mockModules;
    return mockModules.filter(m => m.program === program);
  }, [filters.program]);

  // Get student grades
  const getStudentGrades = (studentId: string) => {
    return mockGrades.filter(g => g.studentId === studentId);
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
                {stats.average}/20
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
                {stats.highest}/20
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
                {stats.lowest}/20
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
                {stats.passRate}%
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
                {stats.totalStudents}
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
            <select 
              value={filters.program || 'all'}
              onChange={(e) => { setFilter('program', e.target.value); setSelectedModule('all'); }}
              style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}
            >
              {programOptions.map(p => (<option key={p.value} value={p.value}>{p.label}</option>))}
            </select>
            {viewMode === 'students' && (
              <select 
                value={selectedModule}
                onChange={(e) => setSelectedModule(e.target.value)}
                style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}
              >
                <option value="all">Tous les modules</option>
                {modules.map(m => (<option key={m.id} value={m.id}>{m.name}</option>))}
              </select>
            )}
          </div>
        </div>
      </Card>

      {/* Students View */}
      {viewMode === 'students' && (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
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
                {mockStudents
                  .filter(s => (filters.program || 'all') === 'all' || s.program === filters.program)
                  .sort((a, b) => (studentAverages[b.id] || 0) - (studentAverages[a.id] || 0))
                  .map((student, index) => {
                  const avg = studentAverages[student.id] || 0;
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
                          <div style={{ width: 40, height: 40, borderRadius: '50%', background: programColors[student.program], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 600 }}>
                            {student.avatar}
                          </div>
                          <div>
                            <div style={{ fontSize: 13, fontWeight: 600, color: Colors.text }}>{student.firstName} {student.lastName}</div>
                            <div style={{ fontSize: 11, color: Colors.textMuted }}>{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 500, background: `${programColors[student.program]}20`, color: programColors[student.program] }}>
                          {student.program}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                          {getStudentGrades(student.id).slice(0, 3).map((g, i) => (
                            <span key={i} style={{ padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 500, background: `${getGradeColor(g.finalScore).bg}`, color: getGradeColor(g.finalScore).color }}>
                              {g.finalScore}
                            </span>
                          ))}
                          {getStudentGrades(student.id).length > 3 && (
                            <span style={{ fontSize: 10, color: Colors.textMuted }}>+{getStudentGrades(student.id).length - 3}</span>
                          )}
                        </div>
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
        </Card>
      )}

      {/* Modules View */}
      {viewMode === 'modules' && (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(100, 140, 255, 0.05)' }}>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Module</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Programme</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Coefficient</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Moyenne</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Taux Réussite</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Distribution</th>
                </tr>
              </thead>
              <tbody>
                {modules.map((module) => {
                  const moduleGrades = mockGrades.filter(g => g.moduleId === module.id);
                  const avg = moduleAverages[module.id] || 0;
                  const gradeColor = getGradeColor(avg);
                  const passCount = moduleGrades.filter(g => g.finalScore >= 10).length;
                  const passRate = moduleGrades.length > 0 ? (passCount / moduleGrades.length) * 100 : 0;
                  
                  const excellent = moduleGrades.filter(g => g.finalScore >= 16).length;
                  const veryGood = moduleGrades.filter(g => g.finalScore >= 14 && g.finalScore < 16).length;
                  const good = moduleGrades.filter(g => g.finalScore >= 12 && g.finalScore < 14).length;
                  const pass = moduleGrades.filter(g => g.finalScore >= 10 && g.finalScore < 12).length;
                  const fail = moduleGrades.filter(g => g.finalScore < 10).length;
                  
                  return (
                    <tr key={module.id} style={{ borderBottom: `1px solid ${Colors.border}`, background: 'transparent' }}>
                      <td style={{ padding: '14px 16px', fontSize: 13, fontWeight: 600, color: Colors.text }}>{module.name}</td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 500, background: `${programColors[module.program]}20`, color: programColors[module.program] }}>
                          {module.program}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: 14, fontWeight: 600, color: Colors.text }}>{module.coefficient}</td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <span style={{ padding: '6px 12px', borderRadius: 20, fontSize: 13, fontWeight: 600, background: gradeColor.bg, color: gradeColor.color }}>{avg}/20</span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <span style={{ padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: passRate >= 70 ? 'rgba(62, 207, 142, 0.15)' : passRate >= 50 ? 'rgba(201, 168, 76, 0.15)' : 'rgba(224, 80, 80, 0.15)', color: passRate >= 70 ? '#3ecf8e' : passRate >= 50 ? '#c9a84c' : '#e05050' }}>
                          {Math.round(passRate)}%
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', gap: 2, height: 20, alignItems: 'flex-end' }}>
                          {[
                            { count: excellent, color: '#3ecf8e', height: excellent > 0 ? 20 : 0 },
                            { count: veryGood, color: '#6490ff', height: veryGood > 0 ? 16 : 0 },
                            { count: good, color: '#a78bfa', height: good > 0 ? 12 : 0 },
                            { count: pass, color: '#c9a84c', height: pass > 0 ? 8 : 0 },
                            { count: fail, color: '#e05050', height: fail > 0 ? 4 : 0 },
                          ].map((bar, i) => (
                            <div key={i} style={{ width: 8, height: bar.height, background: bar.color, borderRadius: 2 }} title={`${bar.count} élève(s)`}></div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Pagination */}
      {viewMode === 'students' && (
        <div style={{ marginTop: 16 }}>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            showingFrom={showingFrom}
            showingTo={showingTo}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Student Details Modal */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedStudent(null); }} title={selectedStudent ? `Bulletin - ${selectedStudent.firstName} ${selectedStudent.lastName}` : 'Saisie des notes'} size="lg">
        {selectedStudent ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, marginBottom: 24 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 80, height: 80, borderRadius: '50%', background: programColors[selectedStudent.program], display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 28, fontWeight: 600 }}>
                  {selectedStudent.avatar}
                </div>
                <span style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: `${programColors[selectedStudent.program]}20`, color: programColors[selectedStudent.program] }}>
                  {selectedStudent.program}
                </span>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 28, fontWeight: 700, color: getGradeColor(studentAverages[selectedStudent.id] || 0).color, fontFamily: "'DM Serif Display', serif" }}>
                    {studentAverages[selectedStudent.id] || 0}/20
                  </div>
                  <div style={{ fontSize: 11, color: Colors.textMuted }}>Moyenne générale</div>
                </div>
              </div>
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div><div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>EMAIL</div><div style={{ fontSize: 13, color: Colors.text }}>{selectedStudent.email}</div></div>
                  <div><div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>NOTES SAISIES</div><div style={{ fontSize: 13, fontWeight: 600, color: Colors.text }}>{getStudentGrades(selectedStudent.id).length} modules</div></div>
                </div>
              </div>
            </div>

            <div style={{ borderTop: `1px solid ${Colors.border}`, paddingTop: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: Colors.text, marginBottom: 12 }}>Notes par module</div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${Colors.border}` }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left', fontSize: 10, color: Colors.textMuted }}>MODULE</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center', fontSize: 10, color: Colors.textMuted }}>EXAMEN</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center', fontSize: 10, color: Colors.textMuted }}>PROJET</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center', fontSize: 10, color: Colors.textMuted }}>QUIZ</th>
                    <th style={{ padding: '8px 12px', textAlign: 'center', fontSize: 10, color: Colors.textMuted }}>MOYENNE</th>
                  </tr>
                </thead>
                <tbody>
                  {getStudentGrades(selectedStudent.id).map((grade) => {
                    const gradeColor = getGradeColor(grade.finalScore);
                    return (
                      <tr key={grade.id} style={{ borderBottom: `1px solid ${Colors.border}` }}>
                        <td style={{ padding: '8px 12px', fontSize: 12, fontWeight: 500, color: Colors.text }}>{grade.moduleName}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'center', fontSize: 12, color: Colors.text }}>{grade.examScore}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'center', fontSize: 12, color: Colors.text }}>{grade.projectScore}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'center', fontSize: 12, color: Colors.text }}>{grade.quizScore}</td>
                        <td style={{ padding: '8px 12px', textAlign: 'center' }}>
                          <span style={{ padding: '4px 8px', borderRadius: 12, fontSize: 11, fontWeight: 600, background: gradeColor.bg, color: gradeColor.color }}>{grade.finalScore}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
              <Button variant="secondary" onClick={() => { setIsModalOpen(false); setSelectedStudent(null); }}>Fermer</Button>
              <Button variant="primary">Imprimer Bulletin</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div><label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Module</label><select style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}><option>Sélectionner...</option>{modules.map(m => (<option key={m.id}>{m.name}</option>))}</select></div>
              <div><label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Apprenant</label><select style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}><option>Sélectionner...</option>{mockStudents.map(s => (<option key={s.id}>{s.firstName} {s.lastName}</option>))}</select></div>
              <div><label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Note Examen</label><input type="number" step="0.1" min="0" max="20" placeholder="0-20" style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }} /></div>
              <div><label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Note Projet</label><input type="number" step="0.1" min="0" max="20" placeholder="0-20" style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }} /></div>
              <div><label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Note Quiz</label><input type="number" step="0.1" min="0" max="20" placeholder="0-20" style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }} /></div>
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

