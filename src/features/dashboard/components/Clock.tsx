// Clock Component - AEVUM Enterprise ERP
// Beautiful professional clock with elegant design - Theme Support

import React, { useState, useEffect } from 'react';
import { BorderRadius } from '../../../constants/theme';
import { useTheme } from '../../../contexts/ThemeContext';

interface ClockProps {
  showDate?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const Clock: React.FC<ClockProps> = ({ 
  showDate = true, 
  size = 'medium' 
}) => {
  const { colors, mode } = useTheme();
  const [time, setTime] = useState(new Date());

  // Size configurations
  const sizes = {
    small: { clock: 70, font: 16, label: 9 },
    medium: { clock: 100, font: 22, label: 11 },
    large: { clock: 140, font: 30, label: 13 },
  };

  const config = sizes[size];

  // Time formatting
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  
  // 12-hour format with AM/PM
  const hours12 = hours % 12 || 12;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const timeString = `${hours12.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  const secondsString = seconds.toString().padStart(2, '0');

  // Date formatting
  const dateString = time.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

  // Get time-based greeting
  const getGreeting = () => {
    if (hours < 12) return 'Bonjour';
    if (hours < 18) return 'Bonne après-midi';
    return 'Bonsoir';
  };

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate clock hand angles
  const secondAngle = seconds * 6;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = hours * 30 + minutes * 0.5;

  // Color scheme - elegant dark theme
  const clockBg = mode === 'light' 
    ? 'linear-gradient(135deg, #2d3436 0%, #1e272e 100%)'
    : 'linear-gradient(135deg, #1e272e 0%, #0f1315 100%)';

  // Clock hand center offset (radius where hands connect)
  const handRadius = config.clock * 0.08;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: config.clock > 100 ? 14 : 10,
      background: colors.card,
      border: `1px solid ${colors.border}`,
      borderRadius: BorderRadius.lg,
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      minWidth: config.clock + 20,
    }}>
      {/* Greeting */}
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: config.label,
        fontWeight: 600,
        color: colors.primary,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginBottom: 6,
      }}>
        {getGreeting()}
      </div>

      {/* Clock Face - Analog */}
      <div style={{
        width: config.clock,
        height: config.clock,
        borderRadius: '50%',
        background: clockBg,
        border: `2px solid ${colors.primary}40`,
        boxShadow: `
          0 0 0 4px ${colors.primary}15,
          0 8px 32px rgba(0,0,0,0.3),
          inset 0 0 60px rgba(0,0,0,0.4)
        `,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
      }}>
        {/* Hour markers */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: i % 3 === 0 ? 6 : 3,
              height: i % 3 === 0 ? 10 : 5,
              background: i % 3 === 0 ? colors.primary : colors.textMuted,
              borderRadius: 2,
              top: 6,
              transformOrigin: 'center',
              transform: `rotate(${i * 30}deg) translateY(-${config.clock / 2 - 12}px)`,
            }}
          />
        ))}

        {/* All hands from center - using transform rotate from center */}
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {/* Hour hand */}
          <div style={{
            position: 'absolute',
            width: 4,
            height: config.clock * 0.22,
            background: 'linear-gradient(180deg, #fff 0%, #ccc 100%)',
            borderRadius: 2,
            top: '50%',
            left: '50%',
            marginTop: -handRadius,
            marginLeft: -2,
            transformOrigin: `center ${handRadius}px`,
            transform: `rotate(${hourAngle}deg)`,
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            zIndex: 3,
          }} />
          
          {/* Minute hand */}
          <div style={{
            position: 'absolute',
            width: 3,
            height: config.clock * 0.30,
            background: 'linear-gradient(180deg, #fff 0%, #ddd 100%)',
            borderRadius: 2,
            top: '50%',
            left: '50%',
            marginTop: -handRadius,
            marginLeft: -1.5,
            transformOrigin: `center ${handRadius}px`,
            transform: `rotate(${minuteAngle}deg)`,
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
            zIndex: 4,
          }} />
          
          {/* Second hand */}
          <div style={{
            position: 'absolute',
            width: 1,
            height: config.clock * 0.35,
            background: colors.danger,
            borderRadius: 1,
            top: '50%',
            left: '50%',
            marginTop: -handRadius,
            marginLeft: -0.5,
            transformOrigin: `center ${handRadius}px`,
            transform: `rotate(${secondAngle}deg)`,
            boxShadow: '0 0 4px rgba(239, 68, 68, 0.5)',
            zIndex: 5,
          }} />
        </div>
        
        {/* Center dot */}
        <div style={{
          position: 'absolute',
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${colors.primary} 0%, ${colors.primary}99 100%)`,
          boxShadow: `0 0 10px ${colors.primary}`,
          zIndex: 10,
        }} />
      </div>

      {/* Digital time display */}
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 4,
        marginBottom: 4,
      }}>
        <span style={{
          fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
          fontSize: config.font,
          fontWeight: 700,
          color: colors.text,
          letterSpacing: '0.05em',
        }}>
          {timeString}
        </span>
        <span style={{
          fontFamily: "'JetBrains Mono', 'SF Mono', monospace",
          fontSize: config.label + 2,
          color: colors.danger,
          fontWeight: 600,
        }}>
          {secondsString}
        </span>
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: config.label - 1,
          color: colors.textMuted,
          fontWeight: 500,
          marginLeft: 4,
        }}>
          {ampm}
        </span>
      </div>

      {/* Date display */}
      {showDate && (
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: config.label,
          color: colors.textMuted,
          textTransform: 'capitalize',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          <span style={{ fontSize: config.label + 2 }}>📅</span>
          {dateString}
        </div>
      )}
    </div>
  );
};

export default Clock;

