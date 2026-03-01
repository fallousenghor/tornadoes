// Projects Feature - AEVUM Enterprise ERP
// Refactored with DRY & SOLID principles

import React, { useState, useMemo } from 'react';
import { Card, Button, ProgressBar, FilterBar, PaginationControls } from '../../components/common';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Colors } from '../../constants/theme';
import { useFilterable } from '../../hooks/useFilterable';
import { projectsData, employeesData } from '../../data/mockData';
import { ProjectForm } from './components';
import type { ProjectFormData } from './components/ProjectForm';

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
  const [viewMode, setViewMode] = useState<'board' | 'list' | 'gantt'>('board');
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [draggedTask, setDraggedTask] = useState<string | null>(null);

  // Use the filterable hook
  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilter,
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
    totalItems,
    showingFrom,
    showingTo,
  } = useFilterable({
    data: projectsData,
    itemsPerPage: 10,
    searchFields: ['name'],
  });

  // Filter by priority
  const filteredProjects = useMemo(() => {
    const priority = filters.priority || 'all';
    if (priority === 'all') return paginatedData;
    return paginatedData.filter((p: any) => p.priority === priority);
  }, [paginatedData, filters.priority]);

  // Group projects by status for Kanban view
  const projectsByStatus = useMemo(() => {
    const groups: Record<string, typeof projectsData> = {
      demarrage: [],
      en_cours: [],
      finalisation: [],
      termine: [],
    };
    filteredProjects.forEach((p: any) => {
      if (groups[p.status]) {
        groups[p.status].push(p);
      }
    });
    return groups;
  }, [filteredProjects]);

  // Get employee name by ID
  const getEmployeeName = (id: string) => {
    const emp = employeesData.find(e => e.id === id);
    return emp ? `${emp.firstName} ${emp.lastName}` : 'Non assigné';
  };

  // Calculate days remaining
  const getDaysRemaining = (deadline: Date) => {
    const today = new Date();
    const diff = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Handle form submission
  const handleProjectSubmit = (data: ProjectFormData) => {
    console.log('Project data submitted:', data);
  };

  const handleNewProject = () => {
    setSelectedProject(null);
    setIsFormOpen(true);
  };

  const handleViewDetails = (project: any) => {
    setSelectedProject(project);
    setIsDetailsOpen(true);
  };

  // Drag and drop handlers
  const handleDragStart = (projectId: string) => {
    setDraggedTask(projectId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: string) => {
    if (draggedTask) {
      console.log(`Moving project ${draggedTask} to ${status}`);
      setDraggedTask(null);
    }
  };

  // Summary stats
  const summaryCards = [
    { title: 'Total Projets', value: projectsData.length, icon: '📋', variant: 'info' as const },
    { title: 'En Cours', value: projectsData.filter(p => p.status === 'en_cours').length, icon: '▶', variant: 'success' as const },
    { title: 'Moyenne', value: '58%', icon: '⏱', variant: 'warning' as const },
    { title: 'Échéance proche', value: projectsData.filter(p => getDaysRemaining(p.deadline) <= 14 && getDaysRemaining(p.deadline) > 0).length, icon: '⚠', variant: 'danger' as const },
  ];

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
          <FilterBar
            filters={[
              { key: 'priority', type: 'select', options: priorityOptions, placeholder: 'Priorité' },
            ]}
            values={filters}
            onChange={setFilter}
            onSearch={setSearchQuery}
            searchValue={searchQuery}
            searchPlaceholder="Rechercher un projet..."
          />
          
          <div style={{ display: 'flex', gap: 4, background: 'rgba(100, 140, 255, 0.05)', padding: 4, borderRadius: 10 }}>
            {viewModes.map(mode => (
              <button
                key={mode.id}
                onClick={() => setViewMode(mode.id as any)}
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
            const projects = projectsByStatus[column.id] || [];
            return (
              <div key={column.id} onDragOver={handleDragOver} onDrop={() => handleDrop(column.id)} style={{ background: 'rgba(100, 140, 255, 0.03)', borderRadius: 12, padding: 12, minHeight: 400 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, padding: '8px 12px', background: 'rgba(100, 140, 255, 0.1)', borderRadius: 8 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: Colors.text }}>{column.label}</span>
                  <span style={{ fontSize: 11, color: Colors.textMuted, background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: 10 }}>{projects.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {projects.map((project: any) => {
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
                            {project.members.length}
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
                {filteredProjects.map((project: any, index: number) => {
                  const daysRemaining = getDaysRemaining(project.deadline);
                  return (
                    <tr key={project.id} style={{ borderBottom: `1px solid ${Colors.border}`, background: index % 2 === 0 ? 'transparent' : 'rgba(100, 140, 255, 0.02)', cursor: 'pointer' }} onClick={() => handleViewDetails(project)}>
                      <td style={{ padding: '14px 16px' }}><span style={{ fontSize: 13, fontWeight: 600, color: Colors.text }}>{project.name}</span></td>
                      <td style={{ padding: '14px 16px' }}><StatusBadge status={project.status} /></td>
                      <td style={{ padding: '14px 16px' }}><StatusBadge status={project.priority} /></td>
                      <td style={{ padding: '14px 16px', width: 150 }}><div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ flex: 1 }}><ProgressBar value={project.progress} color={project.progress >= 80 ? Colors.green : project.progress >= 50 ? Colors.accent : Colors.orange} height={6} /></div><span style={{ fontSize: 11, fontWeight: 600, color: Colors.text, minWidth: 35 }}>{project.progress}%</span></div></td>
                      <td style={{ padding: '14px 16px' }}><span style={{ fontSize: 12, color: daysRemaining < 0 ? Colors.red : daysRemaining < 7 ? Colors.orange : Colors.textMuted }}>{formatDate(project.deadline)}</span></td>
                      <td style={{ padding: '14px 16px', textAlign: 'center' }}><div style={{ display: 'flex', justifyContent: 'center' }}><div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(100, 140, 255, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: Colors.accent, fontWeight: 600 }}>{project.members.length}</div></div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <PaginationControls
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            showingFrom={showingFrom}
            showingTo={showingTo}
            onPageChange={setCurrentPage}
          />
        </Card>
      )}

      {/* Gantt View (Simplified) */}
      {viewMode === 'gantt' && (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: 16, borderBottom: `1px solid ${Colors.border}` }}><h3 style={{ fontSize: 14, fontWeight: 600, color: Colors.text }}>Diagramme de Gantt</h3></div>
          <div style={{ padding: 20 }}>
            {filteredProjects.map((project: any, index: number) => {
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

