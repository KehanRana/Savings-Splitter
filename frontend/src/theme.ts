export const theme = {
    // ── Colours ────────────────────────────────────────────────────────────────
    colors: {
  
      // Background — page and container fills
      bgPrimary:  '#000000',    // main page background (pure black)
      bgSubtle:   '#18191B',    // slightly lifted surface (nav bars, bottom sheets)
      bgSurface:  '#FFFFFF',    // cards, modals, sheets (white)
      bgSurface2: '#F5F5F5',    // inset surfaces within cards
  
      // Text
      textPrimary:   '#FFFFFF',  // primary text on dark backgrounds
      textSecondary: '#B6B6B6',  // secondary / muted text
      textTertiary:  '#3D3D3D',  // tertiary / disabled (used on white surfaces)
      textInverse:   '#000000',  // text on white surfaces (cards)
      textAccent:    '#FFC840',  // brand gold — used for highlights, labels
  
      // Brand palette
      brand100: '#FFF5CC',
      brand200: '#FFE680',
      brand300: '#FFD740',
      brand400: '#FFC840',  // primary brand — also Brand 500
      brand500: '#FFC840',
      brand600: '#D2A028',
      brand700: '#A87820',
      brand800: '#7A5418',
  
      // Semantic — status
      statusError:       '#B80C79',  // Error (pink-magenta)
      statusErrorBg:     '#2D0020',
      statusHealthy:     '#F4C228',  // Healthy (gold/amber)
      statusHealthyBg:   '#2D2500',
      statusCanImprove:  '#B8ABBA',  // Can Improve (muted lilac-grey)
      statusCanImproveBg:'#1E1B1F',
      statusUnhealthy:   '#EA7D4F',  // Unhealthy (warm orange)
      statusUnhealthyBg: '#2D1500',
      statusAlert:       '#F07A02',  // Alert (bright orange)
      statusAlertBg:     '#2D1800',
  
      // Borders
      borderDefault: '#2C2C2C',    // subtle border on dark bg
      borderStrong:  '#3D3D3D',    // more visible separator
      borderLight:   '#E5E5E5',    // border on white/light surfaces
      borderBrand:   '#FFC840',    // brand-coloured border (selected state)
  
      // Button fills
      buttonDark:        '#FFFFFF',  // primary button on dark bg = white
      buttonDarkText:    '#000000',
      buttonAlternate:   '#FFC840',  // brand/alternate button
      buttonAlternateText: '#000000',
      buttonDestructive: '#B80C79',
      buttonDestructiveText: '#FFFFFF',
      buttonDisabled:    '#2C2C2C',
      buttonDisabledText:'#6B6B6B',
  
      // Utility
      white:       '#FFFFFF',
      black:       '#000000',
      transparent: 'transparent',
  
      // Gain / positive (mapped to Healthy)
      gain:    '#F4C228',
      gainBg:  '#1A1500',
      gainText:'#F4C228',
  
      // Info / FCS
      infoBg:   '#0D1A2D',
      infoText: '#5BA3E0',
      infoBorder:'#1A3A6A',
    },
  
    // ── Spacing ────────────────────────────────────────────────────────────────
    // Grid: 6 columns, 16px margins, 8px gutters
    spacing: {
      xs:   4,
      sm:   8,
      md:   12,
      lg:   16,   // = 1 gutter + margin unit
      xl:   20,
      xxl:  24,
      xxxl: 32,
      xxxxl: 48,
    },
  
    // ── Border radius ──────────────────────────────────────────────────────────
    radius: {
      xs:   4,
      sm:   8,
      md:   12,
      lg:   16,
      xl:   20,
      pill: 999,
    },
  
    // ── Typography ─────────────────────────────────────────────────────────────
    // Font: Neue Haas Grotesk Display Round Dot (Figma spec)
    // React Native fallback: System (San Francisco on iOS, Roboto on Android)
    // Weights used: 300 (Light), 400 (Roman), 500 (Medium)
    // Caption: DM Mono Light (monospace — used for data labels)
    //
    // Mobile fontscale:
    //   Display 1: 56px / line 64px
    //   Display 2: 36px / line 44px (also H1)
    //   H1:  45px / line 48px
    //   H2:  36px / line 42px
    //   H3:  28px / line 32px
    //   lg body copy:  24px / line 28px
    //   lg body copy:  20px / line 28px
    //   default body:  16px / line 24px
    //   sm body:       13px / line 16px
    //   xs body:       12px / line 16px
    //   Caption (mono): 11px / line 16px
  
    typography: {
      display1: {
        fontSize:      56,
        lineHeight:    64,
        fontWeight:    '300' as const,
        letterSpacing: -1.5,
        color:         '#FFFFFF',
      },
      display2: {
        fontSize:      36,
        lineHeight:    44,
        fontWeight:    '300' as const,
        letterSpacing: -0.5,
        color:         '#FFFFFF',
      },
      h1: {
        fontSize:      45,
        lineHeight:    48,
        fontWeight:    '400' as const,
        letterSpacing: -1,
        color:         '#FFFFFF',
      },
      h2: {
        fontSize:      36,
        lineHeight:    42,
        fontWeight:    '400' as const,
        letterSpacing: -0.5,
        color:         '#FFFFFF',
      },
      h3: {
        fontSize:      28,
        lineHeight:    32,
        fontWeight:    '500' as const,
        letterSpacing: -0.3,
        color:         '#FFFFFF',
      },
      bodyLg: {
        fontSize:      20,
        lineHeight:    28,
        fontWeight:    '400' as const,
        color:         '#FFFFFF',
      },
      bodyLgStrong: {
        fontSize:      20,
        lineHeight:    28,
        fontWeight:    '500' as const,
        color:         '#FFFFFF',
      },
      bodyMd: {
        fontSize:      16,
        lineHeight:    24,
        fontWeight:    '400' as const,
        color:         '#FFFFFF',
      },
      bodyMdStrong: {
        fontSize:      16,
        lineHeight:    24,
        fontWeight:    '500' as const,
        color:         '#FFFFFF',
      },
      bodySm: {
        fontSize:      13,
        lineHeight:    18,
        fontWeight:    '400' as const,
        color:         '#B6B6B6',
      },
      bodySmStrong: {
        fontSize:      13,
        lineHeight:    18,
        fontWeight:    '500' as const,
        color:         '#FFFFFF',
      },
      bodyXs: {
        fontSize:      12,
        lineHeight:    16,
        fontWeight:    '400' as const,
        color:         '#B6B6B6',
      },
      label: {
        // Used for field labels, section headers — uppercase tracking
        fontSize:      11,
        lineHeight:    16,
        fontWeight:    '500' as const,
        letterSpacing: 0.8,
        textTransform: 'uppercase' as const,
        color:         '#B6B6B6',
      },
      caption: {
        // DM Mono Light — used for data/numeric captions
        fontSize:      11,
        lineHeight:    16,
        fontWeight:    '300' as const,
        fontFamily:    'Courier',  // closest system monospace; swap for DM Mono if loaded
        color:         '#B6B6B6',
      },
    },
  
    // ── Shadows ────────────────────────────────────────────────────────────────
    shadows: {
      card: {
        shadowColor:   '#000000',
        shadowOffset:  { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius:  8,
        elevation:     4,
      },
      modal: {
        shadowColor:   '#000000',
        shadowOffset:  { width: 0, height: 8 },
        shadowOpacity: 0.6,
        shadowRadius:  24,
        elevation:     12,
      },
      none: {
        shadowColor:   'transparent',
        shadowOffset:  { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius:  0,
        elevation:     0,
      },
    },
  
    // ── Institution brand colours ──────────────────────────────────────────────
    institutionColors: {
      'Up Bank':  '#7B2CF8',
      ING:        '#FF6200',
      'AMP Bank': '#1A56C4',
      UBank:      '#0066CC',
      Macquarie:  '#4B8FD4',
      Bankwest:   '#DF0024',
    } as Record<string, string>,
  
    // ── Allocation bar palette ─────────────────────────────────────────────────
    allocationPalette: [
      '#7B2CF8',   // Up Bank
      '#FF6200',   // ING
      '#1A56C4',   // AMP Bank
      '#0066CC',   // UBank
      '#4B8FD4',   // Macquarie
      '#DF0024',   // Bankwest
    ],
  
  } as const;
  
  // ── Convenience re-exports ──────────────────────────────────────────────────
  export type Theme = typeof theme;
  export const { colors, spacing, radius, typography, shadows } = theme;