// Schedule Service - Tornadoes Job Education Module
// Gestion des plannings via l'API backend

import api from './api';
import type { Schedule, Room } from '@/types';

// Types backend
interface ScheduleResponse {
  id: string;
  programId: string;
  programName?: string;
  moduleId: string;
  moduleName?: string;
  roomId: string;
  roomName?: string;
  teacherId: string;
  teacherName?: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  groupName?: string;
}

interface RoomResponse {
  id: string;
  name: string;
  capacity: number;
  equipment?: string[];
  active: boolean;
}

interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

// Mapper la réponse backend vers le format frontend
const mapSchedule = (response: ScheduleResponse): Schedule => ({
  id: response.id,
  programId: response.programId,
  moduleId: response.moduleId,
  roomId: response.roomId,
  teacherId: response.teacherId,
  dayOfWeek: response.dayOfWeek,
  startTime: response.startTime,
  endTime: response.endTime,
});

const mapRoom = (response: RoomResponse): Room => ({
  id: response.id,
  name: response.name,
  capacity: response.capacity,
  equipment: response.equipment,
});

const scheduleService = {
  /**
   * Récupérer la liste des plannings
   */
  async getSchedules(params?: {
    page?: number;
    size?: number;
    programId?: string;
    teacherId?: string;
    roomId?: string;
    dayOfWeek?: number;
  }): Promise<{ data: ScheduleResponse[]; total: number }> {
    const backendParams: Record<string, string | number | undefined> = {
      page: params?.page || 0,
      size: params?.size || 100,
    };
    
    if (params?.programId) {
      backendParams.programId = params.programId;
    }
    if (params?.teacherId) {
      backendParams.teacherId = params.teacherId;
    }
    if (params?.roomId) {
      backendParams.roomId = params.roomId;
    }
    if (params?.dayOfWeek !== undefined) {
      backendParams.dayOfWeek = params.dayOfWeek;
    }

    try {
      const response = await api.get<PageResponse<ScheduleResponse>>('/v1/schedules', { params: backendParams });
      return {
        data: response.data.content,
        total: response.data.totalElements,
      };
    } catch (error) {
      console.error('Error fetching schedules:', error);
      return { data: [], total: 0 };
    }
  },

  /**
   * Récupérer un créneau par ID
   */
  async getSchedule(id: string): Promise<ScheduleResponse | null> {
    try {
      const response = await api.get<ScheduleResponse>(`/v1/schedules/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching schedule:', error);
      return null;
    }
  },

  /**
   * Créer un nouveau créneau
   */
  async createSchedule(data: {
    programId: string;
    moduleId: string;
    roomId: string;
    teacherId: string;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    groupName?: string;
  }): Promise<ScheduleResponse | null> {
    try {
      const response = await api.post<ScheduleResponse>('/v1/schedules', data);
      return response.data;
    } catch (error) {
      console.error('Error creating schedule:', error);
      return null;
    }
  },

  /**
   * Mettre à jour un créneau
   */
  async updateSchedule(id: string, data: {
    programId?: string;
    moduleId?: string;
    roomId?: string;
    teacherId?: string;
    dayOfWeek?: number;
    startTime?: string;
    endTime?: string;
    groupName?: string;
  }): Promise<ScheduleResponse | null> {
    try {
      const response = await api.put<ScheduleResponse>(`/v1/schedules/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating schedule:', error);
      return null;
    }
  },

  /**
   * Supprimer un créneau
   */
  async deleteSchedule(id: string): Promise<boolean> {
    try {
      await api.delete(`/v1/schedules/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting schedule:', error);
      return false;
    }
  },

  /**
   * Récupérer la liste des salles
   */
  async getRooms(): Promise<Room[]> {
    try {
      const response = await api.get<PageResponse<RoomResponse>>('/v1/rooms');
      return response.data.content.map(mapRoom);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      return [];
    }
  },

  /**
   * Récupérer les statistiques du planning
   */
  async getScheduleStats() {
    const schedules = await this.getSchedules();
    return {
      totalHours: schedules.data.reduce((acc, s) => {
        const start = parseInt(s.startTime.split(':')[0]);
        const end = parseInt(s.endTime.split(':')[0]);
        return acc + (end - start);
      }, 0),
      coursesCount: new Set(schedules.data.map(s => s.moduleName)).size,
      roomsUsed: new Set(schedules.data.map(s => s.roomName)).size,
      teachersInvolved: new Set(schedules.data.map(s => s.teacherName)).size,
    };
  },
};

export default scheduleService;

// Extended schedule type for UI
export interface ScheduleSlot {
  id: string;
  day: number;
  startTime: string;
  endTime: string;
  course: string;
  program: string;
  teacher: string;
  room: string;
  group: string;
}

// Helper to convert API response to UI slot
export const mapScheduleToSlot = (response: ScheduleResponse): ScheduleSlot => ({
  id: response.id,
  day: response.dayOfWeek,
  startTime: response.startTime,
  endTime: response.endTime,
  course: response.moduleName || 'Cours',
  program: response.programName || 'Programme',
  teacher: response.teacherName || 'Professeur',
  room: response.roomName || 'Salle',
  group: response.groupName || 'Groupe',
});

