// Presence Page - RH & ORG Module
// Complete presence tracking with daily logs, statistics and reports

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, Button, Badge, SearchInput, Modal } from '../../components/common';
import { Colors } from '../../constants/theme';
import attendanceService, { PresenceDayData } from '../../services/attendanceService';
import employeeService from '../../services/employeeService';
import type { Employee, PresenceStatus } from '../../types';

// Extended presence type for display
interface DailyPresence {
  id: string;
  date: Date;
  employeeId: string;
  employeeName: string;
  department: string;
  checkIn?: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'late' | 'leave';
  lateMinutes?: number;
}

export const Presence: React.FC = () => {
  // State
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [presenceRecords, setPresenceRecords] = useState<DailyPresence[]>([]);
  const [weeklyData, setWeeklyData] = useState<PresenceDayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [employeeFilter, setEmployeeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [formData, setFormData] = useState({
    employeeId: '',
    status: 'present' as PresenceStatus,
    checkIn: '08:00',
    checkOut: '17:00',
    notes: '',
  });
  const itemsPerPage = 10;

  // Fetch employees
  const fetchEmployees = useCallback(async () => {
    try {
      const response = await employeeService.getEmployees({ pageSize: 100 });
      setEmployees(response.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  }, []);

  // Fetch presence data
  const fetchPresenceData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch weekly data for chart
      const weekly = await attendanceService.getWeeklyPresence();
      setWeeklyData(weekly);

      // Generate daily presence records from employees (in real app, would fetch from API)
      const records: DailyPresence[] = [];
      const today = new Date();
      
      employees.forEach((emp) => {
        // Simulate presence data based on weekly stats
        const dayOfWeek = today.getDay();
        const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to Mon=0
        const dayData = weekly[dayIndex];
        
        if (dayData) {
          const total = dayData.present + dayData.absent + dayData.late;
          const rand = Math.random() * total;
          let status: DailyPresence['status'] = 'present';
          let lateMinutes: number | undefined;
          
          if (rand < dayData.absent) {
            status = 'absent';
          } else if (rand < dayData.absent + dayData.late) {
            status = 'late';
            lateMinutes = Math.floor(Math.random() * 30) + 5;
          }
          
          if (status !== 'absent') {
            records.push({
              id: `${emp.id}-${today.toISOString().split('T')[0]}`,
              date: today,
              employeeId: emp.id,
              employeeName: `${emp.firstName} ${emp.lastName}`,
              department: emp.departmentId || 'N/A',
              checkIn: status !== 'absent' ? `${8 + Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` : undefined,
              checkOut: status === 'present' ? `${17 + Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}` : undefined,
              status,
              lateMinutes,
            });
          }
        }
      });
      
      setPresenceRecords(records);
    } catch (err) {
      console.error('Error fetching presence data:', err);
      setError('Erreur lors du chargement des données de présence');
    } finally {
      setLoading(false);
    }
  }, [employees]);

  // Load data on mount
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  useEffect(() => {
    if (employees.length > 0) {
      fetchPresenceData();
    }
  }, [employees, fetchPresenceData]);

  // Filter records
  const filteredRecords = useMemo(() => {
    return presenceRecords.filter(record => {
      const matchesSearch = 
        record.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.department.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
      const matchesEmployee = employeeFilter === 'all' || record.employeeId === employeeFilter;
      
      return matchesSearch && matchesStatus && matchesEmployee;
    });
  }, [presenceRecords, searchQuery, statusFilter, employeeFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = presenceRecords.length || 1;
    const present = presenceRecords.filter(r => r.status === 'present').length;
    const absent = presenceRecords.filter(r => r.status === 'absent').length;
    const late = presenceRecords.filter(r => r.status === 'late').length;
    const onLeave = presenceRecords.filter(r => r.status === 'leave').length;
    const lateRecords = presenceRecords.filter(r => r.lateMinutes);
    const avgLateMinutes = lateRecords.length > 0
      ? Math.round(lateRecords.reduce((sum, r) => sum + (r.lateMinutes || 0), 0) / lateRecords.length)
      : 0;
    
    return {
      total,
      present,
      absent,
      late,
      onLeave,
      presentRate: total > 0 ? ((present / total) * 100).toFixed(1) : '0',
      avgLateMinutes,
    };
  }, [presenceRecords]);

  // Pagination
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
  const paginatedRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Handle form input change
  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await attendanceService.recordAttendance({
        employeeId: formData.employeeId,
        date: selectedDate.toISOString().split('T')[0],
        checkIn: formData.status !== 'absent' ? formData.checkIn : undefined,
        checkOut: formData.status === 'present' ? formData.checkOut : undefined,
        status: formData.status,
        notes: formData.notes,
      });
      
      // Refresh data
      fetchPresenceData();
      setIsModalOpen(false);
      setFormData({
        employeeId: '',
        status: 'present',
        checkIn: '08:00',
        checkOut: '17:00',
        notes: '',
      });
    } catch (err) {
      console.error('Error recording attendance:', err);
      alert('Erreur lors de l\'enregistrement de la présence');
    }
  };

  // Status badge colors
  const getStatusBadge = (status: DailyPresence['status']) => {
    const styles: Record<string, { bg: string; color: string; label: string }> = {
      present: { bg: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e', label: 'Présent' },
      absent: { bg: 'rgba(224, 80, 80, 0.15)', color: '#e05050', label: 'Absent' },
      late: { bg: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', label: 'Retard' },
      leave: { bg: 'rgba(100, 140, 255, 0.15)', color: '#6490ff', label: 'Congé' },
    };
    return styles[status] || styles.present;
  };

  // Default weekly data if empty
  const displayWeeklyData = weeklyData.length > 0 ? weeklyData : [
    { jour: 'Lun', presents: 0, absents: 0, retards: 0 },
    { jour: 'Mar', presents: 0, absents: 0, retards: 0 },
    { jour: 'Mer', presents: 0, absents: 0, retards: 0 },
    { jour: 'Jeu', presents: 0, absents: 0, retards: 0 },
    { jour: 'Ven', presents: 0, absents: 0, retards: 0 },
  ];

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: Colors.text, marginBottom: 4 }}>
            Gestion des Présences
          </h1>
          <p style={{ fontSize: 13, color: Colors.textMuted }}>
            Suivi quotidien · Semaine du {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="secondary" onClick={() => setIsModalOpen(true)}>
            📅 Marquer présence
          </Button>
          <Button variant="primary">
            📥 Exporter rapport
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

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 24 }}>
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
                Présents
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: Colors.text }}>
                {loading ? '...' : stats.present}
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
                Absents
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: Colors.text }}>
                {loading ? '...' : stats.absent}
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
              ↻
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Retards
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: Colors.text }}>
                {loading ? '...' : stats.late}
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
              background: 'rgba(100, 140, 255, 0.15)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              fontSize: 20,
              color: '#6490ff',
            }}>
              ⊗
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Congés
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: Colors.text }}>
                {loading ? '...' : stats.onLeave}
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
              %
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Taux présence
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, color: Colors.text }}>
                {loading ? '...' : `${stats.presentRate}%`}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Weekly Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: Colors.text, marginBottom: 2 }}>
                Présence Hebdomadaire
              </h3>
              <p style={{ fontSize: 11, color: Colors.textMuted }}>
                Répartition par jour · Cette semaine
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end', height: 150 }}>
            {displayWeeklyData.map((day, idx) => {
              const max = Math.max(day.presents, day.absents, day.retards) || 1;
              const presentHeight = (day.presents / max) * 100;
              const absentHeight = (day.absents / max) * 100;
              const lateHeight = (day.retards / max) * 100;
              
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 120 }}>
                    <div style={{ 
                      width: 24, 
                      height: `${presentHeight}%`, 
                      background: '#3ecf8e', 
                      borderRadius: 4,
                      minHeight: 20,
                    }} />
                    <div style={{ 
                      width: 24, 
                      height: `${absentHeight}%`, 
                      background: '#e05050', 
                      borderRadius: 4,
                      minHeight: 10,
                    }} />
                    <div style={{ 
                      width: 24, 
                      height: `${lateHeight}%`, 
                      background: '#fb923c', 
                      borderRadius: 4,
                      minHeight: 10,
                    }} />
                  </div>
                  <span style={{ fontSize: 11, color: Colors.textMuted, fontWeight: 500 }}>{day.jour}</span>
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 16 }}>
            {[
              { color: '#3ecf8e', label: 'Présents' },
              { color: '#e05050', label: 'Absents' },
              { color: '#fb923c', label: 'Retards' },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: 2, background: item.color }} />
                <span style={{ fontSize: 10, color: Colors.textMuted }}>{item.label}</span>
              </div>
            ))}
          </div>
        </Card>
        
        <Card style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: Colors.text, marginBottom: 16 }}>
            Aujourd'hui
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '12px 16px',
              background: 'rgba(62, 207, 142, 0.1)',
              borderRadius: 10,
              border: '1px solid rgba(62, 207, 142, 0.2)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>✓</span>
                <span style={{ fontSize: 13, color: Colors.text }}>Présents</span>
              </div>
              <span style={{ fontSize: 20, fontWeight: 700, color: '#3ecf8e' }}>
                {loading ? '...' : stats.present}
              </span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '12px 16px',
              background: 'rgba(224, 80, 80, 0.1)',
              borderRadius: 10,
              border: '1px solid rgba(224, 80, 80, 0.2)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>✕</span>
                <span style={{ fontSize: 13, color: Colors.text }}>Absents</span>
              </div>
              <span style={{ fontSize: 20, fontWeight: 700, color: '#e05050' }}>
                {loading ? '...' : stats.absent}
              </span>
            </div>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '12px 16px',
              background: 'rgba(251, 146, 60, 0.1)',
              borderRadius: 10,
              border: '1px solid rgba(251, 146, 60, 0.2)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 20 }}>↻</span>
                <span style={{ fontSize: 13, color: Colors.text }}>Avg. Retard</span>
              </div>
              <span style={{ fontSize: 20, fontWeight: 700, color: '#fb923c' }}>
                {loading ? '...' : `${stats.avgLateMinutes} min`}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters Card */}
      <Card style={{ marginBottom: 20, padding: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, alignItems: 'end' }}>
          <SearchInput 
            placeholder="Rechercher par employé, département..."
            value={searchQuery}
            onChange={(value: string) => { setSearchQuery(value); handleFilterChange(); }}
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
              <option value="present">Présent</option>
              <option value="absent">Absent</option>
              <option value="late">Retard</option>
              <option value="leave">Congé</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>
              Employé
            </label>
            <select 
              value={employeeFilter}
              onChange={(e) => { setEmployeeFilter(e.target.value); handleFilterChange(); }}
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
              <option value="all">Tous les employés</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Presence Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: Colors.textMuted }}>
            Chargement des données de présence...
          </div>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(100, 140, 255, 0.05)' }}>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Employé</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Département</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Arrivée</th>
                    <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Départ</th>
                    <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Statut</th>
                    <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRecords.map((record, index) => {
                    const statusStyle = getStatusBadge(record.status);
                    return (
                      <tr 
                        key={record.id} 
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
                              {record.employeeName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <div style={{ fontSize: 14, fontWeight: 500, color: Colors.text }}>
                                {record.employeeName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: Colors.textMuted }}>
                          {record.department}
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: Colors.text }}>
                          {record.checkIn ? (
                            <span style={{ 
                              color: record.status === 'late' ? '#fb923c' : Colors.text,
                              fontWeight: record.status === 'late' ? 600 : 400,
                            }}>
                              {record.checkIn}
                              {record.lateMinutes && <span style={{ fontSize: 10, color: '#fb923c', marginLeft: 6 }}>(+{record.lateMinutes}min)</span>}
                            </span>
                          ) : (
                            <span style={{ color: Colors.textMuted }}>—</span>
                          )}
                        </td>
                        <td style={{ padding: '14px 16px', fontSize: 13, color: Colors.text }}>
                          {record.checkOut || '—'}
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
                            <button style={{ 
                              padding: '6px 12px', 
                              borderRadius: 6, 
                              border: `1px solid ${Colors.border}`, 
                              background: 'transparent', 
                              color: Colors.textMuted, 
                              fontSize: 11, 
                              cursor: 'pointer',
                            }}>
                              ✎ Éditer
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
                Affichage de {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, filteredRecords.length)} sur {filteredRecords.length}
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

      {/* Mark Presence Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Marquer la présence"
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Employé *</label>
              <select 
                value={formData.employeeId}
                onChange={(e) => handleFormChange('employeeId', e.target.value)}
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
              >
                <option value="">Sélectionner un employé</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Date</label>
              <input 
                type="date" 
                value={selectedDate.toISOString().split('T')[0]}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
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
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Statut</label>
              <div style={{ display: 'flex', gap: 12 }}>
                {[
                  { value: 'present', label: 'Présent', color: '#3ecf8e' },
                  { value: 'absent', label: 'Absent', color: '#e05050' },
                  { value: 'late', label: 'Retard', color: '#fb923c' },
                  { value: 'leave', label: 'Congé', color: '#6490ff' },
                ].map(option => (
                  <label key={option.value} style={{ 
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '12px',
                    borderRadius: 8,
                    border: formData.status === option.value ? `2px solid ${option.color}` : `1px solid ${Colors.border}`,
                    cursor: 'pointer',
                    fontSize: 13,
                    color: formData.status === option.value ? option.color : Colors.text,
                    background: formData.status === option.value ? `${option.color}10` : 'transparent',
                  }}>
                    <input 
                      type="radio" 
                      name="status" 
                      value={option.value}
                      checked={formData.status === option.value}
                      onChange={(e) => handleFormChange('status', e.target.value)}
                      style={{ display: 'none' }}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Heure d'arrivée</label>
                <input 
                  type="time" 
                  value={formData.checkIn}
                  onChange={(e) => handleFormChange('checkIn', e.target.value)}
                  disabled={formData.status === 'absent'}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 8,
                    border: `1px solid ${Colors.border}`,
                    background: Colors.bg,
                    color: Colors.text,
                    fontSize: 13,
                    opacity: formData.status === 'absent' ? 0.5 : 1,
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Heure de départ</label>
                <input 
                  type="time" 
                  value={formData.checkOut}
                  onChange={(e) => handleFormChange('checkOut', e.target.value)}
                  disabled={formData.status !== 'present'}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: 8,
                    border: `1px solid ${Colors.border}`,
                    background: Colors.bg,
                    color: Colors.text,
                    fontSize: 13,
                    opacity: formData.status !== 'present' ? 0.5 : 1,
                  }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Notes</label>
              <textarea 
                placeholder="Notes supplémentaires..."
                value={formData.notes}
                onChange={(e) => handleFormChange('notes', e.target.value)}
                rows={2}
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
            <Button variant="primary" type="submit" disabled={!formData.employeeId}>
              Enregistrer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Presence;

