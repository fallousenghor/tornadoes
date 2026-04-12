// Stock & Equipment Management - AEVUM Enterprise ERP
// Refactored with DRY & SOLID principles - Backend API Integration

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, Button, ProgressBar, FilterBar, PaginationControls } from '../../components/common';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Colors } from '../../constants/theme';
import { ProductForm, ProductDetails } from './components';
import type { ProductFormData } from './components/ProductForm';
import { useFilterable } from '../../hooks/useFilterable';
import stockService, { StockSummary, StockCategoryData } from '../../services/stockService';
import type { StockItem, StockCategory } from '../../types';

// Stock category colors
const categoryColors: Record<string, string> = {
  informatique: '#6490ff',
  mobilite: '#3ecf8e',
  mobilier: '#a78bfa',
  equipements: '#fb923c',
};

// Category options for filter
const categoryOptions = [
  { value: 'all', label: 'Toutes les catégories' },
  { value: 'informatique', label: 'Informatique' },
  { value: 'mobilier', label: 'Mobilier' },
  { value: 'equipements', label: 'Équipements' },
  { value: 'mobilite', label: 'Mobilité' },
];

// Tabs configuration
const tabs = [
  { id: 'inventory', label: 'Inventaire', icon: '📦' },
  { id: 'assignments', label: 'Affectations', icon: '👤' },
  { id: 'movements', label: 'Mouvements', icon: '🔄' },
  { id: 'maintenance', label: 'Maintenance', icon: '🔧' },
];

// Helper function for status
const getStockStatus = (available: number, minQuantity: number): { label: string; color: string; bg: string } => {
  if (available === 0) return { label: 'Rupture', color: '#e05050', bg: 'rgba(224, 80, 80, 0.15)' };
  if (available <= minQuantity) return { label: 'Critique', color: '#fb923c', bg: 'rgba(251, 146, 60, 0.15)' };
  if (available <= minQuantity * 2) return { label: 'Attention', color: '#c9a84c', bg: 'rgba(201, 168, 76, 0.15)' };
  return { label: 'OK', color: '#3ecf8e', bg: 'rgba(62, 207, 142, 0.15)' };
};

export const Stock: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<'inventory' | 'assignments' | 'movements' | 'maintenance'>('inventory');
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [stockSummary, setStockSummary] = useState<StockSummary>({ totalItems: 0, available: 0, assigned: 0, maintenance: 0 });
  const [stockCategoriesData, setStockCategoriesData] = useState<StockCategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [items, summary, categories] = await Promise.all([
        stockService.getAssets({ pageSize: 100 }),
        stockService.getStockSummary(),
        stockService.getStockByCategory(),
      ]);

      setStockItems(items.data);
      setStockSummary(summary);
      setStockCategoriesData(categories);
    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError('Erreur lors du chargement des données de stock');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Use the filterable hook
  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
    totalItems,
    showingFrom,
    showingTo,
  } = useFilterable({
    data: stockItems,
    itemsPerPage: 10,
    searchFields: ['name'],
  });

  // Filter by category from filters
  const filteredByCategory = useMemo(() => {
    const category = filters.category || 'all';
    if (category === 'all') return paginatedData;
    return paginatedData.filter((item: StockItem) => item.category === category);
  }, [paginatedData, filters.category]);

  // Handle form submission
  const handleProductSubmit = async (data: ProductFormData) => {
    try {
      await stockService.createAsset({
        name: data.name,
        description: data.description,
        category: data.category as StockCategory,
        serialNumber: data.serialNumber,
        brand: data.brand,
        model: data.model,
        location: data.location,
        purchasePrice: data.purchasePrice,
      });
      fetchData();
    } catch (err) {
      console.error('Error creating product:', err);
      alert('Erreur lors de la création du produit');
    }
  };

  // Handlers
  const handleNewProduct = () => {
    setSelectedItem(null);
    setIsFormOpen(true);
  };

  const handleViewDetails = (item: StockItem) => {
    setSelectedItem(item);
    setIsDetailsOpen(true);
  };

  // Summary cards data
  const summaryCards = [
    { title: 'Total Articles', value: stockSummary.totalItems, icon: '📦', variant: 'info' as const },
    { title: 'Disponibles', value: stockSummary.available, icon: '✓', variant: 'success' as const },
    { title: 'Affectés', value: stockSummary.assigned, icon: '👤', variant: 'default' as const },
    { title: 'En Maintenance', value: stockSummary.maintenance, icon: '🔧', variant: 'warning' as const },
  ];

  // Loading state
  if (loading && stockItems.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: Colors.textMuted }}>
        Chargement des données de stock...
      </div>
    );
  }

  // Error state
  if (error && stockItems.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <div style={{ color: Colors.danger }}>{error}</div>
        <Button variant="primary" onClick={fetchData} style={{ marginTop: 16 }}>
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: Colors.text, marginBottom: 4 }}>
            Stock & Matériel
          </h1>
          <p style={{ fontSize: 13, color: Colors.textMuted }}>
            Inventaire · Affectations · Mouvements · Maintenance
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="secondary" onClick={() => setIsFormOpen(true)}>
            ↺ Transfert
          </Button>
          <Button variant="primary" onClick={handleNewProduct}>
            + Nouvel article
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {summaryCards.map((card, idx) => (
          <Card key={idx} style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: card.variant === 'success' ? 'rgba(62, 207, 142, 0.15)' :
                           card.variant === 'warning' ? 'rgba(251, 146, 60, 0.15)' :
                           'rgba(100, 140, 255, 0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20,
                color: card.variant === 'success' ? '#3ecf8e' :
                       card.variant === 'warning' ? '#fb923c' : '#6490ff',
              }}>
                {card.icon}
              </div>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {card.title}
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                  {card.value}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Category Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: 24, marginBottom: 24 }}>
        <Card style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: Colors.text, marginBottom: 16 }}>
            Répartition par catégorie
          </h3>
          {stockCategoriesData.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {stockCategoriesData.map((cat, idx) => {
                const total = stockCategoriesData.reduce((acc, c) => acc + c.value, 0);
                const percentage = total > 0 ? Math.round((cat.value / total) * 100) : 0;
                return (
                  <div key={idx}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: Colors.textMuted, textTransform: 'capitalize' }}>
                        {cat.name}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: Colors.text }}>
                        {cat.value} ({percentage}%)
                      </span>
                    </div>
                    <ProgressBar 
                      value={percentage} 
                      color={categoryColors[cat.name] || Colors.accent}
                      height={6}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ color: Colors.textMuted, fontSize: 12 }}>
              Aucune donnée disponible
            </div>
          )}
        </Card>

        {/* Tabs and Filters */}
        <div>
          <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'rgba(100, 140, 255, 0.05)', padding: 4, borderRadius: 10, width: 'fit-content' }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '10px 18px',
                  borderRadius: 8,
                  border: 'none',
                  background: activeTab === tab.id ? 'rgba(100, 140, 255, 0.15)' : 'transparent',
                  color: activeTab === tab.id ? Colors.accent : Colors.textMuted,
                  fontSize: 12,
                  fontWeight: activeTab === tab.id ? 600 : 400,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontFamily: "'DM Sans', sans-serif",
                  transition: 'all 0.2s',
                }}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filters */}
          {activeTab === 'inventory' && (
            <Card style={{ marginBottom: 16, padding: 16 }}>
              <FilterBar
                filters={[
                  { key: 'category', type: 'select', options: categoryOptions, placeholder: 'Catégorie' },
                ]}
                values={filters}
                onChange={setFilter}
                onSearch={setSearchQuery}
                searchValue={searchQuery}
                searchPlaceholder="Rechercher par nom ou référence..."
              />
            </Card>
          )}
        </div>
      </div>

      {/* Inventory Table */}
      {activeTab === 'inventory' && (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(100, 140, 255, 0.05)' }}>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Article</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Catégorie</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Qté Total</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Disponibles</th>
                  <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Affectés</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {filteredByCategory.map((item: StockItem, index: number) => {
                  const status = getStockStatus(item.available, item.minQuantity);
                  return (
                    <tr 
                      key={item.id} 
                      style={{ 
                        borderBottom: '1px solid ' + Colors.border,
                        background: index % 2 === 0 ? 'transparent' : 'rgba(100, 140, 255, 0.02)',
                        cursor: 'pointer',
                      }}
                      onClick={() => handleViewDetails(item)}
                    >
                      <td style={{ padding: '14px 16px', fontSize: 13, color: Colors.text, fontWeight: 500 }}>
                        {item.name}
                      </td>
                      <td style={{ padding: '14px 16px' }}>
                        <span style={{ 
                          padding: '4px 10px', 
                          borderRadius: 6, 
                          fontSize: 11, 
                          fontWeight: 500,
                          background: categoryColors[item.category] + '20', 
                          color: categoryColors[item.category],
                          textTransform: 'capitalize',
                        }}>
                          {item.category}
                        </span>
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 14, fontWeight: 600, fontFamily: "'DM Serif Display', serif", color: Colors.text }}>
                        {item.quantity}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 14, fontWeight: 600, fontFamily: "'DM Serif Display', serif", color: '#3ecf8e' }}>
                        {item.available}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'right', fontSize: 14, fontWeight: 600, fontFamily: "'DM Serif Display', serif", color: '#a78bfa' }}>
                        {item.assigned}
                      </td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                        <StatusBadge status={status.label} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            showingFrom={showingFrom}
            showingTo={showingTo}
            onPageChange={setCurrentPage}
          />
        </Card>
      )}

      {/* Other tabs placeholder */}
      {activeTab !== 'inventory' && (
        <Card style={{ padding: 20, textAlign: 'center', color: Colors.textMuted }}>
          <p>Les {activeTab === 'assignments' ? 'affectations' : activeTab === 'movements' ? 'mouvements' : 'alertes de maintenance'} seront affichés ici.</p>
          <p style={{ fontSize: 11, marginTop: 8 }}>Fonctionnalité en cours de développement</p>
        </Card>
      )}

      {/* Product Form Modal */}
      <ProductForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setSelectedItem(null); }}
        onSubmit={handleProductSubmit}
        product={selectedItem}
      />

      {/* Product Details Modal */}
      <ProductDetails
        isOpen={isDetailsOpen}
        onClose={() => { setIsDetailsOpen(false); setSelectedItem(null); }}
        product={selectedItem}
      />
    </div>
  );
};

export default Stock;
