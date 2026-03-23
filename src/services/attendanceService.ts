// Attendance Service - RH Module (Fixed - No duplicate methods)
import api from './api';
import type { PresenceRecord, PresenceStatus } from '@/types';

interface AttendanceResponse {
  id: string;
  employeeId: string;
  employeeName?: string;
  recordDate: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: string;
  lateMinutes?: number;
  notes?: string;
  workedHours?: string;
}

const mapStatus = (backendStatus: string): PresenceStatus => {
  const statusMap: Record<string, PresenceStatus> = {
    'PRESENT': 'present',
    'ABSENT': 'absent',
    'LATE': 'late',
    'ON_LEAVE': 'leave',
    'REMOTE': 'present'
  };
  return statusMap[backendStatus as keyof typeof statusMap] || 'present';
};

const mapAttendance = (response: AttendanceResponse): PresenceRecord => ({
  id: response.id,
  employeeId: response.employeeId,
  date: new Date(response.recordDate),
  checkIn: response.checkInTime ? new Date(response.checkInTime) : undefined,
  checkOut: response.checkOutTime ? new Date(response.checkOutTime) : undefined,
  status: mapStatus(response.status),
  notes: response.notes,
});

export interface WeeklyPresenceData {
  dayOfWeek: string;
  present: number;
  absent: number;
  late: number;
}

const attendanceService = {
  /** Get attendances by employee ID with optional date range */
  getAttendancesByEmployee: async (employeeId: string, params?: { fromDate?: string; toDate?: string }): Promise<PresenceRecord[]> => {
    const response = await api.get(`/v1/attendances/employee/${employeeId}`, { params });
    return (response.data.content || response.data).map(mapAttendance as any);
  },

  /** Record/update attendance for an employee */
  recordAttendance: async (data: {
    employeeId: string;
    date: string;
    checkIn?: string;
    checkOut?: string;
    status: PresenceStatus;
    notes?: string;
  }): Promise<PresenceRecord> => {
    const statusMap = {
      present: 'PRESENT',
      absent: 'ABSENT', 
      late: 'LATE',
      leave: 'ON_LEAVE'
    } as Record<PresenceStatus, string>;
    
    const body = {
      employeeId: data.employeeId,
      recordDate: data.date,
      checkInTime: data.checkIn,
      checkOutTime: data.checkOut,
      status: statusMap[data.status] || 'PRESENT',
      notes: data.notes
    };
    
    const response = await api.post<AttendanceResponse>('/v1/attendances', body);
    return mapAttendance(response.data);
  },

  /** Get company-wide presence stats */
  getPresenceStats: async () => {
    const response = await api.get('/v1/attendance/stats');
    return response.data;
  },

  /** Get weekly presence data for charts */
  getWeeklyPresence: async (): Promise<WeeklyPresenceData[]> => {
    const response = await api.get('/v1/attendance/weekly');
    return response.data.days || [];
  },

  /** List attendances with filters/pagination */
  getAttendances: async (params: {
    page?: number;
    pageSize?: number;
    status?: string;
    fromDate?: string;
    toDate?: string;
  }) => {
    const response = await api.get('/v1/attendance', { params });
    return {
      data: (response.data.content || []).map(mapAttendance as any),
      total: response.data.totalElements || 0,
      page: response.data.page || 0,
      pageSize: response.data.size || 10
    };
  },
};

export default attendanceService;

