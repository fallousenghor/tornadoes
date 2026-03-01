// Clock Component - AEVUM Enterprise ERP
// Beautiful clock with hour announcement - Theme Support

import React, { useState, useEffect, useCallback } from 'react';
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
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Size configurations
  const sizes = {
    small: { clock: 80, font: 16, label: 10 },
    medium: { clock: 120, font: 24, label: 14 },
    large: { clock: 180, font: 36, label: 18 },
  };

  const config = sizes[size];

  // Time formatting
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  const secondsString = seconds.toString().padStart(2, '0');

  // Date formatting
  const dateString = time.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Announce time function using Web Speech API
  const announceTime = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const hourText = hours === 0 ? 'minuit' : 
                       hours === 1 ? 'une heure' : 
                       hours === 12 ? 'midi' : 
                       `${hours} heures`;
      
      const minuteText = minutes === 0 ? '' : 
                         minutes === 1 ? 'une minute' : 
                         `${minutes} minutes`;

      let announcement = '';
      if (minutes === 0) {
        announcement = `Il est ${hourText} précises`;
      } else {
        announcement = `Il est ${hourText} et ${minuteText}`;
      }

      const utterance = new SpeechSynthesisUtterance(announcement);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.9;
      utterance.pitch = 1;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  }, [hours, minutes]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Announce time at the start of each hour
  useEffect(() => {
    if (minutes === 0 && seconds === 0) {
      announceTime();
    }
  }, [minutes, seconds, announceTime]);

  const handleAnnounce = () => {
    announceTime();
  };

  // Calculate clock hand angles
  const secondAngle = seconds * 6;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = hours * 30 + minutes * 0.5;

  // Dark clock background for both themes (looks better)
  const clockBg = mode === 'light' 
    ? 'linear-gradient(145deg, #1a1d2e, #12141f)'
    : 'linear-gradient(145deg, #1a1d2e, #0f1219)';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12,
      padding: 16,
      background: colors.card,
      border: `1px solid ${colors.border}`,
      borderRadius: BorderRadius.xxl,
    }}>
      {/* Clock Face */}
      <div style={{
        width: config.clock,
        height: config.clock,
        borderRadius: '50%',
        background: clockBg,
        border: `3px solid ${colors.primary}`,
        boxShadow: `0 0 20px ${colors.primary}33, inset 0 0 30px rgba(0,0,0,0.5)`,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Hour markers */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: i % 3 === 0 ? 8 : 4,
              height: i % 3 === 0 ? 12 : 6,
              background: i % 3 === 0 ? colors.primary : colors.textMuted,
              borderRadius: 2,
              top: 8,
              transformOrigin: 'center',
              transform: `rotate(${i * 30}deg) translateY(-${config.clock / 2 - 15}px)`,
            }}
          />
        ))}

        {/* Hour hand */}
        <div style={{
          position: 'absolute',
          width: 4,
          height: config.clock * 0.25,
          background: colors.primary,
          borderRadius: 2,
          top: '25%',
          transformOrigin: 'center bottom',
          transform: `rotate(${hourAngle}deg)`,
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        }} />
        
        {/* Minute hand */}
        <div style={{
          position: 'absolute',
          width: 3,
          height: config.clock * 0.35,
          background: colors.textSecondary,
          borderRadius: 2,
          top: '15%',
          transformOrigin: 'center bottom',
          transform: `rotate(${minuteAngle}deg)`,
          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        }} />
        
        {/* Second hand */}
        <div style={{
          position: 'absolute',
          width: 1,
          height: config.clock * 0.4,
          background: colors.danger,
          borderRadius: 1,
          top: '10%',
          transformOrigin: 'center bottom',
          transform: `rotate(${secondAngle}deg)`,
        }} />
        
        {/* Center dot */}
        <div style={{
          position: 'absolute',
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: colors.primary,
          boxShadow: `0 0 10px ${colors.primary}`,
        }} />
      </div>

      {/* Digital time display */}
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 4,
      }}>
        <span style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: config.font,
          fontWeight: 700,
          color: colors.text,
        }}>
          {timeString}
        </span>
        <span style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: config.label,
          color: colors.danger,
          fontWeight: 600,
        }}>
          {secondsString}
        </span>
      </div>

      {/* Date display */}
      {showDate && (
        <div style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: config.label,
          color: colors.textMuted,
          textTransform: 'capitalize',
        }}>
          {dateString}
        </div>
      )}

      {/* Announce button */}
      <button
        onClick={handleAnnounce}
        disabled={isSpeaking}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 16px',
          background: isSpeaking ? colors.primaryMuted : colors.primaryMuted,
          border: `1px solid ${colors.primaryMuted}`,
          borderRadius: BorderRadius.lg,
          color: colors.primary,
          fontSize: config.label,
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 500,
          cursor: isSpeaking ? 'default' : 'pointer',
          transition: 'all 0.2s',
        }}
      >
        <span style={{ fontSize: 14 }}>🔊</span>
        {isSpeaking ? 'Annonce en cours...' : 'Annoncer l\'heure'}
      </button>

      {/* Speaking indicator */}
      {isSpeaking && (
        <div style={{
          display: 'flex',
          gap: 3,
          alignItems: 'center',
        }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 4,
                height: 12,
                background: colors.primary,
                borderRadius: 2,
                animation: `soundWave 0.5s ease-in-out infinite`,
                animationDelay: `${i * 0.15}s`,
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes soundWave {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1); }
        }
      `}</style>
    </div>
  );
};

export default Clock;

