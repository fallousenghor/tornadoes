// Employees Page - RH & ORG Module
// Complete employee management with search, filters, pagination and modal

import React, { useState, useMemo } from 'react';
import { Card, Button, Badge, SectionTitle, SearchInput } from '../../components/common';
import { Colors, Spacing, BorderRadius } from '../../constants/theme';
import { employeesData, deptPerformance } from '../../data/mockData';
import type { Employee, EmployeeStatus, ContractType } from '../../types';
import { EmployeeForm } from './components';
import type { EmployeeFormData } from './components/EmployeeForm';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus | 'all'>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [contractFilter, setContractFilter] = useState<ContractType | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDisplay | null>(null);
  const itemsPerPage = 8;

  // Enrich employees with department names
  const employees: EmployeeDisplay[] = useMemo(() => {
    return employeesData.map(emp => {
      const dept = deptPerformance.find(d => d.id === emp.departmentId);
      return { ...emp, departmentName: dept?.name || 'N/A' };
    });
  }, []);

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

  // Handle form submission
  const handleEmployeeSubmit = (data: EmployeeFormData) => {
    console.log('Employee data submitted:', data);
    // Here you would typically call an API to save the employee
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
            {filteredEmployees.length} employé(s) trouvé(s)
          </p>
        </div>
        <Button variant="primary" onClick={handleNewEmployee}>
          + Nouvel Employé
        </Button>
      </div>

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
              {deptPerformance.map(dept => (
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
                        <button style={{ 
                          padding: '6px 10px', 
                          borderRadius: 6, 
                          border: `1px solid ${Colors.border}`, 
                          background: 'transparent', 
                          color: Colors.textMuted, 
                          fontSize: 11, 
                          cursor: 'pointer',
                        }}>
                          ☰
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
      />
    </div>
  );
};

export default Employees;

