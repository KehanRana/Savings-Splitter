export const theme = {
  colors: {
    bgPage:      '#F7F6F3',
    bgSurface:   '#FFFFFF',
    textPrimary: '#1A1916',
    white:       '#FFFFFF',
  },

  spacing: {
    sm:   8,
    md:   12,
    xxl:  24,
    xxxl: 32,
  },

  typography: {
    headingLg: { fontSize: 20, fontWeight: '600' as const, color: '#1A1916' },
    headingSm: { fontSize: 14, fontWeight: '600' as const, color: '#1A1916' },
    bodyMd:    { fontSize: 14, fontWeight: '400' as const, color: '#1A1916' },
    bodySm:    { fontSize: 13, fontWeight: '400' as const, color: '#6B6860' },
    caption:   { fontSize: 11, fontWeight: '400' as const, color: '#9E9C97' },
  },
} as const;

export type Theme = typeof theme;
export const { colors, spacing, typography } = theme;
