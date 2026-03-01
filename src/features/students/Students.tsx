// Students Feature - AEVUM Enterprise ERP
// Refactored with DRY & SOLID principles

import React, { useState, useMemo } from 'react';
import { Card, Button, ProgressBar, FilterBar, PaginationControls } from '../../components/common';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Colors } from '../../constants/theme';
import { useFilterable } from '../../hooks/useFilterable';
import { StudentForm, StudentDetails } from './components';
import type { StudentFormData } from './components/StudentForm';

// Program colors
const programColors: Record<string, string> = {
  'Développement Web': '#6490ff',
  'Data Science': '#3ecf8e',
  'Cybersécurité': '#a78bfa',
  'Marketing Digital': '#fb923c',
};

// Mock students data
const mockStudents = [
  { id: '1', firstName: 'Amadou', lastName: 'Sall', email: 'amadou.sall@aevum.sn', phone: '+221 77 123 45 67', program: 'Développement Web', status: 'actif', enrollmentDate: new Date('2024-09-01'), progress: 78 },
  { id: '2', firstName: 'Fatou', lastName: 'Ndiaye', email: 'fatou.ndiaye@aevum.sn', phone: '+221 76 234 56 78', program: 'Data Science', status: 'actif', enrollmentDate: new Date('2024-09-01'), progress: 85 },
  { id: '3', firstName: 'Moussa', lastName: 'Sow', email: 'moussa.sow@aevum.sn', phone: '+221 70 345 67 89', program: 'Cybersécurité', status: 'actif', enrollmentDate: new Date('2024-09-15'), progress: 62 },
  { id: '4', firstName: 'Aïcha', lastName: 'Mendy', email: 'aicha.mendy@aevum.sn', phone: '+221 76 456 78 90', program: 'Marketing Digital', status: 'actif', enrollmentDate: new Date('2024-10-01'), progress: 91 },
  { id: '5', firstName: 'Ibou', lastName: 'Gaye', email: 'ibou.gaye@aevum.sn', phone: '+221 77 567 89 01', program: 'Développement Web', status: 'attente', enrollmentDate: new Date('2025-01-15'), progress: 0 },
  { id: '6', firstName: 'Rokhaya', lastName: 'Fall', email: 'rokhaya.fall@aevum.sn', phone: '+221 76 678 90 12', program: 'Data Science', status: 'actif', enrollmentDate: new Date('2024-09-01'), progress: 73 },
  { id: '7', firstName: 'Omar', lastName: 'Ba', email: 'omar.ba@aevum.sn', phone: '+221 70 789 01 23', program: 'Cybersécurité', status: 'diplome', enrollmentDate: new Date('2023-09-01'), progress: 100 },
  { id: '8', firstName: 'Lamine', lastName: 'Diop', email: 'lamine.diops@aevum.sn', phone: '+221 77 890 12 34', program: 'Marketing Digital', status: 'actif', enrollmentDate: new Date('2024-09-15'), progress: 88 },
  { id: '9', firstName: 'Mariama', lastName: 'Sarr', email: 'mariama.sarr@aevum.sn', phone: '+221 76 901 23 45', program: 'Développement Web', status: 'abandon', enrollmentDate: new Date('2024-09-01'), progress: 35 },
  { id: '10', firstName: 'Cheikh', lastName: 'Toure', email: 'cheikh.toure@aevum.sn', phone: '+221 70 012 34 56', program: 'Data Science', status: 'actif', enrollmentDate: new Date('2024-10-01'), progress: 67 },
  { id: '11', firstName: 'Ndeye', lastName: 'Sene', email: 'ndeye.sene@aevum.sn', phone: '+221 76 123 45 67', program: 'Cybersécurité', status: 'inscrit', enrollmentDate: new Date('2025-02-01'), progress: 5 },
  { id: '12', firstName: 'Papa', lastName: 'Ndiaye', email: 'papa.ndiaye@aevum.sn', phone: '+221 77 234 56 78', program: 'Marketing Digital', status: 'actif', enrollmentDate: new Date('2024-09-15'), progress: 79 },
];

// Mock programs data
const mockPrograms = [
  { name: 'Développement Web', inscrits: 124, actifs: 112, completion: 89, duration: 12, price: 450000 },
  { name: 'Data Science', inscrits: 87, actifs: 79, completion: 76, duration: 18, price: 650000 },
  { name: 'Cybersécurité', inscrits: 56, actifs: 51, completion: 84, duration: 12, price: 550000 },
  { name: 'Marketing Digital', inscrits: 103, actifs: 95, completion: 91, duration: 6, price: 350000 },
];

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

export const Students: React.FC = () => {
  // State
  const [viewMode, setViewMode] = useState<'list' | 'programs'>('list');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

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

  // Filter by status and program
  const filteredStudents = useMemo(() => {
    const status = filters.status || 'all';
    const program = filters.program || 'all';
    
    return paginatedData.filter((student: any) => {
      const matchesStatus = status === 'all' || student.status === status;
      const matchesProgram = program === 'all' || student.program === program;
      return matchesStatus && matchesProgram;
    });
  }, [paginatedData, filters.status, filters.program]);

  // Summary stats
  const stats = useMemo(() => {
    return {
      total: mockStudents.length,
      actifs: mockStudents.filter(s => s.status === 'actif').length,
      enAttente: mockStudents.filter(s => s.status === 'attente' || s.status === 'inscrit').length,
      diplomes: mockStudents.filter(s => s.status === 'diplome').length,
    };
  }, []);

  // Handle form submission
  const handleStudentSubmit = (data: StudentFormData) => {
    console.log('Student data submitted:', data);
  };

  const handleNewStudent = () => {
    setSelectedStudent(null);
    setIsFormOpen(true);
  };

  const handleViewDetails = (student: any) => {
    setSelectedStudent(student);
    setIsDetailsOpen(true);
  };

  // Summary cards data
  const summaryCards = [
    { title: 'Total Apprenants', value: stats.total, icon: '🎓', variant: 'info' as const },
    { title: 'Actifs', value: stats.actifs, icon: '✓', variant: 'success' as const },
    { title: 'En Attente', value: stats.enAttente, icon: '⏳', variant: 'warning' as const },
    { title: 'Diplômés', value: stats.diplomes, icon: '🏆', variant: 'default' as const },
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
          <FilterBar
            filters={[
              { key: 'status', type: 'select', options: statusOptions, placeholder: 'Statut' },
              { key: 'program', type: 'select', options: programOptions, placeholder: 'Programme' },
            ]}
            values={filters}
            onChange={setFilter}
            onSearch={setSearchQuery}
            searchValue={searchQuery}
            searchPlaceholder="Rechercher un apprenant..."
          />
        </Card>
      )}

      {/* Students List */}
      {viewMode === 'list' && (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
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
                {filteredStudents.map((student: any, index: number) => {
                  const progColor = programColors[student.program] || Colors.accent;
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
                          {student.program}
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
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            showingFrom={showingFrom}
            showingTo={showingTo}
            onPageChange={setCurrentPage}
          />
        </Card>
      )}

      {/* Programs View */}
      {viewMode === 'programs' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
          {mockPrograms.map((program, idx) => {
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
                      {program.inscrits}
                    </div>
                    <div style={{ fontSize: 11, color: Colors.textMuted }}>Inscrits</div>
                  </div>
                  <div style={{ textAlign: 'center', padding: 16, background: 'rgba(62, 207, 142, 0.05)', borderRadius: 10 }}>
                    <div style={{ fontSize: 24, fontWeight: 700, color: '#3ecf8e', fontFamily: "'DM Serif Display', serif" }}>
                      {program.actifs}
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

