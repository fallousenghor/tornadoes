// Attendance Service - Tornadoes Job RH Module
// Gestion des présences via l'API backend

import api from './api';
import type { PresenceRecord, PresenceStatus } from '@/types';

// Types backend
interface AttendanceResponse {
  id: string;
  employeeId: string;
  employeeName?: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: string;
  notes?: string;
}

// Mapper le status backend vers frontend
const mapStatus = (backendStatus: string): PresenceStatus => {
  switch (backendStatus) {
    case 'PRESENT':
      return 'present';
    case 'ABSENT':
      return 'absent';
    case 'LATE':
      return 'late';
    case 'ON_LEAVE':
      return 'leave';
    default:
      return 'present';
  }
};

// Mapper la réponse backend vers le format frontend
const mapAttendance = (response: AttendanceResponse): PresenceRecord => ({
  id: response.id,
  employeeId: response.employeeId,
  date: new Date(response.date),
  checkIn: response.checkIn ? new Date(response.checkIn) : undefined,
  checkOut: response.checkOut ? new Date(response.checkOut) : undefined,
  status: mapStatus(response.status),
  notes: response.notes,
});

// Format de données de présence pour les graphiques (par jour de la semaine)
export interface PresenceDayData {
  jour: string;
  presents: number;
  absents: number;
  retards: number;
}

// Format pour le graphique de présence hebdomadaire
export interface WeeklyPresenceData {
  dayOfWeek: string;
  present: number;
  absent: number;
  late: number;
}

const attendanceService = {
  /**
   * Récupérer les présences d'un employé
   */
  async getAttendancesByEmployee(employeeId: string): Promise<PresenceRecord[]> {
    const response = await api.get<AttendanceResponse[]>(`/v1/attendances/employee/${employeeId}`);
    const data = response.data as unknown as AttendanceResponse[];
    return data.map(mapAttendance);
  },

  /**
   * Enregistrer une présence
   */
  async recordAttendance(data: {
    employeeId: string;
    date: string;
    checkIn?: string;
    checkOut?: string;
    status: PresenceStatus;
    notes?: string;
  }): Promise<PresenceRecord> {
    const response = await api.post<AttendanceResponse>('/v1/attendances', {
      employeeId: data.employeeId,
      date: data.date,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      status: data.status.toUpperCase(),
      notes: data.notes,
    });
    return mapAttendance(response.data as unknown as AttendanceResponse);
  },

  /**
   * Récupérer les données de présence agrégées pour les graphiques
   * Note: L'API backend ne retourne pas encore ce format, on simule avec des données
   */
  async getPresenceStats(): Promise<PresenceDayData[]> {
    // TODO: Appeler une endpoint d'agrégation quand elle sera disponible
    // Pour l'instant, retourner des données par défaut
    return [
      { jour: 'Lun', presents: 87, absents: 8, retards: 5 },
      { jour: 'Mar', presents: 91, absents: 5, retards: 4 },
      { jour: 'Mer', presents: 84, absents: 10, retards: 6 },
      { jour: 'Jeu', presents: 89, absents: 7, retards: 4 },
      { jour: 'Ven', presents: 79, absents: 14, retards: 7 },
    ];
  },

  /**
   * Récupérer les données de présence hebdomadaire pour le graphique
   */
  async getWeeklyPresence(): Promise<WeeklyPresenceData[]> {
    // TODO: Appeler une endpoint d'agrégation quand elle sera disponible
    // Pour l'instant, retourner des données par défaut
    return [
      { dayOfWeek: 'Lun', present: 87, absent: 8, late: 5 },
      { dayOfWeek: 'Mar', present: 91, absent: 5, late: 4 },
      { dayOfWeek: 'Mer', present: 84, absent: 10, late: 6 },
      { dayOfWeek: 'Jeu', present: 89, absent: 7, late: 4 },
      { dayOfWeek: 'Ven', present: 79, absent: 14, late: 7 },
    ];
  },
};

export default attendanceService;

