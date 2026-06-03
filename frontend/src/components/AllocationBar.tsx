import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Allocation } from '../core/types';
import { formatCurrency } from '../core/calculator';
import { colors, spacing, typography, radius, theme } from '../theme';

interface Props {
  allocations: Allocation[];
  balance:     number;
  unallocated: number;
}

export default function AllocationBar({
  allocations,
  balance,
  unallocated,
}: Props) {
  if (!allocations.length || balance === 0) return null;

  const palette = theme.allocationPalette;

  return (
    <View style={styles.container}>

      {/* Segmented Bar */}
      <View style={styles.track}>
        {allocations.map((a, i) => {
          const pct = (a.allocated / balance) * 100;
          return (
            <View
              key={a.account.id}
              style={[
                styles.segment,
                {
                  flex:             pct,
                  backgroundColor:  palette[i % palette.length],
                },
              ]}
            />
          );
        })}

        {/* Unallocated remainder — grey */}
        {unallocated > 0 && (
          <View
            style={[
              styles.segment,
              {
                flex:            (unallocated / balance) * 100,
                backgroundColor: colors.borderStrong,
              },
            ]}
          />
        )}
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        {allocations.map((a, i) => (
          <View key={a.account.id} style={styles.legendItem}>
            <View
              style={[
                styles.legendDot,
                { backgroundColor: palette[i % palette.length] },
              ]}
            />
            <Text style={styles.legendName} numberOfLines={1}>
              {a.account.institution}
            </Text>
            <Text style={styles.legendAmount}>
              {formatCurrency(a.allocated)}
            </Text>
          </View>
        ))}

        {unallocated > 0 && (
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.borderStrong }]} />
            <Text style={styles.legendName}>Unallocated</Text>
            <Text style={[styles.legendAmount, { color: colors.statusAlert }]}>
              {formatCurrency(unallocated)}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.xl,
  },

  // Segmented bar
  track: {
    flexDirection: 'row',
    height:        10,
    borderRadius:  radius.pill,
    overflow:      'hidden',
    gap:           2,
    marginBottom:  spacing.md,
    backgroundColor: colors.borderDefault,
  },
  segment: {
    height: '100%',
  },

  // Legend
  legend: {
    gap: spacing.sm,
  },
  legendItem: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            spacing.sm,
  },
  legendDot: {
    width:        8,
    height:       8,
    borderRadius: radius.pill,
    flexShrink:   0,
  },
  legendName: {
    ...typography.bodySm,
    flex: 1,
  },
  legendAmount: {
    ...typography.bodySmStrong,
    color: colors.textPrimary,
  },
});