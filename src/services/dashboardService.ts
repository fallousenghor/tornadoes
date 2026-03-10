// Dashboard Service - Tornadoes Job
// Service pour récupérer les KPIs globaux depuis le backend

import api from './api';

// Types de réponse backend
export interface DashboardResponse {
  // HR
  totalEmployees: number;
  activeEmployees: number;
  pendingLeaveRequests: number;
  // Finance
  totalRevenue: string | number;
  totalPending: string | number;
  totalExpenses: string | number;
  unpaidInvoices: number;
  // Inventory
  totalAssets: number;
  availableAssets: number;
  assignedAssets: number;
  // Education
  totalStudents: number;
  activeEnrollments: number;
  totalPrograms: number;
  // Organization
  totalDepartments: number;
}

// Types pour les donnees de graphique
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
  A: number; // Réel
  B: number; // Objectif
}

// Mock data for fallback
const mockRevenueData: RevenueDataPoint[] = [
  { month: 'Jan', revenus: 45000, depenses: 32000, benefice: 13000 },
  { month: 'Fév', revenus: 52000, depenses: 35000, benefice: 17000 },
  { month: 'Mar', revenus: 48000, depenses: 31000, benefice: 17000 },
  { month: 'Avr', revenus: 61000, depenses: 42000, benefice: 19000 },
  { month: 'Mai', revenus: 55000, depenses: 38000, benefice: 17000 },
  { month: 'Juin', revenus: 67000, depenses: 45000, benefice: 22000 },
];

const mockCashFlowData: CashFlowDataPoint[] = [
  { month: 'Jan', incomes: 45000, expenses: 32000, balance: 13000 },
  { month: 'Fév', incomes: 52000, expenses: 35000, balance: 17000 },
  { month: 'Mar', incomes: 48000, expenses: 31000, balance: 17000 },
  { month: 'Avr', incomes: 61000, expenses: 42000, balance: 19000 },
  { month: 'Mai', incomes: 55000, expenses: 38000, balance: 17000 },
  { month: 'Juin', incomes: 67000, expenses: 45000, balance: 22000 },
];

const mockRadarDeptData: RadarDataPoint[] = [
  { subject: 'Productivité', A: 85, B: 90 },
  { subject: 'Qualité', A: 78, B: 85 },
  { subject: 'Efficacité', A: 92, B: 88 },
  { subject: 'Collaboration', A: 70, B: 75 },
  { subject: 'Innovation', A: 65, B: 80 },
];

const mockActivitiesData = [
  { id: '1', type: 'leave', message: 'Nouveau demande de congés de Jean Dupont', timestamp: new Date() },
  { id: '2', type: 'invoice', message: 'Facture #1234 créée', timestamp: new Date() },
  { id: '3', type: 'employee', message: 'Nouvel employé ajouté: Marie Martin', timestamp: new Date() },
];

// Mapper les données backend vers le format KPI du frontend
const mapToKPIs = (data: DashboardResponse) => {
  const formatCurrency = (value: string | number) => {
    if (typeof value === 'string') {
      const num = parseFloat(value);
      if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M FCA`;
      } else if (num >= 1000) {
        return `${(num / 1000).toFixed(0)}K FCA`;
      }
      return `${num} FCA`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M FCA`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K FCA`;
    }
    return `${value} FCA`;
  };

  return [
    {
      id: '1',
      label: "Chiffre d'Affaires",
      value: formatCurrency(data.totalRevenue),
      change: 18.4,
      icon: '◈',
      color: '#6490ff',
      sparklineData: [42, 38, 51, 47, 62, 59, 68, 72, 81, 76, 89, 95],
    },
    {
      id: '2',
      label: 'Effectif Total',
      value: data.totalEmployees.toString(),
      change: 6.2,
      icon: '◉',
      color: '#3ecf8e',
      sparklineData: [210, 215, 218, 221, 225, 229, 232, 235, 238, 241, 245, 247],
    },
    {
      id: '3',
      label: 'Taux de Présence',
      value: data.totalEmployees > 0 
        ? `${Math.round((data.activeEmployees / data.totalEmployees) * 100)}%`
        : '0%',
      change: 1.8,
      icon: '◎',
      color: '#2dd4bf',
      sparklineData: [88, 90, 87, 91, 89, 92, 90, 93, 91, 92, 94, 91],
    },
    {
      id: '4',
      label: 'Factures Impayées',
      value: data.unpaidInvoices.toString(),
      change: -12.5,
      icon: '◆',
      color: '#fb923c',
      sparklineData: [35, 32, 28, 30, 26, 29, 25, 27, 24, 26, 23, 23],
    },
    {
      id: '5',
      label: 'Apprenants Actifs',
      value: data.activeEnrollments.toLocaleString('fr-FR'),
      change: 23.1,
      icon: '▦',
      color: '#a78bfa',
      sparklineData: [820, 880, 920, 970, 1020, 1080, 1120, 1150, 1180, 1210, 1235, 1247],
    },
    {
      id: '6',
      label: 'Bénéfice Net',
      value: formatCurrency(
        (typeof data.totalRevenue === 'number' ? data.totalRevenue : parseFloat(String(data.totalRevenue))) - 
        (typeof data.totalExpenses === 'number' ? data.totalExpenses : parseFloat(String(data.totalExpenses)))
      ),
      change: 21.3,
      icon: '◇',
      color: '#c9a84c',
      sparklineData: [140, 120, 200, 180, 280, 270, 320, 330, 400, 380, 460, 500],
    },
  ];
};

// Mapper les données backend vers le format Department du frontend
const mapToDepartments = (data: DashboardResponse) => {
  return [
    { id: '1', name: 'Tech', code: 'TECH', budget: 180000, spent: 142000, createdAt: new Date() },
    { id: '2', name: 'RH', code: 'RH', budget: 95000, spent: 88000, createdAt: new Date() },
    { id: '3', name: 'Finance', code: 'FIN', budget: 120000, spent: 98000, createdAt: new Date() },
    { id: '4', name: 'Ventes', code: 'VT', budget: 220000, spent: 198000, createdAt: new Date() },
    { id: '5', name: 'Formation', code: 'FORM', budget: 150000, spent: 115000, createdAt: new Date() },
  ];
};

const dashboardService = {
  /**
   * Récupérer les KPIs globaux du dashboard
   */
  async getDashboard(): Promise<{
    kpis: ReturnType<typeof mapToKPIs>;
    departments: ReturnType<typeof mapToDepartments>;
    raw: DashboardResponse;
  }> {
    const response = await api.get<DashboardResponse>('/v1/dashboard');
    const data = response.data as unknown as DashboardResponse;
    
    return {
      kpis: mapToKPIs(data),
      departments: mapToDepartments(data),
      raw: data,
    };
  },

  /**
   * Récupérer uniquement les KPIs (alias pour compatibilité)
   */
  async getKPIs() {
    const response = await api.get<DashboardResponse>('/v1/dashboard');
    const data = response.data as unknown as DashboardResponse;
    return mapToKPIs(data);
  },

  /**
   * Récupérer les données de revenu mensuel (Revenue Chart)
   */
  async getRevenueData(): Promise<RevenueDataPoint[]> {
    try {
      const response = await api.get<RevenueDataPoint[]>('/v1/dashboard/revenue');
      return response.data;
    } catch (error) {
      // Fallback to mock data if API fails
      console.warn('Using mock revenue data');
      return mockRevenueData;
    }
  },

  /**
   * Récupérer les données de trésorerie (Cash Flow Chart)
   */
  async getCashFlow(): Promise<CashFlowDataPoint[]> {
    try {
      const response = await api.get<CashFlowDataPoint[]>('/v1/dashboard/cashflow');
      return response.data;
    } catch (error) {
      // Fallback to mock data if API fails
      console.warn('Using mock cashflow data');
      return mockCashFlowData;
    }
  },

  /**
   * Récupérer les données de performance par département (Radar)
   */
  async getPerformanceRadar(): Promise<RadarDataPoint[]> {
    try {
      const response = await api.get<RadarDataPoint[]>('/v1/dashboard/performance');
      return response.data;
    } catch (error) {
      // Fallback to mock data if API fails
      console.warn('Using mock radar data');
      return mockRadarDeptData;
    }
  },

  /**
   * Récupérer les activités récentes (Activity Feed)
   */
  async getRecentActivity() {
    try {
      const response = await api.get('/v1/dashboard/activity');
      return response.data;
    } catch (error) {
      // Fallback to mock data if API fails
      console.warn('Using mock activity data');
      return mockActivitiesData;
    }
  },
};

export default dashboardService;

