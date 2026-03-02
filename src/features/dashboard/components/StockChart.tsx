// Stock Chart Component - Stock & Matériel
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button, ProgressBar, SectionTitle } from '../../../components/common';
import { Colors } from '../../../constants/theme';
import stockService from '../../../services/stockService';
import type { StockItem } from '@/types';

interface StockByCategory {
  category: string;
  available: number;
  assigned: number;
}

const tooltipStyle = {
  contentStyle: {
    background: Colors.card,
    border: '1px solid rgba(100,140,255,0.2)',
    borderRadius: 8,
    fontSize: 11,
    fontFamily: "'DM Sans', sans-serif",
  },
  labelStyle: { color: Colors.accent },
  itemStyle: { color: Colors.textLight },
};

export const StockChart: React.FC = () => {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const { data } = await stockService.getAssets({ pageSize: 20 });
        setStockItems(data);
      } catch (error) {
        console.error('Error fetching stock:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStock();
  }, []);

  // Aggregate by category
  const stockByCategory: StockByCategory[] = stockItems.reduce((acc: StockByCategory[], item) => {
    const existing = acc.find(a => a.category === item.category);
    if (existing) {
      existing.available += item.available || 0;
      existing.assigned += item.assigned || 0;
    } else {
      acc.push({
        category: item.category || 'autre',
        available: item.available || 0,
        assigned: item.assigned || 0,
      });
    }
    return acc;
  }, []);

  const totalItems = stockItems.length;
  const totalAvailable = stockItems.reduce((sum, item) => sum + (item.available || 0), 0);
  const totalAssigned = stockItems.reduce((sum, item) => sum + (item.assigned || 0), 0);

  return (
    <div style={{
      background: Colors.card,
      border: `1px solid ${Colors.border}`,
      borderRadius: 16,
      padding: 24,
    }}>
      <SectionTitle icon="◈" title="Stock & Matériel" sub="Inventaire · Attribution · Alertes" />
      {loading ? (
        <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: Colors.textMuted }}>
          Chargement...
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={stockByCategory} layout="vertical" barSize={10}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,140,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fill: '#3a4560', fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="category" type="category" tick={{ fill: '#5a6480', fontSize: 9, fontFamily: "'DM Sans',sans-serif" }} axisLine={false} tickLine={false} width={80} />
              <Tooltip {...tooltipStyle} />
              <Bar dataKey="available" fill="#3ecf8e" radius={[0,3,3,0]} name="Disponible" />
              <Bar dataKey="assigned" fill="#6490ff" radius={[0,3,3,0]} name="Assigné" />
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginTop: 10 }}>
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 7, padding: '8px 10px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 16, color: Colors.text }}>{totalItems}</div>
              <div style={{ fontSize: 8, color: Colors.textDim, fontFamily: "'DM Sans',sans-serif", marginTop: 2 }}>Total articles</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 7, padding: '8px 10px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 16, color: Colors.green }}>{totalAvailable}</div>
              <div style={{ fontSize: 8, color: Colors.textDim, fontFamily: "'DM Sans',sans-serif", marginTop: 2 }}>Disponible</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 7, padding: '8px 10px', textAlign: 'center' }}>
              <div style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 16, color: Colors.accent }}>{totalAssigned}</div>
              <div style={{ fontSize: 8, color: Colors.textDim, fontFamily: "'DM Sans',sans-serif", marginTop: 2 }}>Assigné</div>
            </div>
          </div>
          <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(251,146,60,0.06)',
            borderRadius: 8, border: '1px solid rgba(251,146,60,0.15)',
            display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>⚠️</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: Colors.orange, fontFamily: "'DM Sans',sans-serif", fontWeight: 600 }}>Alertes Maintenance</div>
              <div style={{ fontSize: 9, color: Colors.textMuted, fontFamily: "'DM Sans',sans-serif" }}>5 équipements en maintenance prévue · 2 items en rupture</div>
            </div>
            <Button variant="ghost" size="sm">Gérer</Button>
          </div>
        </>
      )}
    </div>
  );
};

export default StockChart;

