import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface BotaoProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

export default function Botao({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  style,
  textStyle,
  testID,
}: BotaoProps) {
  const isDisabled = disabled || loading;

  const getButtonStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: BorderRadius.md,
      ...Shadows.sm,
    };

    // Tamanhos
    const sizeStyles: Record<ButtonSize, ViewStyle> = {
      sm: {
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        minHeight: 36,
      },
      md: {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        minHeight: 48,
      },
      lg: {
        paddingVertical: Spacing.lg,
        paddingHorizontal: Spacing.xl,
        minHeight: 56,
      },
    };

    // Variantes
    const variantStyles: Record<ButtonVariant, ViewStyle> = {
      primary: {
        backgroundColor: isDisabled ? Colors.gray[300] : Colors.primary[500],
      },
      secondary: {
        backgroundColor: isDisabled ? Colors.gray[200] : Colors.secondary[100],
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: isDisabled ? Colors.gray[300] : Colors.primary[500],
      },
      ghost: {
        backgroundColor: 'transparent',
      },
      danger: {
        backgroundColor: isDisabled ? Colors.gray[300] : Colors.error,
      },
    };

    // Largura
    const widthStyle: ViewStyle = fullWidth ? { width: '100%' } : {};

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...widthStyle,
      ...style,
    };
  };

  const getTextStyles = (): TextStyle => {
    const baseTextStyles: TextStyle = {
      fontWeight: Typography.fontWeight.semibold,
      textAlign: 'center',
    };

    // Tamanhos de texto
    const textSizeStyles: Record<ButtonSize, TextStyle> = {
      sm: { fontSize: Typography.fontSize.sm },
      md: { fontSize: Typography.fontSize.base },
      lg: { fontSize: Typography.fontSize.lg },
    };

    // Cores de texto por variante
    const textColorStyles: Record<ButtonVariant, TextStyle> = {
      primary: {
        color: isDisabled ? Colors.gray[500] : Colors.white,
      },
      secondary: {
        color: isDisabled ? Colors.gray[500] : Colors.text.primary,
      },
      outline: {
        color: isDisabled ? Colors.gray[500] : Colors.primary[500],
      },
      ghost: {
        color: isDisabled ? Colors.gray[500] : Colors.primary[500],
      },
      danger: {
        color: isDisabled ? Colors.gray[500] : Colors.white,
      },
    };

    return {
      ...baseTextStyles,
      ...textSizeStyles[size],
      ...textColorStyles[variant],
      ...textStyle,
    };
  };

  return (
    <TouchableOpacity
      style={getButtonStyles()}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      testID={testID}
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? Colors.primary[500] : Colors.white}
          style={{ marginRight: Spacing.sm }}
        />
      )}
      <Text style={getTextStyles()}>{title}</Text>
    </TouchableOpacity>
  );
}