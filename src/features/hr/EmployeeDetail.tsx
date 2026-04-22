// EmployeeDetail Page - RH Module
// Complete employee detail page with tabs (replaces modal)

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Badge, SectionTitle } from '../../components/common';
import { Colors, Spacing, BorderRadius } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { getStatusColor, getContractTypeColor } from '../../utils/colorMapper';
import type { Employee, EmployeeStatus, ContractType, Department, LeaveRequest, PerformanceReview } from '../../types';
import employeeService from '../../services/employeeService';
import leaveService from '../../services/leaveService';
import performanceService from '../../services/performanceService';

// Extended employee type for display
interface EmployeeDisplay extends Employee {
  departmentName: string;
}

// Tab types
type TabType = 'informations' | 'conges' | 'performance' | 'documents';

// Default departments as fallback
const defaultDepartments: Department[] = [
  { id: '1', name: 'Tech', code: 'TECH', budget: 180000, spent: 142000, createdAt: new Date() },
  { id: '2', name: 'RH', code: 'RH', budget: 95000, spent: 88000, createdAt: new Date() },
  { id: '3', name: 'Finance', code: 'FIN', budget: 120000, spent: 98000, createdAt: new Date() },
  { id: '4', name: 'Ventes', code: 'VT', budget: 220000, spent: 198000, createdAt: new Date() },
  { id: '5', name: 'Formation', code: 'FORM', budget: 150000, spent: 115000, createdAt: new Date() },
];

export const EmployeeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { colors } = useTheme();
  
  // State
  const [employee, setEmployee] = useState<EmployeeDisplay | null>(null);
  const [departments, setDepartments] = useState<Department[]>(defaultDepartments);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('informations');
  
  // Data for tabs
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [performanceReviews, setPerformanceReviews] = useState<PerformanceReview[]>([]);
  const [leavesLoading, setLeavesLoading] = useState(false);

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
    }
  }, []);

  // Fetch employee details
  const fetchEmployee = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const emp = await employeeService.getEmployee(id);
      setEmployee((prevEmployee) => {
        // Éviter les re-renders si les données n'ont pas changé
        if (prevEmployee?.id === emp.id) {
          return {
            ...emp,
            departmentName: departments.find(d => d.id === emp.departmentId)?.name || 'N/A'
          };
        }
        return {
          ...emp,
          departmentName: departments.find(d => d.id === emp.departmentId)?.name || 'N/A'
        };
      });
    } catch (err) {
      console.error('Error fetching employee:', err);
      setError('Erreur lors du chargement des détails de l\'employé');
    } finally {
      setLoading(false);
    }
  }, [id, departments]);

  // Fetch leave requests for this employee
  const fetchLeaveRequests = useCallback(async () => {
    if (!id) return;
    
    try {
      setLeavesLoading(true);
      const leaves = await leaveService.getLeavesByEmployee(id);
      setLeaveRequests(leaves);
    } catch (err) {
      console.error('Error fetching leave requests:', err);
    } finally {
      setLeavesLoading(false);
    }
  }, [id]);

  // Fetch performance reviews
  const fetchPerformanceReviews = useCallback(async () => {
    if (!id) return;
    
    try {
      const result = await performanceService.getPerformanceReviews({ employeeId: id });
      // Map to the format expected by the component
      const mappedReviews = result.data.map((review: any) => ({
        id: review.id,
        employeeId: review.employeeId,
        reviewerId: review.reviewer || '',
        period: review.period,
        objectives: [],
        rating: review.rating,
        feedback: review.feedback,
        createdAt: review.reviewedAt,
      }));
      setPerformanceReviews(mappedReviews);
    } catch (err) {
      console.error('Error fetching performance reviews:', err);
    }
  }, [id]);

  // Initial data load
  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  // Fetch employee - seulement quand l'ID change
  useEffect(() => {
    if (departments.length > 0 && id) {
      fetchEmployee();
    }
  }, [id]); // Retirer fetchEmployee de les dépendances!

  // Fetch tab-specific data when tab changes
  useEffect(() => {
    if (activeTab === 'conges' && leaveRequests.length === 0) {
      fetchLeaveRequests();
    }
    if (activeTab === 'performance' && performanceReviews.length === 0) {
      fetchPerformanceReviews();
    }
  }, [activeTab, fetchLeaveRequests, fetchPerformanceReviews]);

  // Handle go back
  const handleBack = () => {
    navigate('/hr/employees');
  };

  // Loading state
  if (loading) {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '60vh' 
        }}>
          <div style={{
            width: 48,
            height: 48,
            border: '3px solid rgba(100, 140, 255, 0.2)',
            borderTopColor: Colors.accent,
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            marginBottom: 16,
          }} />
          <div style={{ fontSize: 14, color: Colors.textMuted }}>Chargement des détails...</div>
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !employee) {
    return (
      <div style={{ padding: 24 }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '60vh' 
        }}>
          <div style={{ 
            fontSize: 48, 
            marginBottom: 16,
            opacity: 0.5 
          }}>⚠️</div>
          <h2 style={{ fontSize: 20, color: Colors.text, marginBottom: 8 }}>
            Erreur de chargement
          </h2>
          <p style={{ fontSize: 14, color: Colors.textMuted, marginBottom: 24 }}>
            {error || 'Employé non trouvé'}
          </p>
          <Button variant="primary" onClick={handleBack}>
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  const statusStyle = getStatusColor(employee.status, colors);
  const contractStyle = getContractTypeColor(employee.contractType, colors);

  // Tab button style
  const getTabStyle = (tab: TabType) => ({
    padding: '12px 20px',
    border: 'none',
    background: activeTab === tab ? 'rgba(100, 140, 255, 0.1)' : 'transparent',
    color: activeTab === tab ? Colors.accent : Colors.textMuted,
    fontSize: 13,
    fontWeight: 500,
    cursor: 'pointer',
    borderBottom: activeTab === tab ? `2px solid ${Colors.accent}` : '2px solid transparent',
    borderRadius: '4px 4px 0 0',
    transition: 'all 0.2s ease',
  });

  return (
    <div style={{ padding: 24 }}>
      {/* Header with back button */}
      <div style={{ marginBottom: 24 }}>
        <button 
          onClick={handleBack}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: Colors.textMuted,
            fontSize: 13,
            cursor: 'pointer',
            padding: '8px 0',
            marginBottom: 16,
          }}
        >
          <span>←</span> Retour à la liste des employés
        </button>
      </div>

      {/* Employee Profile Card - Hero Section */}
      <Card style={{ padding: 0, marginBottom: 24, overflow: 'hidden' }}>
        {/* Banner */}
        <div style={{
          height: 100,
          background: `linear-gradient(135deg, ${Colors.accent} 0%, rgba(100, 140, 255, 0.6) 100%)`,
          position: 'relative',
        }} />
        
        {/* Profile Info */}
        <div style={{ 
          padding: '0 24px 24px',
          position: 'relative',
          marginTop: -60,
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'flex-end', 
            gap: 24,
            flexWrap: 'wrap',
          }}>
            {/* Avatar */}
            <div style={{ position: 'relative' }}>
              {employee.photoUrl ? (
                <img 
                  src={employee.photoUrl} 
                  alt={`${employee.firstName} ${employee.lastName}`}
                  style={{ 
                    width: 120, 
                    height: 120, 
                    borderRadius: '50%', 
                    objectFit: 'cover',
                    border: '4px solid white',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  }}
                />
              ) : (
                <div style={{ 
                  width: 120, 
                  height: 120, 
                  borderRadius: '50%', 
                  background: 'rgba(100, 140, 255, 0.15)', 
                  border: '4px solid white',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: 36, 
                  fontWeight: 600, 
                  color: Colors.accent,
                }}>
                  {employee.firstName[0]}{employee.lastName[0]}
                </div>
              )}
              {/* Status indicator */}
              <div style={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: statusStyle.color,
                border: '3px solid white',
              }} />
            </div>

            {/* Name and Title */}
            <div style={{ flex: 1, minWidth: 200, paddingBottom: 8 }}>
              <h1 style={{ 
                fontSize: 28, 
                fontWeight: 700, 
                color: Colors.text, 
                marginBottom: 4,
              }}>
                {employee.firstName} {employee.lastName}
              </h1>
              <p style={{ 
                fontSize: 16, 
                color: Colors.textMuted, 
                marginBottom: 12 
              }}>
                {employee.poste || 'Poste non défini'}
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Badge color={Colors.accent}>{employee.departmentName}</Badge>
                <span style={{ 
                  padding: '4px 12px', 
                  borderRadius: 6, 
                  fontSize: 12, 
                  fontWeight: 500,
                  background: contractStyle.bg, 
                  color: contractStyle.color 
                }}>
                  {employee.contractType}
                </span>
                <span style={{ 
                  padding: '4px 12px', 
                  borderRadius: 6, 
                  fontSize: 12, 
                  fontWeight: 500,
                  background: statusStyle.bg, 
                  color: statusStyle.color 
                }}>
                  {employee.status}
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div style={{ display: 'flex', gap: 12, paddingBottom: 12 }}>
              <Button variant="primary" onClick={() => navigate(`/hr/employees?edit=${employee.id}`)}>
                ✎ Modifier
              </Button>
              <Button 
                variant="secondary" 
                onClick={() => window.print()}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                🖨 Imprimer
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* QR Code and Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24, marginBottom: 24 }}>
        {/* QR Code Card */}
        <Card style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: Colors.text, marginBottom: 16 }}>
            Badge Employé
          </h3>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            {employee.qrCodeUrl ? (
              <img 
                src={employee.qrCodeUrl} 
                alt="QR Code"
                style={{ 
                  width: 100, 
                  height: 100, 
                  borderRadius: 8,
                  border: `1px solid ${Colors.border}`,
                }}
              />
            ) : (
              <div style={{
                width: 100,
                height: 100,
                borderRadius: 8,
                background: Colors.bg,
                border: `1px solid ${Colors.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: Colors.textMuted,
                fontSize: 12,
              }}>
                QR Code non disponible
              </div>
            )}
            <div>
              <div style={{ fontSize: 13, color: Colors.textMuted, marginBottom: 4 }}>
                Matricule
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 12 }}>
                {employee.employeeNumber || employee.userId}
              </div>
              <div style={{ fontSize: 12, color: Colors.textMuted }}>
                ID: {employee.id.slice(0, 8)}...
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <Card style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: Colors.text, marginBottom: 16 }}>
            Informations Rapides
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>
                Salaire Mensuel
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {employee.salary.toLocaleString()} <span style={{ fontSize: 12, fontWeight: 400 }}>FCFA</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>
                Date d'embauche
              </div>
              <div style={{ fontSize: 14, fontWeight: 500, color: Colors.text }}>
                {new Date(employee.startDate).toLocaleDateString('fr-FR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>
                Email
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: Colors.text }}>
                {employee.email}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>
                Téléphone
              </div>
              <div style={{ fontSize: 13, fontWeight: 500, color: Colors.text }}>
                {employee.phone || '-'}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tabs Navigation */}
      <div style={{ 
        borderBottom: `1px solid ${Colors.border}`, 
        marginBottom: 24,
        display: 'flex',
        gap: 4,
      }}>
        <button style={getTabStyle('informations')} onClick={() => setActiveTab('informations')}>
          📋 Informations
        </button>
        <button style={getTabStyle('conges')} onClick={() => setActiveTab('conges')}>
          📅 Congés
        </button>
        <button style={getTabStyle('performance')} onClick={() => setActiveTab('performance')}>
          📈 Performance
        </button>
        <button style={getTabStyle('documents')} onClick={() => setActiveTab('documents')}>
          📁 Documents
        </button>
      </div>

      {/* Tab Content */}
      {/* Informations Tab */}
      {activeTab === 'informations' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 24 }}>
          {/* Coordonnées */}
          <Card style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 20 }}>
              Coordonnées
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: `1px solid ${Colors.border}` }}>
                <span style={{ fontSize: 13, color: Colors.textMuted }}>Email professionnel</span>
                <span style={{ fontSize: 13, color: Colors.text, fontWeight: 500 }}>{employee.email}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: `1px solid ${Colors.border}` }}>
                <span style={{ fontSize: 13, color: Colors.textMuted }}>Téléphone</span>
                <span style={{ fontSize: 13, color: Colors.text, fontWeight: 500 }}>{employee.phone || '-'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: Colors.textMuted }}>Adresse</span>
                <span style={{ fontSize: 13, color: Colors.text, fontWeight: 500 }}>-</span>
              </div>
            </div>
          </Card>

          {/* Informations Professionnelles */}
          <Card style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 20 }}>
              Informations Professionnelles
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: `1px solid ${Colors.border}` }}>
                <span style={{ fontSize: 13, color: Colors.textMuted }}>Département</span>
                <span style={{ fontSize: 13, color: Colors.text, fontWeight: 500 }}>{employee.departmentName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: `1px solid ${Colors.border}` }}>
                <span style={{ fontSize: 13, color: Colors.textMuted }}>Poste</span>
                <span style={{ fontSize: 13, color: Colors.text, fontWeight: 500 }}>{employee.poste || '-'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: `1px solid ${Colors.border}` }}>
                <span style={{ fontSize: 13, color: Colors.textMuted }}>Type de contrat</span>
                <span style={{ fontSize: 13, color: Colors.text, fontWeight: 500 }}>{employee.contractType}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: Colors.textMuted }}>Date de début</span>
                <span style={{ fontSize: 13, color: Colors.text, fontWeight: 500 }}>
                  {new Date(employee.startDate).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </Card>

          {/* Rémunération */}
          <Card style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 20 }}>
              Rémunération
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: `1px solid ${Colors.border}` }}>
                <span style={{ fontSize: 13, color: Colors.textMuted }}>Salaire de base</span>
                <span style={{ fontSize: 13, color: Colors.text, fontWeight: 600 }}>{employee.salary.toLocaleString()} FCA</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12, borderBottom: `1px solid ${Colors.border}` }}>
                <span style={{ fontSize: 13, color: Colors.textMuted }}>Salaire annuel</span>
                <span style={{ fontSize: 13, color: Colors.text, fontWeight: 600 }}>{(employee.salary * 12).toLocaleString()} FCA</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, color: Colors.textMuted }}>Devise</span>
                <span style={{ fontSize: 13, color: Colors.text, fontWeight: 500 }}>XOF (FCFA)</span>
              </div>
            </div>
          </Card>

          {/* Notes */}
          <Card style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 20 }}>
              Notes
            </h3>
            <p style={{ fontSize: 13, color: Colors.textMuted, lineHeight: 1.6 }}>
              {employee.notes || 'Aucune note enregistrée pour cet employé.'}
            </p>
          </Card>
        </div>
      )}

      {/* Congés Tab */}
      {activeTab === 'conges' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: Colors.text }}>
              Historique des Congés
            </h3>
            <Button variant="primary" onClick={() => navigate('/hr/leaves')}>
              + Demander un congé
            </Button>
          </div>

          {leavesLoading ? (
            <div style={{ textAlign: 'center', padding: 40, color: Colors.textMuted }}>
              Chargement des demandes de congés...
            </div>
          ) : leaveRequests.length > 0 ? (
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(100, 140, 255, 0.05)' }}>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Type</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Date début</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Date fin</th>
                    <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Jours</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.map((leave) => (
                    <tr key={leave.id} style={{ borderBottom: `1px solid ${Colors.border}` }}>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: Colors.text, fontWeight: 500 }}>
                        {leave.type === 'annuel' && 'Congé annuel'}
                        {leave.type === 'maladie' && 'Maladie'}
                        {leave.type === 'maternite' && 'Maternité'}
                        {leave.type === 'sans_solde' && 'Sans solde'}
                        {leave.type === 'exceptionnel' && 'Exceptionnel'}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: Colors.text }}>
                        {new Date(leave.startDate).toLocaleDateString('fr-FR')}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: Colors.text }}>
                        {new Date(leave.endDate).toLocaleDateString('fr-FR')}
                      </td>
                      <td style={{ padding: '14px 16px', fontSize: 13, color: Colors.text, textAlign: 'center' }}>
                        {leave.days}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ 
                          padding: '4px 10px', 
                          borderRadius: 6, 
                          fontSize: 11, 
                          fontWeight: 500,
                          background: leave.status === 'approved' ? 'rgba(62, 207, 142, 0.15)' : 
                                     leave.status === 'pending' ? 'rgba(251, 146, 60, 0.15)' : 
                                     'rgba(224, 80, 80, 0.15)', 
                          color: leave.status === 'approved' ? '#3ecf8e' : 
                                 leave.status === 'pending' ? '#fb923c' : '#e05050',
                        }}>
                          {leave.status === 'approved' && 'Approuvé'}
                          {leave.status === 'pending' && 'En attente'}
                          {leave.status === 'rejected' && 'Refusé'}
                          {leave.status === 'cancelled' && 'Annulé'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          ) : (
            <Card style={{ padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>📅</div>
              <h4 style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 8 }}>
                Aucun congé enregistré
              </h4>
              <p style={{ fontSize: 13, color: Colors.textMuted }}>
                L'historique des congés de cet employé apparaîtra ici.
              </p>
            </Card>
          )}
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: Colors.text }}>
              Évaluations de Performance
            </h3>
            <Button variant="primary" onClick={() => navigate('/hr/performance')}>
              + Nouvelle évaluation
            </Button>
          </div>

          {performanceReviews.length > 0 ? (
            <div style={{ display: 'grid', gap: 16 }}>
              {performanceReviews.map((review) => (
                <Card key={review.id} style={{ padding: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <h4 style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 4 }}>
                        Évaluation {review.period}
                      </h4>
                      <p style={{ fontSize: 13, color: Colors.textMuted }}>
                        Évaluateur: {review.reviewerId}
                      </p>
                    </div>
                    <div style={{ 
                      padding: '8px 16px', 
                      borderRadius: 8, 
                      background: `rgba(100, 140, 255, 0.1)`,
                      color: Colors.accent,
                      fontSize: 18,
                      fontWeight: 700,
                    }}>
                      {review.rating}/5
                    </div>
                  </div>
                  {review.feedback && (
                    <div style={{ 
                      padding: 16, 
                      background: Colors.bg, 
                      borderRadius: 8,
                      marginBottom: 16,
                    }}>
                      <p style={{ fontSize: 13, color: Colors.text, lineHeight: 1.6 }}>
                        {review.feedback}
                      </p>
                    </div>
                  )}
                  {review.objectives && review.objectives.length > 0 && (
                    <div>
                      <h5 style={{ fontSize: 13, fontWeight: 600, color: Colors.textMuted, marginBottom: 12 }}>
                        OBJECTIFS
                      </h5>
                      {review.objectives.map((obj, idx) => (
                        <div key={idx} style={{ marginBottom: 12 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: 13, color: Colors.text }}>{obj.title}</span>
                            <span style={{ fontSize: 12, color: Colors.textMuted }}>
                              {obj.achieved}/{obj.target}
                            </span>
                          </div>
                          <div style={{ 
                            height: 6, 
                            background: 'rgba(100, 140, 255, 0.1)', 
                            borderRadius: 3,
                            overflow: 'hidden',
                          }}>
                            <div style={{ 
                              height: '100%', 
                              width: `${Math.min((obj.achieved / obj.target) * 100, 100)}%`,
                              background: obj.status === 'achieved' ? '#3ecf8e' : 
                                         obj.status === 'exceeded' ? Colors.accent : '#fb923c',
                              borderRadius: 3,
                            }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <Card style={{ padding: 40, textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>📈</div>
              <h4 style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 8 }}>
                Aucune évaluation de performance
              </h4>
              <p style={{ fontSize: 13, color: Colors.textMuted }}>
                Les évaluations de performance de cet employé apparaîtront ici.
              </p>
            </Card>
          )}
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: Colors.text }}>
              Documents
            </h3>
            <Button variant="primary" onClick={() => navigate('/documents')}>
              + Ajouter un document
            </Button>
          </div>

          <Card style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>📁</div>
            <h4 style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 8 }}>
              Aucun document enregistré
            </h4>
            <p style={{ fontSize: 13, color: Colors.textMuted }}>
              Les documents de cet employé (contrats, CNSS, diplômes, etc.) apparaîtront ici.
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EmployeeDetail;

