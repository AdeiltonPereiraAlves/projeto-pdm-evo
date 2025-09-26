import React from 'react';
import { View, Text, TouchableOpacity, TextStyle, ViewStyle } from 'react-native';
import { Colors, Typography, Spacing } from '@/constants/theme';

export interface RodapeLoginProps {
  title?: string;
  subtitle?: string;
  onPress?: () => void;
  style?: ViewStyle;
  titleStyle?: TextStyle;
  subtitleStyle?: TextStyle;
  testID?: string;
}

export default function RodapeLogin({
  title,
  subtitle,
  onPress,
  style,
  titleStyle,
  subtitleStyle,
  testID,
}: RodapeLoginProps) {
  const containerStyle: ViewStyle = {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.lg,
    ...style,
  };

  const defaultTitleStyle: TextStyle = {
    color: Colors.text.secondary,
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.normal,
    ...titleStyle,
  };

  const defaultSubtitleStyle: TextStyle = {
    color: Colors.primary[500],
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    textDecorationLine: 'underline',
    marginLeft: Spacing.xs,
    ...subtitleStyle,
  };

  if (onPress && subtitle) {
    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={onPress}
        activeOpacity={0.7}
        testID={testID}
      >
        <Text style={defaultTitleStyle}>{title}</Text>
        <Text style={defaultSubtitleStyle}>{subtitle}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={containerStyle} testID={testID}>
      <Text style={defaultTitleStyle}>{title}</Text>
      {subtitle && <Text style={defaultSubtitleStyle}>{subtitle}</Text>}
    </View>
  );
}