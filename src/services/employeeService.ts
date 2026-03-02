// Service Employees - Tornadoes Job RH Module
// Gestion des employés via l'API backend

import api from './api';
import type { Employee, ContractType, EmployeeStatus, Department } from '@/types';

// Backend response types (after ApiResponse unwrapping)
interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

interface EmployeeResponse {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  birthDate?: string;
  hireDate: string;
  terminationDate?: string;
  status: 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED';
  baseSalary: number;
  currency: string;
  contractType: string;
  contractStartDate: string;
  contractEndDate?: string;
  departmentId?: string;
  departmentName?: string;
  positionTitle?: string;
  leaveBalance: number;
  photoUrl?: string;
  createdAt: string;
}

interface DepartmentResponse {
  id: string;
  name: string;
  code: string;
  description?: string;
  active: boolean;
  createdAt: string;
}

// Types pour les requêtes - accepts both frontend form fields and backend fields
export interface CreateEmployeeRequest {
  // Frontend form fields
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  poste?: string;
  departmentId: string;
  contractType: ContractType;
  salary?: number;
  startDate?: string;
  notes?: string;
  
  // Backend fields (optional - will be mapped from frontend fields if not provided)
  hireDate?: string;
  baseSalary?: number;
  currency?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  positionTitle?: string;
  departmentName?: string;
}

export interface UpdateEmployeeRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  poste?: string;
  departmentId?: string;
  contractType?: ContractType;
  salary?: number;
  startDate?: string;
  notes?: string;
  status?: EmployeeStatus;
  hireDate?: string;
  baseSalary?: number;
  currency?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  positionTitle?: string;
  departmentName?: string;
}

// Map backend status to frontend status
const mapStatus = (backendStatus: string): EmployeeStatus => {
  switch (backendStatus) {
    case 'ACTIVE':
      return 'Actif';
    case 'ON_LEAVE':
      return 'Congé';
    case 'TERMINATED':
      return 'Inactif';
    default:
      return 'Actif';
  }
};

// Map backend contract type to frontend contract type
const mapContractType = (backendType: string): ContractType => {
  switch (backendType) {
    case 'CDI':
      return 'CDI';
    case 'CDD':
      return 'CDD';
    case 'FREELANCE':
      return 'Freelance';
    case 'INTERNSHIP':
      return 'Stage';
    case 'PART_TIME':
      return 'Part_time';
    default:
      return 'CDI';
  }
};

// Map frontend contract type to backend contract type
const mapContractTypeToBackend = (frontendType: ContractType): string => {
  switch (frontendType) {
    case 'CDI':
      return 'CDI';
    case 'CDD':
      return 'CDD';
    case 'Freelance':
      return 'FREELANCE';
    case 'Stage':
      return 'INTERNSHIP';
    case 'Part_time':
      return 'PART_TIME';
    default:
      return 'CDI';
  }
};

// Map backend EmployeeResponse to frontend Employee
const mapEmployee = (response: EmployeeResponse): Employee => ({
  id: response.id,
  userId: response.employeeNumber,
  firstName: response.firstName,
  lastName: response.lastName,
  email: response.email,
  phone: response.phone,
  poste: response.positionTitle || '',
  departmentId: response.departmentId || '',
  contractType: mapContractType(response.contractType),
  salary: response.baseSalary,
  startDate: new Date(response.hireDate),
  status: mapStatus(response.status),
  avatar: response.photoUrl,
  notes: undefined,
});

// Map backend DepartmentResponse to frontend Department
const mapDepartment = (response: DepartmentResponse): Department => ({
  id: response.id,
  name: response.name,
  code: response.code,
  description: response.description,
  budget: 0,
  spent: 0,
  createdAt: new Date(response.createdAt),
});

const employeeService = {
  /**
   * Récupérer la liste des employés
   */
  async getEmployees(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: EmployeeStatus;
    departmentId?: string;
    contractType?: ContractType;
  }): Promise<{ data: Employee[]; total: number; page: number; pageSize: number }> {
    // Map frontend params to backend params
    const backendParams: Record<string, string | number | undefined> = {
      page: params?.page || 0,
      size: params?.pageSize || 100,
    };
    
    if (params?.search) {
      backendParams.name = params.search;
    }
    if (params?.status && params.status !== 'Actif') {
      backendParams.status = params.status === 'Congé' ? 'ON_LEAVE' : 'TERMINATED';
    }
    if (params?.departmentId) {
      backendParams.departmentId = params.departmentId;
    }

    const response = await api.get<PageResponse<EmployeeResponse>>('/v1/employees', { params: backendParams });
    // response.data is already unwrapped by interceptor
    const pageData = response.data as unknown as PageResponse<EmployeeResponse>;
    
    return {
      data: pageData.content.map(mapEmployee),
      total: pageData.totalElements,
      page: pageData.page,
      pageSize: pageData.size,
    };
  },

  /**
   * Récupérer un employé par ID
   */
  async getEmployee(id: string): Promise<Employee> {
    const response = await api.get<EmployeeResponse>(`/v1/employees/${id}`);
    // response.data is already unwrapped by interceptor
    return mapEmployee(response.data as unknown as EmployeeResponse);
  },

  /**
   * Créer un nouvel employé
   */
  async createEmployee(data: CreateEmployeeRequest): Promise<Employee> {
    // Map frontend fields to backend format
    const hireDate = data.startDate || data.hireDate || new Date().toISOString().split('T')[0];
    const contractStartDate = data.contractStartDate || data.startDate || hireDate;
    
    const backendData = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      hireDate: hireDate,
      departmentId: data.departmentId,
      positionTitle: data.poste || data.positionTitle,
      baseSalary: data.salary || data.baseSalary || 0,
      currency: data.currency || 'XOF',
      contractType: mapContractTypeToBackend(data.contractType),
      contractStartDate: contractStartDate,
      contractEndDate: data.contractEndDate,
    };
    
    const response = await api.post<EmployeeResponse>('/v1/employees', backendData);
    return mapEmployee(response.data as unknown as EmployeeResponse);
  },

  /**
   * Mettre à jour un employé
   */
  async updateEmployee(id: string, data: UpdateEmployeeRequest): Promise<Employee> {
    const backendData: Record<string, unknown> = {};
    
    if (data.firstName && data.firstName.trim()) backendData.firstName = data.firstName.trim();
    if (data.lastName && data.lastName.trim()) backendData.lastName = data.lastName.trim();
    if (data.email && data.email.trim()) backendData.email = data.email.trim();
    if (data.phone && data.phone.trim()) backendData.phone = data.phone.trim();
    
    // Only send departmentId if it's not empty
    if (data.departmentId && data.departmentId.trim()) {
      backendData.departmentId = data.departmentId;
      if (data.departmentName) backendData.departmentName = data.departmentName;
    }
    
    if ((data.poste || data.positionTitle) && (data.poste || data.positionTitle).trim()) {
      backendData.positionTitle = data.poste || data.positionTitle;
    }
    
    if (data.salary || data.baseSalary) {
      backendData.baseSalary = data.salary || data.baseSalary;
      backendData.currency = data.currency || 'XOF';
    }
    
    if (data.contractType) {
      backendData.contractType = mapContractTypeToBackend(data.contractType);
    }
    
    if (data.contractEndDate) backendData.contractEndDate = data.contractEndDate;

    console.log('Updating employee:', id, backendData);
    
    const response = await api.put<EmployeeResponse>(`/v1/employees/${id}`, backendData);
    return mapEmployee(response.data as unknown as EmployeeResponse);
  },

  /**
   * Supprimer (terminer) un employé - Soft delete
   */
  async deleteEmployee(id: string): Promise<void> {
    // Backend uses terminate endpoint for soft delete
    const today = new Date().toISOString().split('T')[0];
    await api.post(`/v1/employees/${id}/terminate`, null, {
      params: { terminationDate: today }
    });
  },

  /**
   * Récupérer les départements (pour les filtres)
   */
  async getDepartments(): Promise<Department[]> {
    const response = await api.get<PageResponse<DepartmentResponse>>('/v1/departments', {
      params: { active: true, size: 100 }
    });
    // response.data is already unwrapped by interceptor
    const pageData = response.data as unknown as PageResponse<DepartmentResponse>;
    return pageData.content.map(mapDepartment);
  },
};

export default employeeService;
