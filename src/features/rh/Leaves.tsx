// Leave Page - RH & ORG Module
// Complete leave management with requests, balances, and approvals

import React, { useState, useMemo } from 'react';
import { Card, Button, Badge, SearchInput } from '../../components/common';
import { Colors } from '../../constants/theme';
import { leaveData, employeesData, deptPerformance } from '../../data/mockData';
import { LeaveRequestForm } from './components';
import type { LeaveRequestFormData } from './components/LeaveRequestForm';

// Extended leave type for display
interface LeaveRequestDisplay {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  type: 'annuel' | 'maladie' | 'maternite' | 'sans_solde' | 'exceptionnel';
  startDate: Date;
  endDate: Date;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  submittedAt: Date;
}

// Generate mock leave requests
const generateLeaveRequests = (): LeaveRequestDisplay[] => {
  const types: LeaveRequestDisplay['type'][] = ['annuel', 'maladie', 'maternite', 'sans_solde', 'exceptionnel'];
  const statuses: LeaveRequestDisplay['status'][] = ['pending', 'approved', 'approved', 'approved', 'rejected'];
  
  const requests: LeaveRequestDisplay[] = [];
  
  employeesData.forEach((emp, idx) => {
    const dept = deptPerformance.find(d => d.id === emp.departmentId);
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 30) - 10);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 5) + 1);
    
    const submittedAt = new Date();
    submittedAt.setDate(submittedAt.getDate() - Math.floor(Math.random() * 7));
    
    requests.push({
      id: `leave-${emp.id}`,
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      department: dept?.name || 'N/A',
      type,
      startDate,
      endDate,
      days: Math.floor(Math.random() * 10) + 1,
      reason: type === 'annuel' ? 'Congé annuel prévu' : 
              type === 'maladie' ? 'Maladie déclarée' :
              type === 'maternite' ? 'Congé maternite' :
              type === 'sans_solde' ? 'Absence non payée' : 'Exceptionnel',
      status,
      submittedAt,
    });
  });
  
  return requests;
};

export const Leaves: React.FC = () => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const itemsPerPage = 10;

  // Generate mock data
  const leaveRequests = useMemo(() => generateLeaveRequests(), []);

  // Calculate leave balances per employee
  const leaveBalances = useMemo(() => {
    return employeesData.map(emp => {
      const dept = deptPerformance.find(d => d.id === emp.departmentId);
      return {
        employeeId: emp.id,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        department: dept?.name || 'N/A',
        annuel: { total: 24, used: Math.floor(Math.random() * 15), remaining: 24 - Math.floor(Math.random() * 15) },
        maladie: { total: 10, used: Math.floor(Math.random() * 5), remaining: 10 - Math.floor(Math.random() * 5) },
        maternite: { total: 14, used: 0, remaining: 14 },
        sans_solde: { total: 30, used: Math.floor(Math.random() * 10), remaining: 30 - Math.floor(Math.random() * 10) },
        exceptionnel: { total: 5, used: Math.floor(Math.random() * 3), remaining: 5 - Math.floor(Math.random() * 3) },
      };
    });
  }, []);

  // Filter requests
  const filteredRequests = useMemo(() => {
    return leaveRequests.filter(request => {
      const matchesSearch = 
        request.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.department.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
      const matchesType = typeFilter === 'all' || request.type === typeFilter;
      
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [leaveRequests, searchQuery, statusFilter, typeFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = leaveRequests.length;
    const pending = leaveRequests.filter(r => r.status === 'pending').length;
    const approved = leaveRequests.filter(r => r.status === 'approved').length;
    const rejected = leaveRequests.filter(r => r.status === 'rejected').length;
    const totalDays = leaveRequests.filter(r => r.status === 'approved').reduce((sum, r) => sum + r.days, 0);
    
    return { total, pending, approved, rejected, totalDays };
  }, [leaveRequests]);

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Handle form submission
  const handleLeaveRequestSubmit = (data: LeaveRequestFormData) => {
    console.log('Leave request data submitted:', data);
    // Here you would typically call an API to submit the leave request
  };

  // Status badge colors
  const getStatusBadge = (status: LeaveRequestDisplay['status']) => {
    const styles: Record<string, { bg: string; color: string; label: string }> = {
      pending: { bg: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', label: 'En attente' },
      approved: { bg: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e', label: 'Approuvé' },
      rejected: { bg: 'rgba(224, 80, 80, 0.15)', color: '#e05050', label: 'Rejeté' },
      cancelled: { bg: 'rgba(160, 174, 192, 0.15)', color: '#a0aeb0', label: 'Annulé' },
    };
    return styles[status] || styles.pending;
  };

  // Leave type colors
  const getTypeColor = (type: LeaveRequestDisplay['type']) => {
    const colors: Record<string, string> = {
      annuel: '#6490ff',
      maladie: '#3ecf8e',
      maternite: '#a78bfa',
      sans_solde: '#fb923c',
      exceptionnel: '#2dd4bf',
    };
    return colors[type] || '#6490ff';
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: Colors.text, marginBottom: 4 }}>
            Gestion des Congés
          </h1>
          <p style={{ fontSize: 13, color: Colors.textMuted }}>
            Demandes · Soldes · Approbations
          </p>
        </div>
        <Button variant="primary" onClick={() => setIsNewRequestOpen(true)}>
          + Nouvelle demande
        </Button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
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
                Total
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: Colors.text }}>
                {stats.total}
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
                {stats.pending}
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
                Approuvés
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: Colors.text }}>
                {stats.approved}
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
              background: 'rgba(224, 80, 80, 0.15)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: 20,
              color: '#e05050',
            }}>
              ✕
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Rejetés
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: Colors.text }}>
                {stats.rejected}
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
              📅
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Jours approuvés
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: Colors.text }}>
                {stats.totalDays}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Leave Distribution Chart & Balances */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, marginBottom: 24 }}>
        <Card style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: Colors.text, marginBottom: 16 }}>
            Répartition des Congés
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {leaveData.map((item, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: Colors.textMuted }}>{item.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: Colors.text }}>{item.value}</span>
                </div>
                <div style={{ 
                  height: 8, 
                  background: 'rgba(100, 140, 255, 0.1)', 
                  borderRadius: 4, 
                  overflow: 'hidden',
                }}>
                  <div style={{ 
                    width: `${(item.value / 50) * 100}%`, 
                    height: '100%', 
                    background: item.color,
                    borderRadius: 4,
                  }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
        
        <Card style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: Colors.text, marginBottom: 16 }}>
            Soldes par Employé
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${Colors.border}` }}>
                  <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 10, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Employé</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: 10, fontWeight: 600, color: '#6490ff', textTransform: 'uppercase' }}>Annuel</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: 10, fontWeight: 600, color: '#3ecf8e', textTransform: 'uppercase' }}>Maladie</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: 10, fontWeight: 600, color: '#a78bfa', textTransform: 'uppercase' }}>Mat.</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: 10, fontWeight: 600, color: '#fb923c', textTransform: 'uppercase' }}>Sans.solde</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center', fontSize: 10, fontWeight: 600, color: '#2dd4bf', textTransform: 'uppercase' }}>Excep.</th>
                </tr>
              </thead>
              <tbody>
                {leaveBalances.slice(0, 5).map((balance) => (
                  <tr key={balance.employeeId} style={{ borderBottom: `1px solid ${Colors.border}` }}>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ fontSize: 12, color: Colors.text, fontWeight: 500 }}>{balance.employeeName}</div>
                      <div style={{ fontSize: 10, color: Colors.textMuted }}>{balance.department}</div>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span style={{ fontSize: 11, color: '#6490ff', fontWeight: 600 }}>{balance.annuel.remaining}</span>
                      <span style={{ fontSize: 9, color: Colors.textMuted }}>/{balance.annuel.total}</span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span style={{ fontSize: 11, color: '#3ecf8e', fontWeight: 600 }}>{balance.maladie.remaining}</span>
                      <span style={{ fontSize: 9, color: Colors.textMuted }}>/{balance.maladie.total}</span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span style={{ fontSize: 11, color: '#a78bfa', fontWeight: 600 }}>{balance.maternite.remaining}</span>
                      <span style={{ fontSize: 9, color: Colors.textMuted }}>/{balance.maternite.total}</span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span style={{ fontSize: 11, color: '#fb923c', fontWeight: 600 }}>{balance.sans_solde.remaining}</span>
                      <span style={{ fontSize: 9, color: Colors.textMuted }}>/{balance.sans_solde.total}</span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span style={{ fontSize: 11, color: '#2dd4bf', fontWeight: 600 }}>{balance.exceptionnel.remaining}</span>
                      <span style={{ fontSize: 9, color: Colors.textMuted }}>/{balance.exceptionnel.total}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Filters Card */}
      <Card style={{ marginBottom: 20, padding: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, alignItems: 'end' }}>
          <SearchInput 
            placeholder="Rechercher par employé, département..."
            value={searchQuery}
            onChange={(value) => { setSearchQuery(value); handleFilterChange(); }}
          />
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
              <option value="pending">En attente</option>
              <option value="approved">Approuvé</option>
              <option value="rejected">Rejeté</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>
              Type de congé
            </label>
            <select 
              value={typeFilter}
              onChange={(e) => { setTypeFilter(e.target.value); handleFilterChange(); }}
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
              <option value="all">Tous les types</option>
              <option value="annuel">Annuel</option>
              <option value="maladie">Maladie</option>
              <option value="maternite">Maternité</option>
              <option value="sans_solde">Sans solde</option>
              <option value="exceptionnel">Exceptionnel</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Leave Requests Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(100, 140, 255, 0.05)' }}>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Employé</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Dates</th>
                <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Jours</th>
                <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Motif</th>
                <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Statut</th>
                <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRequests.map((request, index) => {
                const statusStyle = getStatusBadge(request.status);
                const typeColor = getTypeColor(request.type);
                return (
                  <tr 
                    key={request.id} 
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
                          {request.employeeName.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 500, color: Colors.text }}>
                            {request.employeeName}
                          </div>
                          <div style={{ fontSize: 12, color: Colors.textMuted }}>
                            {request.department}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ 
                        padding: '4px 10px', 
                        borderRadius: 6, 
                        fontSize: 11, 
                        fontWeight: 500,
                        background: `${typeColor}20`, 
                        color: typeColor,
                      }}>
                        {request.type === 'annuel' ? 'Annuel' : 
                         request.type === 'maladie' ? 'Maladie' :
                         request.type === 'maternite' ? 'Maternité' :
                         request.type === 'sans_solde' ? 'Sans solde' : 'Exceptionnel'}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: Colors.text }}>
                      {request.startDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - {request.endDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'center', fontSize: 14, fontWeight: 600, color: Colors.text }}>
                      {request.days}
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: Colors.textMuted }}>
                      {request.reason}
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
                        {request.status === 'pending' && (
                          <>
                            <button style={{ 
                              padding: '6px 12px', 
                              borderRadius: 6, 
                              border: 'none', 
                              background: 'rgba(62, 207, 142, 0.15)', 
                              color: '#3ecf8e', 
                              fontSize: 11, 
                              cursor: 'pointer',
                              fontWeight: 500,
                            }}>
                              ✓ Accepter
                            </button>
                            <button style={{ 
                              padding: '6px 12px', 
                              borderRadius: 6, 
                              border: 'none', 
                              background: 'rgba(224, 80, 80, 0.15)', 
                              color: '#e05050', 
                              fontSize: 11, 
                              cursor: 'pointer',
                              fontWeight: 500,
                            }}>
                              ✕ Refuser
                            </button>
                          </>
                        )}
                        {request.status !== 'pending' && (
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
                        )}
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
            Affichage de {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, filteredRequests.length)} sur {filteredRequests.length}
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
      </Card>

      {/* Leave Request Form Modal */}
      <LeaveRequestForm
        isOpen={isNewRequestOpen}
        onClose={() => setIsNewRequestOpen(false)}
        onSubmit={handleLeaveRequestSubmit}
      />
    </div>
  );
};

export default Leaves;

