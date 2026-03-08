// Performance Page - RH & ORG Module
// Complete performance management with reviews, objectives, and analytics - FULL CRUD

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { Card, Button, Badge, SearchInput, Modal } from '../../components/common';
import { Colors } from '../../constants/theme';
import performanceService from '../../services/performanceService';
import employeeService from '../../services/employeeService';
import departmentService from '../../services/departmentService';
import type { Employee, Department } from '../../types';

// Performance review type
interface PerformanceReviewDisplay {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  period: string;
  rating: number;
  objectivesCompleted: number;
  objectivesTotal: number;
  feedback: string;
  reviewer: string;
  reviewedAt: Date;
  status: 'completed' | 'pending' | 'in_progress';
}

// Objective type
interface ObjectiveDisplay {
  id: string;
  employeeId: string;
  employeeName: string;
  title: string;
  description: string;
  target: number;
  achieved: number;
  status: 'pending' | 'achieved' | 'exceeded' | 'at_risk';
  dueDate: Date;
}

// Department performance type
interface DepartmentPerformance {
  departmentId: string;
  departmentName: string;
  avgRating: number;
  employeeCount: number;
}

// Form data types
interface ReviewFormData {
  employeeId: string;
  period: string;
  rating: number;
  objectivesCompleted: number;
  objectivesTotal: number;
  feedback: string;
  improvementPoints: string;
}

interface ObjectiveFormData {
  employeeId: string;
  title: string;
  description: string;
  target: number;
  dueDate: string;
}

export const Performance: React.FC = () => {
  // State
  const [performanceReviews, setPerformanceReviews] = useState<PerformanceReviewDisplay[]>([]);
  const [objectives, setObjectives] = useState<ObjectiveDisplay[]>([]);
  const [departmentPerformance, setDepartmentPerformance] = useState<DepartmentPerformance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentTab, setCurrentTab] = useState<'reviews' | 'objectives'>('reviews');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Modal states
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isObjectiveModalOpen, setIsObjectiveModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<PerformanceReviewDisplay | null>(null);
  const [editingObjective, setEditingObjective] = useState<ObjectiveDisplay | null>(null);
  const [deletingItem, setDeletingItem] = useState<{ type: 'review' | 'objective'; id: string; name: string } | null>(null);
  
  // Form states
  const [reviewForm, setReviewForm] = useState<ReviewFormData>({
    employeeId: '',
    period: 'Q1 2025',
    rating: 3,
    objectivesCompleted: 0,
    objectivesTotal: 5,
    feedback: '',
    improvementPoints: '',
  });
  
  const [objectiveForm, setObjectiveForm] = useState<ObjectiveFormData>({
    employeeId: '',
    title: '',
    description: '',
    target: 100,
    dueDate: '',
  });

  const itemsPerPage = 10;

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

  // Fetch performance reviews
  const fetchPerformanceReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await performanceService.getPerformanceReviews({ pageSize: 100 });
      setPerformanceReviews(response.data || []);
    } catch (err: unknown) {
      console.error('Error fetching performance reviews:', err);
      setPerformanceReviews([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch objectives
  const fetchObjectives = useCallback(async () => {
    try {
      const response = await performanceService.getObjectives({ pageSize: 100 });
      setObjectives(response.data || []);
    } catch (err: unknown) {
      console.error('Error fetching objectives:', err);
      setObjectives([]);
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

  // Load data on mount
  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, [fetchEmployees, fetchDepartments]);

  useEffect(() => {
    fetchPerformanceReviews();
    fetchObjectives();
    fetchDepartmentPerformance();
  }, [fetchPerformanceReviews, fetchObjectives, fetchDepartmentPerformance]);

  // Filter reviews
  const filteredReviews = useMemo(() => {
    return performanceReviews.filter(review => {
      const matchesSearch = 
        review.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.department.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesRating = ratingFilter === 'all' || review.rating === parseInt(ratingFilter);
      
      const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
      
      return matchesSearch && matchesRating && matchesStatus;
    });
  }, [performanceReviews, searchQuery, ratingFilter, statusFilter]);

  // Filter objectives
  const filteredObjectives = useMemo(() => {
    return objectives.filter(obj => {
      const matchesSearch = 
        obj.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        obj.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [objectives, searchQuery]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalReviews = performanceReviews.length;
    const avgRating = totalReviews > 0 
      ? (performanceReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
      : '0.0';
    const excellentReviews = performanceReviews.filter(r => r.rating >= 4).length;
    const pendingReviews = performanceReviews.filter(r => r.status === 'pending' || r.status === 'in_progress').length;
    
    const totalObjectives = objectives.length;
    const achievedObjectives = objectives.filter(o => o.status === 'achieved' || o.status === 'exceeded').length;
    const atRiskObjectives = objectives.filter(o => o.status === 'at_risk').length;
    
    return { 
      totalReviews, 
      avgRating, 
      excellentReviews, 
      pendingReviews,
      totalObjectives,
      achievedObjectives,
      atRiskObjectives,
    };
  }, [performanceReviews, objectives]);

  // Pagination
  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage) || 1;
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Get employee name by ID
  const getEmployeeName = (employeeId: string) => {
    const emp = employees.find(e => e.id === employeeId);
    return emp ? `${emp.firstName} ${emp.lastName}` : 'Unknown';
  };

  // Get employee department by ID
  const getEmployeeDepartment = (employeeId: string) => {
    const emp = employees.find(e => e.id === employeeId);
    // We don't have department name directly, so we'll use the ID or show a placeholder
    return emp?.departmentId || 'N/A';
  };

  // Open review modal for create/edit
  const openReviewModal = (review?: PerformanceReviewDisplay) => {
    if (review) {
      setEditingReview(review);
      setReviewForm({
        employeeId: review.employeeId,
        period: review.period,
        rating: review.rating,
        objectivesCompleted: review.objectivesCompleted,
        objectivesTotal: review.objectivesTotal,
        feedback: review.feedback,
        improvementPoints: '',
      });
    } else {
      setEditingReview(null);
      setReviewForm({
        employeeId: '',
        period: 'Q1 2025',
        rating: 3,
        objectivesCompleted: 0,
        objectivesTotal: 5,
        feedback: '',
        improvementPoints: '',
      });
    }
    setIsReviewModalOpen(true);
  };

  // Open objective modal for create/edit
  const openObjectiveModal = (objective?: ObjectiveDisplay) => {
    if (objective) {
      setEditingObjective(objective);
      setObjectiveForm({
        employeeId: objective.employeeId,
        title: objective.title,
        description: objective.description,
        target: objective.target,
        dueDate: objective.dueDate instanceof Date 
          ? objective.dueDate.toISOString().split('T')[0]
          : new Date(objective.dueDate).toISOString().split('T')[0],
      });
    } else {
      setEditingObjective(null);
      setObjectiveForm({
        employeeId: '',
        title: '',
        description: '',
        target: 100,
        dueDate: '',
      });
    }
    setIsObjectiveModalOpen(true);
  };

  // Open delete confirmation
  const openDeleteModal = (type: 'review' | 'objective', id: string, name: string) => {
    setDeletingItem({ type, id, name });
    setIsDeleteModalOpen(true);
  };

    // Submit review form
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const employee = employees.find(emp => emp.id === reviewForm.employeeId);
      
      if (editingReview) {
        // Update existing review
        await performanceService.updatePerformanceReview(editingReview.id, {
          period: reviewForm.period,
          rating: reviewForm.rating,
          objectivesCompleted: reviewForm.objectivesCompleted,
          objectivesTotal: reviewForm.objectivesTotal,
          feedback: reviewForm.feedback,
        });
        showSuccess('Évaluation mise à jour avec succès');
      } else {
        // Create new review
        await performanceService.createPerformanceReview({
          employeeId: reviewForm.employeeId,
          employeeName: employee ? `${employee.firstName} ${employee.lastName}` : '',
          departmentId: employee?.departmentId || '',
          departmentName: departments.find(d => d.id === employee?.departmentId)?.name || '',
          period: reviewForm.period,
          rating: reviewForm.rating,
          objectivesCompleted: reviewForm.objectivesCompleted,
          objectivesTotal: reviewForm.objectivesTotal,
          feedback: reviewForm.feedback,
        });
        showSuccess('Nouvelle évaluation créée avec succès');
      }
      
      setIsReviewModalOpen(false);
      fetchPerformanceReviews();
    } catch (err: unknown) {
      console.error('Error saving review:', err);
      
      // Extract more meaningful error message
      let errorMessage = 'Erreur lors de la sauvegarde. Veuillez réessayer.';
      
      if (axios.isAxiosError(err)) {
        const axiosError = err as AxiosError<{message?: string}>;
        if (axiosError.response?.data?.message) {
          // Try to parse validation errors
          const backendMessage = axiosError.response.data.message;
          if (backendMessage.includes('Validation failed') || backendMessage.includes('ConstraintViolationException')) {
            errorMessage = 'Erreur de validation. Veuillez vérifier les champs obligatoires.';
          } else {
            errorMessage = backendMessage;
          }
        } else if (axiosError.response?.status === 400) {
          errorMessage = 'Données invalides. Veuillez vérifier le formulaire.';
        } else if (axiosError.response?.status === 401) {
          errorMessage = 'Session expirée. Veuillez vous reconnecter.';
        } else if (axiosError.response?.status === 403) {
          errorMessage = 'Accès refusé. Vous n\'avez pas les permissions nécessaires.';
        } else if (axiosError.response?.status === 500) {
          errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
        }
      }
      
      showError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Submit objective form
  const handleObjectiveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const employee = employees.find(emp => emp.id === objectiveForm.employeeId);
      
      if (editingObjective) {
        // Update existing objective
        await performanceService.updateObjective(editingObjective.id, {
          title: objectiveForm.title,
          description: objectiveForm.description,
          target: objectiveForm.target,
          dueDate: objectiveForm.dueDate,
        });
        showSuccess('Objectif mis à jour avec succès');
      } else {
        // Create new objective
        await performanceService.createObjective({
          employeeId: objectiveForm.employeeId,
          employeeName: employee ? `${employee.firstName} ${employee.lastName}` : '',
          title: objectiveForm.title,
          description: objectiveForm.description,
          target: objectiveForm.target,
          dueDate: objectiveForm.dueDate,
        });
        showSuccess('Nouvel objectif créé avec succès');
      }
      
      setIsObjectiveModalOpen(false);
      fetchObjectives();
    } catch (err: unknown) {
      console.error('Error saving objective:', err);
      showError('Erreur lors de la sauvegarde. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!deletingItem) return;
    
    setSubmitting(true);
    try {
      if (deletingItem.type === 'review') {
        await performanceService.deletePerformanceReview(deletingItem.id);
        showSuccess('Évaluation supprimée avec succès');
        fetchPerformanceReviews();
      } else {
        await performanceService.deleteObjective(deletingItem.id);
        showSuccess('Objectif supprimé avec succès');
        fetchObjectives();
      }
      setIsDeleteModalOpen(false);
    } catch (err: unknown) {
      console.error('Error deleting:', err);
      showError('Erreur lors de la suppression. Veuillez réessayer.');
    } finally {
      setSubmitting(false);
    }
  };

  // Update objective progress
  const handleUpdateProgress = async (objectiveId: string, achieved: number) => {
    try {
      await performanceService.updateObjectiveProgress(objectiveId, achieved);
      showSuccess('Progression mise à jour');
      fetchObjectives();
    } catch (err: unknown) {
      console.error('Error updating progress:', err);
      showError('Erreur lors de la mise à jour');
    }
  };

  // Rating stars
  const renderStars = (rating: number, interactive = false, onChange?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span 
        key={i} 
        onClick={() => interactive && onChange?.(i + 1)}
        style={{ 
          color: i < rating ? '#fbbf24' : Colors.border, 
          fontSize: 14,
          cursor: interactive ? 'pointer' : 'default',
        }}
      >
        ★
      </span>
    ));
  };

  // Rating badge colors
  const getRatingBadge = (rating: number) => {
    if (rating >= 4) return { bg: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e', label: 'Excellent' };
    if (rating >= 3) return { bg: 'rgba(100, 140, 255, 0.15)', color: '#6490ff', label: 'Bon' };
    if (rating >= 2) return { bg: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', label: 'Moyen' };
    return { bg: 'rgba(224, 80, 80, 0.15)', color: '#e05050', label: 'À améliorer' };
  };

  // Objective status colors
  const getObjectiveStatus = (status: ObjectiveDisplay['status']) => {
    const styles: Record<string, { bg: string; color: string; label: string }> = {
      achieved: { bg: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e', label: 'Atteint' },
      exceeded: { bg: 'rgba(167, 139, 250, 0.15)', color: '#a78bfa', label: 'Dépassé' },
      pending: { bg: 'rgba(100, 140, 255, 0.15)', color: '#6490ff', label: 'En cours' },
      at_risk: { bg: 'rgba(224, 80, 80, 0.15)', color: '#e05050', label: 'À risque' },
    };
    return styles[status] || styles.pending;
  };

  // Rating distribution data
  const ratingDistribution = useMemo(() => {
    return [5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: performanceReviews.filter(r => r.rating === rating).length,
      percentage: stats.totalReviews > 0 
        ? (performanceReviews.filter(r => r.rating === rating).length / stats.totalReviews) * 100 
        : 0,
    }));
  }, [performanceReviews, stats.totalReviews]);

  // Department performance display
  const displayDeptPerformance = useMemo(() => {
    if (departmentPerformance.length > 0) {
      return departmentPerformance.map(dept => ({
        id: dept.departmentId,
        name: dept.departmentName,
        avgRating: dept.avgRating,
        employeeCount: dept.employeeCount,
      }));
    }
    return [];
  }, [departmentPerformance]);

  // Format date
  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
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
          <Button variant="secondary" onClick={() => openObjectiveModal()}>
            + Nouvel objectif
          </Button>
          <Button variant="primary" onClick={() => openReviewModal()}>
            + Nouvelle évaluation
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

      {/* Success Message */}
      {successMessage && (
        <div style={{ 
          padding: '12px 16px', 
          background: 'rgba(62, 207, 142, 0.1)', 
          border: '1px solid rgba(62, 207, 142, 0.3)',
          borderRadius: 8,
          marginBottom: 20,
          color: '#3ecf8e',
          fontSize: 13,
        }}>
          {successMessage}
        </div>
      )}

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16, marginBottom: 24 }}>
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
              color: '#6490ff',
            }}>
            ☰
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Évaluations
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: Colors.text }}>
                {loading ? '...' : stats.totalReviews}
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
              background: 'rgba(251, 191, 36, 0.15)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: 20,
              color: '#fbbf24',
            }}>
              ★
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Note Moyenne
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: Colors.text }}>
                {loading ? '...' : stats.avgRating}
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
              ✓
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Excellents
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: Colors.text }}>
                {loading ? '...' : stats.excellentReviews}
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
              background: 'rgba(251, 146, 60, 0.15)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: 20,
              color: '#fb923c',
            }}>
              ⏳
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                En attente
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: Colors.text }}>
                {loading ? '...' : stats.pendingReviews}
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
              ◎
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Objectifs
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: Colors.text }}>
                {loading ? '...' : stats.totalObjectives}
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
              background: stats.atRiskObjectives > 0 ? 'rgba(224, 80, 80, 0.15)' : 'rgba(62, 207, 142, 0.15)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: 20,
              color: stats.atRiskObjectives > 0 ? '#e05050' : '#3ecf8e',
            }}>
              ⚠
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                À risque
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: Colors.text }}>
                {loading ? '...' : stats.atRiskObjectives}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Rating Distribution & Department Performance */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 24 }}>
        <Card style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: Colors.text, marginBottom: 16 }}>
            Distribution des Notes
          </h3>
          {loading ? (
            <div style={{ padding: 20, textAlign: 'center', color: Colors.textMuted }}>
              Chargement...
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {ratingDistribution.map((item) => (
                <div key={item.rating}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ color: '#fbbf24', fontSize: 12 }}>★</span>
                      <span style={{ fontSize: 12, color: Colors.textMuted }}>{item.rating}</span>
                    </div>
                    <span style={{ fontSize: 12, color: Colors.textMuted }}>{item.count}</span>
                  </div>
                  <div style={{ 
                    height: 8, 
                    background: 'rgba(100, 140, 255, 0.1)', 
                    borderRadius: 4, 
                    overflow: 'hidden',
                  }}>
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
        
        <Card style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: Colors.text, marginBottom: 16 }}>
            Performance par Département
          </h3>
          {loading ? (
            <div style={{ padding: 20, textAlign: 'center', color: Colors.textMuted }}>
              Chargement...
            </div>
          ) : displayDeptPerformance.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
              {displayDeptPerformance.map((dept) => (
                <div key={dept.id} style={{ 
                  padding: 16, 
                  background: 'rgba(100, 140, 255, 0.03)', 
                  borderRadius: 12,
                  border: `1px solid ${Colors.border}`,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: Colors.text, marginBottom: 4 }}>
                    {dept.name}
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 700, color: dept.avgRating >= 4 ? '#3ecf8e' : '#6490ff', marginBottom: 4 }}>
                    {dept.avgRating.toFixed(1)}
                  </div>
                  <div style={{ fontSize: 10, color: Colors.textMuted }}>
                    {dept.employeeCount} employés
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
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderBottom: `1px solid ${Colors.border}` }}>
        <button
          onClick={() => setCurrentTab('reviews')}
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
          Évaluations ({filteredReviews.length})
        </button>
        <button
          onClick={() => setCurrentTab('objectives')}
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
          Objectifs ({filteredObjectives.length})
        </button>
      </div>

      {/* Filters Card */}
      <Card style={{ marginBottom: 20, padding: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, alignItems: 'end' }}>
          <SearchInput 
            placeholder="Rechercher par employé, département, objectif..."
            value={searchQuery}
            onChange={(value: string) => { setSearchQuery(value); handleFilterChange(); }}
          />
          <div>
            <label style={{ display: 'block', fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>
              Note
            </label>
            <select 
              value={ratingFilter}
              onChange={(e) => { setRatingFilter(e.target.value); handleFilterChange(); }}
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
              <option value="all">Toutes les notes</option>
              <option value="5">5 ★</option>
              <option value="4">4 ★</option>
              <option value="3">3 ★</option>
              <option value="2">2 ★</option>
            </select>
          </div>
          {currentTab === 'reviews' && (
            <div>
              <label style={{ display: 'block', fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>
                Statut
              </label>
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
                <option value="all">Tous les statuts</option>
                <option value="completed">Complété</option>
                <option value="in_progress">En cours</option>
                <option value="pending">En attente</option>
              </select>
            </div>
          )}
        </div>
      </Card>

      {/* Reviews Table */}
      {currentTab === 'reviews' && (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: Colors.textMuted }}>
              Chargement des évaluations...
            </div>
          ) : filteredReviews.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: Colors.textMuted }}>
              Aucune évaluation trouvée. Cliquez sur "+ Nouvelle évaluation" pour commencer.
            </div>
          ) : (
            <>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'rgba(100, 140, 255, 0.05)' }}>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Employé</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Période</th>
                      <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Note</th>
                      <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Objectifs</th>
                      <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Évaluateur</th>
                      <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Statut</th>
                      <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedReviews.map((review, index) => {
                      const ratingBadge = getRatingBadge(review.rating);
                      return (
                        <tr 
                          key={review.id} 
                          style={{ 
                            borderBottom: `1px solid ${Colors.border}`,
                            background: index % 2 === 0 ? 'transparent' : 'rgba(100, 140, 255, 0.02)',
                          }}
                        >
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <div style={{ 
                                width: 36, 
                                height: 36, 
                                borderRadius: '50%', 
                                background: 'rgba(100, 140, 255, 0.15)', 
                                border: '1px solid rgba(100, 140, 255, 0.3)',
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center',
                                fontSize: 12, 
                                fontWeight: 600, 
                                color: Colors.accent,
                              }}>
                                {review.employeeName.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <div style={{ fontSize: 14, fontWeight: 500, color: Colors.text }}>
                                  {review.employeeName}
                                </div>
                                <div style={{ fontSize: 12, color: Colors.textMuted }}>
                                  {review.department}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: 13, color: Colors.text }}>
                            {review.period}
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                              {renderStars(review.rating)}
                            </div>
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: 13, color: Colors.text }}>
                            <span style={{ color: review.objectivesCompleted >= review.objectivesTotal * 0.8 ? '#3ecf8e' : Colors.text }}>
                              {review.objectivesCompleted}
                            </span>
                            <span style={{ color: Colors.textMuted }}>/{review.objectivesTotal}</span>
                          </td>
                          <td style={{ padding: '14px 16px', fontSize: 13, color: Colors.textMuted }}>
                            {review.reviewer}
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                            <span style={{ 
                              padding: '4px 10px', 
                              borderRadius: 6, 
                              fontSize: 11, 
                              fontWeight: 500,
                              background: ratingBadge.bg, 
                              color: ratingBadge.color 
                            }}>
                              {ratingBadge.label}
                            </span>
                          </td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                              <button 
                                onClick={() => openReviewModal(review)}
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
                                ✎
                              </button>
                              <button 
                                onClick={() => openDeleteModal('review', review.id, review.employeeName)}
                                style={{ 
                                  padding: '6px 12px', 
                                  borderRadius: 6, 
                                  border: `1px solid rgba(224, 80, 80, 0.3)`, 
                                  background: 'rgba(224, 80, 80, 0.05)', 
                                  color: '#e05050', 
                                  fontSize: 11, 
                                  cursor: 'pointer',
                                }}
                              >
                                ✕
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
                  Affichage de {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, filteredReviews.length)} sur {filteredReviews.length}
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

      {/* Objectives Table */}
      {currentTab === 'objectives' && (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: Colors.textMuted }}>
              Chargement des objectifs...
            </div>
          ) : filteredObjectives.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: Colors.textMuted }}>
              Aucun objectif trouvé. Cliquez sur "+ Nouvel objectif" pour commencer.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(100, 140, 255, 0.05)' }}>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Objectif</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Employé</th>
                    <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Progression</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Échéance</th>
                    <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Statut</th>
                    <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredObjectives.map((objective, index) => {
                    const statusStyle = getObjectiveStatus(objective.status);
                    const progress = Math.min((objective.achieved / objective.target) * 100, 100);
                    
                    return (
                      <tr 
                        key={objective.id} 
                        style={{ 
                          borderBottom: `1px solid ${Colors.border}`,
                          background: index % 2 === 0 ? 'transparent' : 'rgba(100, 140, 255, 0.02)',
                        }}
                      >
                        <td style={{ padding: '14px 16px' }}>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 500, color: Colors.text }}>
                              {objective.title}
                            </div>
                            <div style={{ fontSize: 12, color: Colors.textMuted }}>
                              {objective.description}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: Colors.text }}>
                          {objective.employeeName}
                        </td>
                        <td style={{ padding: '14px 16px', width: 200 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ 
                              flex: 1,
                              height: 8, 
                              background: 'rgba(100, 140, 255, 0.1)', 
                              borderRadius: 4, 
                              overflow: 'hidden',
                            }}>
                              <div style={{ 
                                width: `${progress}%`, 
                                height: '100%', 
                                background: statusStyle.color,
                                borderRadius: 4,
                              }} />
                            </div>
                            <span style={{ fontSize: 12, fontWeight: 500, color: Colors.text, minWidth: 40 }}>
                              {objective.achieved}/{objective.target}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: Colors.textMuted }}>
                          {formatDate(objective.dueDate)}
                        </td>
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          <span style={{ 
                            padding: '4px 10px', 
                            borderRadius: 6, 
                            fontSize: 11, 
                            fontWeight: 500,
                            background: statusStyle.bg, 
                            color: statusStyle.color 
                          }}>
                            {statusStyle.label}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                            <button 
                              onClick={() => openObjectiveModal(objective)}
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
                              ✎
                            </button>
                            <button 
                              onClick={() => openDeleteModal('objective', objective.id, objective.title)}
                              style={{ 
                                padding: '6px 12px', 
                                borderRadius: 6, 
                                border: `1px solid rgba(224, 80, 80, 0.3)`, 
                                background: 'rgba(224, 80, 80, 0.05)', 
                                color: '#e05050', 
                                fontSize: 11, 
                                cursor: 'pointer',
                              }}
                            >
                              ✕
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* Review Modal */}
      <Modal 
        isOpen={isReviewModalOpen} 
        onClose={() => setIsReviewModalOpen(false)} 
        title={editingReview ? 'Modifier l\'évaluation' : 'Nouvelle évaluation de performance'}
        size="lg"
      >
        <form onSubmit={handleReviewSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Employé *</label>
              <select 
                value={reviewForm.employeeId}
                onChange={(e) => setReviewForm({ ...reviewForm, employeeId: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 8,
                  border: `1px solid ${Colors.border}`,
                  background: Colors.bg,
                  color: Colors.text,
                  fontSize: 13,
                }}
                required
                disabled={!!editingReview}
              >
                <option value="">Sélectionner un employé</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Période *</label>
              <select 
                value={reviewForm.period}
                onChange={(e) => setReviewForm({ ...reviewForm, period: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 8,
                  border: `1px solid ${Colors.border}`,
                  background: Colors.bg,
                  color: Colors.text,
                  fontSize: 13,
                }}
                required
              >
                <option value="Q1 2025">Q1 2025</option>
                <option value="Q4 2024">Q4 2024</option>
                <option value="Q3 2024">Q3 2024</option>
                <option value="Q2 2024">Q2 2024</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Note globale *</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {[1, 2, 3, 4, 5].map(rating => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => setReviewForm({ ...reviewForm, rating })}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: 8,
                      border: reviewForm.rating === rating ? `2px solid ${Colors.accent}` : `1px solid ${Colors.border}`,
                      background: reviewForm.rating === rating ? 'rgba(100, 140, 255, 0.1)' : 'transparent',
                      color: '#fbbf24',
                      fontSize: 20,
                      cursor: 'pointer',
                    }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Objectifs atteints</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input 
                  type="number"
                  min="0"
                  max={reviewForm.objectivesTotal}
                  value={reviewForm.objectivesCompleted}
                  onChange={(e) => setReviewForm({ ...reviewForm, objectivesCompleted: parseInt(e.target.value) || 0 })}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: 8,
                    border: `1px solid ${Colors.border}`,
                    background: Colors.bg,
                    color: Colors.text,
                    fontSize: 13,
                  }}
                />
                <span style={{ alignSelf: 'center', color: Colors.textMuted }}>/</span>
                <input 
                  type="number"
                  min="1"
                  value={reviewForm.objectivesTotal}
                  onChange={(e) => setReviewForm({ ...reviewForm, objectivesTotal: parseInt(e.target.value) || 1 })}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: 8,
                    border: `1px solid ${Colors.border}`,
                    background: Colors.bg,
                    color: Colors.text,
                    fontSize: 13,
                  }}
                />
              </div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Feedback</label>
              <textarea 
                value={reviewForm.feedback}
                onChange={(e) => setReviewForm({ ...reviewForm, feedback: e.target.value })}
                placeholder="Commentaires sur la performance..."
                rows={4}
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
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Points d'amélioration</label>
              <textarea 
                value={reviewForm.improvementPoints}
                onChange={(e) => setReviewForm({ ...reviewForm, improvementPoints: e.target.value })}
                placeholder="Points à améliorer..."
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
            <Button variant="secondary" type="button" onClick={() => setIsReviewModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Enregistrement...' : (editingReview ? 'Mettre à jour' : 'Créer l\'évaluation')}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Objective Modal */}
      <Modal 
        isOpen={isObjectiveModalOpen} 
        onClose={() => setIsObjectiveModalOpen(false)} 
        title={editingObjective ? 'Modifier l\'objectif' : 'Nouvel objectif'}
        size="lg"
      >
        <form onSubmit={handleObjectiveSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Employé *</label>
              <select 
                value={objectiveForm.employeeId}
                onChange={(e) => setObjectiveForm({ ...objectiveForm, employeeId: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: 8,
                  border: `1px solid ${Colors.border}`,
                  background: Colors.bg,
                  color: Colors.text,
                  fontSize: 13,
                }}
                required
                disabled={!!editingObjective}
              >
                <option value="">Sélectionner un employé</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                ))}
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Titre de l'objectif *</label>
              <input 
                type="text"
                value={objectiveForm.title}
                onChange={(e) => setObjectiveForm({ ...objectiveForm, title: e.target.value })}
                placeholder="Ex: Augmenter les ventes de 20%"
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
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Description</label>
              <textarea 
                value={objectiveForm.description}
                onChange={(e) => setObjectiveForm({ ...objectiveForm, description: e.target.value })}
                placeholder="Décrivez l'objectif en détail..."
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
            <div>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Cible *</label>
              <input 
                type="number"
                min="1"
                value={objectiveForm.target}
                onChange={(e) => setObjectiveForm({ ...objectiveForm, target: parseInt(e.target.value) || 1 })}
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
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Date d'échéance *</label>
              <input 
                type="date"
                value={objectiveForm.dueDate}
                onChange={(e) => setObjectiveForm({ ...objectiveForm, dueDate: e.target.value })}
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
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
            <Button variant="secondary" type="button" onClick={() => setIsObjectiveModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit" disabled={submitting}>
              {submitting ? 'Enregistrement...' : (editingObjective ? 'Mettre à jour' : 'Créer l\'objectif')}
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
        <div style={{ padding: '20px 0' }}>
          <p style={{ fontSize: 14, color: Colors.text, marginBottom: 8 }}>
            Êtes-vous sûr de vouloir supprimer {deletingItem?.type === 'review' ? 'l\'évaluation' : 'l\'objectif'} suivant ?
          </p>
          <p style={{ fontSize: 16, fontWeight: 600, color: Colors.text }}>
            {deletingItem?.name}
          </p>
          <p style={{ fontSize: 12, color: Colors.textMuted, marginTop: 12 }}>
            Cette action est irréversible.
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
            Annuler
          </Button>
          <Button 
            variant="primary" 
            onClick={handleDelete}
            disabled={submitting}
            style={{ background: '#e05050', borderColor: '#e05050' }}
          >
            {submitting ? 'Suppression...' : 'Confirmer'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default Performance;

