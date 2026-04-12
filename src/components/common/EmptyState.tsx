// EmptyState Component - AEVUM Enterprise ERP
// Professional Empty State with Icon, Message and Actions

import React from 'react';
import { Spacing, FontSizes, FontWeights, BorderRadius } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className = '',
  style,
}) => {
  const { colors } = useTheme();

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xxxl * 3,
    textAlign: 'center',
    ...style,
  };

  const iconContainerStyle: React.CSSProperties = {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    background: colors.bgSecondary,
    border: `1px solid ${colors.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.semibold,
    color: colors.text,
    marginBottom: Spacing.sm,
  };

  const descriptionStyle: React.CSSProperties = {
    fontSize: FontSizes.md,
    color: colors.textSecondary,
    maxWidth: 480,
    marginBottom: Spacing.xl,
    lineHeight: 1.5,
  };

  const actionsStyle: React.CSSProperties = {
    display: 'flex',
    gap: Spacing.md,
  };

  return (
    <div style={containerStyle} className={className}>
      {icon && (
        <div style={iconContainerStyle}>
          {React.isValidElement(icon) 
            ? React.cloneElement(icon as React.ReactElement<any>, { 
                size: 36, 
                color: colors.textMuted 
              })
            : icon
          }
        </div>
      )}
      
      <h3 style={titleStyle}>{title}</h3>
      
      {description && <p style={descriptionStyle}>{description}</p>}
      
      {(actionLabel || secondaryActionLabel) && (
        <div style={actionsStyle}>
          {secondaryActionLabel && (
            <Button
              variant="secondary"
              onClick={onSecondaryAction}
            >
              {secondaryActionLabel}
            </Button>
          )}
          {actionLabel && (
            <Button
              variant="primary"
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
