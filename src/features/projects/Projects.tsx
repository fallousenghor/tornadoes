// Projects Feature - AEVUM Enterprise ERP
// Refactored with DRY & SOLID principles - Backend API Integration

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Card, Button, ProgressBar, FilterBar, PaginationControls } from '../../components/common';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Colors } from '../../constants/theme';
import projectService from '../../services/projectService';
import employeeService from '../../services/employeeService';
import { ProjectForm } from './components';
import type { ProjectFormData } from './components/ProjectForm';
import type { Project, Employee, ProjectStatus, ProjectPriority } from '@/types';

// Filter options
const priorityOptions = [
  { value: 'all', label: 'Toutes les priorités' },
  { value: 'basse', label: 'Basse' },
  { value: 'moyenne', label: 'Moyenne' },
  { value: 'haute', label: 'Haute' },
  { value: 'critique', label: 'Critique' },
];

// View mode tabs
const viewModes = [
  { id: 'board', label: 'Tableau Kanban', icon: '▦' },
  { id: 'list', label: 'Liste', icon: '☰' },
  { id: 'gantt', label: 'Gantt', icon: '📊' },
];

// Status columns for Kanban
const statusColumns = [
  { id: 'demarrage', label: 'Démarrage' },
  { id: 'en_cours', label: 'En cours' },
  { id: 'finalisation', label: 'Finalisation' },
  { id: 'termine', label: 'Terminé' },
];

export const Projects: React.FC = () => {
  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'board' | 'list' | 'gantt'>('board');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const itemsPerPage = 10;

  // Fetch projects from API
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await projectService.getProjects({ pageSize: 100 });
      setProjects(response.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError('Erreur lors du chargement des projets');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch employees for manager display
  const fetchEmployees = useCallback(async () => {
    try {
      const response = await employeeService.getEmployees({ pageSize: 100 });
      setEmployees(response.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    fetchProjects();
    fetchEmployees();
  }, [fetchProjects, fetchEmployees]);

  // Filter projects
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
      return matchesSearch && matchesPriority;
    });
  }, [projects, searchQuery, priorityFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Group projects by status for Kanban view
  const projectsByStatus = useMemo(() => {
    const groups: Record<string, Project[]> = {
      demarrage: [],
      en_cours: [],
      finalisation: [],
      termine: [],
    };
    filteredProjects.forEach((p) => {
      if (groups[p.status]) {
        groups[p.status].push(p);
      }
    });
    return groups;
  }, [filteredProjects]);

  // Get employee name by ID
  const getEmployeeName = (id: string) => {
    const emp = employees.find(e => e.id === id);
    return emp ? `${emp.firstName} ${emp.lastName}` : 'Non assigné';
  };

  // Calculate days remaining
  const getDaysRemaining = (deadline: Date | string) => {
    const today = new Date();
    const deadlineDate = typeof deadline === 'string' ? new Date(deadline) : deadline;
    const diff = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // Format date
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Handle filter change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  // Handle form submission
  const handleProjectSubmit = async (data: ProjectFormData) => {
    try {
      if (selectedProject) {
        await projectService.updateProject(selectedProject.id, {
          name: data.name,
          description: data.description,
          priority: data.priority as ProjectPriority,
          status: data.status as ProjectStatus,
          progress: data.progress,
          deadline: data.deadline,
        });
      } else {
        await projectService.createProject({
          name: data.name,
          description: data.description,
          priority: (data.priority || 'moyenne') as ProjectPriority,
          startDate: data.startDate || new Date().toISOString().split('T')[0],
          deadline: data.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          managerId: data.managerId || '',
          memberIds: data.memberIds,
        });
      }
      fetchProjects();
    } catch (err) {
      console.error('Error saving project:', err);
      alert('Erreur lors de l\'enregistrement du projet');
    }
  };

  const handleNewProject = () => {
    setSelectedProject(null);
    setIsFormOpen(true);
  };

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setIsDetailsOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setIsDetailsOpen(false);
    setIsFormOpen(true);
  };

  // Drag and drop handlers
  const handleDragStart = (projectId: string) => {
    setDraggedTask(projectId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (status: string) => {
    if (draggedTask) {
      try {
        await projectService.updateProject(draggedTask, { status: status as Project['status'] });
        fetchProjects();
      } catch (err) {
        console.error('Error updating project status:', err);
      }
      setDraggedTask(null);
    }
  };

  // Summary stats
  const summaryCards = useMemo(() => [
    { title: 'Total Projets', value: projects.length, icon: '📋', variant: 'info' as const },
    { title: 'En Cours', value: projects.filter(p => p.status === 'en_cours').length, icon: '▶', variant: 'success' as const },
    { title: 'Moyenne', value: projects.length > 0 ? `${Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)}%` : '0%', icon: '⏱', variant: 'warning' as const },
    { title: 'Échéance proche', value: projects.filter(p => getDaysRemaining(p.deadline) <= 14 && getDaysRemaining(p.deadline) > 0).length, icon: '⚠', variant: 'danger' as const },
  ], [projects]);

  // Loading state
  if (loading && projects.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: Colors.textMuted }}>
        Chargement des projets...
      </div>
    );
  }

  // Error state
  if (error && projects.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: 'center' }}>
        <div style={{ color: Colors.danger }}>{error}</div>
        <Button variant="primary" onClick={fetchProjects} style={{ marginTop: 16 }}>
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: Colors.text, marginBottom: 4 }}>
            Projets
          </h1>
          <p style={{ fontSize: 13, color: Colors.textMuted }}>
            Gestion de projets · Suivi d'avancement · Équipe
          </p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Button variant="secondary" onClick={() => setIsFormOpen(true)}>
            ↺ Filtres
          </Button>
          <Button variant="primary" onClick={handleNewProject}>
            + Nouveau projet
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        {summaryCards.map((card, idx) => (
          <Card key={idx} style={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ 
                width: 48, height: 48, borderRadius: 12, 
                background: card.variant === 'success' ? 'rgba(62, 207, 142, 0.15)' :
                           card.variant === 'warning' ? 'rgba(201, 168, 76, 0.15)' :
                           card.variant === 'danger' ? 'rgba(224, 80, 80, 0.15)' :
                           'rgba(100, 140, 255, 0.15)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20,
                color: card.variant === 'success' ? '#3ecf8e' :
                       card.variant === 'warning' ? '#c9a84c' :
                       card.variant === 'danger' ? '#e05050' : '#6490ff',
              }}>
                {card.icon}
              </div>
              <div>
                <div style={{ fontSize: 11, color: Colors.textMuted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {card.title}
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: Colors.text, fontFamily: "'DM Serif Display', serif" }}>
                  {card.value}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters & View Toggle */}
      <Card style={{ marginBottom: 20, padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <input
              type="text"
              placeholder="Rechercher un projet..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); handleFilterChange(); }}
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                border: `1px solid ${Colors.border}`,
                background: Colors.bg,
                color: Colors.text,
                fontSize: 13,
                width: 250,
              }}
            />
            <select
              value={priorityFilter}
              onChange={(e) => { setPriorityFilter(e.target.value); handleFilterChange(); }}
              style={{
                padding: '10px 14px',
                borderRadius: 8,
                border: `1px solid ${Colors.border}`,
                background: Colors.bg,
                color: Colors.text,
                fontSize: 13,
              }}
            >
              {priorityOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          
          <div style={{ display: 'flex', gap: 4, background: 'rgba(100, 140, 255, 0.05)', padding: 4, borderRadius: 10 }}>
            {viewModes.map(mode => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as 'board' | 'list' | 'gantt')}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: 'none',
                  background: viewMode === mode.id ? 'rgba(100, 140, 255, 0.15)' : 'transparent',
                  color: viewMode === mode.id ? Colors.accent : Colors.textMuted,
                  fontSize: 12,
                  fontWeight: viewMode === mode.id ? 600 : 400,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <span>{mode.icon}</span>{mode.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Kanban Board View */}
      {viewMode === 'board' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {statusColumns.map(column => {
            const statusProjects = projectsByStatus[column.id] || [];
            return (
              <div key={column.id} onDragOver={handleDragOver} onDrop={() => handleDrop(column.id)} style={{ background: 'rgba(100, 140, 255, 0.03)', borderRadius: 12, padding: 12, minHeight: 400 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, padding: '8px 12px', background: 'rgba(100, 140, 255, 0.1)', borderRadius: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: Colors.text }}>{column.label}</span>
                  <span style={{ fontSize: 11, color: Colors.textMuted, background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: 10 }}>{statusProjects.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {statusProjects.map((project) => {
                    const daysRemaining = getDaysRemaining(project.deadline);
                    return (
                      <div key={project.id} draggable onDragStart={() => handleDragStart(project.id)} onClick={() => handleViewDetails(project)} style={{ background: Colors.card, border: `1px solid ${Colors.border}`, borderRadius: 10, padding: 14, cursor: 'grab', transition: 'all 0.2s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: Colors.text, flex: 1 }}>{project.name}</span>
                          <StatusBadge status={project.priority} size="sm" />
                        </div>
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                            <span style={{ fontSize: 10, color: Colors.textMuted }}>Avancement</span>
                            <span style={{ fontSize: 10, fontWeight: 600, color: Colors.text }}>{project.progress}%</span>
                          </div>
                          <ProgressBar value={project.progress} color={project.progress >= 80 ? Colors.green : project.progress >= 50 ? Colors.accent : Colors.orange} height={4} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ fontSize: 10, color: Colors.textMuted }}>📅</span>
                            <span style={{ fontSize: 10, color: daysRemaining < 0 ? Colors.red : daysRemaining < 7 ? Colors.orange : Colors.textMuted }}>
                              {daysRemaining < 0 ? `En retard ${Math.abs(daysRemaining)}j` : `${daysRemaining}j restants`}
                            </span>
                          </div>
                          <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(100, 140, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: Colors.accent, fontWeight: 600 }}>
                            {project.members?.length || 0}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(100, 140, 255, 0.05)' }}>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Projet</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Statut</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Priorité</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Avancement</th>
                  <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Échéance</th>
                  <th style={{ padding: '14px 16px', textAlign: 'center', fontSize: 11, fontWeight: 600, color: Colors.textMuted, textTransform: 'uppercase' }}>Équipe</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProjects.map((project, index) => {
                  const daysRemaining = getDaysRemaining(project.deadline);
                  return (
                    <tr key={project.id} style={{ borderBottom: `1px solid ${Colors.border}`, background: index % 2 === 0 ? 'transparent' : 'rgba(100, 140, 255, 0.02)', cursor: 'pointer' }} onClick={() => handleViewDetails(project)}>
                      <td style={{ padding: '14px 16px' }}><span style={{ fontSize: 13, fontWeight: 600, color: Colors.text }}>{project.name}</span></td>
                      <td style={{ padding: '14px 16px' }}><StatusBadge status={project.status} /></td>
                      <td style={{ padding: '14px 16px' }}><StatusBadge status={project.priority} /></td>
                      <td style={{ padding: '14px 16px', width: 150 }}><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ flex: 1 }}><ProgressBar value={project.progress} color={project.progress >= 80 ? Colors.green : project.progress >= 50 ? Colors.accent : Colors.orange} height={6} /></div><span style={{ fontSize: 11, fontWeight: 600, color: Colors.text, minWidth: 35 }}>{project.progress}%</span></div></td>
                      <td style={{ padding: '14px 16px' }}><span style={{ fontSize: 12, color: daysRemaining < 0 ? Colors.red : daysRemaining < 7 ? Colors.orange : Colors.textMuted }}>{formatDate(project.deadline)}</span></td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}><div style={{ display: 'flex', justifyContent: 'center' }}><div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(100, 140, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: Colors.accent, fontWeight: 600 }}>{project.members?.length || 0}</div></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderTop: `1px solid ${Colors.border}` }}>
            <div style={{ fontSize: 12, color: Colors.textMuted }}>
              Affichage de {(currentPage - 1) * itemsPerPage + 1} à {Math.min(currentPage * itemsPerPage, filteredProjects.length)} sur {filteredProjects.length}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ padding: '8px 14px', borderRadius: 6, border: `1px solid ${Colors.border}`, background: 'transparent', color: currentPage === 1 ? Colors.textMuted : Colors.text, fontSize: 12, cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}>
                ← Précédent
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(page => (
                <button key={page} onClick={() => setCurrentPage(page)} style={{ padding: '8px 12px', borderRadius: 6, border: page === currentPage ? `1px solid ${Colors.accent}` : `1px solid ${Colors.border}`, background: page === currentPage ? 'rgba(100, 140, 255, 0.15)' : 'transparent', color: page === currentPage ? Colors.accent : Colors.text, fontSize: 12, cursor: 'pointer' }}>
                  {page}
                </button>
              ))}
              <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ padding: '8px 14px', borderRadius: 6, border: `1px solid ${Colors.border}`, background: 'transparent', color: currentPage === totalPages ? Colors.textMuted : Colors.text, fontSize: 12, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}>
                Suivant →
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Gantt View (Simplified) */}
      {viewMode === 'gantt' && (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: 16, borderBottom: `1px solid ${Colors.border}` }}><h3 style={{ fontSize: 14, fontWeight: 600, color: Colors.text }}>Diagramme de Gantt</h3></div>
          <div style={{ padding: 20 }}>
            {paginatedProjects.map((project) => {
              return (
                <div key={project.id} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: Colors.text }}>{project.name}</span>
                    <span style={{ fontSize: 11, color: Colors.textMuted }}>{formatDate(project.startDate)} - {formatDate(project.deadline)}</span>
                  </div>
                  <div style={{ height: 24, background: 'rgba(100, 140, 255, 0.1)', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
                    <div style={{ width: `${project.progress}%`, height: '100%', background: project.progress >= 80 ? Colors.green : project.progress >= 50 ? Colors.accent : Colors.orange, borderRadius: 6, transition: 'width 0.3s' }} />
                    <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', fontSize: 10, fontWeight: 600, color: Colors.text }}>{project.progress}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Project Form Modal */}
      <ProjectForm
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setSelectedProject(null); }}
        onSubmit={handleProjectSubmit}
        project={selectedProject}
      />
    </div>
  );
};

export default Projects;

