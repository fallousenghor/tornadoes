// Departments Page - RH & ORG Module
// Complete department management with search, filters, budget tracking and modal - Connected to Backend API

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, Button, Badge, SearchInput, Modal, Input } from '../../components/common';
import { Colors } from '../../constants/theme';
import departmentService from '../../services/departmentService';
import employeeService from '../../services/employeeService';
import type { Department, Employee } from '../../types';

// Extended department type for display
interface DepartmentDisplay extends Department {
  employeeCount: number;
  managerName: string;
}

// Budget status colors
const getBudgetStatus = (spent: number, budget: number) => {
  const percentage = budget > 0 ? (spent / budget) * 100 : 0;
  if (percentage >= 95) return { bg: 'rgba(224, 80, 80, 0.15)', color: '#e05050', label: 'Critique' };
  if (percentage >= 80) return { bg: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', label: 'Attention' };
  return { bg: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e', label: 'Normal' };
};

export const Departments: React.FC = () => {
  // State
  const [departmentsData, setDepartmentsData] = useState<Department[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentDisplay | null>(null);
  const [departmentToDelete, setDepartmentToDelete] = useState<DepartmentDisplay | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    budget: 0,
    spent: 0,
    headId: '',
    active: true,
  });

  const itemsPerPage = 6;

  // Fetch departments from API
  const fetchDepartments = useCallback(async () => {
    try {
      const response = await departmentService.getDepartments({ active: statusFilter === 'all' ? undefined : statusFilter === 'active' });
      setDepartmentsData(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
      showNotification('error', 'Erreur lors du chargement des départements');
    }
  }, [statusFilter]);

  // Fetch employees for counting
  const fetchEmployees = useCallback(async () => {
    try {
      const response = await employeeService.getEmployees();
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchDepartments(), fetchEmployees()]);
      setLoading(false);
    };
    loadData();
  }, [fetchDepartments, fetchEmployees]);

  // Show notification
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Enrich departments with employee counts
  const departments: DepartmentDisplay[] = useMemo(() => {
    return departmentsData.map(dept => {
      const employeeCount = employees.filter(emp => emp.departmentId === dept.id).length;
      return { 
        ...dept, 
        employeeCount,
        managerName: dept.headId || 'À assigner'
      };
    });
  }, [departmentsData, employees]);

  // Filter departments
  const filteredDepartments = useMemo(() => {
    return departments.filter(dept => {
      const matchesSearch = 
        dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.managerName.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    });
  }, [departments, searchQuery]);

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
    setFormData({
      name: '',
      code: '',
      description: '',
      budget: 0,
      spent: 0,
      headId: '',
      active: true,
    });
    setSelectedDepartment(null);
    setIsModalOpen(true);
  };

  // Open modal for edit department
  const handleEditDepartment = (dept: DepartmentDisplay) => {
    setFormData({
      name: dept.name,
      code: dept.code,
      description: dept.description || '',
      budget: dept.budget,
      spent: dept.spent,
      headId: dept.headId || '',
      active: true,
    });
    setSelectedDepartment(dept);
    setIsModalOpen(true);
  };

  // Open delete confirmation modal
  const handleDeleteClick = (dept: DepartmentDisplay) => {
    setDepartmentToDelete(dept);
    setIsDeleteModalOpen(true);
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (selectedDepartment) {
        // Update existing department
        await departmentService.updateDepartment(selectedDepartment.id, {
          name: formData.name,
          description: formData.description,
          active: formData.active,
        });
        showNotification('success', 'Département mis à jour avec succès');
      } else {
        // Create new department
        await departmentService.createDepartment({
          name: formData.name,
          code: formData.code,
          description: formData.description,
        });
        showNotification('success', 'Département créé avec succès');
      }
      
      setIsModalOpen(false);
      await fetchDepartments();
    } catch (error: any) {
      console.error('Error saving department:', error);
      showNotification('error', error.response?.data?.message || 'Erreur lors de l\'enregistrement du département');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (!departmentToDelete) return;
    
    setSubmitting(true);
    try {
      await departmentService.deleteDepartment(departmentToDelete.id);
      showNotification('success', 'Département supprimé avec succès');
      setIsDeleteModalOpen(false);
      setDepartmentToDelete(null);
      await fetchDepartments();
    } catch (error: any) {
      console.error('Error deleting department:', error);
      showNotification('error', error.response?.data?.message || 'Erreur lors de la suppression du département');
    } finally {
      setSubmitting(false);
    }
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
      {/* Notification Toast */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: 20,
          right: 20,
          padding: '12px 20px',
          borderRadius: 8,
          background: notification.type === 'success' ? 'rgba(62, 207, 142, 0.15)' : 'rgba(224, 80, 80, 0.15)',
          border: `1px solid ${notification.type === 'success' ? '#3ecf8e' : '#e05050'}`,
          color: notification.type === 'success' ? '#3ecf8e' : '#e05050',
          fontSize: 13,
          fontWeight: 500,
          zIndex: 1000,
          animation: 'slideIn 0.3s ease',
        }}>
          {notification.message}
          <style>{`
            @keyframes slideIn {
              from { transform: translateX(100%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
          `}</style>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: Colors.text, marginBottom: 4 }}>
            Gestion des Départements
          </h1>
          <p style={{ fontSize: 13, color: Colors.textMuted }}>
            {loading ? 'Chargement...' : `${filteredDepartments.length} département(s) trouvé(s)`}
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
                {totals.totalBudget.toLocaleString()} FCA
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
              background: totals.totalBudget > 0 && totals.totalSpent / totals.totalBudget >= 0.9 ? 'rgba(224, 80, 80, 0.15)' : 'rgba(251, 146, 60, 0.15)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: 20,
              color: totals.totalBudget > 0 && totals.totalSpent / totals.totalBudget >= 0.9 ? '#e05050' : '#fb923c',
            }}>
              ◇
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Budget Consumé
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {totals.totalBudget > 0 ? ((totals.totalSpent / totals.totalBudget) * 100).toFixed(1) : 0}%
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
              Statut
            </label>
            <select 
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); handleFilterChange(); fetchDepartments(); }}
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
              <option value="active">Actifs uniquement</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Departments Grid */}
      {loading ? (
        <div style={{ padding: 40, textAlign: 'center', color: Colors.textMuted }}>
          Chargement des départements...
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 20 }}>
          {paginatedDepartments.map((dept) => {
            const budgetPercent = dept.budget > 0 ? (dept.spent / dept.budget) * 100 : 0;
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
                  <div style={{ display: 'flex', gap: 6 }}>
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
                    <button 
                      onClick={() => handleDeleteClick(dept)}
                      style={{ 
                        padding: '6px 10px', 
                        borderRadius: 6, 
                        border: `1px solid rgba(224, 80, 80, 0.3)`, 
                        background: 'rgba(224, 80, 80, 0.1)', 
                        color: '#e05050', 
                        fontSize: 11, 
                        cursor: 'pointer',
                      }}
                    >
                      🗑
                    </button>
                  </div>
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
                        {dept.budget.toLocaleString()} FCA
                      </div>
                    </div>
                  </div>
                  
                  {/* Budget Progress */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 11, color: Colors.textMuted }}>
                        Budget utilisé: {dept.spent.toLocaleString()} FCA
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
                        Restant: {remaining.toLocaleString()} FCA
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
      )}

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

      {/* Department Create/Edit Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={selectedDepartment ? 'Modifier le département' : 'Nouveau Département'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Nom du département *</label>
              <input 
                type="text" 
                placeholder="Ex: Technologie"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Code *</label>
              <input 
                type="text" 
                placeholder="Ex: TECH"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                required
                disabled={!!selectedDepartment}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 8,
                  border: `1px solid ${Colors.border}`,
                  background: selectedDepartment ? Colors.bgSecondary : Colors.bg,
                  color: Colors.text,
                  fontSize: 13,
                  opacity: selectedDepartment ? 0.7 : 1,
                }}
              />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Responsable</label>
              <select 
                value={formData.headId}
                onChange={(e) => setFormData({ ...formData, headId: e.target.value })}
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
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                ))}
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Description</label>
              <textarea 
                placeholder="Description du département..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
            <Button 
              variant="secondary" 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              disabled={submitting}
            >
              Annuler
            </Button>
            <Button 
              variant="primary" 
              type="submit"
              disabled={submitting || !formData.name || !formData.code}
            >
              {submitting ? 'Enregistrement...' : (selectedDepartment ? 'Enregistrer' : 'Créer le département')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmer la suppression"
        size="sm"
      >
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <div style={{ 
            width: 64, 
            height: 64, 
            borderRadius: '50%', 
            background: 'rgba(224, 80, 80, 0.15)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: 28,
          }}>
            ⚠️
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 600, color: Colors.text, marginBottom: 8 }}>
            Supprimer le département ?
          </h3>
          <p style={{ fontSize: 13, color: Colors.textMuted, marginBottom: 24 }}>
            Êtes-vous sûr de vouloir supprimer le département <strong style={{ color: Colors.text }}>{departmentToDelete?.name}</strong> ? 
            Cette action est irréversible.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Button 
              variant="secondary" 
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={submitting}
            >
              Annuler
            </Button>
            <Button 
              variant="primary"
              onClick={handleDeleteConfirm}
              disabled={submitting}
              style={{ 
                background: '#e05050', 
                borderColor: '#e05050',
              }}
            >
              {submitting ? 'Suppression...' : 'Confirmer'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Departments;

