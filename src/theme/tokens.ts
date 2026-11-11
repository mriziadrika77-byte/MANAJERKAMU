export const TOKENS = {
  colors: {
    light: {
      brandNavy: '#243B80',
      brandBlue: '#4169E1',
      blueSupport: '#3153B5',
      softLavender: '#A8B8F0',
      lavenderMist: '#F2F3FC',
      cloudWhite: '#FFFFFF',
      deepCharcoal: '#172033',
      mutedSlate: '#778198',
      border: '#E7EAF3',
    },
    dark: {
      background: '#101728',
      surface: '#182238',
      elevatedSurface: '#202C45',
      primaryText: '#F0F3FC',
      secondaryText: '#A1ADC4',
      border: '#2B3852',
      brandBlue: '#7895F0',
      softBlue: '#A8B8F0',
      brandTint: '#273657',
    },
    semantic: {
      success: '#16A477',
      warning: '#D99736',
      danger: '#DC626F',
      information: '#6485C7',
    },
  },
  typography: {
    fonts: {
      heading: 'Manrope, sans-serif',
      body: 'Inter, sans-serif',
    },
    scales: {
      pageTitle: 'text-2xl sm:text-3xl font-bold tracking-tight',
      sectionHeading: 'text-lg sm:text-xl font-semibold',
      cardHeading: 'text-base sm:text-lg font-semibold',
      body: 'text-sm sm:text-base leading-relaxed',
      caption: 'text-xs text-content-muted leading-normal',
      label: 'text-xs sm:text-sm font-medium',
      button: 'text-sm font-medium tracking-wide',
    },
  },
  radius: {
    subtle: 'rounded-md', // 6-8px
    card: 'rounded-xl', // 12-14px
    pill: 'rounded-full',
  },
  shadows: {
    subtle: 'shadow-sm',
    card: 'shadow-card dark:shadow-dark-card',
    elevated: 'shadow-elevated',
  },
  transitions: {
    default: 'transition-all duration-200 ease-in-out',
    theme: 'transition-colors duration-200',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

export type ThemeMode = 'light' | 'dark';

