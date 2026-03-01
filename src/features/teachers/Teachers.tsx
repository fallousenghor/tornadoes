// Teachers Feature - AEVUM Enterprise ERP
// Refactored with DRY & SOLID principles

import React, { useState, useMemo } from 'react';
import { Card, Button, Modal, FilterBar, PaginationControls } from '../../components/common';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Colors } from '../../constants/theme';
import { useFilterable } from '../../hooks/useFilterable';
import { TeacherForm } from './components';
import type { TeacherFormData } from './components/TeacherForm';

// Status colors (kept inline for this module-specific need)
const statusColors: Record<string, { bg: string; color: string; label: string }> = {
  actif: { bg: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e', label: 'Actif' },
  inactif: { bg: 'rgba(100, 140, 255, 0.15)', color: '#6490ff', label: 'Inactif' },
  conge: { bg: 'rgba(201, 168, 76, 0.15)', color: '#c9a84c', label: 'Congé' },
};

// Specialty colors
const specialtyColors: Record<string, string> = {
  'Développement Web': '#6490ff',
  'Data Science': '#3ecf8e',
  'Cybersécurité': '#a78bfa',
  'Marketing Digital': '#fb923c',
  'Gestion de projet': '#c9a84c',
  'Base de données': '#2dd4bf',
};

// Mock teachers data
const mockTeachers = [
  { id: '1', firstName: 'Mamadou', lastName: 'Sall', email: 'mamadou.sall@aevum.sn', phone: '+221 77 123 45 67', specialties: ['Développement Web', 'Base de données'], status: 'actif', hourlyRate: 15000, coursesCount: 3, studentsCount: 89, rating: 4.8, hireDate: new Date('2022-01-15') },
  { id: '2', firstName: 'Fatou', lastName: 'Diallo', email: 'fatou.diallo@aevum.sn', phone: '+221 76 234 56 78', specialties: ['Data Science', 'Gestion de projet'], status: 'actif', hourlyRate: 18000, coursesCount: 2, studentsCount: 67, rating: 4.9, hireDate: new Date('2021-09-01') },
  { id: '3', firstName: 'Omar', lastName: 'Ndiaye', email: 'omar.ndiaye@aevum.sn', phone: '+221 70 345 67 89', specialties: ['Cybersécurité'], status: 'actif', hourlyRate: 20000, coursesCount: 2, studentsCount: 54, rating: 4.7, hireDate: new Date('2023-02-01') },
  { id: '4', firstName: 'Aïcha', lastName: 'Mendy', email: 'aicha.mendy@aevum.sn', phone: '+221 78 456 78 90', specialties: ['Marketing Digital', 'Gestion de projet'], status: 'actif', hourlyRate: 16000, coursesCount: 2, studentsCount: 45, rating: 4.6, hireDate: new Date('2022-06-15') },
  { id: '5', firstName: 'Ibrahima', lastName: 'Ba', email: 'ibrahima.ba@aevum.sn', phone: '+221 77 567 89 01', specialties: ['Développement Web', 'Cybersécurité'], status: 'actif', hourlyRate: 17500, coursesCount: 2, studentsCount: 52, rating: 4.5, hireDate: new Date('2023-01-10') },
  { id: '6', firstName: 'Mariama', lastName: 'Gaye', email: 'mariama.gaye@aevum.sn', phone: '+221 76 678 90 12', specialties: ['Développement Web', 'Base de données'], status: 'conge', hourlyRate: 15000, coursesCount: 1, studentsCount: 28, rating: 4.8, hireDate: new Date('2021-03-20') },
  { id: '7', firstName: 'Cheikh', lastName: 'Ndiaye', email: 'cheikh.ndiaye@aevum.sn', phone: '+221 70 789 01 23', specialties: ['Data Science', 'Cybersécurité'], status: 'inactif', hourlyRate: 19000, coursesCount: 0, studentsCount: 0, rating: 4.4, hireDate: new Date('2020-08-01') },
  { id: '8', firstName: 'Khadija', lastName: 'Sall', email: 'khadija.sall@aevum.sn', phone: '+221 78 890 12 34', specialties: ['Marketing Digital'], status: 'actif', hourlyRate: 14000, coursesCount: 1, studentsCount: 32, rating: 4.7, hireDate: new Date('2023-09-01') },
];

// Filter options
const statusOptions = [
  { value: 'all', label: 'Tous les statuts' },
  { value: 'actif', label: 'Actif' },
  { value: 'inactif', label: 'Inactif' },
  { value: 'conge', label: 'Congé' },
];

const specialtyOptions = [
  { value: 'all', label: 'Toutes les spécialités' },
  { value: 'Développement Web', label: 'Développement Web' },
  { value: 'Data Science', label: 'Data Science' },
  { value: 'Cybersécurité', label: 'Cybersécurité' },
  { value: 'Marketing Digital', label: 'Marketing Digital' },
  { value: 'Gestion de projet', label: 'Gestion de projet' },
  { value: 'Base de données', label: 'Base de données' },
];

export const Teachers: React.FC = () => {
  // State
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
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
    data: mockTeachers,
    itemsPerPage: 10,
    searchFields: ['firstName', 'lastName', 'email'],
  });

  // Filter by specialty
  const filteredTeachers = useMemo(() => {
    const specialty = filters.specialty || 'all';
    
    return paginatedData.filter((teacher: any) => {
      const matchesSpecialty = specialty === 'all' || teacher.specialties.includes(specialty);
      return matchesSpecialty;
    });
  }, [paginatedData, filters.specialty]);

  // Summary stats
  const stats = useMemo(() => {
    const active = mockTeachers.filter(t => t.status === 'actif').length;
    const totalStudents = mockTeachers.reduce((acc, t) => acc + t.studentsCount, 0);
    const avgRating = mockTeachers.reduce((acc, t) => acc + t.rating, 0) / mockTeachers.length;
    const totalCourses = mockTeachers.reduce((acc, t) => acc + t.coursesCount, 0);
    return {
      total: mockTeachers.length,
      active,
      totalStudents,
      avgRating: avgRating.toFixed(1),
      totalCourses,
    };
  }, []);

  // Handle form submission
  const handleTeacherSubmit = (data: TeacherFormData) => {
    console.log('Teacher data submitted:', data);
  };

  const handleNewTeacher = () => {
    setSelectedTeacher(null);
    setIsFormOpen(true);
  };

  const handleViewDetails = (teacher: any) => {
    setSelectedTeacher(teacher);
    setIsDetailsOpen(true);
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: Colors.text, marginBottom: 4 }}>
            Professeurs
          </h1>
          <p style={{ fontSize: 13, color: Colors.textMuted }}>
            Gestion des enseignants · Compétences · Affectations
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="secondary" onClick={() => setIsFormOpen(true)}>
            ↺ Exporter
          </Button>
          <Button variant="primary" onClick={handleNewTeacher}>
            + Nouveau professeur
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(100, 140, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#6490ff' }}>
              👨‍🏫
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {stats.total}
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
                Actifs
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {stats.active}
              </div>
            </div>
          </div>
        </Card>
        
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(167, 139, 250, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#a78bfa' }}>
              📚
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Cours
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {stats.totalCourses}
              </div>
            </div>
          </div>
        </Card>
        
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(251, 146, 60, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#fb923c' }}>
              👥
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
        
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(201, 168, 76, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#c9a84c' }}>
              ★
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Note Moyenne
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {stats.avgRating}/5
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: 20, padding: 16 }}>
        <FilterBar
          filters={[
            { key: 'specialty', type: 'select', options: specialtyOptions, placeholder: 'Spécialité' },
          ]}
          values={filters}
          onChange={setFilter}
          onSearch={setSearchQuery}
          searchValue={searchQuery}
          searchPlaceholder="Rechercher un professeur..."
        />
      </Card>

      {/* Teachers Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
        {filteredTeachers.map((teacher: any) => {
          return (
            <Card 
              key={teacher.id} 
              style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => handleViewDetails(teacher)}
            >
              <div style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: teacher.specialties[0] ? specialtyColors[teacher.specialties[0]] : '#6490ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20, fontWeight: 600 }}>
                      {teacher.firstName[0]}{teacher.lastName[0]}
                    </div>
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: Colors.text }}>
                        {teacher.firstName} {teacher.lastName}
                      </div>
                      <div style={{ fontSize: 12, color: Colors.textMuted }}>{teacher.email}</div>
                    </div>
                  </div>
                  <StatusBadge status={teacher.status} />
                </div>
                
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 6 }}>SPÉCIALITÉS</div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {teacher.specialties.map((specialty: string, idx: number) => (
                      <span 
                        key={idx}
                        style={{ 
                          padding: '4px 10px', 
                          borderRadius: 6, 
                          fontSize: 11, 
                          fontWeight: 500, 
                          background: `${specialtyColors[specialty]}20`, 
                          color: specialtyColors[specialty] 
                        }}
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, paddingTop: 16, borderTop: `1px solid ${Colors.border}` }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: Colors.text }}>{teacher.coursesCount}</div>
                    <div style={{ fontSize: 10, color: Colors.textMuted }}>Cours</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: Colors.text }}>{teacher.studentsCount}</div>
                    <div style={{ fontSize: 10, color: Colors.textMuted }}>Apprenants</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 16, fontWeight: 600, color: '#c9a84c' }}>★ {teacher.rating}</div>
                    <div style={{ fontSize: 10, color: Colors.textMuted }}>Note</div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredTeachers.length === 0 && (
        <Card style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 8 }}>Aucun professeur trouvé</div>
          <div style={{ fontSize: 13, color: Colors.textMuted }}>Essayez de modifier vos critères de recherche</div>
        </Card>
      )}

      {/* Pagination */}
      <div style={{ marginTop: 20 }}>
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          showingFrom={showingFrom}
          showingTo={showingTo}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Teacher Form Modal */}
      <TeacherForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setSelectedTeacher(null); }}
        onSubmit={handleTeacherSubmit}
        teacher={selectedTeacher}
      />

      {/* Teacher Details Modal */}
      {selectedTeacher && (
        <Modal 
          isOpen={isDetailsOpen} 
          onClose={() => { setIsDetailsOpen(false); setSelectedTeacher(null); }} 
          title={`${selectedTeacher.firstName} ${selectedTeacher.lastName}`}
          size="lg"
        >
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 24, marginBottom: 24 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 100, height: 100, borderRadius: '50%', background: selectedTeacher.specialties[0] ? specialtyColors[selectedTeacher.specialties[0]] : '#6490ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 32, fontWeight: 600 }}>
                  {selectedTeacher.firstName[0]}{selectedTeacher.lastName[0]}
                </div>
                <StatusBadge status={selectedTeacher.status} size="lg" />
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ color: '#c9a84c', fontSize: 18 }}>★</span>
                  <span style={{ fontSize: 18, fontWeight: 600, color: Colors.text }}>{selectedTeacher.rating}</span>
                  <span style={{ fontSize: 12, color: Colors.textMuted }}>/5</span>
                </div>
              </div>
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>EMAIL</div>
                    <div style={{ fontSize: 13, color: Colors.text }}>{selectedTeacher.email}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>TÉLÉPHONE</div>
                    <div style={{ fontSize: 13, color: Colors.text }}>{selectedTeacher.phone}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>DATE D'EMBAUCHE</div>
                    <div style={{ fontSize: 13, color: Colors.text }}>
                      {selectedTeacher.hireDate.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>TAUX HORAIRE</div>
                    <div style={{ fontSize: 13, color: Colors.text }}>{selectedTeacher.hourlyRate.toLocaleString('fr-FR')} CFA</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: Colors.text, marginBottom: 12 }}>Spécialités</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {selectedTeacher.specialties.map((specialty: string, idx: number) => (
                  <span 
                    key={idx}
                    style={{ 
                      padding: '6px 14px', 
                      borderRadius: 8, 
                      fontSize: 12, 
                      fontWeight: 500, 
                      background: `${specialtyColors[specialty]}20`, 
                      color: specialtyColors[specialty] 
                    }}
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
              <Card style={{ padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>{selectedTeacher.coursesCount}</div>
                <div style={{ fontSize: 11, color: Colors.textMuted }}>COURS ASSIGNÉS</div>
              </Card>
              <Card style={{ padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>{selectedTeacher.studentsCount}</div>
                <div style={{ fontSize: 11, color: Colors.textMuted }}>APPRENANTS</div>
              </Card>
              <Card style={{ padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#3ecf8e', fontFamily: "'DM Serif Display', serif" }}>95%</div>
                <div style={{ fontSize: 11, color: Colors.textMuted }}>SATISFACTION</div>
              </Card>
            </div>

            <div style={{ borderTop: `1px solid ${Colors.border}`, paddingTop: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: Colors.text, marginBottom: 12 }}>Cours récents</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {['React & Next.js', 'Node.js Backend', 'Bases de données'].map((course, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px', background: 'rgba(100, 140, 255, 0.03)', borderRadius: 8 }}>
                    <span style={{ fontSize: 13, color: Colors.text }}>{course}</span>
                    <span style={{ fontSize: 11, color: Colors.textMuted }}>DW-2025</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
              <Button variant="secondary" onClick={() => { setIsDetailsOpen(false); setSelectedTeacher(null); }}>Fermer</Button>
              <Button variant="primary" onClick={() => { setIsDetailsOpen(false); setIsFormOpen(true); }}>Modifier</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Teachers;

