// Card Component - AEVUM Enterprise ERP
// Reusable card with hover effects

import React from 'react';
import { Colors, BorderRadius, Shadows, Transitions, Spacing } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hoverable = false,
  onClick,
  style 
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const baseStyle: React.CSSProperties = {
    background: Colors.card,
    border: `1px solid ${Colors.border}`,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
    transition: Transitions.normal,
    transform: isHovered && hoverable ? 'translateY(-1px)' : 'none',
    boxShadow: isHovered && hoverable ? Shadows.cardHover : Shadows.card,
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

