// Students Page - Formation & Education Module
// Complete student management with search, filters, pagination and modal

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, Button, Badge, SectionTitle, SearchInput } from '../../components/common';
import { Colors, Spacing, BorderRadius } from '../../constants/theme';
import type { Student, StudentStatus } from '../../types';
import { StudentForm, DeleteConfirmModal } from './components';
import type { StudentFormData } from './components/StudentForm';
import studentService from '../../services/studentService';

// Extended student type for display
interface StudentDisplay extends Student {
  actions?: string;
}

// Status badge colors
const getStatusBadge = (status: StudentStatus) => {
  const styles: Record<StudentStatus, { bg: string; color: string }> = {
    'ACTIVE': { bg: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e' },
    'GRADUATED': { bg: 'rgba(30, 58, 138, 0.15)', color: '#1E3A8A' },
    'SUSPENDED': { bg: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B' },
    'DROPPED_OUT': { bg: 'rgba(220, 38, 38, 0.15)', color: '#DC2626' },
  };
  return styles[status] || styles['ACTIVE'];
};

export const Students: React.FC = () => {
  // State
  const [students, setStudents] = useState<StudentDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StudentStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentDisplay | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<StudentDisplay | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const itemsPerPage = 8;

  // Fetch students from API
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await studentService.getStudents({ 
        page: currentPage - 1,
        pageSize: itemsPerPage
      });
      setStudents(response.data);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Erreur lors du chargement des étudiants');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  // Load data on mount or when currentPage changes
  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Filter students
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = 
        student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.userId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || student.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [students, searchQuery, statusFilter]);

  // Handle open modal
  const handleOpenModal = (student?: StudentDisplay) => {
    setSelectedStudent(student || null);
    setIsModalOpen(true);
  };

  // Handle form submit
  const handleFormSubmit = async (data: StudentFormData) => {
    try {
      if (selectedStudent) {
        // Update existing student
        const updated = await studentService.updateStudent(selectedStudent.id, data);
        setStudents(students.map(s => s.id === selectedStudent.id ? updated : s));
      } else {
        // Create new student
        const created = await studentService.createStudent(data);
        setStudents([created, ...students]);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error submitting student form:', err);
      setError('Erreur lors de la sauvegarde');
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!studentToDelete) return;
    
    try {
      setDeleteLoading(true);
      // Note: studentService doesn't have deleteStudent yet, so we skip for now
      // In production, implement this: await studentService.deleteStudent(studentToDelete.id);
      
      setStudents(students.filter(s => s.id !== studentToDelete.id));
      setDeleteModalOpen(false);
      setStudentToDelete(null);
    } catch (err) {
      console.error('Error deleting student:', err);
      setError('Erreur lors de la suppression');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Reset page when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    handleFilterChange();
  };

  const handleStatusFilterChange = (status: StudentStatus | 'all') => {
    setStatusFilter(status);
    handleFilterChange();
  };

  // Pagination
  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);
  const paginatedStudents = filteredStudents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Styles
  const containerStyle: React.CSSProperties = {
    padding: 24,
    background: Colors.bgLight,
    minHeight: '100vh',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    gap: 16,
    flexWrap: 'wrap',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 24,
    fontWeight: 700,
    color: Colors.text,
    margin: 0,
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: 14,
    color: Colors.textMuted,
    margin: '4px 0 0',
  };

  const statsStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 16,
    marginBottom: 32,
  };

  const statCardStyle: React.CSSProperties = {
    background: Colors.bg,
    padding: 16,
    borderRadius: BorderRadius.md,
    border: `1px solid ${Colors.border}`,
    textAlign: 'center',
  };

  const statValueStyle: React.CSSProperties = {
    fontSize: 28,
    fontWeight: 700,
    color: Colors.primary,
    margin: '0 0 8px',
  };

  const statLabelStyle: React.CSSProperties = {
    fontSize: 13,
    color: Colors.textMuted,
    margin: 0,
  };

  const tableContainerStyle: React.CSSProperties = {
    background: Colors.bg,
    borderRadius: BorderRadius.md,
    border: `1px solid ${Colors.border}`,
    overflow: 'hidden',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: 13,
  };

  const thStyle: React.CSSProperties = {
    padding: 16,
    textAlign: 'left',
    borderBottom: `1px solid ${Colors.border}`,
    backgroundColor: Colors.bgLight,
    fontWeight: 600,
    color: Colors.textMuted,
    fontSize: 12,
  };

  const tdStyle: React.CSSProperties = {
    padding: 16,
    borderBottom: `1px solid ${Colors.border}`,
    color: Colors.text,
  };

  const trHoverStyle: React.CSSProperties = {
    backgroundColor: Colors.bgLight,
    cursor: 'pointer',
  };

  const actionButtonsStyle: React.CSSProperties = {
    display: 'flex',
    gap: 8,
  };

  const emptyStyle: React.CSSProperties = {
    padding: 48,
    textAlign: 'center',
    color: Colors.textMuted,
  };

  const loadingStyle: React.CSSProperties = {
    padding: 48,
    textAlign: 'center',
    color: Colors.textMuted,
  };

  const filterBarStyle: React.CSSProperties = {
    display: 'flex',
    gap: 16,
    marginBottom: 24,
    alignItems: 'center',
    flexWrap: 'wrap',
  };

  const paginationStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTop: `1px solid ${Colors.border}`,
  };

  const paginationTextStyle: React.CSSProperties = {
    fontSize: 13,
    color: Colors.textMuted,
  };

  const paginationButtonsStyle: React.CSSProperties = {
    display: 'flex',
    gap: 8,
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>🎓 Étudiants</h1>
          <p style={subtitleStyle}>Gérez les inscriptions et le suivi des apprenants</p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => handleOpenModal()}
        >
          ➕ Nouvel Étudiant
        </Button>
      </div>

      {/* Stats */}
      <div style={statsStyle}>
        <div style={statCardStyle}>
          <div style={statValueStyle}>{students.length}</div>
          <p style={statLabelStyle}>Total</p>
        </div>
        <div style={statCardStyle}>
          <div style={statValueStyle}>
            {students.filter(s => s.status === 'ACTIVE').length}
          </div>
          <p style={statLabelStyle}>Actifs</p>
        </div>
        <div style={statCardStyle}>
          <div style={statValueStyle}>
            {students.filter(s => s.status === 'GRADUATED').length}
          </div>
          <p style={statLabelStyle}>Inscrits</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div style={filterBarStyle}>
        <SearchInput 
          placeholder="Rechercher par nom, email ou code..." 
          value={searchQuery}
          onChange={handleSearchChange}
          style={{ flex: 1, minWidth: 200 }}
        />
        
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: Colors.textMuted }}>Statut :</span>
          {(['all', 'ACTIVE', 'GRADUATED', 'SUSPENDED', 'DROPPED_OUT'] as const).map(status => (
            <button
              key={status}
              onClick={() => handleStatusFilterChange(status)}
              style={{
                padding: '6px 12px',
                borderRadius: 6,
                border: statusFilter === status ? 'none' : `1px solid ${Colors.border}`,
                background: statusFilter === status ? Colors.primary : Colors.bg,
                color: statusFilter === status ? 'white' : Colors.text,
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {status === 'all' ? 'Tous' : 
               status === 'ACTIVE' ? 'Actifs' : 
               status === 'GRADUATED' ? 'Diplômés' :
               status === 'SUSPENDED' ? 'Suspendus' : 'Abandons'}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          padding: 12,
          marginBottom: 16,
          backgroundColor: 'rgba(220, 38, 38, 0.1)',
          border: `1px solid ${Colors.danger}`,
          borderRadius: 8,
          color: Colors.danger,
          fontSize: 13,
        }}>
          {error}
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div style={loadingStyle}>⏳ Chargement des étudiants...</div>
      ) : filteredStudents.length === 0 ? (
        <div style={emptyStyle}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
          <p>Aucun étudiant trouvé</p>
        </div>
      ) : (
        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Nom Complet</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Téléphone</th>
                <th style={thStyle}>Code Étudiant</th>
                <th style={thStyle}>Statut</th>
                <th style={thStyle}>Date d'inscription</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedStudents.map((student) => {
                const statusBadge = getStatusBadge(student.status);
                return (
                  <tr 
                    key={student.id} 
                    style={{
                      ...tdStyle,
                      borderBottom: `1px solid ${Colors.border}`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = Colors.bgLight;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <td style={tdStyle}>
                      <div>
                        <div style={{ fontWeight: 600, color: Colors.text }}>
                          {student.firstName} {student.lastName}
                        </div>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ color: Colors.textMuted, fontSize: 12 }}>
                        {student.email}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {student.phone || '—'}
                    </td>
                    <td style={tdStyle}>
                      <code style={{
                        background: Colors.bgLight,
                        padding: '4px 8px',
                        borderRadius: 4,
                        fontSize: 11,
                        fontFamily: 'monospace',
                      }}>
                        {student.userId}
                      </code>
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        ...statusBadge,
                        padding: '4px 8px',
                        borderRadius: 4,
                        fontSize: 11,
                        fontWeight: 500,
                        display: 'inline-block',
                      }}>
                        {student.status === 'ACTIVE' ? '✓ Actif' : 
                         student.status === 'GRADUATED' ? '🎓 Diplômé' :
                         student.status === 'SUSPENDED' ? '⏸ Suspendu' : '✕ Abandonné'}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {student.enrollmentDate.toLocaleDateString('fr-FR')}
                    </td>
                    <td style={tdStyle}>
                      <div style={actionButtonsStyle}>
                        <button
                          onClick={() => handleOpenModal(student)}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 4,
                            background: Colors.primaryMuted,
                            color: Colors.primary,
                            border: 'none',
                            fontSize: 12,
                            fontWeight: 500,
                            cursor: 'pointer',
                          }}
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => {
                            setStudentToDelete(student);
                            setDeleteModalOpen(true);
                          }}
                          style={{
                            padding: '6px 12px',
                            borderRadius: 4,
                            background: 'rgba(220, 38, 38, 0.1)',
                            color: Colors.danger,
                            border: 'none',
                            fontSize: 12,
                            fontWeight: 500,
                            cursor: 'pointer',
                          }}
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          <div style={{ ...paginationStyle, padding: 16 }}>
            <p style={paginationTextStyle}>
              Affichage {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, filteredStudents.length)} sur {filteredStudents.length}
            </p>
            <div style={paginationButtonsStyle}>
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '6px 12px',
                  borderRadius: 4,
                  border: `1px solid ${Colors.border}`,
                  background: Colors.bg,
                  color: Colors.text,
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  opacity: currentPage === 1 ? 0.5 : 1,
                }}
              >
                ← Précédent
              </button>
              <span style={{ fontSize: 12, color: Colors.textMuted }}>
                Page {currentPage} / {totalPages || 1}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages}
                style={{
                  padding: '6px 12px',
                  borderRadius: 4,
                  border: `1px solid ${Colors.border}`,
                  background: Colors.bg,
                  color: Colors.text,
                  cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                  opacity: currentPage >= totalPages ? 0.5 : 1,
                }}
              >
                Suivant →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal */}
      <StudentForm
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedStudent(null);
        }}
        onSubmit={handleFormSubmit}
        student={selectedStudent}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Supprimer l'étudiant"
        message={`Êtes-vous sûr de vouloir supprimer ${studentToDelete?.firstName} ${studentToDelete?.lastName} ? Cette action est irréversible.`}
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default Students;
