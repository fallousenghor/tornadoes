// Attendance Service - RH Module (Fixed - No duplicate methods)
import api from './api';
import type { PresenceRecord, PresenceStatus } from '@/types';

interface AttendanceResponse {
  id: string;
  employeeId: string;
  employeeName?: string;
  departmentName?: string;
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
  employeeName: response.employeeName || 'N/A',
  department: response.departmentName || 'N/A',
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
  deleteRecord: async (id: string): Promise<void> => {
    await api.delete(`/v1/attendance/${id}`);
  },

  updateRecord: async (id: string, data: {
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
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      status: statusMap[data.status],
      notes: data.notes
    };
    
    const response = await api.put<AttendanceResponse>(`/v1/attendance/${id}`, body);
    return mapAttendance(response.data);
  },

  getAttendancesByEmployee: async (employeeId: string, params?: { fromDate?: string; toDate?: string }): Promise<PresenceRecord[]> => {
    const response = await api.get(`/v1/attendance/employee/${employeeId}`, { params });
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
      recordDate: data.date,  // Backend expects "recordDate", not "date"
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      status: statusMap[data.status] || 'PRESENT',
      notes: data.notes
    };

    const response = await api.post<AttendanceResponse>('/v1/attendance', body);
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
    // Handle both paginated and non-paginated responses
    const data = response.data;
    const records = Array.isArray(data) ? data : (data.content || []);
    return {
      data: records.map(mapAttendance as any),
      total: Array.isArray(data) ? data.length : (data.totalElements || 0),
      page: Array.isArray(data) ? 0 : (data.page || 0),
      pageSize: Array.isArray(data) ? records.length : (data.size || 10)
    };
  },
};

export default attendanceService;

