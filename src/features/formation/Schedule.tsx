// Schedule Feature - Formation & Education Module
// Course Scheduling and Room Management

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, Button, Modal } from '../../components/common';
import { Colors, BorderRadius } from '../../constants/theme';
import scheduleService, { ScheduleSlot, mapScheduleToSlot } from '../../services/scheduleService';
import type { Room } from '@/types';

// Days of week
const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

// Time slots
const timeSlots = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

// Program colors matching our design system
const programColors: Record<string, string> = {
  'Développement Web': Colors.primary,
  'Data Science': Colors.success,
  'Cybersécurité': '#a78bfa',
  'Marketing Digital': Colors.warning,
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

  // Styles
  const containerStyle: React.CSSProperties = {
    padding: 24,
    background: Colors.bgLight,
    minHeight: '100vh',
  };

  const headerStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
    gap: 16,
    flexWrap: 'wrap',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 24,
    fontWeight: 700,
    color: Colors.text,
    margin: 0,
  };

  const subtitleStyle: React.CSSProperties = {
    fontSize: 14,
    color: Colors.textMuted,
    margin: '4px 0 0',
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>📅 Plannings</h1>
          <p style={subtitleStyle}>Gestion des emplois du temps · Salles · Cours</p>
        </div>
        <button 
          onClick={() => { setSelectedSlot(null); setIsModalOpen(true); }}
          style={{
            padding: '10px 18px',
            borderRadius: BorderRadius.md,
            background: Colors.primary,
            color: 'white',
            border: 'none',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          ➕ Nouveau Créneau
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 24 }}>
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: BorderRadius.md, background: Colors.primaryMuted, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              ⏱️
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                Heures/Semaine
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: Colors.primary }}>
                {isLoading ? '...' : `${stats.totalHours}h`}
              </div>
            </div>
          </div>
        </Card>
        
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: BorderRadius.md, background: '#D1FAE5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              📚
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                Cours
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: Colors.success }}>
                {isLoading ? '...' : stats.coursesCount}
              </div>
            </div>
          </div>
        </Card>
        
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: BorderRadius.md, background: '#E9D5FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              🚪
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                Salles Utilisées
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#A855F7' }}>
                {isLoading ? '...' : stats.roomsUsed}
              </div>
            </div>
          </div>
        </Card>
        
        <Card style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: BorderRadius.md, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
              👨‍🏫
            </div>
            <div>
              <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                Formateurs
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: Colors.warning }}>
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
            <span style={{ fontSize: 13, color: Colors.textMuted, fontWeight: 500 }}>Programme :</span>
            <select 
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              style={{ 
                padding: '10px 14px', 
                borderRadius: BorderRadius.md, 
                border: `1px solid ${Colors.border}`, 
                background: Colors.bg, 
                color: Colors.text, 
                fontSize: 13,
                fontWeight: 500,
              }}
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
      <Card style={{ padding: 0, overflow: 'hidden', marginBottom: 24 }}>
        {isLoading ? (
          <div style={{ padding: 40, textAlign: 'center', color: Colors.textMuted }}>
            ⏳ Chargement du planning...
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(6, 1fr)', minWidth: 800 }}>
              {/* Header Row */}
              <div style={{ 
                padding: '14px 12px', 
                background: Colors.primaryMuted,
                border: `1px solid ${Colors.border}`,
              }}></div>
              {daysOfWeek.map((day, idx) => (
                <div key={idx} style={{ 
                  padding: '14px 12px', 
                  background: Colors.primaryMuted,
                  borderRight: idx < 5 ? `1px solid ${Colors.border}` : 'none',
                  textAlign: 'center' 
                }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: Colors.primary }}>{day}</div>
                  <div style={{ fontSize: 11, color: Colors.primary, opacity: 0.7 }}>17-22 fév</div>
                </div>
              ))}

              {/* Time Slots */}
              {timeSlots.map((time) => (
                <React.Fragment key={time}>
                  {/* Time label */}
                  <div style={{ 
                    padding: '12px 8px', 
                    borderBottom: `1px solid ${Colors.border}`,
                    borderRight: `1px solid ${Colors.border}`,
                    fontSize: 11, 
                    color: Colors.textMuted, 
                    textAlign: 'center', 
                    background: Colors.bgLight,
                    fontWeight: 500,
                  }}>
                    {time}
                  </div>
                  
                  {/* Day cells */}
                  {daysOfWeek.map((_, dayIdx) => {
                    const slot = getSlotContent(dayIdx, time);
                    const slotColor = programColors[slot?.program || ''] || Colors.primary;
                    return (
                      <div 
                        key={`${dayIdx}-${time}`}
                        onClick={() => { if (slot) { setSelectedSlot(slot); setIsModalOpen(true); } }}
                        style={{ 
                          padding: '4px', 
                          borderBottom: `1px solid ${Colors.border}`,
                          borderRight: dayIdx < 5 ? `1px solid ${Colors.border}` : 'none',
                          minHeight: 60,
                          background: slot ? `${slotColor}10` : Colors.bg,
                          cursor: slot ? 'pointer' : 'default',
                          transition: 'background 0.2s ease',
                        }}
                        onMouseEnter={(e) => {
                          if (slot) (e.currentTarget as HTMLElement).style.background = `${slotColor}20`;
                        }}
                        onMouseLeave={(e) => {
                          if (slot) (e.currentTarget as HTMLElement).style.background = `${slotColor}10`;
                        }}
                      >
                        {slot && (
                          <div style={{ 
                            padding: '6px 8px', 
                            borderRadius: BorderRadius.sm,
                            background: slotColor,
                            color: 'white',
                            fontSize: 10,
                            fontWeight: 600,
                          }}>
                            <div style={{ fontWeight: 700, marginBottom: 2 }}>{slot.course}</div>
                            <div style={{ opacity: 0.9, fontSize: 9 }}>{slot.room}</div>
                            <div style={{ opacity: 0.8, fontSize: 9 }}>{slot.teacher.split(' ')[0]}</div>
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
      <div style={{ marginBottom: 24, padding: 16, background: Colors.bg, borderRadius: BorderRadius.md, border: `1px solid ${Colors.border}` }}>
        <h3 style={{ fontSize: 12, fontWeight: 600, color: Colors.textMuted, margin: '0 0 12px', textTransform: 'uppercase' }}>Légende</h3>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          {Object.entries(programColors).map(([program, color]) => (
            <div key={program} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 12, height: 12, borderRadius: BorderRadius.sm, background: color }}></div>
              <span style={{ fontSize: 12, color: Colors.text }}>{program}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Room Availability */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: Colors.text, marginBottom: 16 }}>🚪 Disponibilité des Salles</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
          {rooms.length > 0 ? rooms.map((room) => {
            const roomSchedule = schedules.filter(s => s.room === room.name);
            const busySlots = new Set(roomSchedule.map(s => s.startTime));
            const occupancyRate = (busySlots.size / timeSlots.length * 100).toFixed(0);
            return (
              <Card key={room.id} style={{ padding: 16, border: `1px solid ${Colors.border}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: Colors.text }}>{room.name}</span>
                  <span style={{ 
                    fontSize: 11, 
                    color: Colors.textMuted,
                    background: Colors.bgLight,
                    padding: '2px 8px',
                    borderRadius: 4,
                  }}>
                    Cap. {room.capacity}
                  </span>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 11, color: Colors.textMuted }}>Utilisation</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: Colors.primary }}>{occupancyRate}%</span>
                  </div>
                  <div style={{ height: 4, background: Colors.bgLight, borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ 
                      height: '100%', 
                      background: Colors.primary,
                      width: `${occupancyRate}%`,
                      borderRadius: 2,
                      transition: 'width 0.3s ease',
                    }}></div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {timeSlots.slice(0, 10).map(time => (
                    <div 
                      key={time}
                      style={{ 
                        width: 20, 
                        height: 18, 
                        borderRadius: BorderRadius.sm,
                        background: busySlots.has(time) ? Colors.primary : Colors.bgLight,
                        border: busySlots.has(time) ? `1px solid ${Colors.primary}` : `1px solid ${Colors.border}`,
                        cursor: 'help',
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
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setSelectedSlot(null); }} title={selectedSlot ? '📅 ' + selectedSlot.course : '➕ Nouveau Créneau'}>
        {selectedSlot ? (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 6, fontWeight: 600, textTransform: 'uppercase' }}>COURS</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: Colors.text }}>{selectedSlot.course}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 6, fontWeight: 600, textTransform: 'uppercase' }}>PROGRAMME</div>
                <div style={{ fontSize: 14, color: Colors.text }}>
                  <span style={{ padding: '4px 10px', borderRadius: BorderRadius.sm, background: programColors[selectedSlot.program] || Colors.primary, color: 'white', fontSize: 12, fontWeight: 600 }}>
                    {selectedSlot.program}
                  </span>
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 6, fontWeight: 600, textTransform: 'uppercase' }}>FORMATEUR</div>
                <div style={{ fontSize: 14, color: Colors.text }}>👨‍🏫 {selectedSlot.teacher}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 6, fontWeight: 600, textTransform: 'uppercase' }}>SALLE</div>
                <div style={{ fontSize: 14, color: Colors.text }}>🚪 {selectedSlot.room}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 6, fontWeight: 600, textTransform: 'uppercase' }}>JOUR</div>
                <div style={{ fontSize: 14, color: Colors.text }}>{daysOfWeek[selectedSlot.day]}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, marginBottom: 6, fontWeight: 600, textTransform: 'uppercase' }}>HORAIRE</div>
                <div style={{ fontSize: 14, color: Colors.text }}>{selectedSlot.startTime} - {selectedSlot.endTime}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button 
                onClick={() => handleDeleteSchedule(selectedSlot.id)}
                style={{
                  padding: '8px 16px',
                  borderRadius: BorderRadius.md,
                  background: '#FEF2F2',
                  color: Colors.danger,
                  border: `1px solid ${Colors.danger}40`,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                🗑️ Supprimer
              </button>
              <button 
                onClick={() => { setIsModalOpen(false); setSelectedSlot(null); }}
                style={{
                  padding: '8px 16px',
                  borderRadius: BorderRadius.md,
                  background: Colors.bgLight,
                  color: Colors.text,
                  border: `1px solid ${Colors.border}`,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Fermer
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleScheduleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6, fontWeight: 600 }}>Cours</label>
                <input type="text" name="course" placeholder="Nom du cours" required style={{ width: '100%', padding: '10px 12px', borderRadius: BorderRadius.md, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6, fontWeight: 600 }}>Formateur</label>
                <select name="teacherId" required style={{ width: '100%', padding: '10px 12px', borderRadius: BorderRadius.md, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}>
                  <option value="">Sélectionner...</option>
                  <option value="1">Mamadou Sall</option>
                  <option value="2">Fatou Diallo</option>
                  <option value="3">Omar Ndiaye</option>
                  <option value="4">Aïcha Mendy</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6, fontWeight: 600 }}>Jour</label>
                <select name="dayOfWeek" required style={{ width: '100%', padding: '10px 12px', borderRadius: BorderRadius.md, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}>
                  {daysOfWeek.map((d, i) => (<option key={i} value={i}>{d}</option>))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6, fontWeight: 600 }}>Salle</label>
                <select name="roomId" required style={{ width: '100%', padding: '10px 12px', borderRadius: BorderRadius.md, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}>
                  <option value="1">Salle A</option>
                  <option value="2">Salle B</option>
                  <option value="3">Salle C</option>
                  <option value="4">Salle D</option>
                  <option value="5">Labo Info</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6, fontWeight: 600 }}>Début</label>
                <input type="time" name="startTime" defaultValue="08:00" required style={{ width: '100%', padding: '10px 12px', borderRadius: BorderRadius.md, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6, fontWeight: 600 }}>Fin</label>
                <input type="time" name="endTime" defaultValue="10:00" required style={{ width: '100%', padding: '10px 12px', borderRadius: BorderRadius.md, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6, fontWeight: 600 }}>Programme</label>
                <select name="programId" required style={{ width: '100%', padding: '10px 12px', borderRadius: BorderRadius.md, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}>
                  <option value="1">Développement Web</option>
                  <option value="2">Data Science</option>
                  <option value="3">Cybersécurité</option>
                  <option value="4">Marketing Digital</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: Colors.textMuted, marginBottom: 6, fontWeight: 600 }}>Groupe</label>
                <select name="groupName" required style={{ width: '100%', padding: '10px 12px', borderRadius: BorderRadius.md, border: `1px solid ${Colors.border}`, background: Colors.bg, color: Colors.text, fontSize: 13 }}>
                  {groups.map(g => (<option key={g} value={g}>{g}</option>))}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{
                  padding: '8px 16px',
                  borderRadius: BorderRadius.md,
                  background: Colors.bgLight,
                  color: Colors.text,
                  border: `1px solid ${Colors.border}`,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Annuler
              </button>
              <button 
                type="submit"
                style={{
                  padding: '8px 16px',
                  borderRadius: BorderRadius.md,
                  background: Colors.primary,
                  color: 'white',
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                ➕ Créer
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
export default Schedule;
