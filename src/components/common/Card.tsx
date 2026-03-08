// Card Component - AEVUM Enterprise ERP
// Corporate Professional Theme - B2B SaaS Design System

import React from 'react';
import { Colors, BorderRadius, Shadows, Transitions, Spacing } from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
  variant?: 'default' | 'flat' | 'elevated';
}

// Helper function to safely render children and convert NaN/undefined to string
const safeRenderChildren = (children: React.ReactNode): React.ReactNode => {
  if (children === undefined || children === null) {
    return null;
  }
  
  // If children is a number (including NaN)
  if (typeof children === 'number') {
    // Check for NaN specifically
    if (Number.isNaN(children)) {
      return '0';
    }
    return children;
  }
  
  // If children is a string that might be "NaN"
  if (typeof children === 'string') {
    if (children === 'NaN' || children.trim() === '') {
      return '';
    }
    return children;
  }
  
  // If children is an array, recursively process each element
  if (Array.isArray(children)) {
    return children.map((child, index) => (
      <React.Fragment key={index}>{safeRenderChildren(child)}</React.Fragment>
    ));
  }
  
  return children;
};

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hoverable = false,
  onClick,
  style,
  variant = 'default',
}) => {
  const { colors } = useTheme();
  const [isHovered, setIsHovered] = React.useState(false);

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'flat':
        return {
          background: colors.card,
          border: 'none',
          borderRadius: BorderRadius.lg,
          padding: Spacing.lg,
        };
      case 'elevated':
        return {
          background: colors.card,
          border: `1px solid ${colors.border}`,
          borderRadius: BorderRadius.xxl,
          padding: Spacing.xxl,
          boxShadow: Shadows.cardElevated,
        };
      case 'default':
      default:
        return {
          background: colors.card,
          border: `1px solid ${colors.border}`,
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
      : (variant === 'elevated' ? Shadows.cardElevated : Shadows.card),
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
      {safeRenderChildren(children)}
    </div>
  );
};

export default Card;

