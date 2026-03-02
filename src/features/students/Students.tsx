// Students Feature - AEVUM Enterprise ERP
// Complete student management with enrollment, programs, and tracking

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, Button, ProgressBar, PaginationControls } from '../../components/common';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Colors } from '../../constants/theme';
import studentService from '../../services/studentService';
import programService from '../../services/programService';
import type { Student, StudentStatus, Program } from '../../types';
import { StudentForm, StudentDetails } from './components';
import type { StudentFormData } from './components/StudentForm';

// Program colors
const programColors: Record<string, string> = {
  'Développement Web': '#6490ff',
  'Data Science': '#3ecf8e',
  'Cybersécurité': '#a78bfa',
  'Marketing Digital': '#fb923c',
};

// Filter options
const statusOptions = [
  { value: 'all', label: 'Tous statuts' },
  { value: 'inscrit', label: 'Inscrit' },
  { value: 'actif', label: 'Actif' },
  { value: 'attente', label: 'En attente' },
  { value: 'diplome', label: 'Diplômé' },
  { value: 'abandon', label: 'Abandon' },
];

const programOptions = [
  { value: 'all', label: 'Tous les programmes' },
  { value: 'Développement Web', label: 'Développement Web' },
  { value: 'Data Science', label: 'Data Science' },
  { value: 'Cybersécurité', label: 'Cybersécurité' },
  { value: 'Marketing Digital', label: 'Marketing Digital' },
];

// Extended types for display
interface StudentDisplay extends Student {
  programName: string;
  progress: number;
}

interface ProgramDisplay {
  name: string;
  inscrit: number;
  actif: number;
  completion: number;
  duration: number;
  price: number;
}

export const Students: React.FC = () => {
  // State
  const [students, setStudents] = useState<StudentDisplay[]>([]);
  const [programs, setPrograms] = useState<ProgramDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [programFilter, setProgramFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'list' | 'programs'>('list');
  const [selectedStudent, setSelectedStudent] = useState<StudentDisplay | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const itemsPerPage = 10;

  // Fetch students
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await studentService.getStudents({ pageSize: 100 });
      
      // Add mock program data since it's not in the backend yet
      const studentPrograms = ['Développement Web', 'Data Science', 'Cybersécurité', 'Marketing Digital'];
      const studentStatuses: StudentStatus[] = ['inscrit', 'actif', 'actif', 'actif', 'attente', 'diplome', 'abandon'];
      
      const enrichedStudents: StudentDisplay[] = response.data.map((student, idx) => ({
        ...student,
        programName: studentPrograms[idx % studentPrograms.length],
        progress: Math.floor(Math.random() * 100),
      }));
      
      setStudents(enrichedStudents);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Erreur lors du chargement des apprenants');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch programs
  const fetchPrograms = useCallback(async () => {
    try {
      const response = await programService.getProgramsWithStats();
      if (response.programs && response.programs.length > 0) {
        const programDisplays: ProgramDisplay[] = response.programs.map(p => ({
          name: p.name,
          inscrit: p.studentsCount || 0,
          actif: p.activeStudents || 0,
          completion: p.completionRate || 0,
          duration: p.duration || 0,
          price: p.price || 0,
        }));
        setPrograms(programDisplays);
      }
    } catch (err) {
      console.error('Error fetching programs:', err);
      // Keep fallback data
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    fetchStudents();
    fetchPrograms();
  }, [fetchStudents, fetchPrograms]);

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = 
        student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
      const matchesProgram = programFilter === 'all' || student.programName === programFilter;
      
      return matchesSearch && matchesStatus && matchesProgram;
    });
  }, [students, searchQuery, statusFilter, programFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Calculate statistics
  const stats = useMemo(() => {
    return {
      total: students.length,
      actifs: students.filter(s => s.status === 'actif').length,
      enAttente: students.filter(s => s.status === 'attente' || s.status === 'inscrit').length,
      diplomes: students.filter(s => s.status === 'diplome').length,
    };
  }, [students]);

  // Handle form submission
  const handleStudentSubmit = async (data: StudentFormData) => {
    try {
      if (data.id) {
        // Update existing student
        await studentService.updateStudent(data.id, {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
        });
      } else {
        // Create new student
        await studentService.createStudent({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
        });
      }
      fetchStudents();
    } catch (err) {
      console.error('Error saving student:', err);
      alert('Erreur lors de l\'enregistrement');
    }
  };

  const handleNewStudent = () => {
    setSelectedStudent(null);
    setIsFormOpen(true);
  };

  const handleViewDetails = (student: StudentDisplay) => {
    setSelectedStudent(student);
    setIsDetailsOpen(true);
  };

  // Summary cards data
  const summaryCards = [
    { title: 'Total Apprenants', value: loading ? '...' : stats.total, icon: '🎓', variant: 'info' as const },
    { title: 'Actifs', value: loading ? '...' : stats.actifs, icon: '✓', variant: 'success' as const },
    { title: 'En Attente', value: loading ? '...' : stats.enAttente, icon: '⏳', variant: 'warning' as const },
    { title: 'Diplômés', value: loading ? '...' : stats.diplomes, icon: '🏆', variant: 'default' as const },
  ];

  // Default programs if none from backend
  const displayPrograms = programs.length > 0 ? programs : [
    { name: 'Développement Web', inscrit: 124, actif: 112, completion: 89, duration: 12, price: 450000 },
    { name: 'Data Science', inscrit: 87, actif: 79, completion: 76, duration: 18, price: 650000 },
    { name: 'Cybersécurité', inscrit: 56, actif: 51, completion: 84, duration: 12, price: 550000 },
    { name: 'Marketing Digital', inscrit: 103, actif: 95, completion: 91, duration: 6, price: 350000 },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: Colors.text, marginBottom: 4 }}>
            Apprenants
          </h1>
          <p style={{ fontSize: 13, color: Colors.textMuted }}>
            Gestion des apprenants · Inscriptions · Suivi · Certifications
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="secondary" onClick={() => setIsFormOpen(true)}>
            ↺ Exporter
          </Button>
          <Button variant="primary" onClick={handleNewStudent}>
            + Nouvel apprenant
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{ 
          padding: '12px 16px', 
          background: 'rgba(224, 80, 80, 0.1)', 
          border: '1px solid rgba(224, 80, 80, 0.3)',
          borderRadius: 8,
          marginBottom: 20,
          color: '#e05050',
          fontSize: 13,
        }}>
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {summaryCards.map((card, idx) => (
          <Card key={idx} style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ 
                width: 48, height: 48, borderRadius: 12, 
                background: card.variant === 'success' ? 'rgba(62, 207, 142, 0.15)' :
                           card.variant === 'warning' ? 'rgba(201, 168, 76, 0.15)' :
                           card.variant === 'default' ? 'rgba(167, 139, 250, 0.15)' :
                           'rgba(100, 140, 255, 0.15)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20,
                color: card.variant === 'success' ? '#3ecf8e' :
                       card.variant === 'warning' ? '#c9a84c' :
                       card.variant === 'default' ? '#a78bfa' : '#6490ff',
              }}>
                {card.icon}
              </div>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {card.title}
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                  {card.value}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'rgba(100, 140, 255, 0.05)', padding: 4, borderRadius: 10, width: 'fit-content' }}>
        <button
          onClick={() => setViewMode('list')}
          style={{
            padding: '10px 18px',
            borderRadius: 8,
            border: 'none',
            background: viewMode === 'list' ? 'rgba(100, 140, 255, 0.15)' : 'transparent',
            color: viewMode === 'list' ? Colors.accent : Colors.textMuted,
            fontSize: 12,
            fontWeight: viewMode === 'list' ? 600 : 400,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <span>👥</span> Liste des apprenants
        </button>
        <button
          onClick={() => setViewMode('programs')}
          style={{
            padding: '10px 18px',
            borderRadius: 8,
            border: 'none',
            background: viewMode === 'programs' ? 'rgba(100, 140, 255, 0.15)' : 'transparent',
            color: viewMode === 'programs' ? Colors.accent : Colors.textMuted,
            fontSize: 12,
            fontWeight: viewMode === 'programs' ? 600 : 400,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <span>📚</span> Programmes
        </button>
      </div>

      {/* Filters */}
      {viewMode === 'list' && (
        <Card style={{ marginBottom: 20, padding: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, alignItems: 'end' }}>
            <input
              type="text"
              placeholder="Rechercher un apprenant..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); handleFilterChange(); }}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: `1px solid ${Colors.border}`,
                background: Colors.bg,
                color: Colors.text,
                fontSize: 13,
              }}
            />
            <select 
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); handleFilterChange(); }}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: `1px solid ${Colors.border}`,
                background: Colors.bg,
                color: Colors.text,
                fontSize: 13,
              }}
            >
              {statusOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <select 
              value={programFilter}
              onChange={(e) => { setProgramFilter(e.target.value); handleFilterChange(); }}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: `1px solid ${Colors.border}`,
                background: Colors.bg,
                color: Colors.text,
                fontSize: 13,
              }}
            >
              {programOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </Card>
      )}

      {/* Students List */}
      {viewMode === 'list' && (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: Colors.textMuted }}>
              Chargement des apprenants...
            </div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(100, 140, 255, 0.05)' }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Apprenant</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Programme</th>
                      <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Progression</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Statut</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Inscription</th>
                      <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedStudents.map((student, index) => {
                      const progColor = programColors[student.programName] || Colors.accent;
                      return (
                        <tr 
                          key={student.id}
                          style={{ 
                            borderBottom: `1px solid ${Colors.border}`,
                            background: index % 2 === 0 ? 'transparent' : 'rgba(100, 140, 255, 0.02)',
                            cursor: 'pointer',
                          }}
                          onClick={() => handleViewDetails(student)}
                        >
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{ 
                                width: 36, height: 36, borderRadius: '50%', background: progColor,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: '#fff', fontSize: 12, fontWeight: 600,
                              }}>
                                {student.firstName[0]}{student.lastName[0]}
                              </div>
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 600, color: Colors.text }}>
                                  {student.firstName} {student.lastName}
                                </div>
                                <div style={{ fontSize: 11, color: Colors.textMuted }}>
                                  {student.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <span style={{ 
                              padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 500,
                              background: `${progColor}20`, color: progColor,
                            }}>
                              {student.programName}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px', width: 180 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <ProgressBar value={student.progress} color={progColor} height={6} />
                              <span style={{ fontSize: 12, fontWeight: 600, color: Colors.text, minWidth: 35 }}>
                                {student.progress}%
                              </span>
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <StatusBadge status={student.status} />
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: 12, color: Colors.textMuted }}>
                            {student.enrollmentDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                            <button 
                              style={{ 
                                padding: '6px 12px', borderRadius: 6, border: `1px solid ${Colors.border}`, 
                                background: 'transparent', color: Colors.textMuted, fontSize: 11, cursor: 'pointer',
                              }}
                              onClick={(e) => { e.stopPropagation(); handleViewDetails(student); }}
                            >
                              ✎ Détails
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '16px 20px',
                borderTop: `1px solid ${Colors.border}`,
              }}>
                <div style={{ fontSize: 12, color: Colors.textMuted }}>
                  Affichage de {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, filteredStudents.length)} sur {filteredStudents.length}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button 
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 6,
                      border: `1px solid ${Colors.border}`,
                      background: 'transparent',
                      color: currentPage === 1 ? Colors.textMuted : Colors.text,
                      fontSize: 12,
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                      opacity: currentPage === 1 ? 0.5 : 1,
                    }}
                  >
                    ← Précédent
                  </button>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      style={{
                        padding: '8px 12px',
                        borderRadius: 6,
                        border: page === currentPage ? `1px solid ${Colors.accent}` : `1px solid ${Colors.border}`,
                        background: page === currentPage ? 'rgba(100, 140, 255, 0.15)' : 'transparent',
                        color: page === currentPage ? Colors.accent : Colors.text,
                        fontSize: 12,
                        cursor: 'pointer',
                      }}
                    >
                      {page}
                    </button>
                  ))}
                  <button 
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 6,
                      border: `1px solid ${Colors.border}`,
                      background: 'transparent',
                      color: currentPage === totalPages ? Colors.textMuted : Colors.text,
                      fontSize: 12,
                      cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                      opacity: currentPage === totalPages ? 0.5 : 1,
                    }}
                  >
                    Suivant →
                  </button>
                </div>
              </div>
            </>
          )}
        </Card>
      )}

      {/* Programs View */}
      {viewMode === 'programs' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
          {displayPrograms.map((program, idx) => {
            const progColor = programColors[program.name] || Colors.accent;
            return (
              <Card key={idx} style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ 
                      width: 48, height: 48, borderRadius: 12, background: `${progColor}20`, 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 24, color: progColor,
                    }}>
                      📚
                    </div>
                    <div>
                      <div style={{ fontSize: 16, fontWeight: 600, color: Colors.text }}>{program.name}</div>
                      <div style={{ fontSize: 12, color: Colors.textMuted }}>{program.duration} mois</div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                      {program.price.toLocaleString('fr-FR')} CFA
                    </div>
                    <div style={{ fontSize: 11, color: Colors.textMuted }}>Frais de formation</div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 20 }}>
                  <div style={{ textAlign: 'center', padding: 16, background: 'rgba(100, 140, 255, 0.05)', borderRadius: 10 }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                      {program.inscrit}
                    </div>
                    <div style={{ fontSize: 11, color: Colors.textMuted }}>Inscrits</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: 16, background: 'rgba(62, 207, 142, 0.05)', borderRadius: 10 }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#3ecf8e', fontFamily: "'DM Serif Display', serif" }}>
                      {program.actif}
                    </div>
                    <div style={{ fontSize: 11, color: Colors.textMuted }}>Actifs</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: 16, background: 'rgba(167, 139, 250, 0.05)', borderRadius: 10 }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#a78bfa', fontFamily: "'DM Serif Display', serif" }}>
                      {program.completion}%
                    </div>
                    <div style={{ fontSize: 11, color: Colors.textMuted }}>Réussite</div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 12, color: Colors.textMuted }}>Taux de complétion</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: progColor }}>{program.completion}%</span>
                  </div>
                  <ProgressBar value={program.completion} color={progColor} height={8} />
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Student Form Modal */}
      <StudentForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setSelectedStudent(null); }}
        onSubmit={handleStudentSubmit}
        student={selectedStudent}
      />

      {/* Student Details Modal */}
      <StudentDetails
        isOpen={isDetailsOpen}
        onClose={() => { setIsDetailsOpen(false); setSelectedStudent(null); }}
        student={selectedStudent}
      />
    </div>
  );
};

export default Students;

