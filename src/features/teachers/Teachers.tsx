// Teachers Feature - Tornadoes Job Education Module
// Connected to backend API

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, Button, Modal, FilterBar, PaginationControls } from '../../components/common';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Colors } from '../../constants/theme';
import { TeacherForm } from './components';
import type { TeacherFormData } from './components/TeacherForm';
import teacherService from '../../services/teacherService';
import type { Teacher } from '@/types';

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

// Convert backend active status to frontend status
const getFrontendStatus = (active: boolean): string => {
  return active ? 'actif' : 'inactif';
};

// Filter options
const statusOptions = [
  { value: '', label: 'Tous les statuts' },
  { value: 'actif', label: 'Actif' },
  { value: 'inactif', label: 'Inactif' },
  { value: 'conge', label: 'Congé' },
];

const specialtyOptions = [
  { value: '', label: 'Toutes les spécialités' },
  { value: 'Développement Web', label: 'Développement Web' },
  { value: 'Data Science', label: 'Data Science' },
  { value: 'Cybersécurité', label: 'Cybersécurité' },
  { value: 'Marketing Digital', label: 'Marketing Digital' },
  { value: 'Gestion de projet', label: 'Gestion de projet' },
  { value: 'Base de données', label: 'Base de données' },
];

export const Teachers: React.FC = () => {
  // State
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  
  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');

  // Fetch teachers from API
  const fetchTeachers = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await teacherService.getTeachers({
        page: currentPage,
        pageSize: pageSize,
        search: searchQuery || undefined,
      });
      setTeachers(result.data);
      setTotalItems(result.total);
      setTotalPages(Math.ceil(result.total / pageSize));
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setTeachers([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchQuery]);

  // Initial load
  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  // Calculate stats
  const stats = useMemo(() => {
    const active = teachers.filter(t => getFrontendStatus(true) === 'actif').length;
    return {
      total: teachers.length,
      active,
      totalCourses: teachers.length * 2, // Placeholder - backend might provide this
      totalStudents: teachers.length * 30, // Placeholder - backend might provide this
      avgRating: '4.7', // Placeholder - backend might provide this
    };
  }, [teachers]);

  // Handle form submission
  const handleTeacherSubmit = async (data: TeacherFormData) => {
    try {
      if (selectedTeacher) {
        await teacherService.updateTeacher(selectedTeacher.id, {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          specialization: data.specialties?.[0] || '',
        });
      } else {
        await teacherService.createTeacher({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          specialization: data.specialties?.[0] || '',
        });
      }
      setIsFormOpen(false);
      setSelectedTeacher(null);
      fetchTeachers();
    } catch (error) {
      console.error('Error saving teacher:', error);
    }
  };

  const handleNewTeacher = () => {
    setSelectedTeacher(null);
    setIsFormOpen(true);
  };

  const handleViewDetails = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsDetailsOpen(true);
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setIsDetailsOpen(false);
    setIsFormOpen(true);
  };

  const handleDeleteTeacher = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce professeur ?')) return;
    try {
      // Note: Need to add delete method to teacherService if needed
      console.log('Delete teacher:', id);
      setIsDetailsOpen(false);
      setSelectedTeacher(null);
      fetchTeachers();
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  };

  // Handle filter change
  const handleFilterChange = (key: string, value: string) => {
    if (key === 'status') {
      setStatusFilter(value);
    } else if (key === 'specialty') {
      setSpecialtyFilter(value);
    }
    setCurrentPage(0); // Reset to first page
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(0); // Reset to first page
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Filter teachers by specialty
  const filteredTeachers = useMemo(() => {
    if (!specialtyFilter) return teachers;
    return teachers.filter(teacher => 
      teacher.specialties?.includes(specialtyFilter)
    );
  }, [teachers, specialtyFilter]);

  // Calculate pagination values
  const showingFrom = totalItems > 0 ? currentPage * pageSize + 1 : 0;
  const showingTo = Math.min((currentPage + 1) * pageSize, totalItems);

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
                {isLoading ? '...' : totalItems}
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
                {isLoading ? '...' : stats.active}
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
                {isLoading ? '...' : stats.totalCourses}
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
                {isLoading ? '...' : stats.totalStudents}
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
          values={{ specialty: specialtyFilter }}
          onChange={handleFilterChange}
          onSearch={handleSearch}
          searchValue={searchQuery}
          searchPlaceholder="Rechercher un professeur..."
        />
      </Card>

      {/* Teachers Grid */}
      {isLoading ? (
        <Card style={{ padding: 40, textAlign: 'center', color: Colors.textMuted }}>
          Chargement des professeurs...
        </Card>
      ) : filteredTeachers.length === 0 ? (
        <Card style={{ padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 8 }}>Aucun professeur trouvé</div>
          <div style={{ fontSize: 13, color: Colors.textMuted }}>Essayez de modifier vos critères de recherche</div>
        </Card>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
            {filteredTeachers.map((teacher) => {
              const status = getFrontendStatus(true); // Backend provides active field
              const specialty = teacher.specialties?.[0] || 'Développement Web';
              
              return (
                <Card 
                  key={teacher.id} 
                  style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
                  onClick={() => handleViewDetails(teacher)}
                >
                  <div style={{ padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 56, height: 56, borderRadius: '50%', background: specialtyColors[specialty] || '#6490ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20, fontWeight: 600 }}>
                          {teacher.firstName[0]}{teacher.lastName[0]}
                        </div>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: Colors.text }}>
                            {teacher.firstName} {teacher.lastName}
                          </div>
                          <div style={{ fontSize: 12, color: Colors.textMuted }}>{teacher.email}</div>
                        </div>
                      </div>
                      <StatusBadge status={status} />
                    </div>
                    
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 6 }}>SPÉCIALITÉS</div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {teacher.specialties?.map((specialtyItem, idx) => (
                          <span 
                            key={idx}
                            style={{ 
                              padding: '4px 10px', 
                              borderRadius: 6, 
                              fontSize: 11, 
                              fontWeight: 500, 
                              background: `${specialtyColors[specialtyItem] || '#6490ff'}20`, 
                              color: specialtyColors[specialtyItem] || '#6490ff' 
                            }}
                          >
                            {specialtyItem}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, paddingTop: 16, borderTop: `1px solid ${Colors.border}` }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 16, fontWeight: 600, color: Colors.text }}>2</div>
                        <div style={{ fontSize: 10, color: Colors.textMuted }}>Cours</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 16, fontWeight: 600, color: Colors.text }}>30</div>
                        <div style={{ fontSize: 10, color: Colors.textMuted }}>Apprenants</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 16, fontWeight: 600, color: '#c9a84c' }}>★ 4.7</div>
                        <div style={{ fontSize: 10, color: Colors.textMuted }}>Note</div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          <div style={{ marginTop: 20 }}>
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              showingFrom={showingFrom}
              showingTo={showingTo}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}

      {/* Teacher Form Modal */}
      <TeacherForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setSelectedTeacher(null); }}
        onSubmit={handleTeacherSubmit}
        teacher={selectedTeacher ? {
          firstName: selectedTeacher.firstName,
          lastName: selectedTeacher.lastName,
          email: selectedTeacher.email,
          phone: selectedTeacher.phone || '',
          specialization: selectedTeacher.specialties?.[0] || '',
        } : undefined}
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
                <div style={{ width: 100, height: 100, borderRadius: '50%', background: specialtyColors[selectedTeacher.specialties?.[0] || 'Développement Web'] || '#6490ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 32, fontWeight: 600 }}>
                  {selectedTeacher.firstName[0]}{selectedTeacher.lastName[0]}
                </div>
                <StatusBadge status="actif" size="lg" />
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ color: '#c9a84c', fontSize: 18 }}>★</span>
                  <span style={{ fontSize: 18, fontWeight: 600, color: Colors.text }}>4.7</span>
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
                    <div style={{ fontSize: 13, color: Colors.text }}>{selectedTeacher.phone || 'N/A'}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>ID</div>
                    <div style={{ fontSize: 13, color: Colors.text }}>{selectedTeacher.id}</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: Colors.text, marginBottom: 12 }}>Spécialités</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {selectedTeacher.specialties?.map((specialtyItem, idx) => (
                  <span 
                    key={idx}
                    style={{ 
                      padding: '6px 14px', 
                      borderRadius: 8, 
                      fontSize: 12, 
                      fontWeight: 500, 
                      background: `${specialtyColors[specialtyItem] || '#6490ff'}20`, 
                      color: specialtyColors[specialtyItem] || '#6490ff' 
                    }}
                  >
                    {specialtyItem}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
              <Card style={{ padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>2</div>
                <div style={{ fontSize: 11, color: Colors.textMuted }}>COURS ASSIGNÉS</div>
              </Card>
              <Card style={{ padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>30</div>
                <div style={{ fontSize: 11, color: Colors.textMuted }}>APPRENANTS</div>
              </Card>
              <Card style={{ padding: 16, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#3ecf8e', fontFamily: "'DM Serif Display', serif" }}>95%</div>
                <div style={{ fontSize: 11, color: Colors.textMuted }}>SATISFACTION</div>
              </Card>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
              <Button 
                variant="secondary" 
                onClick={() => handleDeleteTeacher(selectedTeacher.id)}
                style={{ color: '#e05050', borderColor: '#e05050' }}
              >
                Supprimer
              </Button>
              <Button variant="secondary" onClick={() => { setIsDetailsOpen(false); setSelectedTeacher(null); }}>Fermer</Button>
              <Button variant="primary" onClick={() => handleEditTeacher(selectedTeacher)}>Modifier</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Teachers;

