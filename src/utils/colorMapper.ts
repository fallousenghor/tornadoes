// Color Mapping Utility - Centralizes color assignments for consistent theme usage
// Maps business domain statuses/types to theme colors

import type { ThemeColors } from '../contexts/ThemeContext';

// Status color mappings
export const getStatusColor = (status: string, colors: any) => {
  const statusMap: Record<string, { bg: string; color: string; label: string }> = {
    // Employee statuses
    'Actif': { bg: colors.successMuted, color: colors.success, label: 'Actif' },
    'actif': { bg: colors.successMuted, color: colors.success, label: 'Actif' },
    'Congé': { bg: colors.warningMuted, color: colors.warning, label: 'Congé' },
    'conge': { bg: colors.warningMuted, color: colors.warning, label: 'Congé' },
    'Inactif': { bg: colors.bgSecondary, color: colors.textMuted, label: 'Inactif' },
    'inactif': { bg: colors.bgSecondary, color: colors.textMuted, label: 'Inactif' },
    'Suspendu': { bg: colors.dangerMuted, color: colors.danger, label: 'Suspendu' },

    // Leave request statuses
    'approved': { bg: colors.successMuted, color: colors.success, label: 'Approuvé' },
    'pending': { bg: colors.warningMuted, color: colors.warning, label: 'En attente' },
    'rejected': { bg: colors.dangerMuted, color: colors.danger, label: 'Rejeté' },

    // Project statuses
    'Démarrage': { bg: colors.primaryMuted, color: colors.primary, label: 'Démarrage' },
    'En cours': { bg: colors.successMuted, color: colors.success, label: 'En cours' },
    'Finalisation': { bg: colors.purpleMuted, color: colors.purple, label: 'Finalisation' },
    'Terminé': { bg: colors.successMuted, color: colors.success, label: 'Terminé' },
    'En pause': { bg: colors.warningMuted, color: colors.warning, label: 'En pause' },

    // Degree/Education statuses
    'diplome': { bg: colors.successMuted, color: colors.success, label: 'Diplômé' },
    'attente': { bg: colors.warningMuted, color: colors.warning, label: 'En attente' },
    'abandon': { bg: colors.dangerMuted, color: colors.danger, label: 'Abandon' },

    // Document statuses
    'draft': { bg: colors.primaryMuted, color: colors.primary, label: 'Brouillon' },
    'Brouillon': { bg: colors.primaryMuted, color: colors.primary, label: 'Brouillon' },
    'Signé': { bg: colors.successMuted, color: colors.success, label: 'Signé' },
    'En signature': { bg: colors.warningMuted, color: colors.warning, label: 'En signature' },
    'Expiré': { bg: colors.dangerMuted, color: colors.danger, label: 'Expiré' },

    // Payment statuses
    'Payé': { bg: colors.successMuted, color: colors.success, label: 'Payé' },
    'En attente': { bg: colors.warningMuted, color: colors.warning, label: 'En attente' },
    'Partiel': { bg: colors.primaryMuted, color: colors.primary, label: 'Partiel' },
    'Annulé': { bg: colors.bgSecondary, color: colors.textMuted, label: 'Annulé' },
    'Retard': { bg: colors.dangerMuted, color: colors.danger, label: 'Retard' },

    // Connection/Integration statuses
    'connected': { bg: colors.successMuted, color: colors.success, label: 'Connecté' },
    'disconnected': { bg: colors.bgSecondary, color: colors.textMuted, label: 'Déconnecté' },
    'error': { bg: colors.dangerMuted, color: colors.danger, label: 'Erreur' },

    // Presence statuses
    'present': { bg: colors.successMuted, color: colors.success, label: 'Présent' },
    'absent': { bg: colors.dangerMuted, color: colors.danger, label: 'Absent' },
    'late': { bg: colors.warningMuted, color: colors.warning, label: 'En retard' },
  };

  return statusMap[status] || { bg: colors.bgSecondary, color: colors.textMuted, label: status };
};

// Contract type color mappings
export const getContractTypeColor = (type: string, colors: any) => {
  const contractMap: Record<string, { bg: string; color: string; label: string }> = {
    'CDI': { bg: colors.primaryMuted, color: colors.primary, label: 'CDI' },
    'CDD': { bg: colors.purpleMuted, color: colors.purple, label: 'CDD' },
    'Freelance': { bg: colors.infoMuted, color: colors.info, label: 'Freelance' },
    'Stage': { bg: colors.warningMuted, color: colors.warning, label: 'Stage' },
    'Part_time': { bg: 'rgba(251, 146, 60, 0.15)', color: '#fb923c', label: 'Part-time' },
    'Apprentissage': { bg: colors.teal, color: colors.teal, label: 'Apprentissage' },
    'Intérim': { bg: 'rgba(249, 115, 22, 0.15)', color: colors.orange, label: 'Intérim' },
  };

  return contractMap[type] || { bg: colors.bgSecondary, color: colors.textMuted, label: type };
};

// Priority level color mappings
export const getPriorityColor = (priority: string, colors: any) => {
  const priorityMap: Record<string, { bg: string; color: string; label: string }> = {
    'critique': { bg: colors.dangerMuted, color: colors.danger, label: 'Critique' },
    'Critique': { bg: colors.dangerMuted, color: colors.danger, label: 'Critique' },
    'haute': { bg: colors.dangerMuted, color: colors.danger, label: 'Haute' },
    'Haute': { bg: colors.dangerMuted, color: colors.danger, label: 'Haute' },
    'urgente': { bg: colors.warningMuted, color: colors.warning, label: 'Urgente' },
    'Urgente': { bg: colors.warningMuted, color: colors.warning, label: 'Urgente' },
    'moyenne': { bg: colors.primaryMuted, color: colors.primary, label: 'Moyenne' },
    'Moyenne': { bg: colors.primaryMuted, color: colors.primary, label: 'Moyenne' },
    'normale': { bg: colors.primaryMuted, color: colors.primary, label: 'Normale' },
    'Normale': { bg: colors.primaryMuted, color: colors.primary, label: 'Normale' },
    'basse': { bg: colors.bgSecondary, color: colors.textMuted, label: 'Basse' },
    'Basse': { bg: colors.bgSecondary, color: colors.textMuted, label: 'Basse' },
  };

  return priorityMap[priority] || { bg: colors.bgSecondary, color: colors.textMuted, label: priority };
};

// Severity/Risk level color mappings
export const getSeverityColor = (severity: string, colors: any) => {
  const severityMap: Record<string, { bg: string; color: string; label: string }> = {
    'critical': { bg: colors.dangerMuted, color: colors.danger, label: 'Critique' },
    'high': { bg: colors.dangerMuted, color: colors.danger, label: 'Élevée' },
    'medium': { bg: colors.warningMuted, color: colors.warning, label: 'Moyenne' },
    'low': { bg: colors.successMuted, color: colors.success, label: 'Faible' },
    'at_risk': { bg: colors.warningMuted, color: colors.warning, label: 'À risque' },
    'on_track': { bg: colors.successMuted, color: colors.success, label: 'En bonne voie' },
  };

  return severityMap[severity] || { bg: colors.bgSecondary, color: colors.textMuted, label: severity };
};

// Performance/Achievement color mappings
export const getAchievementColor = (achievement: string, colors: any) => {
  const achievementMap: Record<string, { bg: string; color: string; label: string }> = {
    'achieved': { bg: colors.successMuted, color: colors.success, label: 'Atteint' },
    'exceeded': { bg: colors.purpleMuted, color: colors.purple, label: 'Dépassé' },
    'pending': { bg: colors.primaryMuted, color: colors.primary, label: 'En cours' },
    'at_risk': { bg: colors.warningMuted, color: colors.warning, label: 'À risque' },
    'failed': { bg: colors.dangerMuted, color: colors.danger, label: 'Échoué' },
  };

  return achievementMap[achievement] || { bg: colors.bgSecondary, color: colors.textMuted, label: achievement };
};

// Grade/Score color mappings
export const getGradeColor = (score: number, colors: any) => {
  if (score >= 14) return { bg: colors.successMuted, color: colors.success, label: 'Excellent' };
  if (score >= 12) return { bg: colors.successMuted, color: colors.success, label: 'Très Bien' };
  if (score >= 10) return { bg: colors.warningMuted, color: colors.warning, label: 'Passable' };
  return { bg: colors.dangerMuted, color: colors.danger, label: 'Insuffisant' };
};

// Program/Category color mappings
export const getProgramColor = (program: string, colors: any): { bg: string; color: string } => {
  const programMap: Record<string, { bg: string; color: string }> = {
    'Développement Web': { bg: colors.primaryMuted, color: colors.primary },
    'Data Science': { bg: colors.successMuted, color: colors.success },
    'Cybersécurité': { bg: colors.purpleMuted, color: colors.purple },
    'Marketing Digital': { bg: colors.warningMuted, color: colors.warning },
    'Gestion de projet': { bg: 'rgba(201, 168, 76, 0.15)', color: '#c9a84c' },
    'Base de données': { bg: 'rgba(45, 212, 191, 0.15)', color: '#2dd4bf' },
  };

  return programMap[program] || { bg: colors.bgSecondary, color: colors.textMuted };
};
