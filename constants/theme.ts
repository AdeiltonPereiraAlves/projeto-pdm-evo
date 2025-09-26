/**
 * Sistema de Design EVO
 * Cores, tipografia e espaçamentos baseados no design do Figma
 */

import { Platform } from 'react-native';

// Cores principais do projeto EVO
export const Colors = {
  // Cores primárias
  primary: {
    50: '#E6F4FE',
    100: '#CCE9FD',
    200: '#99D3FB',
    300: '#66BDF9',
    400: '#33A7F7',
    500: '#295CA9', // Cor principal do botão
    600: '#1E4A87',
    700: '#143865',
    800: '#0A2643',
    900: '#001421',
  },
  
  // Cores secundárias
  secondary: {
    50: '#F8F9FA',
    100: '#F1F3F4',
    200: '#E8EAED',
    300: '#DADCE0',
    400: '#BDC1C6',
    500: '#9AA0A6',
    600: '#80868B',
    700: '#5F6368',
    800: '#3C4043',
    900: '#202124',
  },
  
  // Cores de status
  success: '#34A853',
  warning: '#FBBC04',
  error: '#EA4335',
  info: '#4285F4',
  
  // Cores neutras
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  
  // Cores de fundo
  background: {
    light: '#FFFFFF',
    dark: '#121212',
    card: '#FFFFFF',
    surface: '#F8F9FA',
  },
  
  // Cores de texto
  text: {
    primary: '#202124',
    secondary: '#5F6368',
    disabled: '#9AA0A6',
    inverse: '#FFFFFF',
  },
};

// Tipografia
export const Typography = {
  // Tamanhos de fonte
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  // Pesos de fonte
  fontWeight: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  
  // Altura da linha
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
  
  // Famílias de fonte
  fontFamily: Platform.select({
    ios: {
      sans: 'System',
      serif: 'Georgia',
      mono: 'Courier New',
    },
    android: {
      sans: 'Roboto',
      serif: 'serif',
      mono: 'monospace',
    },
    default: {
      sans: 'System',
      serif: 'serif',
      mono: 'monospace',
    },
  }),
};

// Espaçamentos
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
  '4xl': 96,
};

// Bordas e raios
export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  full: 9999,
};

// Sombras
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};

// Tema completo
export const Theme = {
  colors: Colors,
  typography: Typography,
  spacing: Spacing,
  borderRadius: BorderRadius,
  shadows: Shadows,
};
