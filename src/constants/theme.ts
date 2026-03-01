// Theme Constants - AEVUM Enterprise ERP
// Corporate Professional Color Palette - B2B SaaS Design System
// =============================================================
// Primary: #1E3A8A (Bleu foncé corporate)
// Secondary: #2563EB
// Success: #16A34A
// Warning: #F59E0B
// Danger: #DC2626
// Background: #F9FAFB
// Surface: #FFFFFF
// Text: #1F2937
// Text Secondary: #4B5563
// Border: #E5E7EB

export const Colors = {
  // ===========================================
  // PRIMARY BRAND COLORS - Corporate Blue
  // ===========================================
  primary: '#1E3A8A',
  primaryLight: '#2563EB',
  primaryLighter: '#3B82F6',
  primaryMuted: 'rgba(30, 58, 138, 0.1)',
  primaryMutedBg: 'rgba(30, 58, 138, 0.08)',
  
  // Secondary
  secondary: '#2563EB',
  secondaryMuted: 'rgba(37, 99, 235, 0.1)',
  
  // ===========================================
  // STATUS COLORS
  // ===========================================
  // Success - Professional Green
  success: '#16A34A',
  successLight: '#22C55E',
  successMuted: 'rgba(22, 163, 74, 0.1)',
  successBg: 'rgba(22, 163, 74, 0.08)',
  
  // Warning - Amber/Orange
  warning: '#F59E0B',
  warningLight: '#FBBF24',
  warningMuted: 'rgba(245, 158, 11, 0.1)',
  warningBg: 'rgba(245, 158, 11, 0.08)',
  
  // Danger - Red
  danger: '#DC2626',
  dangerLight: '#EF4444',
  dangerMuted: 'rgba(220, 38, 38, 0.1)',
  dangerBg: 'rgba(220, 38, 38, 0.08)',
  
  // Info - Blue
  info: '#0EA5E9',
  infoMuted: 'rgba(14, 165, 233, 0.1)',
  
  // Neutral / Purple for variety
  purple: '#8B5CF6',
  purpleMuted: 'rgba(139, 92, 246, 0.1)',
  
  // ===========================================
  // BACKGROUND & SURFACE
  // ===========================================
  // Main backgrounds
  bg: '#F9FAFB',
  bgSecondary: '#F3F4F6',
  bgTertiary: '#E5E7EB',
  
  // Surface (Cards, panels)
  card: '#FFFFFF',
  cardHover: '#F9FAFB',
  surface: '#FFFFFF',
  
  // Input backgrounds
  input: '#FFFFFF',
  inputBg: '#F9FAFB',
  
  // Header
  header: '#FFFFFF',
  
  // ===========================================
  // TEXT COLORS
  // ===========================================
  // Primary text - High contrast for readability
  text: '#1F2937',
  textPrimary: '#1F2937',
  
  // Secondary text
  textSecondary: '#4B5563',
  textMuted: '#6B7280',
  textLight: '#9CA3AF',
  
  // Inverse/Light text (for dark backgrounds)
  textInverse: '#FFFFFF',
  textInverseMuted: 'rgba(255, 255, 255, 0.8)',
  
  // ===========================================
  // BORDER COLORS
  // ===========================================
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderDark: '#D1D5DB',
  
  // Focus/Active borders
  focus: '#2563EB',
  focusRing: 'rgba(37, 99, 235, 0.4)',
  
  // ===========================================
  // LEGACY COMPATIBILITY - Mapped to new palette
  // ===========================================
  // Legacy accent colors (for backward compatibility)
  accent: '#1E3A8A',
  accentLight: '#2563EB',
  accentMuted: 'rgba(30, 58, 138, 0.1)',
  
  // Legacy status colors (mapped to new palette)
  gold: '#D97706',
  green: '#16A34A',
  greenMuted: 'rgba(22, 163, 74, 0.1)',
  red: '#DC2626',
  redMuted: 'rgba(220, 38, 38, 0.1)',
  teal: '#0D9488',
  orange: '#F97316',
  orangeMuted: 'rgba(249, 115, 22, 0.1)',
  
  // Legacy text colors (already defined above - kept for compatibility)
  textDim: '#9CA3AF',
  textDark: '#374151',
  textDark2: '#4B5563',
  textMutedLegacy: '#6B7280',
  
  // ===========================================
  // HOVER & INTERACTION STATES
  // ===========================================
  hover: 'rgba(30, 58, 138, 0.05)',
  hoverLight: 'rgba(30, 58, 138, 0.03)',
  active: 'rgba(30, 58, 138, 0.1)',
  
  // ===========================================
  // SIDEBAR GRADIENT (Professional subtle)
  // ===========================================
  sidebarGradient: 'linear-gradient(180deg, #1E3A8A 0%, #1E40AF 50%, #1D4ED8 100%)',
  sidebarGradientSubtle: 'linear-gradient(180deg, #1E3A8A 0%, #1E3A8A 100%)',
  sidebarBg: '#1E3A8A',
  sidebarText: '#FFFFFF',
  sidebarTextMuted: 'rgba(255, 255, 255, 0.7)',
  sidebarBorder: 'rgba(255, 255, 255, 0.1)',
  
  // ===========================================
  // SHADOWS
  // ===========================================
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowLight: 'rgba(0, 0, 0, 0.05)',
  shadowMedium: 'rgba(0, 0, 0, 0.1)',
  shadowHeavy: 'rgba(0, 0, 0, 0.15)',
} as const;

// ===========================================
// SPACING SYSTEM
// ===========================================
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

// ===========================================
// BORDER RADIUS
// ===========================================
export const BorderRadius = {
  sm: 4,
  md: 6,
  lg: 8,
  xl: 10,
  xxl: 14,
  full: 9999,
} as const;

// ===========================================
// FONT SIZES - Optimized for B2B readability
// ===========================================
export const FontSizes = {
  xs: 11,
  sm: 12,
  md: 13,
  lg: 14,
  xl: 15,
  xxl: 16,
  xxxl: 18,
  title: 20,
  hero: 24,
} as const;

// ===========================================
// FONT FAMILIES
// ===========================================
export const FontFamilies = {
  display: "'DM Serif Display', Georgia, serif",
  body: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
} as const;

// ===========================================
// SHADOWS - Professional subtle shadows
// ===========================================
export const Shadows = {
  card: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  cardHover: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  cardElevated: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  button: '0 1px 2px rgba(0, 0, 0, 0.05)',
  input: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
  accent: '0 4px 14px rgba(30, 58, 138, 0.25)',
  glow: (color: string) => `0 0 8px ${color}40`,
} as const;

// ===========================================
// TRANSITIONS
// ===========================================
export const Transitions = {
  fast: '0.15s ease',
  normal: '0.2s ease',
  slow: '0.28s cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

// ===========================================
// LAYOUT DIMENSIONS
// ===========================================
export const Layout = {
  sidebarWidth: 260,
  sidebarCollapsed: 72,
  headerHeight: 64,
} as const;

// ===========================================
// CARD STYLES
// ===========================================
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
  flat: {
    background: Colors.card,
    border: 'none',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
};

// ===========================================
// BUTTON STYLES
// ===========================================
export const ButtonStyles = {
  primary: {
    background: Colors.primary,
    color: Colors.textInverse,
    border: 'none',
    borderRadius: BorderRadius.lg,
    padding: `${Spacing.sm}px ${Spacing.lg}px`,
    fontSize: FontSizes.md,
    fontFamily: FontFamilies.body,
    fontWeight: 500,
    cursor: 'pointer',
    boxShadow: Shadows.button,
  },
  primaryOutline: {
    background: 'transparent',
    color: Colors.primary,
    border: `1px solid ${Colors.primary}`,
    borderRadius: BorderRadius.lg,
    padding: `${Spacing.sm}px ${Spacing.lg}px`,
    fontSize: FontSizes.md,
    fontFamily: FontFamilies.body,
    fontWeight: 500,
    cursor: 'pointer',
  },
  secondary: {
    background: Colors.bgSecondary,
    color: Colors.textPrimary,
    border: `1px solid ${Colors.border}`,
    borderRadius: BorderRadius.lg,
    padding: `${Spacing.sm}px ${Spacing.lg}px`,
    fontSize: FontSizes.md,
    fontFamily: FontFamilies.body,
    fontWeight: 500,
    cursor: 'pointer',
  },
  ghost: {
    background: 'transparent',
    color: Colors.textSecondary,
    border: 'none',
    borderRadius: BorderRadius.md,
    padding: `${Spacing.xs}px ${Spacing.sm}px`,
    fontSize: FontSizes.sm,
    fontFamily: FontFamilies.body,
    cursor: 'pointer',
  },
  danger: {
    background: Colors.danger,
    color: Colors.textInverse,
    border: 'none',
    borderRadius: BorderRadius.lg,
    padding: `${Spacing.sm}px ${Spacing.lg}px`,
    fontSize: FontSizes.md,
    fontFamily: FontFamilies.body,
    fontWeight: 500,
    cursor: 'pointer',
  },
};

// ===========================================
// CHART COLORS - Professional palette
// ===========================================
export const ChartColors = {
  primary: Colors.primary,
  primaryLight: Colors.primaryLight,
  success: Colors.success,
  successLight: Colors.successLight,
  danger: Colors.danger,
  dangerLight: Colors.dangerLight,
  warning: Colors.warning,
  warningLight: Colors.warningLight,
  info: Colors.info,
  purple: Colors.purple,
  teal: Colors.teal,
  gold: Colors.gold,
  
  // Chart palette for graphs
  palette: [
    '#1E3A8A', // Primary
    '#16A34A', // Success
    '#F59E0B', // Warning
    '#DC2626', // Danger
    '#8B5CF6', // Purple
    '#0EA5E9', // Info
    '#10B981', // Emerald
    '#F97316', // Orange
  ],
} as const;

// ===========================================
// STATUS COLORS
// ===========================================
export const StatusColors = {
  success: Colors.success,
  successBg: Colors.successBg,
  warning: Colors.warning,
  warningBg: Colors.warningBg,
  danger: Colors.danger,
  dangerBg: Colors.dangerBg,
  info: Colors.info,
  infoBg: Colors.infoMuted,
  primary: Colors.primary,
  primaryBg: Colors.primaryMuted,
  purple: Colors.purple,
  purpleBg: Colors.purpleMuted,
} as const;

// ===========================================
// ANIMATIONS
// ===========================================
export const Animations = {
  shimmer: `
    background: linear-gradient(90deg, transparent, rgba(30,58,138,0.05), transparent);
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

// ===========================================
// TOOLTIP STYLES
// ===========================================
export const TooltipStyles = {
  contentStyle: {
    background: Colors.card,
    border: `1px solid ${Colors.border}`,
    borderRadius: BorderRadius.lg,
    fontSize: FontSizes.sm,
    fontFamily: FontFamilies.body,
    boxShadow: Shadows.cardElevated,
  },
  labelStyle: { color: Colors.primary },
  itemStyle: { color: Colors.textPrimary },
  cursor: { fill: 'rgba(30, 58, 138, 0.05)' },
} as const;

// ===========================================
// INPUT STYLES
// ===========================================
export const InputStyles = {
  default: {
    background: Colors.inputBg,
    border: `1px solid ${Colors.border}`,
    borderRadius: BorderRadius.lg,
    padding: `${Spacing.sm}px ${Spacing.md}px`,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
    fontFamily: FontFamilies.body,
    transition: Transitions.fast,
  },
  focus: {
    borderColor: Colors.focus,
    boxShadow: `0 0 0 3px ${Colors.focusRing}`,
    outline: 'none',
  },
  error: {
    borderColor: Colors.danger,
    boxShadow: `0 0 0 3px ${Colors.dangerMuted}`,
  },
} as const;

// ===========================================
// TABLE STYLES
// ===========================================
export const TableStyles = {
  header: {
    background: Colors.bgSecondary,
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
  },
  row: {
    background: Colors.card,
    borderBottom: `1px solid ${Colors.borderLight}`,
    transition: Transitions.fast,
  },
  rowHover: {
    background: Colors.bgSecondary,
  },
  cell: {
    padding: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.textPrimary,
  },
} as const;

// ===========================================
// EXPORT DEFAULT
// ===========================================
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
  InputStyles,
  TableStyles,
};

