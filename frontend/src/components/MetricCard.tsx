import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radius, shadows } from '../theme';

export type MetricVariant = 'default' | 'primary' | 'gain' | 'muted';

interface Props {
  label:    string;
  value:    string;
  subLabel?: string;
  variant?: MetricVariant;
}

export default function MetricCard({
  label,
  value,
  subLabel,
  variant = 'default',
}: Props) {
  const filled = variant === 'primary' || variant === 'gain';

  return (
    <View style={[styles.container, filled ? styles.containerFilled : styles.containerOutline]}>
      <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Text>
      <Text style={styles.name} numberOfLines={2}>{label}</Text>
      {subLabel && (
        <Text style={styles.caption} numberOfLines={1}>{subLabel}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:           1,
    borderRadius:   radius.lg,
    padding:        spacing.lg,
    minHeight:      120,
    justifyContent: 'flex-end',
    ...shadows.card,
  },

  // Fills
  containerFilled: {
    backgroundColor: colors.brand400,   // brand gold
  },
  containerOutline: {
    backgroundColor: colors.bgSurface,  // white
    borderWidth:     1,
    borderColor:     colors.borderLight,
  },

  // Label tier
  value: {
    fontSize:      26,
    lineHeight:    30,
    fontWeight:    '500',
    letterSpacing: -0.5,
    color:         colors.textInverse,
  },
  // Paragraph tier — what the metric is
  name: {
    fontSize:   16,
    lineHeight: 20,
    fontWeight: '400',
    color:      colors.textInverse,
    marginTop:  spacing.sm,
  },
  // Caption tier — muted meta
  caption: {
    fontSize:   13,
    lineHeight: 18,
    fontWeight: '400',
    color:      'rgba(0, 0, 0, 0.55)',
    marginTop:  spacing.xs,
  },
});
