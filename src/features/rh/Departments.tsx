// Departments Page - RH & ORG Module
// Complete department management with search, filters, budget tracking and modal

import React, { useState, useMemo } from 'react';
import { Card, Button, Badge, SearchInput, Modal, Input } from '../../components/common';
import { Colors } from '../../constants/theme';
import { deptPerformance, employeesData } from '../../data/mockData';
import type { Department } from '../../types';

// Extended department type for display
interface DepartmentDisplay extends Department {
  employeeCount: number;
  managerName: string;
}

// Budget status colors
const getBudgetStatus = (spent: number, budget: number) => {
  const percentage = (spent / budget) * 100;
  if (percentage >= 95) return { bg: 'rgba(224, 80, 80, 0.15)', color: '#e05050', label: 'Critique' };
  if (percentage >= 80) return { bg: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', label: 'Attention' };
  return { bg: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e', label: 'Normal' };
};

export const Departments: React.FC = () => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [budgetFilter, setBudgetFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentDisplay | null>(null);
  const itemsPerPage = 6;

  // Enrich departments with employee counts
  const departments: DepartmentDisplay[] = useMemo(() => {
    return deptPerformance.map(dept => {
      const employeeCount = employeesData.filter(emp => emp.departmentId === dept.id).length;
      // Generate a mock manager name based on department
      const managerNames: Record<string, string> = {
        '1': 'Sara Mendy',
        '2': 'Fatou Diallo',
        '3': 'Moussa Sow',
        '4': 'Ibou Gaye',
        '5': 'Rokhaya Fall',
      };
      return { 
        ...dept, 
        employeeCount,
        managerName: managerNames[dept.id] || 'À assigner'
      };
    });
  }, []);

  // Filter departments
  const filteredDepartments = useMemo(() => {
    return departments.filter(dept => {
      const matchesSearch = 
        dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.managerName.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesBudget = true;
      if (budgetFilter === 'critical') {
        matchesBudget = (dept.spent / dept.budget) >= 0.95;
      } else if (budgetFilter === 'warning') {
        matchesBudget = (dept.spent / dept.budget) >= 0.8 && (dept.spent / dept.budget) < 0.95;
      } else if (budgetFilter === 'normal') {
        matchesBudget = (dept.spent / dept.budget) < 0.8;
      }
      
      return matchesSearch && matchesBudget;
    });
  }, [departments, searchQuery, budgetFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredDepartments.length / itemsPerPage);
  const paginatedDepartments = filteredDepartments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Open modal for new department
  const handleNewDepartment = () => {
    setSelectedDepartment(null);
    setIsModalOpen(true);
  };

  // Open modal for edit department
  const handleEditDepartment = (dept: DepartmentDisplay) => {
    setSelectedDepartment(dept);
    setIsModalOpen(true);
  };

  // Calculate totals
  const totals = useMemo(() => {
    const totalBudget = departments.reduce((sum, d) => sum + d.budget, 0);
    const totalSpent = departments.reduce((sum, d) => sum + d.spent, 0);
    const totalEmployees = departments.reduce((sum, d) => sum + d.employeeCount, 0);
    return { totalBudget, totalSpent, totalEmployees };
  }, [departments]);

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: Colors.text, marginBottom: 4 }}>
            Gestion des Départements
          </h1>
          <p style={{ fontSize: 13, color: Colors.textMuted }}>
            {filteredDepartments.length} département(s) trouvé(s)
          </p>
        </div>
        <Button variant="primary" onClick={handleNewDepartment}>
          + Nouveau Département
        </Button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ 
              width: 48, 
              height: 48, 
              borderRadius: 12, 
              background: 'rgba(100, 140, 255, 0.15)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: 20,
              color: Colors.accent,
            }}>
              ◉
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Départements
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: Colors.text }}>
                {departments.length}
              </div>
            </div>
          </div>
        </Card>
        
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ 
              width: 48, 
              height: 48, 
              borderRadius: 12, 
              background: 'rgba(62, 207, 142, 0.15)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: 20,
              color: '#3ecf8e',
            }}>
              ▦
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Employés
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: Colors.text }}>
                {totals.totalEmployees}
              </div>
            </div>
          </div>
        </Card>
        
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ 
              width: 48, 
              height: 48, 
              borderRadius: 12, 
              background: 'rgba(45, 212, 191, 0.15)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: 20,
              color: '#2dd4bf',
            }}>
              ◆
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Budget Total
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {totals.totalBudget.toLocaleString()} €
              </div>
            </div>
          </div>
        </Card>
        
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ 
              width: 48, 
              height: 48, 
              borderRadius: 12, 
              background: totals.totalSpent / totals.totalBudget >= 0.9 ? 'rgba(224, 80, 80, 0.15)' : 'rgba(251, 146, 60, 0.15)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: 20,
              color: totals.totalSpent / totals.totalBudget >= 0.9 ? '#e05050' : '#fb923c',
            }}>
              ◇
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Budget Consumé
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {((totals.totalSpent / totals.totalBudget) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters Card */}
      <Card style={{ marginBottom: 20, padding: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, alignItems: 'end' }}>
          <SearchInput 
            placeholder="Rechercher par nom, code, responsable..."
            value={searchQuery}
            onChange={(value: string) => { setSearchQuery(value); handleFilterChange(); }}
          />
          <div>
            <label style={{ display: 'block', fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>
              Statut Budget
            </label>
            <select 
              value={budgetFilter}
              onChange={(e) => { setBudgetFilter(e.target.value); handleFilterChange(); }}
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
              <option value="normal">Normal - moins de 80%</option>
              <option value="warning">Attention - 80% à 95%</option>
              <option value="critical">Critique - plus de 95%</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Departments Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 20 }}>
        {paginatedDepartments.map((dept) => {
          const budgetPercent = (dept.spent / dept.budget) * 100;
          const budgetStatus = getBudgetStatus(dept.spent, dept.budget);
          const remaining = dept.budget - dept.spent;
          
          return (
            <Card key={dept.id} style={{ padding: 0, overflow: 'hidden' }}>
              {/* Card Header */}
              <div style={{ 
                padding: '16px 20px', 
                borderBottom: `1px solid ${Colors.border}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <span style={{ 
                      fontSize: 18, 
                      fontWeight: 700, 
                      color: Colors.text 
                    }}>
                      {dept.name}
                    </span>
                    <Badge color={Colors.accent}>{dept.code}</Badge>
                  </div>
                  <div style={{ fontSize: 12, color: Colors.textMuted }}>
                    Responsable: <span style={{ color: Colors.text }}>{dept.managerName}</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleEditDepartment(dept)}
                  style={{ 
                    padding: '6px 10px', 
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
              </div>
              
              {/* Card Body */}
              <div style={{ padding: 20 }}>
                {/* Employee Count */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 2 }}>EMPLOYÉS</div>
                    <div style={{ fontSize: 20, fontWeight: 600, color: Colors.text }}>
                      {dept.employeeCount}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 2 }}>BUDGET</div>
                    <div style={{ fontSize: 20, fontWeight: 600, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                      {dept.budget.toLocaleString()} €
                    </div>
                  </div>
                </div>
                
                {/* Budget Progress */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 11, color: Colors.textMuted }}>
                      Budget utilisé: {dept.spent.toLocaleString()} €
                    </span>
                    <span style={{ 
                      fontSize: 11, 
                      fontWeight: 600, 
                      color: budgetStatus.color,
                    }}>
                      {budgetPercent.toFixed(1)}%
                    </span>
                  </div>
                  <div style={{ 
                    height: 8, 
                    background: 'rgba(100, 140, 255, 0.1)', 
                    borderRadius: 4, 
                    overflow: 'hidden',
                    marginBottom: 8,
                  }}>
                    <div style={{ 
                      width: `${Math.min(budgetPercent, 100)}%`, 
                      height: '100%', 
                      background: budgetStatus.color,
                      borderRadius: 4,
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 11, color: Colors.textMuted }}>
                      Restant: {remaining.toLocaleString()} €
                    </span>
                    <span style={{ 
                      padding: '3px 8px', 
                      borderRadius: 4, 
                      fontSize: 10, 
                      fontWeight: 500,
                      background: budgetStatus.bg, 
                      color: budgetStatus.color,
                    }}>
                      {budgetStatus.label}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: 12, color: Colors.textMuted }}>
            Affichage de {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, filteredDepartments.length)} sur {filteredDepartments.length}
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
        </Card>
      )}

      {/* Department Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={selectedDepartment ? 'Modifier le département' : 'Nouveau Département'}
        size="lg"
      >
        <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Nom du département</label>
              <input 
                type="text" 
                placeholder="Ex: Technologie"
                defaultValue={selectedDepartment?.name}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 8,
                  border: `1px solid ${Colors.border}`,
                  background: Colors.bg,
                  color: Colors.text,
                  fontSize: 13,
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Code</label>
              <input 
                type="text" 
                placeholder="Ex: TECH"
                defaultValue={selectedDepartment?.code}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 8,
                  border: `1px solid ${Colors.border}`,
                  background: Colors.bg,
                  color: Colors.text,
                  fontSize: 13,
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Budget (€)</label>
              <input 
                type="number" 
                placeholder="50000"
                defaultValue={selectedDepartment?.budget}
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 8,
                  border: `1px solid ${Colors.border}`,
                  background: Colors.bg,
                  color: Colors.text,
                  fontSize: 13,
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Budget dépensé (€)</label>
              <input 
                type="number" 
                placeholder="25000"
                defaultValue={selectedDepartment?.spent}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 8,
                  border: `1px solid ${Colors.border}`,
                  background: Colors.bg,
                  color: Colors.text,
                  fontSize: 13,
                }}
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Responsable</label>
              <select 
                defaultValue={selectedDepartment?.managerName || ''}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 8,
                  border: `1px solid ${Colors.border}`,
                  background: Colors.bg,
                  color: Colors.text,
                  fontSize: 13,
                }}
              >
                <option value="">Sélectionner un responsable</option>
                <option value="Sara Mendy">Sara Mendy - Tech</option>
                <option value="Fatou Diallo">Fatou Diallo - RH</option>
                <option value="Moussa Sow">Moussa Sow - Finance</option>
                <option value="Ibou Gaye">Ibou Gaye - Ventes</option>
                <option value="Rokhaya Fall">Rokhaya Fall - Formation</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Description</label>
              <textarea 
                placeholder="Description du département..."
                defaultValue={selectedDepartment?.description}
                rows={3}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 8,
                  border: `1px solid ${Colors.border}`,
                  background: Colors.bg,
                  color: Colors.text,
                  fontSize: 13,
                  resize: 'vertical',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              {selectedDepartment ? 'Enregistrer' : 'Créer le département'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Departments;

