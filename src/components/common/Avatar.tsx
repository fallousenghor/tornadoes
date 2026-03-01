// Avatar Component - AEVUM Enterprise ERP

import React from 'react';
import { Colors, BorderRadius } from '../../constants/theme';
import { getInitials } from '../../utils';

interface AvatarProps {
  name: string;
  color?: string;
  size?: number;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  color,
  size = 28,
  className = '',
}) => {
  const initials = getInitials(name);
  const bgColor = color || Colors.accent;

  const style: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
    flexShrink: 0,
    background: `${bgColor}22`,
    border: `1px solid ${bgColor}44`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: size * 0.35,
    fontWeight: 700,
    color: bgColor,
    fontFamily: "'DM Sans', sans-serif",
  };

  return (
    <div className={className} style={style}>
      {initials}
    </div>
  );
};

// Avatar with image support
interface AvatarWithImageProps {
  name: string;
  imageUrl?: string;
  color?: string;
  size?: number;
}

export const AvatarWithImage: React.FC<AvatarWithImageProps> = ({
  name,
  imageUrl,
  color,
  size = 28,
}) => {
  const [hasError, setHasError] = React.useState(false);
  const initials = getInitials(name);
  const bgColor = color || Colors.accent;

  const containerStyle: React.CSSProperties = {
    width: size,
    height: size,
    borderRadius: '50%',
    flexShrink: 0,
    overflow: 'hidden',
    background: `${bgColor}22`,
    border: `1px solid ${bgColor}44`,
  };

  const textStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: size * 0.35,
    fontWeight: 700,
    color: bgColor,
    fontFamily: "'DM Sans', sans-serif",
  };

  if (imageUrl && !hasError) {
    return (
      <div style={containerStyle}>
        <img
          src={imageUrl}
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={textStyle}>{initials}</div>
    </div>
  );
};

export default Avatar;

