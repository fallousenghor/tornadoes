// Theme Constants - AEVUM Enterprise ERP
// Design tokens following the original color palette

export const Colors = {
  // Backgrounds
  bg: '#07080f',
  card: '#0c0d17',
  border: 'rgba(100,140,255,0.12)',
  
  // Primary
  accent: '#6490ff',
  accentLight: 'rgba(100,140,255,0.12)',
  accentMuted: 'rgba(100,140,255,0.08)',
  
  // Status
  gold: '#c9a84c',
  green: '#3ecf8e',
  greenMuted: 'rgba(62,207,142,0.1)',
  red: '#e05050',
  redMuted: 'rgba(224,80,80,0.1)',
  purple: '#a78bfa',
  purpleMuted: 'rgba(167,139,250,0.1)',
  orange: '#fb923c',
  orangeMuted: 'rgba(251,146,60,0.1)',
  teal: '#2dd4bf',
  
  // Text
  text: '#e2e8f8',
  textMuted: '#7a84a0',
  textDim: '#3a3f58',
  textLight: '#a0b0d0',
  textDark: '#2a2f45',
  textDark2: '#3a4560',
  
  // UI Elements
  input: '#0f1020',
  header: '#111320',
  hover: 'rgba(100,140,255,0.08)',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const BorderRadius = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 10,
  xxl: 14,
  full: 99,
} as const;

export const FontSizes = {
  xs: 8,
  sm: 9,
  md: 10,
  lg: 11,
  xl: 12,
  xxl: 14,
  xxxl: 16,
  title: 18,
  hero: 20,
} as const;

export const FontFamilies = {
  display: "'DM Serif Display', Georgia, serif",
  body: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
} as const;

export const Shadows = {
  card: '0 4px 20px rgba(0,0,0,0.3)',
  cardHover: '0 12px 40px rgba(0,0,0,0.5)',
  accent: '0 4px 16px rgba(100,140,255,0.4)',
  glow: (color: string) => `0 0 8px ${color}66`,
} as const;

export const Transitions = {
  fast: '0.15s ease',
  normal: '0.2s ease',
  slow: '0.28s cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export const Layout = {
  sidebarWidth: 320,
  sidebarCollapsed: 84,
  headerHeight: 58,
} as const;

// Card Styles
export const CardStyles = {
  default: {
    background: Colors.card,
    border: `1px solid ${Colors.border}`,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xxl,
  },
  hoverable: {
    transition: `transform ${Transitions.normal}, box-shadow ${Transitions.normal}`,
    cursor: 'pointer',
  },
};

// Button Styles
export const ButtonStyles = {
  primary: {
    background: Colors.accentMuted,
    color: Colors.accent,
    border: 'none',
    borderRadius: BorderRadius.lg,
    padding: `${Spacing.sm}px ${Spacing.lg}px`,
    fontSize: FontSizes.md,
    fontFamily: FontFamilies.body,
    cursor: 'pointer',
  },
  secondary: {
    background: 'transparent',
    color: Colors.textMuted,
    border: `1px solid ${Colors.border}`,
    borderRadius: BorderRadius.lg,
    padding: `${Spacing.sm}px ${Spacing.lg}px`,
    fontSize: FontSizes.md,
    fontFamily: FontFamilies.body,
    cursor: 'pointer',
  },
  ghost: {
    background: 'transparent',
    color: Colors.textMuted,
    border: 'none',
    borderRadius: BorderRadius.md,
    padding: `${Spacing.xs}px ${Spacing.sm}px`,
    fontSize: FontSizes.sm,
    fontFamily: FontFamilies.body,
    cursor: 'pointer',
  },
};

// Chart Colors
export const ChartColors = {
  primary: Colors.accent,
  success: Colors.green,
  danger: Colors.red,
  warning: Colors.orange,
  info: Colors.teal,
  purple: Colors.purple,
  gold: Colors.gold,
} as const;

// Status Colors
export const StatusColors = {
  success: Colors.green,
  warning: Colors.orange,
  danger: Colors.red,
  info: Colors.accent,
  purple: Colors.purple,
} as const;

// Animation Keyframes (CSS string)
export const Animations = {
  shimmer: `
    background: linear-gradient(90deg, transparent, rgba(100,140,255,0.03), transparent);
    background-size: 200%;
    animation: sh 4s infinite;
  `,
  pulse: `
    animation: p 2s infinite;
  `,
  upfade: `
    animation: upfade 0.5s ease forwards;
  `,
  stagger: `
    animation: si 0.4s ease forwards;
  `,
} as const;

// Tooltip Styles
export const TooltipStyles = {
  contentStyle: {
    background: Colors.card,
    border: `1px solid rgba(100,140,255,0.2)`,
    borderRadius: BorderRadius.lg,
    fontSize: FontSizes.sm,
    fontFamily: FontFamilies.body,
  },
  labelStyle: { color: Colors.accent },
  itemStyle: { color: Colors.textLight },
  cursor: { fill: 'rgba(100,140,255,0.05)' },
} as const;

export default {
  Colors,
  Spacing,
  BorderRadius,
  FontSizes,
  FontFamilies,
  Shadows,
  Transitions,
  Layout,
  CardStyles,
  ButtonStyles,
  ChartColors,
  StatusColors,
  Animations,
  TooltipStyles,
};

