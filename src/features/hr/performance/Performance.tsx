// Performance Page - Refactored with modular architecture
// Complete performance management with reviews, objectives, and analytics

import React, { useState, useEffect, useCallback } from 'react';
import { Button, SearchInput, Card } from '../../../components/common';
import { Colors } from '../../../constants/theme';
import performanceService from '../../../services/performanceService';
import employeeService from '../../../services/employeeService';
import departmentService from '../../../services/departmentService';
import useAppStore from '../../../store/appStore';

// Types
import type { 
  PerformanceReview, 
  Objective, 
  DepartmentPerformance,
  ReviewFormData,
  ObjectiveFormData,
  PerformanceStats,
  RatingDistributionItem,
  CurrentTab,
  DeleteModalState
} from './types';
import type { Employee, Department } from '../../../types';

// Components
import { StatsCards, ReviewsTable, ObjectivesTable, ReviewForm, ObjectiveForm } from './components';

// Hooks
import { usePerformanceReviews, useReviewActions, useFilteredReviews } from './hooks/usePerformance';
import { useObjectives, useObjectiveActions, useFilteredObjectives } from './hooks/useObjectives';

const Performance: React.FC = () => {
  // State - Employees & Departments
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentPerformance, setDepartmentPerformance] = useState<DepartmentPerformance[]>([]);

  // State - UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentTab, setCurrentTab] = useState<CurrentTab>('reviews');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modal states
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isObjectiveModalOpen, setIsObjectiveModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<PerformanceReview | null>(null);
  const [editingObjective, setEditingObjective] = useState<Objective | null>(null);
  const [deletingItem, setDeletingItem] = useState<DeleteModalState | null>(null);
  const currentUser = useAppStore((state) => state.currentUser);

  // Data from hooks
  const { reviews, loading: reviewsLoading, stats: reviewStats, ratingDistribution, refetch: refetchReviews } = usePerformanceReviews();
  const { objectives, loading: objectivesLoading, totalObjectives, achievedObjectives, atRiskObjectives, refetch: refetchObjectives } = useObjectives();
  
  const reviewActions = useReviewActions(refetchReviews);
  const objectiveActions = useObjectiveActions(refetchObjectives);

  // Filtered data
  const filteredReviews = useFilteredReviews(reviews, searchQuery, ratingFilter, statusFilter);
  const filteredObjectives = useFilteredObjectives(objectives, searchQuery);

  // Fetch employees
  const fetchEmployees = useCallback(async () => {
    try {
      const response = await employeeService.getEmployees({ pageSize: 100 });
      setEmployees(response.data || []);
    } catch (err: unknown) {
      console.error('Error fetching employees:', err);
    }
  }, []);

  // Fetch departments
  const fetchDepartments = useCallback(async () => {
    try {
      const response = await departmentService.getDepartments({ pageSize: 100 });
      setDepartments(response.data || []);
    } catch (err: unknown) {
      console.error('Error fetching departments:', err);
    }
  }, []);

  // Fetch department performance
  const fetchDepartmentPerformance = useCallback(async () => {
    try {
      const data = await performanceService.getDepartmentPerformance();
      setDepartmentPerformance(data);
    } catch (err: unknown) {
      console.error('Error fetching department performance:', err);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
    fetchDepartmentPerformance();
  }, [fetchEmployees, fetchDepartments, fetchDepartmentPerformance]);

  // Loading state
  useEffect(() => {
    setLoading(reviewsLoading || objectivesLoading);
  }, [reviewsLoading, objectivesLoading]);

  // Combined stats
  const combinedStats: PerformanceStats = {
    ...reviewStats,
    totalObjectives,
    achievedObjectives,
    atRiskObjectives,
  };

  // Show success message
  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // Show error message
  const showError = (message: string) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  // Reset page when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Open review modal
  const openReviewModal = (review?: PerformanceReview) => {
    setEditingReview(review || null);
    setIsReviewModalOpen(true);
  };

  // Open objective modal
  const openObjectiveModal = (objective?: Objective) => {
    setEditingObjective(objective || null);
    setIsObjectiveModalOpen(true);
  };

  // Open delete modal
  const openDeleteModal = (type: 'review' | 'objective', id: string, name: string) => {
    setDeletingItem({ type, id, name });
    setIsDeleteModalOpen(true);
  };

  // Handle review form submit
  const handleReviewSubmit = async (formData: ReviewFormData) => {
    const employee = employees.find(emp => emp.id === formData.employeeId);
    
    if (editingReview) {
      const success = await reviewActions.updateReview(editingReview.id, {
        period: formData.period,
        rating: formData.rating,
        objectivesCompleted: formData.objectivesCompleted,
        objectivesTotal: formData.objectivesTotal,
        feedback: formData.feedback,
      });
      if (success) {
        showSuccess('Évaluation mise à jour avec succès');
        setIsReviewModalOpen(false);
      } else {
        showError('Erreur lors de la mise à jour');
      }
    } else {
      const success = await reviewActions.createReview({
        employeeId: formData.employeeId,
        employeeName: employee ? `${employee.firstName} ${employee.lastName}` : '',
        departmentId: employee?.departmentId || '',
        departmentName: departments.find(d => d.id === employee?.departmentId)?.name || '',
        period: formData.period,
        rating: formData.rating,
        objectivesCompleted: formData.objectivesCompleted,
        objectivesTotal: formData.objectivesTotal,
        feedback: formData.feedback,
        reviewerName: currentUser?.name || undefined,
      });
      if (success) {
        showSuccess('Nouvelle évaluation créée avec succès');
        setIsReviewModalOpen(false);
      } else {
        showError('Erreur lors de la création');
      }
    }
  };

  // Handle objective form submit
  const handleObjectiveSubmit = async (formData: ObjectiveFormData) => {
    const employee = employees.find(emp => emp.id === formData.employeeId);
    
    if (editingObjective) {
      const success = await objectiveActions.updateObjective(editingObjective.id, {
        title: formData.title,
        description: formData.description,
        target: formData.target,
        dueDate: formData.dueDate,
      });
      if (success) {
        showSuccess('Objectif mis à jour avec succès');
        setIsObjectiveModalOpen(false);
      } else {
        showError('Erreur lors de la mise à jour');
      }
    } else {
      const success = await objectiveActions.createObjective({
        employeeId: formData.employeeId,
        employeeName: employee ? `${employee.firstName} ${employee.lastName}` : '',
        title: formData.title,
        description: formData.description,
        target: formData.target,
        dueDate: formData.dueDate,
      });
      if (success) {
        showSuccess('Nouvel objectif créé avec succès');
        setIsObjectiveModalOpen(false);
      } else {
        showError('Erreur lors de la création');
      }
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingItem) return;
    
    let success = false;
    if (deletingItem.type === 'review') {
      success = await reviewActions.deleteReview(deletingItem.id);
      if (success) showSuccess('Évaluation supprimée avec succès');
    } else {
      success = await objectiveActions.deleteObjective(deletingItem.id);
      if (success) showSuccess('Objectif supprimé avec succès');
    }
    
    if (success) {
      setIsDeleteModalOpen(false);
    } else {
      showError('Erreur lors de la suppression');
    }
  };

  // Handle edit/delete clicks from tables
  const handleEditReview = (review: PerformanceReview) => openReviewModal(review);
  const handleDeleteReview = (review: PerformanceReview) => openDeleteModal('review', review.id, review.employeeName);
  const handleEditObjective = (objective: Objective) => openObjectiveModal(objective);
  const handleDeleteObjective = (objective: Objective) => openDeleteModal('objective', objective.id, objective.title);

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <Header 
        onNewObjective={() => openObjectiveModal()}
        onNewReview={() => openReviewModal()}
      />

      {/* Error Message */}
      {error && <AlertMessage message={error} type="error" />}

      {/* Success Message */}
      {successMessage && <AlertMessage message={successMessage} type="success" />}

      {/* Stats Cards */}
      <StatsCards 
        stats={combinedStats} 
        loading={loading} 
        atRiskObjectives={atRiskObjectives}
      />

      {/* Rating Distribution & Department Performance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 24 }}>
        <RatingDistribution distribution={ratingDistribution} loading={loading} />
        <DepartmentPerformanceChart data={departmentPerformance} loading={loading} />
      </div>

      {/* Tabs */}
      <Tabs currentTab={currentTab} onTabChange={setCurrentTab} counts={{ reviews: filteredReviews.length, objectives: filteredObjectives.length }} />

      {/* Filters */}
      <Card style={{ marginBottom: 20, padding: 16 }}>
        <Filters 
          searchQuery={searchQuery}
          onSearchChange={(value) => { setSearchQuery(value); handleFilterChange(); }}
          ratingFilter={ratingFilter}
          onRatingChange={(value) => { setRatingFilter(value); handleFilterChange(); }}
          statusFilter={statusFilter}
          onStatusChange={(value) => { setStatusFilter(value); handleFilterChange(); }}
          currentTab={currentTab}
        />
      </Card>

      {/* Reviews Table */}
      {currentTab === 'reviews' && (
        <ReviewsTable
          reviews={filteredReviews}
          loading={loading}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onEdit={handleEditReview}
          onDelete={handleDeleteReview}
        />
      )}

      {/* Objectives Table */}
      {currentTab === 'objectives' && (
        <ObjectivesTable
          objectives={filteredObjectives}
          loading={loading}
          onEdit={handleEditObjective}
          onDelete={handleDeleteObjective}
        />
      )}

      {/* Modals */}
      <ReviewForm
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={handleReviewSubmit}
        review={editingReview}
        employees={employees}
        submitting={reviewActions.submitting}
      />

      <ObjectiveForm
        isOpen={isObjectiveModalOpen}
        onClose={() => setIsObjectiveModalOpen(false)}
        onSubmit={handleObjectiveSubmit}
        objective={editingObjective}
        employees={employees}
        submitting={objectiveActions.submitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        item={deletingItem}
        submitting={reviewActions.submitting || objectiveActions.submitting}
      />
    </div>
  );
};

// ==================== Sub-components ====================

const Header: React.FC<{ onNewObjective: () => void; onNewReview: () => void }> = ({ onNewObjective, onNewReview }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: Colors.text, marginBottom: 4 }}>
        Gestion de la Performance
      </h1>
      <p style={{ fontSize: 13, color: Colors.textMuted }}>
        Évaluations · Objectifs · Suivi
      </p>
    </div>
    <div style={{ display: 'flex', gap: 12 }}>
      <Button variant="secondary" onClick={onNewObjective}>+ Nouvel objectif</Button>
      <Button variant="primary" onClick={onNewReview}>+ Nouvelle évaluation</Button>
    </div>
  </div>
);

const AlertMessage: React.FC<{ message: string; type: 'error' | 'success' }> = ({ message, type }) => (
  <div style={{ 
    padding: '12px 16px', 
    background: type === 'error' ? 'rgba(224, 80, 80, 0.1)' : 'rgba(62, 207, 142, 0.1)', 
    border: `1px solid ${type === 'error' ? 'rgba(224, 80, 80, 0.3)' : 'rgba(62, 207, 142, 0.3)'}`,
    borderRadius: 8,
    marginBottom: 20,
    color: type === 'error' ? '#e05050' : '#3ecf8e',
    fontSize: 13,
  }}>
    {message}
  </div>
);

const RatingDistribution: React.FC<{ distribution: RatingDistributionItem[]; loading: boolean }> = ({ distribution, loading }) => (
  <Card style={{ padding: 20 }}>
    <h3 style={{ fontSize: 14, fontWeight: 600, color: Colors.text, marginBottom: 16 }}>
      Distribution des Notes
    </h3>
    {loading ? (
      <div style={{ padding: 20, textAlign: 'center', color: Colors.textMuted }}>Chargement...</div>
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {distribution.map((item) => (
          <div key={item.rating}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ color: '#fbbf24', fontSize: 12 }}>★</span>
                <span style={{ fontSize: 12, color: Colors.textMuted }}>{item.rating}</span>
              </div>
              <span style={{ fontSize: 12, color: Colors.textMuted }}>{item.count}</span>
            </div>
            <div style={{ height: 8, background: 'rgba(100, 140, 255, 0.1)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ 
                width: `${item.percentage}%`, 
                height: '100%', 
                background: item.rating >= 4 ? '#3ecf8e' : item.rating >= 3 ? '#6490ff' : '#fb923c',
                borderRadius: 4,
              }} />
            </div>
          </div>
        ))}
      </div>
    )}
  </Card>
);

const DepartmentPerformanceChart: React.FC<{ data: DepartmentPerformance[]; loading: boolean }> = ({ data, loading }) => (
  <Card style={{ padding: 20 }}>
    <h3 style={{ fontSize: 14, fontWeight: 600, color: Colors.text, marginBottom: 16 }}>
      Performance par Département
    </h3>
    {loading ? (
      <div style={{ padding: 20, textAlign: 'center', color: Colors.textMuted }}>Chargement...</div>
    ) : data.length > 0 ? (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 16 }}>
        {data.map((dept) => (
          <div key={dept.departmentId} style={{ 
            padding: 16, 
            background: 'rgba(100, 140, 255, 0.03)', 
            borderRadius: 12,
            border: `1px solid ${Colors.border}`,
            textAlign: 'center',
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: Colors.text, marginBottom: 4 }}>
              {dept.departmentName}
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: (dept.avgRating || 0) >= 4 ? '#3ecf8e' : '#6490ff', marginBottom: 4 }}>
              {(dept.avgRating || 0).toFixed(1)}
            </div>
            <div style={{ fontSize: 10, color: Colors.textMuted }}>
              {dept.employeeCount || 0} employés
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div style={{ padding: 20, textAlign: 'center', color: Colors.textMuted }}>
        Aucune donnée de performance disponible
      </div>
    )}
  </Card>
);

const Tabs: React.FC<{ currentTab: CurrentTab; onTabChange: (tab: CurrentTab) => void; counts: { reviews: number; objectives: number } }> = ({ 
  currentTab, onTabChange, counts 
}) => (
  <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: `1px solid ${Colors.border}` }}>
    <button
      onClick={() => onTabChange('reviews')}
      style={{
        padding: '12px 24px',
        background: 'transparent',
        border: 'none',
        borderBottom: currentTab === 'reviews' ? `2px solid ${Colors.accent}` : '2px solid transparent',
        color: currentTab === 'reviews' ? Colors.accent : Colors.textMuted,
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
      }}
    >
      Évaluations ({counts.reviews})
    </button>
    <button
      onClick={() => onTabChange('objectives')}
      style={{
        padding: '12px 24px',
        background: 'transparent',
        border: 'none',
        borderBottom: currentTab === 'objectives' ? `2px solid ${Colors.accent}` : '2px solid transparent',
        color: currentTab === 'objectives' ? Colors.accent : Colors.textMuted,
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
      }}
    >
      Objectifs ({counts.objectives})
    </button>
  </div>
);

const Filters: React.FC<{
  searchQuery: string;
  onSearchChange: (value: string) => void;
  ratingFilter: string;
  onRatingChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
  currentTab: CurrentTab;
}> = ({ searchQuery, onSearchChange, ratingFilter, onRatingChange, statusFilter, onStatusChange, currentTab }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, alignItems: 'end' }}>
    <SearchInput 
      placeholder="Rechercher par employé, département, objectif..."
      value={searchQuery}
      onChange={onSearchChange}
    />
    <div>
      <label style={{ display: 'block', fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>Note</label>
      <select 
        value={ratingFilter}
        onChange={(e) => onRatingChange(e.target.value)}
        style={selectStyle}
      >
        <option value="all">Toutes les notes</option>
        <option value="5">5 ★</option>
        <option value="4">4 ★</option>
        <option value="3">3 ★</option>
        <option value="2">2 ★</option>
      </select>
    </div>
    {currentTab === 'reviews' && (
      <div>
        <label style={{ display: 'block', fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>Statut</label>
        <select 
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          style={selectStyle}
        >
          <option value="all">Tous les statuts</option>
          <option value="completed">Complété</option>
          <option value="in_progress">En cours</option>
          <option value="pending">En attente</option>
        </select>
      </div>
    )}
  </div>
);

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  borderRadius: 8,
  border: `1px solid ${Colors.border}`,
  background: Colors.bg,
  color: Colors.text,
  fontSize: 13,
};

const DeleteModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  item: DeleteModalState | null;
  submitting: boolean;
}> = ({ isOpen, onClose, onConfirm, item, submitting }) => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: isOpen ? 'flex' : 'none',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  }}>
    <div style={{
      background: Colors.bg,
      padding: 24,
      borderRadius: 12,
      maxWidth: 400,
      width: '90%',
    }}>
      <h3 style={{ fontSize: 18, fontWeight: 600, color: Colors.text, marginBottom: 16 }}>
        Confirmer la suppression
      </h3>
      <p style={{ fontSize: 14, color: Colors.text, marginBottom: 8 }}>
        Êtes-vous sûr de vouloir supprimer {item?.type === 'review' ? 'l\'évaluation' : 'l\'objectif'} suivant ?
      </p>
      <p style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 12 }}>
        {item?.name}
      </p>
      <p style={{ fontSize: 12, color: Colors.textMuted, marginBottom: 20 }}>
        Cette action est irréversible.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <Button variant="secondary" onClick={onClose}>Annuler</Button>
        <Button 
          variant="primary" 
          onClick={onConfirm}
          disabled={submitting}
          style={{ background: '#e05050', borderColor: '#e05050' }}
        >
          {submitting ? 'Suppression...' : 'Confirmer'}
        </Button>
      </div>
    </div>
  </div>
);

export default Performance;
