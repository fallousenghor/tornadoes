// Objectives Hooks - Business Logic for Objectives
// Hooks for fetching, creating, updating and deleting objectives

import { useState, useEffect, useCallback } from 'react';
import performanceService from '../../../../services/performanceService';
import type {
  Objective,
  ObjectiveFormData,
  CreateObjectivePayload,
  UpdateObjectivePayload,
  ObjectiveStatus,
} from '../types';

interface UseObjectivesOptions {
  pageSize?: number;
}

interface UseObjectivesReturn {
  objectives: Objective[];
  loading: boolean;
  error: string | null;
  totalObjectives: number;
  achievedObjectives: number;
  atRiskObjectives: number;
  refetch: () => void;
}

export const useObjectives = (options: UseObjectivesOptions = {}): UseObjectivesReturn => {
  const { pageSize = 100 } = options;
  
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchObjectives = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await performanceService.getObjectives({ pageSize });
      setObjectives(response.data || []);
    } catch (err: unknown) {
      console.error('Error fetching objectives:', err);
      setError('Erreur lors du chargement des objectifs');
      setObjectives([]);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    fetchObjectives();
  }, [fetchObjectives]);

  const totalObjectives = objectives.length;
  const achievedObjectives = objectives.filter(
    o => o.status === 'achieved' || o.status === 'exceeded'
  ).length;
  const atRiskObjectives = objectives.filter(o => o.status === 'at_risk').length;

  return {
    objectives,
    loading,
    error,
    totalObjectives,
    achievedObjectives,
    atRiskObjectives,
    refetch: fetchObjectives,
  };
};

// Hook for CRUD operations on objectives
interface UseObjectiveActionsReturn {
  submitting: boolean;
  createObjective: (data: CreateObjectivePayload) => Promise<boolean>;
  updateObjective: (id: string, data: UpdateObjectivePayload) => Promise<boolean>;
  updateProgress: (id: string, achieved: number) => Promise<boolean>;
  deleteObjective: (id: string) => Promise<boolean>;
}

export const useObjectiveActions = (onSuccess?: () => void): UseObjectiveActionsReturn => {
  const [submitting, setSubmitting] = useState(false);

  const createObjective = useCallback(async (data: CreateObjectivePayload): Promise<boolean> => {
    setSubmitting(true);
    try {
      await performanceService.createObjective(data);
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      console.error('Error creating objective:', err);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [onSuccess]);

  const updateObjective = useCallback(async (id: string, data: UpdateObjectivePayload): Promise<boolean> => {
    setSubmitting(true);
    try {
      await performanceService.updateObjective(id, data);
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      console.error('Error updating objective:', err);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [onSuccess]);

  const updateProgress = useCallback(async (id: string, achieved: number): Promise<boolean> => {
    setSubmitting(true);
    try {
      await performanceService.updateObjectiveProgress(id, achieved);
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      console.error('Error updating progress:', err);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [onSuccess]);

  const deleteObjective = useCallback(async (id: string): Promise<boolean> => {
    setSubmitting(true);
    try {
      await performanceService.deleteObjective(id);
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      console.error('Error deleting objective:', err);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [onSuccess]);

  return {
    submitting,
    createObjective,
    updateObjective,
    updateProgress,
    deleteObjective,
  };
};

// Helper hook for filtering objectives
export const useFilteredObjectives = (
  objectives: Objective[],
  searchQuery: string
) => {
  return objectives.filter(obj => 
    obj.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    obj.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
};

