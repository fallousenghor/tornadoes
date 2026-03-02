// Budget by Department Component
import React, { useState, useEffect } from 'react';
import { SectionTitle, ProgressBar } from '../../../components/common';
import { Colors } from '../../../constants/theme';
import { formatCurrency } from '../../../utils';
import departmentService from '../../../services/departmentService';
import type { Department } from '@/types';

export const BudgetByDepartment: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const { data } = await departmentService.getDepartments({ active: true, pageSize: 10 });
        setDepartments(data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  // Calculate totals
  const totalBudget = departments.reduce((sum, d) => sum + d.budget, 0);
  const totalSpent = departments.reduce((sum, d) => sum + d.spent, 0);
  const utilizationRate = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;

  return (
    <div style={{
      background: Colors.card,
      border: `1px solid ${Colors.border}`,
      borderRadius: 16,
      padding: 24,
    }}>
      <SectionTitle icon="▦" title="Budget par Département" sub="Alloué vs Dépensé" />
      {loading ? (
        <div style={{ padding: 20, textAlign: 'center', color: Colors.textMuted }}>Chargement...</div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {departments.map((d, i) => (
              <div key={d.id || i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 10, color: Colors.textMuted, fontFamily: "'DM Sans',sans-serif", fontWeight: 500 }}>{d.name}</span>
                  <span style={{ fontSize: 9, color: Colors.textDim, fontFamily: "'DM Sans',sans-serif" }}>
                    {formatCurrency(d.spent)} / {formatCurrency(d.budget)}
                  </span>
                </div>
                <ProgressBar 
                  value={d.budget > 0 ? Math.round(d.spent/d.budget*100) : 0}
                  color={d.budget > 0 && d.spent/d.budget > 0.9 ? Colors.orange : d.budget > 0 && d.spent/d.budget > 0.8 ? Colors.accent : Colors.green} 
                />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: '10px', background: 'rgba(100,140,255,0.06)',
            borderRadius: 8, border: '1px solid rgba(100,140,255,0.1)' }}>
            <div style={{ fontSize: 9, color: Colors.textDim, fontFamily: "'DM Sans',sans-serif", marginBottom: 2 }}>Budget Total Alloué</div>
            <div style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 20, color: Colors.text }}>{formatCurrency(totalBudget)}</div>
            <div style={{ fontSize: 9, color: Colors.green, fontFamily: "'DM Sans',sans-serif" }}>▲ Utilisé à {utilizationRate}%</div>
          </div>
        </>
      )}
    </div>
  );
};

export default BudgetByDepartment;

