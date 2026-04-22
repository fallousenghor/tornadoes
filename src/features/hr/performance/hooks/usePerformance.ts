// Performance Hooks - Business Logic for Performance Reviews
// Hooks for fetching, creating, updating and deleting performance reviews

import { useState, useEffect, useCallback } from 'react';
import performanceService from '../../../../services/performanceService';
import type {
  PerformanceReview,
  PerformanceStats,
  RatingDistributionItem,
  CreateReviewPayload,
  UpdateReviewPayload
} from '../types';

interface UsePerformanceReviewsOptions {
  pageSize?: number;
}

interface UsePerformanceReviewsReturn {
  reviews: PerformanceReview[];
  loading: boolean;
  error: string | null;
  stats: PerformanceStats;
  ratingDistribution: RatingDistributionItem[];
  refetch: () => void;
}

export const usePerformanceReviews = (options: UsePerformanceReviewsOptions = {}): UsePerformanceReviewsReturn => {
  const { pageSize = 100 } = options;
  
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await performanceService.getPerformanceReviews({ pageSize });
      setReviews(response.data || []);
    } catch (err: unknown) {
      console.error('Error fetching performance reviews:', err);
      setError('Erreur lors du chargement des évaluations');
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [pageSize]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Calculate statistics
  const stats: PerformanceStats = {
    totalReviews: reviews.length,
    avgRating: reviews.length > 0 
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '0.0',
    excellentReviews: reviews.filter(r => r.rating >= 4).length,
    pendingReviews: reviews.filter(r => r.status === 'pending' || r.status === 'in_progress').length,
    totalObjectives: 0,
    achievedObjectives: 0,
    atRiskObjectives: 0,
  };

  // Rating distribution
  const ratingDistribution: RatingDistributionItem[] = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: reviews.filter(r => r.rating === rating).length,
    percentage: stats.totalReviews > 0 
      ? (reviews.filter(r => r.rating === rating).length / stats.totalReviews) * 100 
      : 0,
  }));

  return {
    reviews,
    loading,
    error,
    stats,
    ratingDistribution,
    refetch: fetchReviews,
  };
};

// Hook for CRUD operations on performance reviews
interface UseReviewActionsReturn {
  submitting: boolean;
  createReview: (data: CreateReviewPayload) => Promise<boolean>;
  updateReview: (id: string, data: UpdateReviewPayload) => Promise<boolean>;
  deleteReview: (id: string) => Promise<boolean>;
}

export const useReviewActions = (onSuccess?: () => void): UseReviewActionsReturn => {
  const [submitting, setSubmitting] = useState(false);

  const createReview = useCallback(async (data: CreateReviewPayload): Promise<boolean> => {
    setSubmitting(true);
    try {
      await performanceService.createPerformanceReview(data);
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      console.error('Error creating review:', err);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [onSuccess]);

  const updateReview = useCallback(async (id: string, data: UpdateReviewPayload): Promise<boolean> => {
    setSubmitting(true);
    try {
      await performanceService.updatePerformanceReview(id, data);
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      console.error('Error updating review:', err);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [onSuccess]);

  const deleteReview = useCallback(async (id: string): Promise<boolean> => {
    setSubmitting(true);
    try {
      await performanceService.deletePerformanceReview(id);
      onSuccess?.();
      return true;
    } catch (err: unknown) {
      console.error('Error deleting review:', err);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [onSuccess]);

  return {
    submitting,
    createReview,
    updateReview,
    deleteReview,
  };
};

// Helper hook for filtering reviews
export const useFilteredReviews = (
  reviews: PerformanceReview[],
  searchQuery: string,
  ratingFilter: string,
  statusFilter: string
) => {
  return reviews.filter(review => {
    const matchesSearch = 
      review.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.period.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.reviewer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRating = ratingFilter === 'all' || review.rating === parseInt(ratingFilter);
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    
    return matchesSearch && matchesRating && matchesStatus;
  });
};
