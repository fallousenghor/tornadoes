// Department Budget Chart Component - Budget par Département
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useTheme } from '../../../contexts/ThemeContext';
import dashboardService from '../../../services/dashboardService';

interface DepartmentData {
  name: string;
  budget: number;
  spent: number;
  utilization: number;
}

const COLORS = ['#6490ff', '#3ecf8e', '#a78bfa', '#fb923c', '#2dd4bf', '#e05050', '#c9a84c'];

const DepartmentBudgetChart: React.FC = () => {
  const { colors, isDark } = useTheme();
  const [departments, setDepartments] = useState<DepartmentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const data = await dashboardService.getDepartments();
        const mappedData = data
          .filter((d: any) => d.budget && d.budget > 0)
          .map((d: any) => ({
            name: d.name || d.code,
            budget: d.budget || 0,
            spent: d.spent || 0,
            utilization: d.budget > 0 ? Math.round(((d.spent || 0) / d.budget) * 100) : 0,
          }))
          .slice(0, 5); // Top 5 departments
        setDepartments(mappedData);
      } catch (error) {
        console.error('Error fetching departments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const totalBudget = departments.reduce((sum, d) => sum + d.budget, 0);
  const totalSpent = departments.reduce((sum, d) => sum + d.spent, 0);
  const avgUtilization = departments.length > 0
    ? Math.round(departments.reduce((sum, d) => sum + d.utilization, 0) / departments.length)
    : 0;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          background: isDark ? '#1e293b' : 'white',
          border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
          borderRadius: 8,
          padding: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: isDark ? '#f1f5f9' : '#1e293b', marginBottom: 8 }}>
            {data.name}
          </div>
          <div style={{ fontSize: 11, color: isDark ? '#94a3b8' : '#64748b' }}>
            <div style={{ marginBottom: 4 }}>Budget: {data.budget.toLocaleString('fr-FR')} FCA</div>
            <div style={{ marginBottom: 4 }}>Dépensé: {data.spent.toLocaleString('fr-FR')} FCA</div>
            <div style={{ color: data.utilization > 90 ? '#e05050' : data.utilization > 70 ? '#fb923c' : '#3ecf8e' }}>
              Utilisation: {data.utilization}%
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div style={{
        background: isDark ? '#1e293b' : 'white',
        borderRadius: 16,
        padding: 24,
        border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
      }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#f1f5f9' : '#1e293b', marginBottom: 16 }}>
          📊 Budget par Département
        </h3>
        <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: isDark ? '#64748b' : '#94a3b8' }}>
          Chargement...
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: isDark ? '#1e293b' : 'white',
      borderRadius: 16,
      padding: 24,
      border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
      boxShadow: isDark
        ? '0 4px 20px rgba(0,0,0,0.3)'
        : '0 4px 20px rgba(0,0,0,0.08)',
    }}>
      <div style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#f1f5f9' : '#1e293b', marginBottom: 4 }}>
          📊 Budget par Département
        </h3>
        <p style={{ fontSize: 11, color: isDark ? '#64748b' : '#94a3b8' }}>
          Répartition et utilisation des budgets
        </p>
      </div>

      {departments.length === 0 ? (
        <div style={{
          height: 180,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: isDark ? '#64748b' : '#94a3b8',
        }}>
          <div style={{ fontSize: 32, marginBottom: 8 }}>📊</div>
          <div style={{ fontSize: 12, textAlign: 'center' }}>Aucun budget départemental</div>
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={departments}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="budget"
                nameKey="name"
              >
                {departments.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend & Stats */}
          <div style={{ marginTop: 16 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              {departments.map((dept, index) => (
                <div key={dept.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      background: COLORS[index % COLORS.length],
                    }}
                  />
                  <span style={{ fontSize: 10, color: isDark ? '#94a3b8' : '#64748b' }}>
                    {dept.name}
                  </span>
                </div>
              ))}
            </div>

            {/* Summary Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 8,
              paddingTop: 12,
              borderTop: `1px solid ${isDark ? '#334155' : '#f1f5f9'}`,
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: isDark ? '#f1f5f9' : '#1e293b' }}>
                  {(totalBudget / 1000000).toFixed(1)}M
                </div>
                <div style={{ fontSize: 9, color: isDark ? '#64748b' : '#94a3b8', textTransform: 'uppercase' }}>
                  Budget Total
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: isDark ? '#f1f5f9' : '#1e293b' }}>
                  {(totalSpent / 1000000).toFixed(1)}M
                </div>
                <div style={{ fontSize: 9, color: isDark ? '#64748b' : '#94a3b8', textTransform: 'uppercase' }}>
                  Total Dépensé
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: avgUtilization > 90 ? '#e05050' : avgUtilization > 70 ? '#fb923c' : '#3ecf8e',
                }}>
                  {avgUtilization}%
                </div>
                <div style={{ fontSize: 9, color: isDark ? '#64748b' : '#94a3b8', textTransform: 'uppercase' }}>
                  Utilisation Moy.
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DepartmentBudgetChart;
