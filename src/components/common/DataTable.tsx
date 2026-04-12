// DataTable Component - AEVUM Enterprise ERP
// Professional Data Table with Sorting, Pagination, and Row Selection

import React, { useState, useMemo } from 'react';
import { Spacing, FontSizes, FontWeights, BorderRadius, Transitions } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { ChevronUp, ChevronDown, ChevronsUpDown, Check } from 'lucide-react';
import { Checkbox } from './Checkbox';
import { PaginationControls } from './PaginationControls';

export interface Column<T> {
  key: string;
  title: string;
  sortable?: boolean;
  render?: (item: T, index: number) => React.ReactNode;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  selectable?: boolean;
  selectedRows?: T[];
  onSelectionChange?: (selectedRows: T[]) => void;
  pageSize?: number;
  showPagination?: boolean;
  emptyMessage?: string;
  loading?: boolean;
  className?: string;
  style?: React.CSSProperties;
  getRowId?: (item: T) => string | number;
}

export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  pageSize = 10,
  showPagination = true,
  emptyMessage = 'Aucune donnée disponible',
  loading = false,
  className = '',
  style,
  getRowId,
}: DataTableProps<T>) {
  const { colors } = useTheme();
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Handle sorting
  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }, [data, sortConfig]);

  // Handle pagination
  const paginatedData = useMemo(() => {
    if (!showPagination) return sortedData;
    const startIndex = (currentPage - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, currentPage, pageSize, showPagination]);

  const totalPages = Math.ceil(data.length / pageSize);

  // Handle sort
  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return prev.direction === 'asc' ? { key, direction: 'desc' } : null;
      }
      return { key, direction: 'asc' };
    });
  };

  // Handle row selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange?.([...data]);
    } else {
      onSelectionChange?.([]);
    }
  };

  const handleSelectRow = (item: T) => {
    const isSelected = selectedRows.some(row => 
      getRowId ? getRowId(row) === getRowId(item) : row === item
    );

    if (isSelected) {
      onSelectionChange?.(selectedRows.filter(row => 
        getRowId ? getRowId(row) !== getRowId(item) : row !== item
      ));
    } else {
      onSelectionChange?.([...selectedRows, item]);
    }
  };

  const isAllSelected = data.length > 0 && selectedRows.length === data.length;
  const isSomeSelected = selectedRows.length > 0 && selectedRows.length < data.length;

  // Get sort icon
  const getSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;
    if (sortConfig?.key === column.key) {
      return sortConfig.direction === 'asc' 
        ? <ChevronUp size={14} /> 
        : <ChevronDown size={14} />;
    }
    return <ChevronsUpDown size={14} />;
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    background: colors.card,
    borderRadius: BorderRadius.xl,
    border: `1px solid ${colors.border}`,
    overflow: 'hidden',
    ...style,
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const headerStyle: React.CSSProperties = {
    background: colors.bgSecondary,
    borderBottom: `1px solid ${colors.border}`,
  };

  const headerCellStyle: React.CSSProperties = {
    padding: `${Spacing.md}px ${Spacing.lg}px`,
    textAlign: 'left',
    fontSize: FontSizes.sm,
    fontWeight: FontWeights.semibold,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    whiteSpace: 'nowrap',
  };

  const sortableHeaderStyle: React.CSSProperties = {
    ...headerCellStyle,
    cursor: 'pointer',
    userSelect: 'none',
    transition: Transitions.fast,
  };

  const cellStyle: React.CSSProperties = {
    padding: `${Spacing.md}px ${Spacing.lg}px`,
    fontSize: FontSizes.base,
    color: colors.textPrimary,
    borderBottom: `1px solid ${colors.borderLight}`,
    whiteSpace: 'nowrap',
  };

  const rowStyle: React.CSSProperties = {
    transition: Transitions.fast,
    cursor: onRowClick ? 'pointer' : 'default',
  };

  const getAlignment = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center': return 'center';
      case 'right': return 'right';
      default: return 'left';
    }
  };

  if (loading) {
    return (
      <div style={{
        ...containerStyle,
        padding: Spacing.xxxl * 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <div style={{
          width: 32,
          height: 32,
          border: `3px solid ${colors.border}`,
          borderTopColor: colors.primary,
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }} />
      </div>
    );
  }

  return (
    <div style={containerStyle} className={className}>
      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead style={headerStyle}>
            <tr>
              {selectable && (
                <th style={{ ...headerCellStyle, width: 50 }}>
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isSomeSelected}
                    onChange={handleSelectAll}
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={{
                    ...(column.sortable ? sortableHeaderStyle : headerCellStyle),
                    width: column.width,
                    textAlign: getAlignment(column.align),
                  }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: Spacing.xs,
                    justifyContent: getAlignment(column.align),
                  }}>
                    {column.title}
                    {column.sortable && (
                      <span style={{ color: colors.textMuted }}>
                        {getSortIcon(column)}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (selectable ? 1 : 0)}
                  style={{
                    ...cellStyle,
                    textAlign: 'center',
                    padding: Spacing.xxxl * 2,
                    color: colors.textMuted,
                  }}
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => {
                const rowId = getRowId ? getRowId(item) : index;
                const isSelected = selectedRows.some(row => 
                  getRowId ? getRowId(row) === rowId : row === item
                );

                return (
                  <tr
                    key={rowId}
                    style={{
                      ...rowStyle,
                      background: isSelected ? colors.primaryMutedBg : 'transparent',
                    }}
                    onClick={() => onRowClick?.(item)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = isSelected 
                        ? colors.primaryMutedBg 
                        : colors.bgSecondary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = isSelected 
                        ? colors.primaryMutedBg 
                        : 'transparent';
                    }}
                  >
                    {selectable && (
                      <td style={cellStyle}>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleSelectRow(item)}
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={column.key}
                        style={{
                          ...cellStyle,
                          textAlign: getAlignment(column.align),
                        }}
                      >
                        {column.render 
                          ? column.render(item, index)
                          : item[column.key]
                        }
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {showPagination && totalPages > 1 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: `${Spacing.lg}px ${Spacing.xxl}px`,
          borderTop: `1px solid ${colors.border}`,
          background: colors.bgSecondary,
        }}>
          <div style={{
            fontSize: FontSizes.sm,
            color: colors.textSecondary,
          }}>
            {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, data.length)} sur {data.length}
          </div>
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={data.length}
            showingFrom={((currentPage - 1) * pageSize) + 1}
            showingTo={Math.min(currentPage * pageSize, data.length)}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default DataTable;
