// Dashboard Service - AEVUM ERP
// Service pour récupérer les KPIs globaux depuis le backend
// Endpoints: GET /api/v1/dashboard, /revenue, /cashflow, /performance, /activity

import api from './api';

// Types de réponse backend
export interface DashboardResponse {
  totalEmployees: number;
  activeEmployees: number;
  pendingLeaveRequests: number;
  totalRevenue: number | string;
  totalPending: number | string;
  totalExpenses: number | string;
  unpaidInvoices: number;
  totalAssets: number;
  availableAssets: number;
  assignedAssets: number;
  totalStudents: number;
  activeEnrollments: number;
  totalPrograms: number;
  totalDepartments: number;
}

export interface RevenueDataPoint {
  month: string;
  revenus: number;
  depenses: number;
  benefice: number;
}

export interface CashFlowDataPoint {
  month: string;
  incomes: number;
  expenses: number;
  balance: number;
}

export interface RadarDataPoint {
  subject: string;
  A: number;
  B: number;
}

export interface ActivityItem {
  id: string;
  type: string;
  message: string;
  timestamp: string | Date;
  user?: string;
}

// Format currency helper
export const formatCurrency = (value: number | string): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return '0 FCA';
  if (num >= 1000000000) return `${(num / 1000000000).toFixed(2)} Md FCA`;
  if (num >= 1000000) return `${(num / 1000000).toFixed(2)} M FCA`;
  if (num >= 1000) return `${(num / 1000).toFixed(0)} K FCA`;
  return `${num.toFixed(0)} FCA`;
};

// Mapper les données backend vers le format KPI du frontend
export const mapToKPIs = (data: DashboardResponse) => {
  const revenue = Number(data.totalRevenue) || 0;
  const expenses = Number(data.totalExpenses) || 0;
  const pending = Number(data.totalPending) || 0;
  
  const netProfit = revenue - expenses;

  const presenceRate = data.totalEmployees > 0
    ? Math.round((data.activeEmployees / data.totalEmployees) * 100)
    : 0;

  const invoiceRate = revenue > 0
    ? Math.round(((revenue - pending) / revenue) * 100)
    : 0;

  return [
    {
      id: '1',
      label: "Chiffre d'Affaires",
      value: formatCurrency(data.totalRevenue),
      change: 18.4,
      icon: '◈',
      color: '#6490ff',
    },
    {
      id: '2',
      label: 'Effectif Total',
      value: data.totalEmployees.toString(),
      change: 6.2,
      icon: '◉',
      color: '#3ecf8e',
    },
    {
      id: '3',
      label: 'Taux de Présence',
      value: `${presenceRate}%`,
      change: 1.8,
      icon: '◎',
      color: '#2dd4bf',
    },
    {
      id: '4',
      label: 'Taux Recouvrement',
      value: `${invoiceRate}%`,
      change: -12.5,
      icon: '◆',
      color: '#fb923c',
    },
    {
      id: '5',
      label: 'Apprenants Actifs',
      value: data.activeEnrollments.toLocaleString('fr-FR'),
      change: 23.1,
      icon: '▦',
      color: '#a78bfa',
    },
    {
      id: '6',
      label: 'Bénéfice Net',
      value: formatCurrency(netProfit),
      change: 21.3,
      icon: '◇',
      color: '#c9a84c',
    },
  ];
};

const dashboardService = {
  /**
   * Récupérer le dashboard complet
   * GET /api/v1/dashboard
   */
  async getDashboard(): Promise<{
    kpis: ReturnType<typeof mapToKPIs>;
    raw: DashboardResponse;
  }> {
    const response = await api.get<DashboardResponse>('/v1/dashboard');
    const data = response.data as unknown as DashboardResponse;
    return {
      kpis: mapToKPIs(data),
      raw: data,
    };
  },

  /**
   * Récupérer les KPIs uniquement
   */
  async getKPIs() {
    const response = await api.get<DashboardResponse>('/v1/dashboard');
    const data = response.data as unknown as DashboardResponse;
    return mapToKPIs(data);
  },

  /**
   * Récupérer les données de revenu mensuel
   * GET /api/v1/dashboard/revenue
   */
  async getRevenueData(): Promise<RevenueDataPoint[]> {
    const response = await api.get<RevenueDataPoint[]>('/v1/dashboard/revenue');
    return response.data || [];
  },

  /**
   * Récupérer les données de trésorerie
   * GET /api/v1/dashboard/cashflow
   */
  async getCashFlow(): Promise<CashFlowDataPoint[]> {
    const response = await api.get<CashFlowDataPoint[]>('/v1/dashboard/cashflow');
    return response.data || [];
  },

  /**
   * Récupérer les données de performance (Radar)
   * GET /api/v1/dashboard/performance
   */
  async getPerformanceRadar(): Promise<RadarDataPoint[]> {
    const response = await api.get<RadarDataPoint[]>('/v1/dashboard/performance');
    return response.data || [];
  },

  /**
   * Récupérer les activités récentes
   * GET /api/v1/dashboard/activity
   */
  async getRecentActivity(): Promise<ActivityItem[]> {
    const response = await api.get<ActivityItem[]>('/v1/dashboard/activity');
    return response.data || [];
  },

  /**
   * Récupérer les employés récents
   */
  async getRecentEmployees() {
    const response = await api.get('/v1/employees', { params: { page: 0, size: 5 } });
    return response.data?.content || [];
  },

  /**
   * Récupérer les factures récentes
   */
  async getRecentInvoices() {
    const response = await api.get('/v1/invoices', { params: { page: 0, size: 5 } });
    return response.data?.content || [];
  },

  /**
   * Récupérer les départements
   */
  async getDepartments() {
    const response = await api.get('/v1/departments');
    return response.data?.content || [];
  },
};

export default dashboardService;
