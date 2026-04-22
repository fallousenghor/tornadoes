// Attendance Service - RH Module (Fixed - No duplicate methods)
import api from './api';
import type { PresenceRecord, PresenceStatus } from '@/types';

interface AttendanceResponse {
  id: string;
  employeeId: string;
  employeeNumber?: string;
  employeeName?: string;
  departmentName?: string;
  attendanceDate?: string;
  recordDate?: string;
  checkIn?: string;
  checkInTime?: string;
  checkOut?: string;
  checkOutTime?: string;
  status: string;
  lateMinutes?: number;
  notes?: string;
  workedHours?: string;
}

const ATTENDANCE_BASE_PATH = '/v1/attendances';

const parseTimeToDate = (time?: string): Date | undefined => {
  if (!time) return undefined;
  const parsed = new Date(`1970-01-01T${time}`);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
};

const mapStatus = (backendStatus: string): PresenceStatus => {
  const statusMap: Record<string, PresenceStatus> = {
    'PRESENT': 'present',
    'ABSENT': 'absent',
    'HALF_DAY': 'late',
    'REMOTE': 'present',
  };
  return statusMap[backendStatus as keyof typeof statusMap] || 'present';
};

const parseAttendanceDate = (response: AttendanceResponse): Date => {
  const rawDate = response.attendanceDate || response.recordDate;
  if (!rawDate) {
    return new Date();
  }

  const parsed = new Date(rawDate);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const mapAttendance = (response: AttendanceResponse): PresenceRecord => ({
  id: response.id,
  employeeId: response.employeeId,
  employeeName: response.employeeName || 'N/A',
  department: response.departmentName || 'N/A',
  date: parseAttendanceDate(response),
  checkIn: parseTimeToDate(response.checkIn || response.checkInTime),
  checkOut: parseTimeToDate(response.checkOut || response.checkOutTime),
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
  updateRecord: async (id: string, data: {
    checkIn?: string;
    checkOut?: string;
    status: PresenceStatus;
    notes?: string;
  }): Promise<PresenceRecord> => {
    const statusMap = {
      present: 'PRESENT',
      absent: 'ABSENT',
      late: 'HALF_DAY',
      leave: 'ABSENT'
    } as Record<PresenceStatus, string>;
    
    const body = {
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      status: statusMap[data.status],
      notes: data.notes
    };
    
    const response = await api.put<AttendanceResponse>(`${ATTENDANCE_BASE_PATH}/${id}`, body);
    return mapAttendance(response.data);
  },

  getAttendancesByEmployee: async (employeeId: string, params?: { fromDate?: string; toDate?: string }): Promise<PresenceRecord[]> => {
    const backendParams = params?.fromDate && params?.toDate
      ? { from: params.fromDate, to: params.toDate }
      : undefined;
    const response = await api.get(`${ATTENDANCE_BASE_PATH}/employee/${employeeId}`, { params: backendParams });
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
      late: 'HALF_DAY',
      leave: 'ABSENT'
    } as Record<PresenceStatus, string>;

    const body = {
      employeeId: data.employeeId,
      date: data.date,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      status: statusMap[data.status] || 'PRESENT',
      notes: data.notes
    };

    const response = await api.post<AttendanceResponse>(ATTENDANCE_BASE_PATH, body);
    return mapAttendance(response.data);
  },

  getWeeklyPresence: async (): Promise<WeeklyPresenceData[]> => {
    const attendanceResult = await attendanceService.getAttendances({});
    const dayLabels = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

    return Array.from({ length: 7 }, (_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const iso = date.toISOString().split('T')[0];
      const recordsForDay = attendanceResult.data.filter(
        record => record.date.toISOString().split('T')[0] === iso
      );

      return {
        dayOfWeek: dayLabels[date.getDay()],
        present: recordsForDay.filter(record => record.status === 'present').length,
        absent: recordsForDay.filter(record => record.status === 'absent').length,
        late: recordsForDay.filter(record => record.status === 'late').length,
      };
    });
  },

  /** List attendances with filters/pagination */
  getAttendances: async (params: {
    page?: number;
    pageSize?: number;
    status?: string;
    fromDate?: string;
    toDate?: string;
  }) => {
    const response = await api.get(ATTENDANCE_BASE_PATH);
    const data = response.data;
    const records = Array.isArray(data) ? data : (data.content || []);
    const normalizedStatus = params.status && params.status !== 'all' ? params.status : undefined;
    const filtered = records
      .map(mapAttendance as any)
      .filter((record: PresenceRecord) => {
        const recordDate = record.date.toISOString().split('T')[0];
        if (params.fromDate && recordDate < params.fromDate) return false;
        if (params.toDate && recordDate > params.toDate) return false;
        if (normalizedStatus && record.status !== normalizedStatus) return false;
        return true;
      });

    return {
      data: filtered,
      total: filtered.length,
      page: params.page || 0,
      pageSize: params.pageSize || filtered.length || 10
    };
  },
};

export default attendanceService;
