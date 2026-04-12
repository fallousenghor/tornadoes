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

// CSS Variable-based colors for automatic theme support
// These will automatically use the correct colors based on the data-theme attribute
export const Colors = {
  // ===========================================
  // PRIMARY BRAND COLORS - Corporate Blue
  // ===========================================
  primary: 'var(--color-primary, #1E3A8A)',
  primaryLight: 'var(--color-primary-light, #2563EB)',
  primaryLighter: 'var(--color-primary-lighter, #3B82F6)',
  primaryMuted: 'var(--color-primary-muted, rgba(30, 58, 138, 0.1))',
  primaryMutedBg: 'var(--color-primary-muted-bg, rgba(30, 58, 138, 0.08))',
  
  // Secondary
  secondary: 'var(--color-secondary, #2563EB)',
  secondaryMuted: 'var(--color-secondary-muted, rgba(37, 99, 235, 0.1))',
  
  // ===========================================
  // STATUS COLORS
  // ===========================================
  // Success - Professional Green
  success: 'var(--color-success, #16A34A)',
  successLight: 'var(--color-success-light, #22C55E)',
  successMuted: 'var(--color-success-muted, rgba(22, 163, 74, 0.1))',
  successBg: 'var(--color-success-bg, rgba(22, 163, 74, 0.08))',
  
  // Warning - Amber/Orange
  warning: 'var(--color-warning, #F59E0B)',
  warningLight: 'var(--color-warning-light, #FBBF24)',
  warningMuted: 'var(--color-warning-muted, rgba(245, 158, 11, 0.1))',
  warningBg: 'var(--color-warning-bg, rgba(245, 158, 11, 0.08))',
  
  // Danger - Red
  danger: 'var(--color-danger, #DC2626)',
  dangerLight: 'var(--color-danger-light, #EF4444)',
  dangerMuted: 'var(--color-danger-muted, rgba(220, 38, 38, 0.1))',
  dangerBg: 'var(--color-danger-bg, rgba(220, 38, 38, 0.08))',
  
  // Info - Blue
  info: 'var(--color-info, #0EA5E9)',
  infoMuted: 'var(--color-info-muted, rgba(14, 165, 233, 0.1))',
  
  // Neutral / Purple for variety
  purple: 'var(--color-purple, #8B5CF6)',
  purpleMuted: 'var(--color-purple-muted, rgba(139, 92, 246, 0.1))',
  
  // ===========================================
  // BACKGROUND & SURFACE
  // ===========================================
  // Main backgrounds
  bg: 'var(--color-bg, #F9FAFB)',
  bgSecondary: 'var(--color-bg-secondary, #F3F4F6)',
  bgTertiary: 'var(--color-bg-tertiary, #E5E7EB)',
  bgLight: 'var(--color-bg-light, #FAFBFC)',
  
  // Surface (Cards, panels)
  card: 'var(--color-card, #FFFFFF)',
  cardHover: 'var(--color-card-hover, #F9FAFB)',
  surface: 'var(--color-surface, #FFFFFF)',
  
  // Input backgrounds
  input: 'var(--color-input, #FFFFFF)',
  inputBg: 'var(--color-input-bg, #F9FAFB)',
  
  // Header
  header: 'var(--color-header, #FFFFFF)',
  
  // ===========================================
  // TEXT COLORS
  // ===========================================
  // Primary text - High contrast for readability
  text: 'var(--color-text, #1F2937)',
  textPrimary: 'var(--color-text-primary, #1F2937)',
  
  // Secondary text
  textSecondary: 'var(--color-text-secondary, #4B5563)',
  textMuted: 'var(--color-text-muted, #6B7280)',
  textLight: 'var(--color-text-light, #9CA3AF)',
  
  // Inverse/Light text (for dark backgrounds)
  textInverse: 'var(--color-text-inverse, #FFFFFF)',
  textInverseMuted: 'var(--color-text-inverse-muted, rgba(255, 255, 255, 0.8))',
  
  // ===========================================
  // BORDER COLORS
  // ===========================================
  border: 'var(--color-border, #E5E7EB)',
  borderLight: 'var(--color-border-light, #F3F4F6)',
  borderDark: 'var(--color-border-dark, #D1D5DB)',
  
  // Focus/Active borders
  focus: 'var(--color-focus, #2563EB)',
  focusRing: 'var(--color-focus-ring, rgba(37, 99, 235, 0.4))',
  
  // ===========================================
  // LEGACY COMPATIBILITY - Mapped to new palette
  // ===========================================
  // Legacy accent colors (for backward compatibility)
  accent: 'var(--color-accent, #1E3A8A)',
  accentLight: 'var(--color-accent-light, #2563EB)',
  accentMuted: 'var(--color-accent-muted, rgba(30, 58, 138, 0.1))',
  
  // Legacy status colors (mapped to new palette)
  gold: 'var(--color-gold, #D97706)',
  green: 'var(--color-green, #16A34A)',
  greenMuted: 'var(--color-green-muted, rgba(22, 163, 74, 0.1))',
  red: 'var(--color-red, #DC2626)',
  redMuted: 'var(--color-red-muted, rgba(220, 38, 38, 0.1))',
  teal: 'var(--color-teal, #0D9488)',
  orange: 'var(--color-orange, #F97316)',
  orangeMuted: 'var(--color-orange-muted, rgba(249, 115, 22, 0.1))',
  
  // Legacy text colors (already defined above - kept for compatibility)
  textDim: 'var(--color-text-dim, #9CA3AF)',
  textDark: 'var(--color-text-dark, #374151)',
  textDark2: 'var(--color-text-dark2, #4B5563)',
  textMutedLegacy: 'var(--color-text-muted-legacy, #6B7280)',
  
  // ===========================================
  // HOVER & INTERACTION STATES
  // ===========================================
  hover: 'var(--color-hover, rgba(30, 58, 138, 0.05))',
  hoverLight: 'var(--color-hover-light, rgba(30, 58, 138, 0.03))',
  active: 'var(--color-active, rgba(30, 58, 138, 0.1))',
  
  // ===========================================
  // SIDEBAR GRADIENT (Professional subtle)
  // ===========================================
  sidebarGradient: 'var(--color-sidebar-gradient, linear-gradient(180deg, #1E3A8A 0%, #1E40AF 50%, #1D4ED8 100%))',
  sidebarGradientSubtle: 'var(--color-sidebar-gradient-subtle, linear-gradient(180deg, #1E3A8A 0%, #1E3A8A 100%))',
  sidebarBg: 'var(--color-sidebar-bg, #1E3A8A)',
  sidebarText: 'var(--color-sidebar-text, #FFFFFF)',
  sidebarTextMuted: 'var(--color-sidebar-text-muted, rgba(255, 255, 255, 0.7))',
  sidebarBorder: 'var(--color-sidebar-border, rgba(255, 255, 255, 0.1))',
  
  // ===========================================
  // SHADOWS
  // ===========================================
  shadow: 'var(--shadow-card, rgba(0, 0, 0, 0.1))',
  shadowLight: 'var(--shadow-card-light, rgba(0, 0, 0, 0.05))',
  shadowMedium: 'var(--shadow-card-medium, rgba(0, 0, 0, 0.1))',
  shadowHeavy: 'var(--shadow-card-heavy, rgba(0, 0, 0, 0.15))',
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
// FONT SIZES - Optimized for B2B Enterprise ERP
// Professional readability for prolonged daily use
// ===========================================
export const FontSizes = {
  // Base sizes
  xs: 11,      // Overline, tiny labels
  sm: 12,      // Small labels, badges
  base: 13,    // Table cells, secondary text
  md: 14,      // Body text (default)
  lg: 15,      // Large body, important text
  xl: 16,      // Lead text, large body
  xxl: 18,     // H4, card titles
  xxxl: 20,    // H3, subsection titles
  title: 24,   // H2, section titles
  hero: 32,    // H1, page titles
} as const;

// ===========================================
// FONT WEIGHTS - Optimal for readability
// ===========================================
export const FontWeights = {
  light: 300,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

// ===========================================
// LINE HEIGHTS - For optimal readability
// ===========================================
export const LineHeights = {
  tight: 1.2,   // Headings
  snug: 1.3,    // Subheadings
  normal: 1.4, // Small text, labels
  relaxed: 1.5, // Body text
  loose: 1.6,   // Large body, long text
} as const;

// ===========================================
// LETTER SPACING - Professional refinement
// ===========================================
export const LetterSpacing = {
  tighter: '-0.02em',
  tight: '-0.01em',
  normal: '0',
  wide: '0.01em',
  wider: '0.025em',
  widest: '0.05em',  // Uppercase labels
} as const;

// ===========================================
// TYPOGRAPHY CONFIGURATION
// Complete typography system for Enterprise ERP
// ===========================================
export const Typography = {
  // Font Families
  fontFamily: {
    display: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    body: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
  },
  
  // Font Sizes
  fontSize: FontSizes,
  
  // Font Weights
  fontWeight: FontWeights,
  
  // Line Heights
  lineHeight: LineHeights,
  
  // Letter Spacing
  letterSpacing: LetterSpacing,
  
  // Heading configurations
  headings: {
    h1: {
      fontSize: FontSizes.hero,
      fontWeight: FontWeights.bold,
      lineHeight: LineHeights.tight,
      letterSpacing: LetterSpacing.tight,
    },
    h2: {
      fontSize: FontSizes.title,
      fontWeight: FontWeights.semibold,
      lineHeight: LineHeights.snug,
      letterSpacing: LetterSpacing.tight,
    },
    h3: {
      fontSize: FontSizes.xxxl,
      fontWeight: FontWeights.semibold,
      lineHeight: LineHeights.snug,
      letterSpacing: LetterSpacing.normal,
    },
    h4: {
      fontSize: FontSizes.xxl,
      fontWeight: FontWeights.semibold,
      lineHeight: LineHeights.normal,
      letterSpacing: LetterSpacing.normal,
    },
  },
  
  // Body text configurations
  body: {
    large: {
      fontSize: FontSizes.xl,
      fontWeight: FontWeights.regular,
      lineHeight: LineHeights.loose,
    },
    default: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.regular,
      lineHeight: LineHeights.relaxed,
    },
    small: {
      fontSize: FontSizes.base,
      fontWeight: FontWeights.regular,
      lineHeight: LineHeights.normal,
    },
  },
  
  // Label configurations
  label: {
    default: {
      fontSize: FontSizes.sm,
      fontWeight: FontWeights.medium,
      lineHeight: LineHeights.normal,
      letterSpacing: LetterSpacing.wide,
    },
    small: {
      fontSize: FontSizes.xs,
      fontWeight: FontWeights.semibold,
      lineHeight: LineHeights.normal,
      letterSpacing: LetterSpacing.widest,
      textTransform: 'uppercase' as const,
    },
  },
  
  // Button text
  button: {
    default: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.medium,
      lineHeight: LineHeights.normal,
      letterSpacing: LetterSpacing.normal,
    },
    small: {
      fontSize: FontSizes.sm,
      fontWeight: FontWeights.medium,
      lineHeight: LineHeights.normal,
    },
    large: {
      fontSize: FontSizes.lg,
      fontWeight: FontWeights.semibold,
      lineHeight: LineHeights.normal,
    },
  },
  
  // Table text
  table: {
    header: {
      fontSize: FontSizes.sm,
      fontWeight: FontWeights.semibold,
      lineHeight: LineHeights.normal,
      letterSpacing: LetterSpacing.widest,
      textTransform: 'uppercase' as const,
    },
    cell: {
      fontSize: FontSizes.base,
      fontWeight: FontWeights.regular,
      lineHeight: LineHeights.relaxed,
    },
  },
  
  // Sidebar
  sidebar: {
    section: {
      fontSize: FontSizes.xs,
      fontWeight: FontWeights.semibold,
      letterSpacing: LetterSpacing.widest,
      textTransform: 'uppercase' as const,
    },
    item: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.regular,
      lineHeight: LineHeights.normal,
    },
    itemActive: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.semibold,
      lineHeight: LineHeights.normal,
    },
  },
  
  // Header
  header: {
    title: {
      fontSize: FontSizes.xxl,
      fontWeight: FontWeights.bold,
      lineHeight: LineHeights.snug,
    },
    subtitle: {
      fontSize: FontSizes.sm,
      fontWeight: FontWeights.regular,
      lineHeight: LineHeights.normal,
    },
  },
  
  // KPI / Dashboard numbers
  kpi: {
    value: {
      fontSize: FontSizes.hero,
      fontWeight: FontWeights.bold,
      lineHeight: LineHeights.tight,
    },
    label: {
      fontSize: FontSizes.sm,
      fontWeight: FontWeights.medium,
      lineHeight: LineHeights.normal,
    },
    trend: {
      fontSize: FontSizes.sm,
      fontWeight: FontWeights.semibold,
      lineHeight: LineHeights.normal,
    },
  },
  
  // Form elements
  form: {
    label: {
      fontSize: FontSizes.sm,
      fontWeight: FontWeights.medium,
      lineHeight: LineHeights.normal,
    },
    input: {
      fontSize: FontSizes.md,
      fontWeight: FontWeights.regular,
      lineHeight: LineHeights.relaxed,
    },
    helper: {
      fontSize: FontSizes.sm,
      fontWeight: FontWeights.regular,
      lineHeight: LineHeights.normal,
    },
  },
} as const;

// ===========================================
// LEGACY COMPATIBILITY - Mapped to new system
// ===========================================
export const FontFamilies = {
  display: Typography.fontFamily.display,
  body: Typography.fontFamily.body,
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
  FontWeights,
  LineHeights,
  LetterSpacing,
  Typography,
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

