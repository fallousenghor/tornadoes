// Teacher Salaries Page - Education Module
// Gestion des salaires des professeurs

import React, { useState, useEffect, useMemo } from 'react';
import { Colors, BorderRadius } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import teacherSalaryService, { TeacherSalaryResponse } from '../../services/teacherSalaryService';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount);
};

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  PENDING: { bg: '#fef3c7', text: '#d97706', label: 'En attente' },
  APPROVED: { bg: '#dbeafe', text: '#2563eb', label: 'Approuvé' },
  PAID: { bg: '#dcfce7', text: '#16a34a', label: 'Payé' },
  CANCELLED: { bg: '#f3f4f6', text: '#6b7280', label: 'Annulé' },
};

const salaryTypeLabels: Record<string, string> = {
  MONTHLY: 'Mensuel',
  HOURLY: 'Horaire',
  PER_COURSE: 'Par cours',
  BONUS: 'Bonus',
};

const TeacherSalaries: React.FC = () => {
  const { colors } = useTheme();
  const [salaries, setSalaries] = useState<TeacherSalaryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);
  const pageSize = 20;

  useEffect(() => { loadSalaries(); }, [page, statusFilter]);

  const loadSalaries = async () => {
    try {
      setLoading(true);
      const result = await teacherSalaryService.getSalaries({ page, size: pageSize });
      setSalaries(result.data);
      setTotal(result.total);
    } catch (error) {
      console.error('Error loading salaries:', error);
    } finally { setLoading(false); }
  };

  const handleApprove = async (id: string) => {
    try {
      await teacherSalaryService.approve(id);
      await loadSalaries();
    } catch (error) {
      console.error('Error approving salary:', error);
    }
  };

  const handleMarkPaid = async (id: string) => {
    try {
      await teacherSalaryService.markAsPaid(id);
      await loadSalaries();
    } catch (error) {
      console.error('Error marking as paid:', error);
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await teacherSalaryService.cancel(id);
      await loadSalaries();
    } catch (error) {
      console.error('Error cancelling salary:', error);
    }
  };

  const filteredSalaries = useMemo(() => {
    return salaries.filter(s => {
      const matchesSearch = s.teacherName?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [salaries, searchQuery, statusFilter]);

  const totalPaid = salaries.filter(s => s.status === 'PAID').reduce((sum, s) => sum + s.grossAmount, 0);
  const totalPending = salaries.filter(s => s.status === 'PENDING').length;
  const totalApproved = salaries.filter(s => s.status === 'APPROVED').length;

  const cardStyle: React.CSSProperties = { background: colors.card || colors.bg, borderRadius: BorderRadius.md, border: `1px solid ${colors.border}`, padding: 20 };
  const badgeStyle = (status: string): React.CSSProperties => ({
    display: 'inline-block', padding: '4px 10px', borderRadius: 12, fontSize: 11, fontWeight: 600,
    background: statusConfig[status]?.bg || '#f3f4f6', color: statusConfig[status]?.text || '#6b7280',
  });

  return (
    <div style={{ padding: 24, background: colors.bg, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: colors.text, margin: 0 }}>💵 Salaires Professeurs</h1>
          <p style={{ fontSize: 14, color: colors.textMuted, margin: '4px 0 0' }}>Gestion des paiements des enseignants</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Total payé', value: formatCurrency(totalPaid), color: '#16a34a' },
          { label: 'En attente', value: totalPending.toString(), color: '#d97706' },
          { label: 'Approuvés', value: totalApproved.toString(), color: '#2563eb' },
          { label: 'Total', value: total.toString(), color: colors.primary },
        ].map((stat, i) => (
          <div key={i} style={{ ...cardStyle, textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: stat.color }}>{stat.value}</div>
            <p style={{ fontSize: 13, color: colors.textMuted, margin: '4px 0 0' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center' }}>
        <input type="text" placeholder="Rechercher un professeur..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          style={{ flex: 1, minWidth: 200, padding: '10px 14px', borderRadius: BorderRadius.md, border: `1px solid ${colors.border}`, background: colors.bg, color: colors.text }}
        />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: '6px 12px', borderRadius: 6, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text }}
        >
          <option value="all">Tous les statuts</option>
          {Object.entries(statusConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48 }}>⏳ Chargement...</div>
      ) : filteredSalaries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 48, color: colors.textMuted }}>📭 Aucun salaire trouvé</div>
      ) : (
        <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
                {['Référence', 'Professeur', 'Programme', 'Type', 'Montant brut', 'Période', 'Statut', 'Actions'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: colors.textMuted, background: colors.bg }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredSalaries.map(s => (
                <tr key={s.id} style={{ borderBottom: `1px solid ${colors.border}` }}>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontFamily: 'monospace' }}>{s.reference}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 600 }}>{s.teacherName}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13 }}>{s.programTitle || '—'}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13 }}>{salaryTypeLabels[s.salaryType]}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13, fontWeight: 700 }}>{formatCurrency(s.grossAmount)}</td>
                  <td style={{ padding: '12px 16px', fontSize: 13 }}>{s.periodStart} → {s.periodEnd}</td>
                  <td style={{ padding: '12px 16px' }}><span style={badgeStyle(s.status)}>{statusConfig[s.status]?.label}</span></td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {s.status === 'PENDING' && (
                        <button onClick={() => handleApprove(s.id)} style={{ padding: '4px 10px', borderRadius: 4, background: '#dbeafe', color: '#2563eb', border: 'none', fontSize: 12, cursor: 'pointer' }}>✓ Approuver</button>
                      )}
                      {s.status === 'APPROVED' && (
                        <button onClick={() => handleMarkPaid(s.id)} style={{ padding: '4px 10px', borderRadius: 4, background: '#dcfce7', color: '#16a34a', border: 'none', fontSize: 12, cursor: 'pointer' }}>✓ Marquer payé</button>
                      )}
                      {(s.status === 'PENDING' || s.status === 'APPROVED') && (
                        <button onClick={() => handleCancel(s.id)} style={{ padding: '4px 10px', borderRadius: 4, background: '#fee2e2', color: '#dc2626', border: 'none', fontSize: 12, cursor: 'pointer' }}>✕</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', borderTop: `1px solid ${colors.border}` }}>
            <span style={{ fontSize: 13, color: colors.textMuted }}>Page {page + 1} / {Math.ceil(total / pageSize)}</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <button disabled={page === 0} onClick={() => setPage(p => p - 1)} style={{ padding: '6px 12px', borderRadius: 4, border: `1px solid ${colors.border}`, background: colors.bg, cursor: 'pointer' }}>Précédent</button>
              <button disabled={page >= Math.ceil(total / pageSize) - 1} onClick={() => setPage(p => p + 1)} style={{ padding: '6px 12px', borderRadius: 4, border: `1px solid ${colors.border}`, background: colors.bg, cursor: 'pointer' }}>Suivant</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherSalaries;
