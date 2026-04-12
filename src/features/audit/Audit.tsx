// Audit & Logs Feature - Tornadoes Job System Module
// Connected to backend API

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, Button, Modal } from '../../components/common';
import { Colors } from '../../constants/theme';
import auditService from '../../services/auditService';

// Types
interface AuditLog {
  id: string;
  timestamp: Date;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  details: string;
  ipAddress: string;
  status: 'success' | 'warning' | 'error';
}

// Action types
const actionTypes = [
  { id: 'login', label: 'Login', icon: '🔑', color: '#3ecf8e' },
  { id: 'create', label: 'Creation', icon: '➕', color: '#6490ff' },
  { id: 'update', label: 'Update', icon: '✏️', color: '#fb923c' },
  { id: 'delete', label: 'Deletion', icon: '🗑️', color: '#e05050' },
  { id: 'view', label: 'View', icon: '👁️', color: '#a78bfa' },
];

// Modules
const modules = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'employees', label: 'Employees' },
  { id: 'departments', label: 'Departments' },
  { id: 'presence', label: 'Presence' },
  { id: 'conges', label: 'Leave' },
  { id: 'performance', label: 'Performance' },
  { id: 'treasury', label: 'Treasury' },
  { id: 'invoices', label: 'Invoicing' },
  { id: 'accounting', label: 'Accounting' },
  { id: 'stock', label: 'Stock' },
  { id: 'projects', label: 'Projects' },
  { id: 'documents', label: 'Documents' },
  { id: 'students', label: 'Learners' },
  { id: 'teachers', label: 'Teachers' },
  { id: 'schedule', label: 'Schedules' },
  { id: 'grades', label: 'Grades' },
  { id: 'roles', label: 'Roles & Access' },
  { id: 'audit', label: 'Audit & Logs' },
];

// Get action info
const getActionInfo = (action: string) => {
  if (!action) return { id: 'unknown', label: 'Unknown', icon: '❓', color: '#6490ff' };

  const normalizedAction = action.toLowerCase();

  // Try exact match first
  let found = actionTypes.find(a => normalizedAction.includes(a.label.toLowerCase()));
  if (found) return found;

  // Try pattern matching for specific actions
  if (normalizedAction.includes('login') || normalizedAction.includes('connexion')) return { id: 'login', label: 'Login', icon: '🔑', color: '#3ecf8e' };
  if (normalizedAction.includes('create') || normalizedAction.includes('creation') || normalizedAction.includes('création')) return { id: 'create', label: 'Creation', icon: '➕', color: '#6490ff' };
  if (normalizedAction.includes('update') || normalizedAction.includes('modif')) return { id: 'update', label: 'Update', icon: '✏️', color: '#fb923c' };
  if (normalizedAction.includes('delete') || normalizedAction.includes('suppression')) return { id: 'delete', label: 'Deletion', icon: '🗑️', color: '#e05050' };
  if (normalizedAction.includes('view') || normalizedAction.includes('consultation')) return { id: 'view', label: 'View', icon: '👁️', color: '#a78bfa' };

  // Default
  return { id: 'unknown', label: action, icon: '❓', color: '#6490ff' };
};

// Get status color
const getStatusColor = (status: string): { bg: string; color: string; label: string } => {
  switch (status) {
    case 'success': return { bg: 'rgba(62, 207, 142, 0.15)', color: '#3ecf8e', label: 'Success' };
    case 'warning': return { bg: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', label: 'Warning' };
    case 'error': return { bg: 'rgba(224, 80, 80, 0.15)', color: '#e05050', label: 'Error' };
    default: return { bg: 'rgba(100, 140, 255, 0.15)', color: '#6490ff', label: 'Unknown' };
  }
};

// Format date
const formatDate = (date: Date): string => {
  if (!date || isNaN(date.getTime())) {
    return 'Invalid date';
  }

  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days} day(s) ago`;
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
};

// Format date for API (ISO string)
const formatDateForAPI = (date: Date | null): string | undefined => {
  if (!date) return undefined;
  return date.toISOString();
};

// Format date for display in input
const formatDateForInput = (date: Date | null): string => {
  if (!date) return '';
  return date.toISOString().split('T')[0];
};

export const Audit: React.FC = () => {
  // State
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string>('all');
  const [selectedAction, setSelectedAction] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [totalLogs, setTotalLogs] = useState(0);
  const itemsPerPage = 15;

  // Date range filtering
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);

  // Purge modal state
  const [isPurgeModalOpen, setIsPurgeModalOpen] = useState(false);
  const [purgeDays, setPurgeDays] = useState(90);
  const [isPurging, setIsPurging] = useState(false);
  const [purgeSuccess, setPurgeSuccess] = useState(false);

  // Fetch data from API
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await auditService.getAuditLogs({
        page: currentPage - 1,
        size: itemsPerPage,
        module: selectedModule !== 'all' ? selectedModule : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
        startDate: formatDateForAPI(startDate),
        endDate: formatDateForAPI(endDate),
      });

      console.log('Audit logs fetched:', result.data);

      const logs: AuditLog[] = result.data.map(log => {
        let timestamp = new Date();
        if (log.timestamp) {
          timestamp = new Date(log.timestamp);
          if (isNaN(timestamp.getTime()) && typeof log.timestamp === 'string') {
            const parsed = parseInt(log.timestamp, 10);
            if (!isNaN(parsed)) {
              timestamp = new Date(parsed);
            }
          }
        }

        return {
          id: log.id,
          timestamp: timestamp,
          userName: log.userName || 'Unknown User',
          userRole: log.userRole || 'Unknown Role',
          action: log.action,
          module: log.module,
          details: log.details,
          ipAddress: log.ipAddress,
          status: log.status,
        };
      });

      console.log('Processed logs:', logs);
      setAuditLogs(logs);
      setTotalLogs(result.total);
    } catch (error) {
      console.error('Error fetching audit logs:', error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, selectedModule, selectedStatus, startDate, endDate]);

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Fetch stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        await auditService.getAuditStats();
      } catch (error) {
        console.error('Error fetching audit stats:', error);
      }
    };
    fetchStats();
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedModule, selectedAction, selectedStatus, searchQuery, startDate, endDate]);

  // Summary stats
  const stats = useMemo(() => {
    return {
      totalLogs: totalLogs,
      todayLogs: auditLogs.filter(l => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return l.timestamp >= today;
      }).length,
      errors: auditLogs.filter(l => l.status === 'error').length,
      warnings: auditLogs.filter(l => l.status === 'warning').length,
    };
  }, [auditLogs, totalLogs]);

  // Export logs to CSV
  const exportLogsToCSV = () => {
    if (auditLogs.length === 0 && totalLogs === 0) return;

    const headers = ['ID', 'Date', 'Utilisateur', 'Role', 'Action', 'Module', 'Details', 'IP', 'Statut'];
    const csvRows = [headers.join(',')];

    auditLogs.forEach(log => {
      const row = [
        log.id,
        log.timestamp instanceof Date ? log.timestamp.toISOString() : String(log.timestamp),
        `"${(log.userName || '').replace(/"/g, '""')}"`,
        `"${(log.userRole || '').replace(/"/g, '""')}"`,
        `"${(log.action || '').replace(/"/g, '""')}"`,
        log.module,
        `"${(log.details || '').replace(/"/g, '""')}"`,
        log.ipAddress,
        log.status,
      ];
      csvRows.push(row.join(','));
    });

    const csvContent = '\uFEFF' + csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Purge old logs
  const handlePurge = async () => {
    setIsPurging(true);
    try {
      const beforeDate = new Date();
      beforeDate.setDate(beforeDate.getDate() - purgeDays);
      const success = await auditService.purgeOldLogs(beforeDate.toISOString());

      if (success) {
        setPurgeSuccess(true);
        setTimeout(() => {
          setIsPurgeModalOpen(false);
          setPurgeSuccess(false);
          fetchData();
        }, 1500);
      }
    } catch (error) {
      console.error('Error purging logs:', error);
    } finally {
      setIsPurging(false);
    }
  };

  // Apply date range filter
  const applyDateRange = () => {
    setShowDateRangePicker(false);
    setCurrentPage(1);
    fetchData();
  };

  // Clear date range filter
  const clearDateRange = () => {
    setStartDate(null);
    setEndDate(null);
    setCurrentPage(1);
  };

  // Pagination
  const totalPages = Math.ceil(totalLogs / itemsPerPage);

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: Colors.text, marginBottom: 4 }}>
            Audit & Logs
          </h1>
          <p style={{ fontSize: 13, color: Colors.textMuted }}>
            Activity journal . Traceability . System history
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="secondary" onClick={exportLogsToCSV}>
            Export CSV
          </Button>
          <Button variant="primary" onClick={() => setIsPurgeModalOpen(true)}>
            Purge Logs
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(100, 140, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#6490ff' }}>
              Logs
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Total Logs
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {isLoading ? '...' : totalLogs}
              </div>
            </div>
          </div>
        </Card>

        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(62, 207, 142, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#3ecf8e' }}>
              Today
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Today
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {isLoading ? '...' : stats.todayLogs}
              </div>
            </div>
          </div>
        </Card>

        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(224, 80, 80, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#e05050' }}>
              Errors
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Errors
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {isLoading ? '...' : stats.errors}
              </div>
            </div>
          </div>
        </Card>

        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(251, 146, 60, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#fb923c' }}>
              Warn
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Warnings
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {isLoading ? '...' : stats.warnings}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: 20, padding: 16 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={selectedModule}
            onChange={(e) => setSelectedModule(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}
          >
            <option value="all">All modules</option>
            {modules.map(m => (<option key={m.id} value={m.id}>{m.label}</option>))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}
          >
            <option value="all">All statuses</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>

          {/* Date range filter */}
          <div style={{ position: 'relative' }}>
            <Button
              variant="secondary"
              onClick={() => setShowDateRangePicker(!showDateRangePicker)}
              style={{ fontSize: 13, padding: '10px 14px' }}
            >
              {startDate || endDate ? `Date: ${formatDateForInput(startDate)} → ${formatDateForInput(endDate)}` : 'Date Range'}
            </Button>

            {showDateRangePicker && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: 8,
                padding: 16,
                background: Colors.card,
                border: `1px solid ${Colors.border}`,
                borderRadius: 12,
                boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                zIndex: 100,
                minWidth: 320,
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: Colors.text, marginBottom: 12 }}>Filter by date range</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>From</label>
                    <input
                      type="date"
                      value={formatDateForInput(startDate)}
                      onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 12 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>To</label>
                    <input
                      type="date"
                      value={formatDateForInput(endDate)}
                      onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: 6, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 12 }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                  {[
                    { label: '7d', days: 7 },
                    { label: '30d', days: 30 },
                    { label: '90d', days: 90 },
                    { label: '1y', days: 365 },
                  ].map(preset => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        const start = new Date();
                        start.setDate(start.getDate() - preset.days);
                        setStartDate(start);
                        setEndDate(new Date());
                      }}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 4,
                        border: `1px solid ${Colors.border}`,
                        background: 'transparent',
                        color: Colors.textMuted,
                        fontSize: 11,
                        cursor: 'pointer',
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button variant="secondary" onClick={clearDateRange} style={{ flex: 1, fontSize: 12, padding: '8px 12px' }}>Clear</Button>
                  <Button variant="primary" onClick={applyDateRange} style={{ flex: 1, fontSize: 12, padding: '8px 12px' }}>Apply</Button>
                </div>
              </div>
            )}
          </div>

          {/* Active date range indicator */}
          {(startDate || endDate) && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 12px',
              borderRadius: 6,
              background: 'rgba(100, 140, 255, 0.08)',
              border: `1px solid rgba(100, 140, 255, 0.2)`,
              fontSize: 11,
              color: Colors.accent,
            }}>
              Active: {startDate ? formatDateForInput(startDate) : '...'} → {endDate ? formatDateForInput(endDate) : 'now'}
              <button
                onClick={clearDateRange}
                style={{ background: 'none', border: 'none', color: Colors.accent, cursor: 'pointer', fontSize: 14, padding: '0 2px' }}
              >
                ×
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* Logs Table */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center', color: Colors.textMuted }}>
            Loading logs...
          </div>
        ) : auditLogs.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 8 }}>No results</div>
            <div style={{ fontSize: 13, color: Colors.textMuted }}>No audit logs found</div>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(100, 140, 255, 0.05)' }}>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Timestamp</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>User</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Action</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Module</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Details</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {auditLogs.map((log) => {
                  const actionInfo = getActionInfo(log.action);
                  const statusInfo = getStatusColor(log.status);
                  const moduleInfo = modules.find(m => m.id === log.module);
                  return (
                    <tr
                      key={log.id}
                      style={{
                        borderBottom: `1px solid ${Colors.border}`,
                        cursor: 'pointer',
                      }}
                      onClick={() => { setSelectedLog(log); setIsModalOpen(true); }}
                    >
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: 12, color: Colors.textMuted }}>
                          {formatDate(log.timestamp)}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(100, 140, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, color: Colors.accent }}>
                            {log.userName ? log.userName.split(' ').map(n => n[0]).join('') : '?'}
                          </div>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: 500, color: Colors.text }}>{log.userName || 'Unknown'}</div>
                            <div style={{ fontSize: 10, color: Colors.textMuted }}>{log.userRole || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontSize: 14 }}>{actionInfo.icon}</span>
                          <span style={{ fontSize: 12, color: actionInfo.color }}>{log.action}</span>
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 500, background: 'rgba(100, 140, 255, 0.1)', color: Colors.accent }}>
                          {moduleInfo?.label || log.module}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ fontSize: 12, color: Colors.textLight, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {log.details}
                        </div>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 500, background: statusInfo.bg, color: statusInfo.color }}>
                          {statusInfo.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderTop: `1px solid ${Colors.border}` }}>
            <div style={{ fontSize: 12, color: Colors.textMuted }}>
              Page {currentPage} of {totalPages} ({totalLogs} logs)
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <Button
                variant="secondary"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                style={{ fontSize: 12, padding: '6px 14px', opacity: currentPage === 1 ? 0.5 : 1 }}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                style={{ fontSize: 12, padding: '6px 14px', opacity: currentPage === totalPages ? 0.5 : 1 }}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Log Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setSelectedLog(null); }}
        title="Action Details"
        size="md"
      >
        {selectedLog && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>USER</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(100, 140, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, color: Colors.accent }}>
                    {selectedLog.userName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: Colors.text }}>{selectedLog.userName}</div>
                    <div style={{ fontSize: 11, color: Colors.textMuted }}>{selectedLog.userRole}</div>
                  </div>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>STATUS</div>
                <div style={{ marginTop: 8 }}>
                  <span style={{ padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 500, background: getStatusColor(selectedLog.status).bg, color: getStatusColor(selectedLog.status).color }}>
                    {getStatusColor(selectedLog.status).label}
                  </span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>TIMESTAMP</div>
                <div style={{ fontSize: 13, color: Colors.text, marginTop: 4 }}>
                  {selectedLog.timestamp.toLocaleString('fr-FR')}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>IP ADDRESS</div>
                <div style={{ fontSize: 13, color: Colors.text, fontFamily: 'monospace', marginTop: 4 }}>
                  {selectedLog.ipAddress || 'N/A'}
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>ACTION</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <span style={{ fontSize: 16 }}>{getActionInfo(selectedLog.action).icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: getActionInfo(selectedLog.action).color }}>
                    {selectedLog.action}
                  </span>
                  <span style={{ padding: '3px 8px', borderRadius: 4, fontSize: 10, background: 'rgba(100, 140, 255, 0.1)', color: Colors.accent }}>
                    {modules.find(m => m.id === selectedLog.module)?.label || selectedLog.module}
                  </span>
                </div>
              </div>
              {selectedLog.details && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>DETAILS</div>
                  <div style={{
                    fontSize: 12,
                    color: Colors.text,
                    padding: 12,
                    background: 'rgba(100, 140, 255, 0.03)',
                    borderRadius: 8,
                    border: `1px solid ${Colors.border}`,
                    lineHeight: 1.5,
                  }}>
                    {selectedLog.details}
                  </div>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <Button variant="secondary" onClick={() => { setIsModalOpen(false); setSelectedLog(null); }}>Close</Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Purge Confirmation Modal */}
      <Modal
        isOpen={isPurgeModalOpen}
        onClose={() => { setIsPurgeModalOpen(false); setPurgeSuccess(false); }}
        title="Purge Audit Logs"
        size="sm"
      >
        {purgeSuccess ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: Colors.success, marginBottom: 8 }}>Logs purged successfully</div>
            <div style={{ fontSize: 13, color: Colors.textMuted }}>Old audit logs have been removed</div>
          </div>
        ) : (
          <div>
            <div style={{
              padding: 16,
              background: 'rgba(220, 38, 38, 0.06)',
              border: `1px solid rgba(220, 38, 38, 0.15)`,
              borderRadius: 10,
              marginBottom: 20,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>⚠️</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: Colors.danger }}>Warning: Irreversible action</span>
              </div>
              <div style={{ fontSize: 12, color: Colors.textMuted, lineHeight: 1.5 }}>
                This will permanently delete all audit logs older than the selected period. This action cannot be undone.
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 8 }}>
                Delete logs older than:
              </label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                {[
                  { label: '7 days', value: 7 },
                  { label: '30 days', value: 30 },
                  { label: '90 days', value: 90 },
                  { label: '1 year', value: 365 },
                ].map(option => (
                  <button
                    key={option.value}
                    onClick={() => setPurgeDays(option.value)}
                    style={{
                      flex: 1,
                      padding: '10px 8px',
                      borderRadius: 8,
                      border: `1px solid ${purgeDays === option.value ? Colors.danger : Colors.border}`,
                      background: purgeDays === option.value ? 'rgba(220, 38, 38, 0.08)' : 'transparent',
                      color: purgeDays === option.value ? Colors.danger : Colors.textMuted,
                      fontSize: 12,
                      fontWeight: purgeDays === option.value ? 600 : 400,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: 11, color: Colors.textMuted }}>
                Logs before {new Date(Date.now() - purgeDays * 86400000).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })} will be deleted.
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
              <Button variant="secondary" onClick={() => setIsPurgeModalOpen(false)}>Cancel</Button>
              <Button
                variant="primary"
                onClick={handlePurge}
                disabled={isPurging}
                style={{
                  background: isPurging ? Colors.textMuted : Colors.danger,
                  opacity: isPurging ? 0.7 : 1,
                }}
              >
                {isPurging ? 'Purging...' : 'Confirm Purge'}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Audit;
