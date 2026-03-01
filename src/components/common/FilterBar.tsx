// FilterBar - AEVUM Enterprise ERP
// Reusable filter bar component - DRY Principle

import React from 'react';
import { Colors } from '../../constants/theme';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  type: 'search' | 'select' | 'multi-select';
  placeholder?: string;
  options?: FilterOption[];
  defaultValue?: string;
  className?: string;
}

export interface FilterBarProps {
  filters: FilterConfig[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
  onSearch?: (query: string) => void;
  searchValue?: string;
  searchPlaceholder?: string;
  className?: string;
  layout?: 'horizontal' | 'vertical';
  showSearch?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  values,
  onChange,
  onSearch,
  searchValue = '',
  searchPlaceholder = 'Rechercher...',
  className = '',
  layout = 'horizontal',
  showSearch = true,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch?.(e.target.value);
  };

  const containerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: layout === 'horizontal' 
      ? `repeat(auto-fit, minmax(200px, 1fr))`
      : '1fr',
    gap: 12,
    alignItems: 'end',
    width: '100%',
  };

  return (
    <div 
      className={className}
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'flex-end',
        flexWrap: 'wrap',
      }}
    >
      {/* Search Input */}
      {showSearch && onSearch && (
        <div style={{ flex: layout === 'horizontal' ? '2' : '1', minWidth: 200 }}>
          <input 
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: 8,
              border: `1px solid ${Colors.border}`,
              background: Colors.bg,
              color: Colors.text,
              fontSize: 13,
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
          />
        </div>
      )}

      {/* Filter Selects */}
      <div style={containerStyle}>
        {filters.map((filter) => {
          const value = values[filter.key] || filter.defaultValue || '';
          
          if (filter.type === 'search') {
            return (
              <div key={filter.key} style={{ minWidth: 180 }}>
                <label 
                  style={{ 
                    display: 'block', 
                    fontSize: 11, 
                    color: Colors.textMuted, 
                    marginBottom: 4,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {filter.placeholder || filter.key}
                </label>
                <input 
                  type="text"
                  placeholder={filter.placeholder || `Rechercher...`}
                  value={value}
                  onChange={(e) => onChange(filter.key, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 8,
                    border: `1px solid ${Colors.border}`,
                    background: Colors.bg,
                    color: Colors.text,
                    fontSize: 13,
                  }}
                />
              </div>
            );
          }

          return (
            <div key={filter.key} style={{ minWidth: 150 }}>
              <label 
                style={{ 
                  display: 'block', 
                  fontSize: 11, 
                  color: Colors.textMuted, 
                  marginBottom: 4,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {filter.placeholder || filter.key}
              </label>
              <select 
                value={value}
                onChange={(e) => onChange(filter.key, e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: `1px solid ${Colors.border}`,
                  background: Colors.bg,
                  color: Colors.text,
                  fontSize: 13,
                  cursor: 'pointer',
                  outline: 'none',
                }}
              >
                {filter.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Helper to create common filter options
export const createStatusOptions = (includeAll = true) => {
  const options = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'Actif', label: 'Actif' },
    { value: 'Inactif', label: 'Inactif' },
    { value: 'Congé', label: 'Congé' },
    { value: 'Suspendu', label: 'Suspendu' },
  ];
  return includeAll ? options : options.slice(1);
};

export const createCategoryOptions = (categories: string[], allLabel = 'Toutes les catégories') => {
  return [
    { value: 'all', label: allLabel },
    ...categories.map(cat => ({ value: cat, label: cat.charAt(0).toUpperCase() + cat.slice(1) }))
  ];
};

export default FilterBar;

