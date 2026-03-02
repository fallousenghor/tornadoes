// Employees Page - RH & ORG Module
// Complete employee management with search, filters, pagination and modal

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, Button, Badge, SectionTitle, SearchInput } from '../../components/common';
import { Colors, Spacing, BorderRadius } from '../../constants/theme';
import type { Employee, EmployeeStatus, ContractType, Department } from '../../types';
import { EmployeeForm } from './components';
import type { EmployeeFormData } from './components/EmployeeForm';
import employeeService, { CreateEmployeeRequest, UpdateEmployeeRequest } from '../../services/employeeService';

// Default departments as fallback
const defaultDepartments: Department[] = [
  { id: '1', name: 'Tech', code: 'TECH', budget: 180000, spent: 142000, createdAt: new Date() },
  { id: '2', name: 'RH', code: 'RH', budget: 95000, spent: 88000, createdAt: new Date() },
  { id: '3', name: 'Finance', code: 'FIN', budget: 120000, spent: 98000, createdAt: new Date() },
  { id: '4', name: 'Ventes', code: 'VT', budget: 220000, spent: 198000, createdAt: new Date() },
  { id: '5', name: 'Formation', code: 'FORM', budget: 150000, spent: 115000, createdAt: new Date() },
];

// Extended employee type for display
interface EmployeeDisplay extends Employee {
  departmentName: string;
}

// Status badge colors
const getStatusBadge = (status: EmployeeStatus) => {
  const styles: Record<EmployeeStatus, { bg: string; color: string }> = {
    'Actif': { bg: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e' },
    'Congé': { bg: 'rgba(251, 146, 60, 0.15)', color: '#fb923c' },
    'Inactif': { bg: 'rgba(160, 174, 192, 0.15)', color: '#a0aeb0' },
    'Suspendu': { bg: 'rgba(224, 80, 80, 0.15)', color: '#e05050' },
  };
  return styles[status] || styles['Actif'];
};

// Contract badge colors
const getContractBadge = (contract: ContractType) => {
  const styles: Record<ContractType, { bg: string; color: string }> = {
    'CDI': { bg: 'rgba(100, 140, 255, 0.15)', color: '#6490ff' },
    'CDD': { bg: 'rgba(167, 139, 250, 0.15)', color: '#a78bfa' },
    'Freelance': { bg: 'rgba(45, 212, 191, 0.15)', color: '#2dd4bf' },
    'Stage': { bg: 'rgba(201, 168, 76, 0.15)', color: '#c9a84c' },
  };
  return styles[contract] || styles['CDI'];
};

export const Employees: React.FC = () => {
  // State
  const [employees, setEmployees] = useState<EmployeeDisplay[]>([]);
  const [departments, setDepartments] = useState<Department[]>(defaultDepartments);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus | 'all'>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [contractFilter, setContractFilter] = useState<ContractType | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDisplay | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailEmployee, setDetailEmployee] = useState<EmployeeDisplay | null>(null);
  const itemsPerPage = 8;

  // Fetch employees from API
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await employeeService.getEmployees();
      
      // Enrich employees with department names
      const enrichedEmployees: EmployeeDisplay[] = response.data.map(emp => {
        const dept = departments.find(d => d.id === emp.departmentId);
        return { ...emp, departmentName: dept?.name || 'N/A' };
      });
      
      setEmployees(enrichedEmployees);
    } catch (err) {
      console.error('Error fetching employees:', err);
      setError('Erreur lors du chargement des employés - utilisation des données locales');
      // No fallback - just show empty or error state
    } finally {
      setLoading(false);
    }
  }, [departments]);

  // Fetch departments
  const fetchDepartments = useCallback(async () => {
    try {
      const depts = await employeeService.getDepartments();
      if (depts && depts.length > 0) {
        setDepartments(depts.map(d => ({
          id: d.id,
          name: d.name,
          code: d.name.substring(0, 3).toUpperCase(),
          budget: 0,
          spent: 0,
          createdAt: new Date()
        })));
      }
    } catch (err) {
      console.error('Error fetching departments:', err);
      // Keep fallback to mock data
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchesSearch = 
        emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.poste.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;
      const matchesDept = deptFilter === 'all' || emp.departmentId === deptFilter;
      const matchesContract = contractFilter === 'all' || emp.contractType === contractFilter;
      
      return matchesSearch && matchesStatus && matchesDept && matchesContract;
    });
  }, [employees, searchQuery, statusFilter, deptFilter, contractFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Open modal for new employee
  const handleNewEmployee = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  // Open modal for edit employee
  const handleEditEmployee = (emp: EmployeeDisplay) => {
    setSelectedEmployee(emp);
    setIsModalOpen(true);
  };

  // View employee details
  const handleViewEmployee = async (emp: EmployeeDisplay) => {
    try {
      const fullEmployee = await employeeService.getEmployee(emp.id);
      setDetailEmployee({
        ...fullEmployee,
        departmentName: departments.find(d => d.id === fullEmployee.departmentId)?.name || 'N/A'
      });
      setIsDetailModalOpen(true);
    } catch (err) {
      console.error('Error fetching employee details:', err);
      alert('Erreur lors du chargement des détails');
    }
  };

  // Delete (terminate) employee
  const handleDeleteEmployee = async (emp: EmployeeDisplay) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'employé ${emp.firstName} ${emp.lastName} ?`)) {
      return;
    }
    try {
      await employeeService.deleteEmployee(emp.id);
      fetchEmployees();
    } catch (err) {
      console.error('Error deleting employee:', err);
      alert('Erreur lors de la suppression');
    }
  };

  // Handle form submission (create or update)
  const handleEmployeeSubmit = async (data: EmployeeFormData) => {
    try {
      if (selectedEmployee) {
        // Update existing employee
        const updateData: UpdateEmployeeRequest = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          poste: data.poste,
          departmentId: data.departmentId,
          contractType: data.contractType,
          salary: data.salary,
          startDate: data.startDate,
          notes: data.notes,
        };
        await employeeService.updateEmployee(selectedEmployee.id, updateData);
      } else {
        // Create new employee
        const createData: CreateEmployeeRequest = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          poste: data.poste,
          departmentId: data.departmentId,
          contractType: data.contractType,
          salary: data.salary,
          startDate: data.startDate,
          notes: data.notes,
        };
        await employeeService.createEmployee(createData);
      }
      // Refresh the employee list
      fetchEmployees();
    } catch (err) {
      console.error('Error saving employee:', err);
      alert('Erreur lors de l\'enregistrement de l\'employé');
    }
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: Colors.text, marginBottom: 4 }}>
            Gestion des Employés
          </h1>
          <p style={{ fontSize: 13, color: Colors.textMuted }}>
            {loading ? 'Chargement...' : `${filteredEmployees.length} employé(s) trouvé(s)`}
          </p>
        </div>
        <Button variant="primary" onClick={handleNewEmployee}>
          + Nouvel Employé
        </Button>
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

      {/* Filters Card */}
      <Card style={{ marginBottom: 20, padding: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 12, alignItems: 'end' }}>
          <SearchInput 
            placeholder="Rechercher par nom, email, poste..."
            value={searchQuery}
            onChange={(value) => { setSearchQuery(value); handleFilterChange(); }}
          />
          <div>
            <label style={{ display: 'block', fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>
              Statut
            </label>
            <select 
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as EmployeeStatus | 'all'); handleFilterChange(); }}
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
              <option value="all">Tous les statuts</option>
              <option value="Actif">Actif</option>
              <option value="Congé">Congé</option>
              <option value="Inactif">Inactif</option>
              <option value="Suspendu">Suspendu</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>
              Département
            </label>
            <select 
              value={deptFilter}
              onChange={(e) => { setDeptFilter(e.target.value); handleFilterChange(); }}
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
              <option value="all">Tous les départements</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>
              Type de contrat
            </label>
            <select 
              value={contractFilter}
              onChange={(e) => { setContractFilter(e.target.value as ContractType | 'all'); handleFilterChange(); }}
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
              <option value="all">Tous les contrats</option>
              <option value="CDI">CDI</option>
              <option value="CDD">CDD</option>
              <option value="Freelance">Freelance</option>
              <option value="Stage">Stage</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table Card */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(100, 140, 255, 0.05)' }}>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Employé</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Poste</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Département</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Contrat</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Salaire (FCFA)</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Statut</th>
                <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.map((emp, index) => {
                const statusStyle = getStatusBadge(emp.status);
                const contractStyle = getContractBadge(emp.contractType);
                return (
                  <tr 
                    key={emp.id} 
                    style={{ 
                      borderBottom: `1px solid ${Colors.border}`,
                      background: index % 2 === 0 ? 'transparent' : 'rgba(100, 140, 255, 0.02)',
                    }}
                  >
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ 
                          width: 40, 
                          height: 40, 
                          borderRadius: '50%', 
                          background: 'rgba(100, 140, 255, 0.15)', 
                          border: '1px solid rgba(100, 140, 255, 0.3)',
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          fontSize: 13, 
                          fontWeight: 600, 
                          color: Colors.accent,
                        }}>
                          {emp.firstName[0]}{emp.lastName[0]}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 500, color: Colors.text }}>
                            {emp.firstName} {emp.lastName}
                          </div>
                          <div style={{ fontSize: 12, color: Colors.textMuted }}>{emp.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: Colors.text }}>{emp.poste}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <Badge color={Colors.accent}>{emp.departmentName}</Badge>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: 6, 
                        fontSize: 11, 
                        fontWeight: 500,
                        background: contractStyle.bg, 
                        color: contractStyle.color 
                      }}>
                        {emp.contractType}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 14, fontWeight: 600, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                      {emp.salary.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: 6, 
                        fontSize: 11, 
                        fontWeight: 500,
                        background: statusStyle.bg, 
                        color: statusStyle.color 
                      }}>
                        {emp.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <button 
                          onClick={() => handleViewEmployee(emp)}
                          style={{ 
                            padding: '6px 10px', 
                            borderRadius: 6, 
                            border: `1px solid ${Colors.border}`, 
                            background: 'transparent', 
                            color: Colors.textMuted, 
                            fontSize: 11, 
                            cursor: 'pointer',
                          }}
                          title="Voir les détails"
                        >
                          👁
                        </button>
                        <button 
                          onClick={() => handleEditEmployee(emp)}
                          style={{ 
                            padding: '6px 12px', 
                            borderRadius: 6, 
                            border: `1px solid ${Colors.border}`, 
                            background: 'transparent', 
                            color: Colors.textMuted, 
                            fontSize: 11, 
                            cursor: 'pointer',
                          }}
                        >
                          ✎ Éditer
                        </button>
                        <button 
                          onClick={() => handleDeleteEmployee(emp)}
                          style={{ 
                            padding: '6px 10px', 
                            borderRadius: 6, 
                            border: `1px solid rgba(224, 80, 80, 0.3)`, 
                            background: 'transparent', 
                            color: '#e05050', 
                            fontSize: 11, 
                            cursor: 'pointer',
                          }}
                          title="Supprimer"
                        >
                          🗑
                        </button>
                      </div>
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
            Affichage de {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, filteredEmployees.length)} sur {filteredEmployees.length}
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
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
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
      </Card>

      {/* Employee Form Modal */}
      <EmployeeForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleEmployeeSubmit}
        employee={selectedEmployee}
        departments={departments}
      />

      {/* Employee Detail Modal */}
      {isDetailModalOpen && detailEmployee && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div style={{
            background: Colors.bg,
            borderRadius: 12,
            padding: 24,
            maxWidth: 600,
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, color: Colors.text }}>
                Détails de l'employé
              </h2>
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: Colors.textMuted }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ fontSize: 11, color: Colors.textMuted }}>Nom complet</label>
                <p style={{ fontSize: 14, color: Colors.text, fontWeight: 500 }}>
                  {detailEmployee.firstName} {detailEmployee.lastName}
                </p>
              </div>
              <div>
                <label style={{ fontSize: 11, color: Colors.textMuted }}>Email</label>
                <p style={{ fontSize: 14, color: Colors.text }}>{detailEmployee.email}</p>
              </div>
              <div>
                <label style={{ fontSize: 11, color: Colors.textMuted }}>Téléphone</label>
                <p style={{ fontSize: 14, color: Colors.text }}>{detailEmployee.phone || '-'}</p>
              </div>
              <div>
                <label style={{ fontSize: 11, color: Colors.textMuted }}>Poste</label>
                <p style={{ fontSize: 14, color: Colors.text }}>{detailEmployee.poste}</p>
              </div>
              <div>
                <label style={{ fontSize: 11, color: Colors.textMuted }}>Département</label>
                <p style={{ fontSize: 14, color: Colors.text }}>{detailEmployee.departmentName}</p>
              </div>
              <div>
                <label style={{ fontSize: 11, color: Colors.textMuted }}>Type de contrat</label>
                <p style={{ fontSize: 14, color: Colors.text }}>{detailEmployee.contractType}</p>
              </div>
              <div>
                <label style={{ fontSize: 11, color: Colors.textMuted }}>Salaire</label>
                <p style={{ fontSize: 14, color: Colors.text, fontWeight: 600 }}>
                  {detailEmployee.salary.toLocaleString()} FCA
                </p>
              </div>
              <div>
                <label style={{ fontSize: 11, color: Colors.textMuted }}>Statut</label>
                <span style={{ 
                  padding: '4px 10px', 
                  borderRadius: 6, 
                  fontSize: 11, 
                  fontWeight: 500,
                  background: getStatusBadge(detailEmployee.status).bg, 
                  color: getStatusBadge(detailEmployee.status).color 
                }}>
                  {detailEmployee.status}
                </span>
              </div>
              <div>
                <label style={{ fontSize: 11, color: Colors.textMuted }}>Date de début</label>
                <p style={{ fontSize: 14, color: Colors.text }}>
                  {new Date(detailEmployee.startDate).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <div>
                <label style={{ fontSize: 11, color: Colors.textMuted }}>Notes</label>
                <p style={{ fontSize: 14, color: Colors.text }}>{detailEmployee.notes || '-'}</p>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
              <Button variant="secondary" onClick={() => setIsDetailModalOpen(false)}>
                Fermer
              </Button>
              <Button variant="primary" onClick={() => {
                setIsDetailModalOpen(false);
                handleEditEmployee(detailEmployee);
              }}>
                Modifier
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Employees;

