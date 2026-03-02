// Performance Page - RH & ORG Module
// Complete performance management with reviews, objectives, and analytics

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, Button, Badge, SearchInput, Modal } from '../../components/common';
import { Colors } from '../../constants/theme';
import performanceService from '../../services/performanceService';
import employeeService from '../../services/employeeService';
import type { Employee } from '../../types';

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

export const Performance: React.FC = () => {
  // State
  const [performanceReviews, setPerformanceReviews] = useState<PerformanceReviewDisplay[]>([]);
  const [objectives, setObjectives] = useState<ObjectiveDisplay[]>([]);
  const [departmentPerformance, setDepartmentPerformance] = useState<DepartmentPerformance[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [currentTab, setCurrentTab] = useState<'reviews' | 'objectives'>('reviews');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itemsPerPage = 10;

  // Fetch performance reviews
  const fetchPerformanceReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await performanceService.getPerformanceReviews({ pageSize: 100 });
      setPerformanceReviews(response.data || []);
    } catch (err) {
      console.error('Error fetching performance reviews:', err);
      // Don't show error - just use empty data when API fails
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
    } catch (err) {
      console.error('Error fetching objectives:', err);
      // Don't show error - just use empty data when API fails
      setObjectives([]);
    }
  }, []);

  // Fetch department performance
  const fetchDepartmentPerformance = useCallback(async () => {
    try {
      const data = await performanceService.getDepartmentPerformance();
      setDepartmentPerformance(data);
    } catch (err) {
      console.error('Error fetching department performance:', err);
    }
  }, []);

  // Fetch employees
  const fetchEmployees = useCallback(async () => {
    try {
      const response = await employeeService.getEmployees({ pageSize: 100 });
      setEmployees(response.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

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
      
      return matchesSearch && matchesRating;
    });
  }, [performanceReviews, searchQuery, ratingFilter]);

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

  // Rating stars
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? '#fbbf24' : Colors.border, fontSize: 14 }}>
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
    // No fallback - show empty state when no backend data
    return [];
  }, [departmentPerformance]);

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
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          + Nouvelle évaluation
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
          ) : (
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
          Évaluations
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
          Objectifs
        </button>
      </div>

      {/* Filters Card */}
      <Card style={{ marginBottom: 20, padding: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, alignItems: 'end' }}>
          <SearchInput 
            placeholder="Rechercher par employé, département..."
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
        </div>
      </Card>

      {/* Reviews Table */}
      {currentTab === 'reviews' && (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: Colors.textMuted }}>
              Chargement des évaluations...
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
                            <button style={{ 
                              padding: '6px 12px', 
                              borderRadius: 6, 
                              border: `1px solid ${Colors.border}`, 
                              background: 'transparent', 
                              color: Colors.textMuted, 
                              fontSize: 11, 
                              cursor: 'pointer',
                            }}>
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
                          {objective.dueDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
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
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* New Evaluation Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Nouvelle évaluation de performance"
        size="lg"
      >
        <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Employé *</label>
              <select 
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
                <option value="">Sélectionner un employé</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Période *</label>
              <select 
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
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: 8,
                      border: `1px solid ${Colors.border}`,
                      background: 'transparent',
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
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Feedback</label>
              <textarea 
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
            <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Soumettre l'évaluation
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Performance;

