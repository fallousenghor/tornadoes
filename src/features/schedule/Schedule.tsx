// Schedule Feature - Tornadoes Job Education Module
// Connected to backend API

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, Button, Modal } from '../../components/common';
import { Colors } from '../../constants/theme';
import scheduleService, { ScheduleSlot, mapScheduleToSlot } from '../../services/scheduleService';
import type { Room } from '@/types';

// Days of week
const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

// Time slots
const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

// Room colors
const roomColors: Record<string, string> = {
  'Salle A': '#6490ff',
  'Salle B': '#3ecf8e',
  'Salle C': '#a78bfa',
  'Salle D': '#fb923c',
  'Labo Info': '#2dd4bf',
  'Amphi': '#c9a84c',
};

// Program colors
const programColors: Record<string, string> = {
  'Développement Web': '#6490ff',
  'Data Science': '#3ecf8e',
  'Cybersécurité': '#a78bfa',
  'Marketing Digital': '#fb923c',
};

// Groups
const groups = ['DW-2025', 'DS-2025', 'CYB-2025', 'MKD-2025'];

// Programs for filter
const programs = ['all', ...Object.keys(programColors)];

export const Schedule: React.FC = () => {
  // State
  const [selectedProgram, setSelectedProgram] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<ScheduleSlot | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [schedules, setSchedules] = useState<ScheduleSlot[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [stats, setStats] = useState({ totalHours: 0, coursesCount: 0, roomsUsed: 0, teachersInvolved: 0 });

  // Fetch schedules from API
  const fetchSchedules = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await scheduleService.getSchedules();
      const slots = result.data.map(mapScheduleToSlot);
      setSchedules(slots);
      
      // Calculate stats
      const totalHours = slots.reduce((acc, s) => {
        const start = parseInt(s.startTime.split(':')[0]);
        const end = parseInt(s.endTime.split(':')[0]);
        return acc + (end - start);
      }, 0);
      const coursesCount = new Set(slots.map(s => s.course)).size;
      const roomsUsed = new Set(slots.map(s => s.room)).size;
      const teachersInvolved = new Set(slots.map(s => s.teacher)).size;
      
      setStats({ totalHours, coursesCount, roomsUsed, teachersInvolved });
    } catch (error) {
      console.error('Error fetching schedules:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch rooms
  const fetchRooms = useCallback(async () => {
    try {
      const result = await scheduleService.getRooms();
      setRooms(result);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchSchedules();
    fetchRooms();
  }, [fetchSchedules, fetchRooms]);

  // Filter schedule by program
  const filteredSchedule = useMemo(() => {
    if (selectedProgram === 'all') return schedules;
    return schedules.filter(s => s.program === selectedProgram);
  }, [schedules, selectedProgram]);

  // Get schedule for a specific day and time slot
  const getSlotContent = (day: number, time: string) => {
    return filteredSchedule.find(s => s.day === day && s.startTime === time);
  };

  // Handle create/update schedule
  const handleScheduleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      programId: formData.get('programId') as string,
      moduleId: '1',
      roomId: formData.get('roomId') as string,
      teacherId: '1',
      dayOfWeek: parseInt(formData.get('dayOfWeek') as string),
      startTime: formData.get('startTime') as string,
      endTime: formData.get('endTime') as string,
      groupName: formData.get('groupName') as string,
    };

    try {
      if (selectedSlot) {
        await scheduleService.updateSchedule(selectedSlot.id, data);
      } else {
        await scheduleService.createSchedule(data);
      }
      setIsModalOpen(false);
      setSelectedSlot(null);
      fetchSchedules();
    } catch (error) {
      console.error('Error saving schedule:', error);
    }
  };

  // Handle delete schedule
  const handleDeleteSchedule = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce créneau ?')) return;
    try {
      await scheduleService.deleteSchedule(id);
      setIsModalOpen(false);
      setSelectedSlot(null);
      fetchSchedules();
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: Colors.text, marginBottom: 4 }}>
            Plannings
          </h1>
          <p style={{ fontSize: 13, color: Colors.textMuted }}>
            Gestion des emploi du temps · Salles · Cours
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="secondary" onClick={() => alert('Fonctionnalité d\'exportation bientôt disponible!')}>
            ↺ Exporter
          </Button>
          <Button variant="primary" onClick={() => { setSelectedSlot(null); setIsModalOpen(true); }}>
            + Nouveau créneau
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(100, 140, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#6490ff' }}>
              ⏱️
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Heures/Semaine
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {isLoading ? '...' : `${stats.totalHours}h`}
              </div>
            </div>
          </div>
        </Card>
        
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(62, 207, 142, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#3ecf8e' }}>
              📚
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Cours
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {isLoading ? '...' : stats.coursesCount}
              </div>
            </div>
          </div>
        </Card>
        
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(167, 139, 250, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#a78bfa' }}>
              🚪
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Salles Utilisées
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {isLoading ? '...' : stats.roomsUsed}
              </div>
            </div>
          </div>
        </Card>
        
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(251, 146, 60, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, color: '#fb923c' }}>
              👨‍🏫
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Professeurs
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                {isLoading ? '...' : stats.teachersInvolved}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card style={{ marginBottom: 20, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <select 
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              style={{ padding: '10px 14px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}
            >
              {programs.map(p => (<option key={p} value={p}>{p === 'all' ? 'Tous les programmes' : p}</option>))}
            </select>
          </div>
          <div style={{ fontSize: 13, color: Colors.textMuted }}>
            Semaine du 17 au 22 février 2025
          </div>
        </div>
      </Card>

      {/* Weekly Schedule Grid */}
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center', color: Colors.textMuted }}>
            Chargement du planning...
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(6, 1fr)', minWidth: 800 }}>
              {/* Header Row */}
              <div style={{ padding: '14px 12px', background: 'rgba(100, 140, 255, 0.05)', borderBottom: `1px solid ${Colors.border}`, borderRight: `1px solid ${Colors.border}` }}></div>
              {daysOfWeek.map((day, idx) => (
                <div key={idx} style={{ padding: '14px 12px', background: 'rgba(100, 140, 255, 0.05)', borderBottom: `1px solid ${Colors.border}`, borderRight: `1px solid ${Colors.border}`, textAlign: 'center' }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: Colors.text }}>{day}</div>
                  <div style={{ fontSize: 11, color: Colors.textMuted }}>17-22 fév</div>
                </div>
              ))}

              {/* Time Slots */}
              {timeSlots.map((time) => (
                <React.Fragment key={time}>
                  {/* Time label */}
                  <div style={{ padding: '12px 8px', borderBottom: `1px solid ${Colors.border}`, borderRight: `1px solid ${Colors.border}`, fontSize: 11, color: Colors.textMuted, textAlign: 'center', background: 'rgba(100, 140, 255, 0.02)' }}>
                    {time}
                  </div>
                  
                  {/* Day cells */}
                  {daysOfWeek.map((_, dayIdx) => {
                    const slot = getSlotContent(dayIdx, time);
                    return (
                      <div 
                        key={`${dayIdx}-${time}`}
                        onClick={() => { if (slot) { setSelectedSlot(slot); setIsModalOpen(true); } }}
                        style={{ 
                          padding: '4px', 
                          borderBottom: `1px solid ${Colors.border}`, 
                          borderRight: `1px solid ${Colors.border}`,
                          minHeight: 50,
                          background: slot ? `${programColors[slot.program] || '#6490ff'}10` : 'transparent',
                          cursor: slot ? 'pointer' : 'default',
                        }}
                      >
                        {slot && (
                          <div style={{ 
                            padding: '6px 8px', 
                            borderRadius: 6, 
                            background: programColors[slot.program] || '#6490ff',
                            color: '#fff',
                            fontSize: 10,
                            fontWeight: 500,
                          }}>
                            <div style={{ fontWeight: 600, marginBottom: 2 }}>{slot.course}</div>
                            <div style={{ opacity: 0.9 }}>{slot.room} · {slot.teacher.split(' ')[0]}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Legend */}
      <div style={{ marginTop: 20, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {Object.entries(programColors).map(([program, color]) => (
          <div key={program} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: color }}></div>
            <span style={{ fontSize: 12, color: Colors.textMuted }}>{program}</span>
          </div>
        ))}
      </div>

      {/* Room Availability */}
      <div style={{ marginTop: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: Colors.text, marginBottom: 12 }}>Disponibilité des salles</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {rooms.length > 0 ? rooms.map((room) => {
            const roomSchedule = schedules.filter(s => s.room === room.name);
            const busySlots = new Set(roomSchedule.map(s => s.startTime));
            return (
              <Card key={room.id} style={{ padding: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: Colors.text }}>{room.name}</span>
                  <span style={{ fontSize: 11, color: Colors.textMuted }}>Capacité: {room.capacity}</span>
                </div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {timeSlots.slice(0, 8).map(time => (
                    <div 
                      key={time}
                      style={{ 
                        width: 24, 
                        height: 20, 
                        borderRadius: 3, 
                        background: busySlots.has(time) ? `${roomColors[room.name] || '#6490ff'}40` : 'rgba(100, 140, 255, 0.1)',
                        border: busySlots.has(time) ? `1px solid ${roomColors[room.name] || '#6490ff'}` : 'none',
                      }}
                      title={`${time}: ${busySlots.has(time) ? 'Occupé' : 'Libre'}`}
                    ></div>
                  ))}
                </div>
              </Card>
            );
          }) : (
            <div style={{ gridColumn: '1 / -1', padding: 20, textAlign: 'center', color: Colors.textMuted }}>
              Chargement des salles...
            </div>
          )}
        </div>
      </div>

      {/* Schedule Slot Modal */}
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedSlot(null); }} title={selectedSlot ? selectedSlot.course : 'Nouveau créneau'} size="md">
        {selectedSlot ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div><div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>COURS</div><div style={{ fontSize: 14, fontWeight: 600, color: Colors.text }}>{selectedSlot.course}</div></div>
              <div><div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>PROGRAMME</div><div style={{ fontSize: 14, color: Colors.text }}><span style={{ padding: '2px 8px', borderRadius: 4, background: programColors[selectedSlot.program] || '#6490ff', color: '#fff', fontSize: 11 }}>{selectedSlot.program}</span></div></div>
              <div><div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>PROFESSEUR</div><div style={{ fontSize: 14, color: Colors.text }}>{selectedSlot.teacher}</div></div>
              <div><div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>SALLE</div><div style={{ fontSize: 14, color: Colors.text }}>{selectedSlot.room}</div></div>
              <div><div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>JOUR</div><div style={{ fontSize: 14, color: Colors.text }}>{daysOfWeek[selectedSlot.day]}</div></div>
              <div><div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>HORAIRE</div><div style={{ fontSize: 14, color: Colors.text }}>{selectedSlot.startTime} - {selectedSlot.endTime}</div></div>
              <div style={{ gridColumn: '1 / -1' }}><div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 4 }}>GROUPE</div><div style={{ fontSize: 14, color: Colors.text }}>{selectedSlot.group}</div></div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <Button 
                variant="secondary" 
                onClick={() => handleDeleteSchedule(selectedSlot.id)}
                style={{ color: '#e05050', borderColor: '#e05050' }}
              >
                Supprimer
              </Button>
              <Button variant="secondary" onClick={() => { setIsModalOpen(false); setSelectedSlot(null); }}>Fermer</Button>
              <Button variant="primary">Modifier</Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleScheduleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div><label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Cours</label><input type="text" name="course" placeholder="Nom du cours" style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }} /></div>
              <div><label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Professeur</label><select name="teacherId" style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}><option value="1">Mamadou Sall</option><option value="2">Fatou Diallo</option><option value="3">Omar Ndiaye</option><option value="4">Aïcha Mendy</option><option value="5">Ibrahima Ba</option><option value="6">Mariama Gaye</option></select></div>
              <div><label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Jour</label><select name="dayOfWeek" style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}>{daysOfWeek.map((d, i) => (<option key={i} value={i}>{d}</option>))}</select></div>
              <div><label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Salle</label><select name="roomId" style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}><option value="1">Salle A</option><option value="2">Salle B</option><option value="3">Salle C</option><option value="4">Salle D</option><option value="5">Labo Info</option><option value="6">Amphi</option></select></div>
              <div><label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Début</label><input type="time" name="startTime" defaultValue="08:00" style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }} /></div>
              <div><label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Fin</label><input type="time" name="endTime" defaultValue="10:00" style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }} /></div>
              <div><label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Programme</label><select name="programId" style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}><option value="1">Développement Web</option><option value="2">Data Science</option><option value="3">Cybersécurité</option><option value="4">Marketing Digital</option></select></div>
              <div><label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6 }}>Groupe</label><select name="groupName" style={{ width: '100%', padding: '12px', borderRadius: 8, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}>{groups.map(g => (<option key={g}>{g}</option>))}</select></div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
              <Button variant="secondary" type="button" onClick={() => setIsModalOpen(false)}>Annuler</Button>
              <Button variant="primary" type="submit">Créer</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Schedule;

