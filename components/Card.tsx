import React from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';

export type CardVariant = 'default' | 'elevated' | 'outlined' | 'filled';
export type CardSize = 'sm' | 'md' | 'lg';

export interface CardProps {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  variant?: CardVariant;
  size?: CardSize;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  testID?: string;
}

export function Card({
  children,
  title,
  subtitle,
  variant = 'default',
  size = 'md',
  onPress,
  disabled = false,
  style,
  contentStyle,
  titleStyle,
  subtitleStyle,
  testID,
}: CardProps) {
  const isPressable = !!onPress && !disabled;

  const getCardStyles = (): ViewStyle => {
    const baseStyles: ViewStyle = {
      borderRadius: BorderRadius.lg,
      backgroundColor: Colors.background.card,
    };

    // Tamanhos
    const sizeStyles: Record<CardSize, ViewStyle> = {
      sm: {
        padding: Spacing.md,
        margin: Spacing.sm,
      },
      md: {
        padding: Spacing.lg,
        margin: Spacing.md,
      },
      lg: {
        padding: Spacing.xl,
        margin: Spacing.lg,
      },
    };

    // Variantes
    const variantStyles: Record<CardVariant, ViewStyle> = {
      default: {
        ...Shadows.sm,
      },
      elevated: {
        ...Shadows.lg,
      },
      outlined: {
        borderWidth: 1,
        borderColor: Colors.gray[200],
        shadowOpacity: 0,
        elevation: 0,
      },
      filled: {
        backgroundColor: Colors.gray[50],
        shadowOpacity: 0,
        elevation: 0,
      },
    };

    const pressableStyles: ViewStyle = isPressable
      ? {
          opacity: disabled ? 0.6 : 1,
        }
      : {};

    return {
      ...baseStyles,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...pressableStyles,
      ...style,
    };
  };

  const getTitleStyles = (): TextStyle => {
    return {
      fontSize: Typography.fontSize.lg,
      fontWeight: Typography.fontWeight.semibold,
      color: Colors.text.primary,
      marginBottom: subtitle ? Spacing.xs : Spacing.sm,
      ...titleStyle,
    };
  };

  const getSubtitleStyles = (): TextStyle => {
    return {
      fontSize: Typography.fontSize.sm,
      fontWeight: Typography.fontWeight.normal,
      color: Colors.text.secondary,
      marginBottom: Spacing.sm,
      ...subtitleStyle,
    };
  };

  const CardContent = () => (
    <View style={contentStyle}>
      {title && <Text style={getTitleStyles()}>{title}</Text>}
      {subtitle && <Text style={getSubtitleStyles()}>{subtitle}</Text>}
      {children}
    </View>
  );

  if (isPressable) {
    return (
      <TouchableOpacity
        style={getCardStyles()}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.8}
        testID={testID}
      >
        <CardContent />
      </TouchableOpacity>
    );
  }

  return (
    <View style={getCardStyles()} testID={testID}>
      <CardContent />
    </View>
  );
}

// Componente Card específico para listas
export interface CardListItemProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  testID?: string;
}

export function CardListItem({
  title,
  subtitle,
  rightElement,
  onPress,
  disabled = false,
  style,
  testID,
}: CardListItemProps) {
  return (
    <Card
      variant="outlined"
      size="sm"
      onPress={onPress}
      disabled={disabled}
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginVertical: Spacing.xs,
        },
        style,
      ]}
      testID={testID}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: Typography.fontSize.base,
            fontWeight: Typography.fontWeight.medium,
            color: Colors.text.primary,
            marginBottom: subtitle ? Spacing.xs : 0,
          }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            style={{
              fontSize: Typography.fontSize.sm,
              color: Colors.text.secondary,
            }}
          >
            {subtitle}
          </Text>
        )}
      </View>
      {rightElement && <View>{rightElement}</View>}
    </Card>
  );
}
