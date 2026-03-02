// Employees Table Component - Gestion des Employés
import React, { useState, useEffect } from 'react';
import { Button, Badge, SectionTitle } from '../../../components/common';
import { Colors } from '../../../constants/theme';
import employeeService from '../../../services/employeeService';
import type { Employee } from '@/types';

export const EmployeesTable: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await employeeService.getEmployees();
        setEmployees(response.data.slice(0, 5)); // Limit to 5 for dashboard
      } catch (error) {
        console.error('Error fetching employees:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  return (
    <div style={{
      background: Colors.card,
      border: `1px solid ${Colors.border}`,
      borderRadius: 16,
      padding: 24,
      marginBottom: 16,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <SectionTitle icon="◉" title="Gestion des Employés" sub="Fiches · Contrats · Salaires" />
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="primary" size="sm">+ Nouvel employé</Button>
          <Button variant="secondary" size="sm">Export Excel ↓</Button>
        </div>
      </div>
      {loading ? (
        <div style={{ padding: 20, textAlign: 'center', color: Colors.textMuted }}>
          Chargement...
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${Colors.border}` }}>
                {["Employé","Poste","Département","Contrat","Salaire (FCFA)","Note","Statut","Actions"].map(h => (
                  <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontSize: 9,
                    fontWeight: 700, color: Colors.textDim, fontFamily: "'DM Sans',sans-serif",
                    letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {employees.map((e, i) => (
                <tr key={e.id || i} style={{ borderBottom: '1px solid rgba(100,140,255,0.04)' }}>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                        background: 'rgba(100,140,255,0.15)', border: '1px solid rgba(100,140,255,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 9, fontWeight: 700, color: Colors.accent, fontFamily: "'DM Sans',sans-serif" }}>
                        {e.firstName[0]}{e.lastName[0]}
                      </div>
                      <span style={{ fontSize: 11, color: Colors.text, fontFamily: "'DM Sans',sans-serif", fontWeight: 500 }}>
                        {e.firstName} {e.lastName}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px', fontSize: 10, color: Colors.textMuted, fontFamily: "'DM Sans',sans-serif" }}>{e.poste}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <Badge color={Colors.accent}>{e.departmentId}</Badge>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <Badge type="contract">{e.contractType}</Badge>
                  </td>
                  <td style={{ padding: '10px 12px', fontSize: 10, color: Colors.text, fontFamily: "'DM Serif Display',Georgia,serif" }}>{e.salary.toLocaleString()}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ fontSize: 9, color: Colors.gold }}>★</span>
                      <span style={{ fontSize: 10, color: Colors.text, fontFamily: "'DM Sans',sans-serif" }}>4.8</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <Badge type="status">{e.status}</Badge>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {['Fiche','Paie'].map(a => (
                        <button key={a} style={{ padding: '3px 8px', borderRadius: 5,
                          border: `1px solid ${Colors.border}`, background: 'transparent',
                          color: Colors.textMuted, fontSize: 8, cursor: 'pointer',
                          fontFamily: "'DM Sans',sans-serif" }}>{a}</button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EmployeesTable;

