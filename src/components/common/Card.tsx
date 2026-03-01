// Card Component - AEVUM Enterprise ERP
// Corporate Professional Card Component

import React from 'react';
import { Colors, BorderRadius, Shadows, Transitions, Spacing } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
  variant?: 'default' | 'elevated' | 'flat';
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hoverable = false,
  onClick,
  style,
  variant = 'default',
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'elevated':
        return {
          background: Colors.card,
          border: 'none',
          borderRadius: BorderRadius.xxl,
          padding: Spacing.xxl,
          boxShadow: Shadows.card,
        };
      case 'flat':
        return {
          background: Colors.card,
          border: 'none',
          borderRadius: BorderRadius.lg,
          padding: Spacing.lg,
        };
      default:
        return {
          background: Colors.card,
          border: `1px solid ${Colors.border}`,
          borderRadius: BorderRadius.xxl,
          padding: Spacing.xxl,
        };
    }
  };

  const baseStyle: React.CSSProperties = {
    ...getVariantStyles(),
    transition: Transitions.normal,
    transform: isHovered && hoverable ? 'translateY(-2px)' : 'none',
    boxShadow: isHovered && hoverable 
      ? Shadows.cardHover 
      : (variant === 'elevated' ? Shadows.card : (variant === 'default' ? Shadows.card : 'none')),
    cursor: onClick ? 'pointer' : 'default',
    ...style,
  };

  return (
    <div 
      className={`card-h ${className}`}
      style={baseStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </div>
  );
};

export default Card;

