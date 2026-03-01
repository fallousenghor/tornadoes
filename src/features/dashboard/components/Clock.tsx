// Clock Component - AEVUM Enterprise ERP
// Beautiful clock with hour announcement using Web Speech API

import React, { useState, useEffect, useCallback } from 'react';
import { Colors, BorderRadius } from '../../../constants/theme';

interface ClockProps {
  showDate?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const Clock: React.FC<ClockProps> = ({ 
  showDate = true, 
  size = 'medium' 
}) => {
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
      // Stop any current speech
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

  // Manual announce button click
  const handleAnnounce = () => {
    announceTime();
  };

  // Calculate clock hand angles
  const secondAngle = seconds * 6;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = hours * 30 + minutes * 0.5;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 12,
      padding: 16,
      background: Colors.card,
      border: `1px solid ${Colors.border}`,
      borderRadius: BorderRadius.xxl,
    }}>
      {/* Clock Face */}
      <div style={{
        width: config.clock,
        height: config.clock,
        borderRadius: '50%',
        background: `linear-gradient(145deg, #1a1d2e, #12141f)`,
        border: `3px solid ${Colors.accent}`,
        boxShadow: `0 0 20px ${Colors.accent}33, inset 0 0 30px rgba(0,0,0,0.5)`,
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
              background: i % 3 === 0 ? Colors.accent : Colors.textMuted,
              borderRadius: 2,
              top: 8,
              transformOrigin: 'center',
              transform: `rotate(${i * 30}deg) translateY(-${config.clock / 2 - 15}px)`,
            }}
          />
        ))}

        {/* Clock hands */}
        {/* Hour hand */}
        <div style={{
          position: 'absolute',
          width: 4,
          height: config.clock * 0.25,
          background: Colors.accent,
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
          background: Colors.textLight,
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
          background: Colors.red,
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
          background: Colors.accent,
          boxShadow: `0 0 10px ${Colors.accent}`,
        }} />
      </div>

      {/* Digital time display */}
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: 4,
      }}>
        <span style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: config.font,
          fontWeight: 700,
          color: Colors.text,
        }}>
          {timeString}
        </span>
        <span style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: config.label,
          color: Colors.red,
          fontWeight: 600,
        }}>
          {secondsString}
        </span>
      </div>

      {/* Date display */}
      {showDate && (
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: config.label,
          color: Colors.textMuted,
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
          background: isSpeaking ? 'rgba(100, 140, 255, 0.1)' : 'rgba(100, 140, 255, 0.15)',
          border: `1px solid ${Colors.accent}44`,
          borderRadius: BorderRadius.lg,
          color: Colors.accent,
          fontSize: config.label,
          fontFamily: "'DM Sans', sans-serif",
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
                background: Colors.accent,
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

