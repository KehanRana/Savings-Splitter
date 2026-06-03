import React from 'react';
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, spacing, radius, typography } from '../theme';

export type ButtonHierarchy = 'primary' | 'secondary' | 'destructive';
export type ButtonSize      = 'default' | 'small';
export type ButtonSurface   = 'dark' | 'light';

type Props = {
  label:      string;
  onPress?:   () => void;
  hierarchy?: ButtonHierarchy;
  size?:      ButtonSize;
  surface?:   ButtonSurface;
  disabled?:  boolean;
  loading?:   boolean;
  fullWidth?: boolean;
  /** Optional element rendered after the label (e.g. a badge or icon). */
  trailing?:  React.ReactNode;
  style?:     ViewStyle;
};

const ERROR = '#E93C79';

type Resolved = { bg: string; border?: string; text: string };

/**
 * Resolve fill/border/text colours for a hierarchy + surface + state combo.
 * Light-surface and disabled treatments follow DS convention (white↔black
 * inversion; theme disabled tokens) — verify against Figma when unblocked.
 */
function resolveColors(
  hierarchy: ButtonHierarchy,
  surface:   ButtonSurface,
  disabled:  boolean,
): Resolved {
  if (disabled) {
    if (hierarchy === 'primary') {
      return { bg: colors.buttonDisabled, text: colors.buttonDisabledText };
    }
    // secondary / destructive: muted outline
    return {
      bg:     colors.transparent,
      border: colors.buttonDisabled,
      text:   colors.buttonDisabledText,
    };
  }

  const onDark = surface === 'dark';

  switch (hierarchy) {
    case 'primary':
      return onDark
        ? { bg: colors.white, text: colors.black }
        : { bg: colors.black, text: colors.white };
    case 'secondary':
      return onDark
        ? { bg: colors.transparent, border: colors.white, text: colors.white }
        : { bg: colors.transparent, border: colors.black, text: colors.black };
    case 'destructive':
      return { bg: colors.transparent, border: ERROR, text: ERROR };
  }
}

export default function Button({
  label,
  onPress,
  hierarchy = 'primary',
  size      = 'default',
  surface   = 'dark',
  disabled  = false,
  loading   = false,
  fullWidth,
  trailing,
  style,
}: Props) {
  const isDefault = size === 'default';
  const stretch   = fullWidth ?? isDefault;
  const { bg, border, text } = resolveColors(hierarchy, surface, disabled);

  const containerStyle: ViewStyle = {
    backgroundColor: bg,
    borderRadius:    isDefault ? radius.sm : radius.xs,
    paddingHorizontal: isDefault ? spacing.xxl : spacing.lg, // 24 / 16
    paddingVertical:   isDefault ? spacing.lg  : spacing.sm, //  16 / 8
    ...(isDefault ? { height: 60 } : null),
    ...(border ? { borderWidth: 1, borderColor: border } : null),
    ...(stretch ? { alignSelf: 'stretch' } : { alignSelf: 'flex-start' }),
  };

  const textStyle: TextStyle = {
    ...(isDefault ? typography.bodyLg : typography.bodyMd),
    color:         text,
    fontWeight:    isDefault ? '400' : '300',
    letterSpacing: isDefault ? 0.4 : 0.64,
  };

  return (
    <TouchableOpacity
      style={[styles.base, containerStyle, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
    >
      {loading ? (
        <ActivityIndicator color={text} size="small" />
      ) : (
        <View style={styles.content}>
          <Text style={textStyle} numberOfLines={1}>
            {label}
          </Text>
          {trailing}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            spacing.sm,
  },
});
