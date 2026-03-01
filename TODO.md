# TODO: Typography Optimization for AEVUM ERP

## Objective
Optimize typography and font sizes to match professional B2B SaaS/ERP standards with excellent readability for prolonged daily use.

## Implementation Plan

### Step 1: Update Theme Constants (`src/constants/theme.ts`)
- [x] Add comprehensive Typography object with all font sizes
- [x] Add FontWeights object
- [x] Add LineHeights object
- [x] Add LetterSpacing object
- [x] Update FontFamilies with Plus Jakarta Sans

### Step 2: Update Global CSS (`src/index.css`)
- [x] Update Google Fonts import (Plus Jakarta Sans)
- [x] Add comprehensive CSS custom properties for typography
- [x] Update base typography styles (h1-h6, p, a, etc.)
- [x] Update utility classes
- [x] Add responsive typography

### Step 3: Update Theme Context (`src/contexts/ThemeContext.tsx`)
- [x] Add typography variables to CSS custom properties

### Step 4: Update Sidebar Component (`src/components/layout/Sidebar.tsx`)
- [x] Update sidebar typography styles

## Typography Hierarchy (Target)

| Element | Font Size | Font Weight | Line Height | Usage |
|---------|-----------|-------------|-------------|-------|
| H1 (Page Title) | 32px | 700 (Bold) | 1.2 (tight) | Main page titles |
| H2 (Section) | 24px | 600 (Semibold) | 1.3 (snug) | Section headers |
| H3 (Subsection) | 20px | 600 (Semibold) | 1.3 (snug) | Subsection headers |
| H4 | 18px | 600 (Semibold) | 1.4 (normal) | Card titles |
| Body Large | 16px | 400 (Regular) | 1.6 (loose) | Important text |
| Body | 14px | 400 (Regular) | 1.5 (relaxed) | Default text |
| Body Small | 13px | 400 (Regular) | 1.4 (normal) | Secondary text |
| Caption | 12px | 500 (Medium) | 1.4 (normal) | Labels |
| Overline | 11px | 600 (Semibold) | 1.3 (normal) | Uppercase labels |

## Font Family
- **Primary**: "Plus Jakarta Sans" (Google Font) - Modern, professional, excellent readability
- **Fallback**: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- **Monospace**: JetBrains Mono (for code/numbers)

## Key Improvements
1. ✅ Replaced DM Sans/DM Serif Display with Plus Jakarta Sans (modern ERP standard)
2. ✅ Increased H1 from 24px to 32px for better page title visibility
3. ✅ Increased body text from 13px to 14px for improved readability
4. ✅ Added proper line heights (1.2-1.6) for optimal reading comfort
5. ✅ Added letter spacing for professional polish
6. ✅ Consistent font weights (300-700) throughout
7. ✅ All components use CSS variables for consistency

## Status
- [x] In Progress
- [x] Completed

