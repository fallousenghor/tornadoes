// Theme Toggle Component - AEVUM Enterprise ERP
// Switch between light and dark mode

import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { mode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: 10,
        border: '1px solid var(--color-border)',
        background: 'var(--color-bg-secondary)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontSize: 18,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--color-hover)';
        e.currentTarget.style.borderColor = 'var(--color-primary)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--color-bg-secondary)';
        e.currentTarget.style.borderColor = 'var(--color-border)';
      }}
      title={mode === 'light' ? 'Passer en mode sombre' : 'Passer en mode clair'}
    >
      {mode === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle;

