// Nullable Value Formatter - Utility for handling missing or null data
// Provides consistent formatting for null/undefined/empty values

/**
 * Format a nullable value with appropriate fallback
 * @param value - The value to format
 * @param fallback - The fallback value (default: '-')
 * @returns Formatted value
 */
export const formatNullableValue = (
  value: string | null | undefined,
  fallback: string = '-'
): string => {
  if (!value || value.trim() === '') {
    return fallback;
  }
  return value.trim();
};

/**
 * Format a reviewer name with special handling for unassigned reviewers
 * @param reviewerName - The reviewer name
 * @returns Formatted reviewer name
 */
export const formatReviewerName = (reviewerName: string | null | undefined): string => {
  if (!reviewerName || reviewerName.trim() === '') {
    return 'Non assigné';
  }
  return reviewerName.trim();
};

/**
 * Get style for nullable fields (highlight if missing)
 * @param value - The value to check
 * @returns Style object
 */
export const getNullableFieldStyle = (
  value: string | null | undefined,
  normalColor: string,
  missingColor: string = '#f59e0b'
) => {
  const isEmpty = !value || value.trim() === '';
  return {
    color: isEmpty ? missingColor : normalColor,
    fontStyle: isEmpty ? 'italic' as const : 'normal' as const,
  };
};

/**
 * Format employee or department name
 * @param name - The name to format
 * @returns Formatted name with fallback
 */
export const formatEntityName = (
  name: string | null | undefined
): string => {
  return formatNullableValue(name, '-');
};

/**
 * Check if a value is missing or null
 * @param value - The value to check
 * @returns true if missing
 */
export const isMissing = (value: string | null | undefined): boolean => {
  return !value || value.trim() === '';
};
