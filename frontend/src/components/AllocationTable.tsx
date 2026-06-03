import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Allocation } from '../core/types';
import { formatCurrency, formatRate } from '../core/calculator';
import { colors, spacing, typography, radius, theme } from '../theme';

interface Props {
  allocations:           Allocation[];
  totalOptimisedReturn:  number;
  balance:               number;
}

export default function AllocationTable({
  allocations,
  totalOptimisedReturn,
  balance,
}: Props) {
  if (!allocations.length) return null;

  const palette = theme.allocationPalette;

  return (
    <View style={styles.container}>

      {/* Header row */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, styles.colAccount]}>Account</Text>
        <Text style={[styles.headerCell, styles.colAmount, styles.alignRight]}>Allocated</Text>
        <Text style={[styles.headerCell, styles.colRate, styles.alignRight]}>Rate</Text>
        <Text style={[styles.headerCell, styles.colReturn, styles.alignRight]}>Return/yr</Text>
      </View>

      {/* Data rows */}
      {allocations.map((a, i) => {
        const brandColor = palette[i % palette.length];
        const isOverCap  = a.earnsBaseOn > 0;

        return (
          <View key={a.account.id}>
            <View style={styles.dataRow}>

              {/* Account name + dot */}
              <View style={[styles.colAccount, styles.nameCell]}>
                <View style={[styles.rowDot, { backgroundColor: brandColor }]} />
                <View style={styles.nameBlock}>
                  <Text style={styles.institutionText}>
                    {a.account.institution}
                  </Text>
                  <Text style={styles.productText} numberOfLines={1}>
                    {a.account.name}
                  </Text>
                </View>
              </View>

              {/* Allocated amount */}
              <Text style={[styles.dataCell, styles.colAmount, styles.alignRight]}>
                {formatCurrency(a.allocated)}
              </Text>

              {/* Rate */}
              <Text style={[styles.dataCell, styles.colRate, styles.alignRight, { color: brandColor }]}>
                {a.account.bonusRate.toFixed(2)}%
              </Text>

              {/* Annual return */}
              <Text style={[styles.dataCell, styles.colReturn, styles.alignRight, styles.returnText]}>
                {formatCurrency(a.annualReturn)}
              </Text>
            </View>

            {/* Over-cap warning sub-row */}
            {isOverCap && (
              <View style={styles.overCapRow}>
                <Text style={styles.overCapText}>
                  {formatCurrency(a.earnsBaseOn)} above cap — earns base{' '}
                  {formatRate(a.account.baseRate)}
                </Text>
              </View>
            )}
          </View>
        );
      })}

      {/* Total rows */}
      <View style={styles.totalRow}>
        <Text style={[styles.totalLabel, styles.colAccount]}>Total</Text>
        <Text style={[styles.totalValue, styles.colAmount]}>
          {formatCurrency(balance)}
        </Text>
        <View style={styles.colRate} />
        <Text style={[styles.totalValue, styles.colReturn]}>
          {formatCurrency(totalOptimisedReturn)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius:    radius.md,
    overflow:        'hidden',
    borderWidth:     0.5,
    borderColor:     colors.borderDefault,
  },

  // Column widths — flex-based
  colAccount: { flex: 2.2 },
  colAmount:  { flex: 1.4 },
  colRate:    { flex: 1.2 },
  colReturn:  { flex: 1.4 },

  // Header
  headerRow: {
    flexDirection:   'row',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.bgSubtle,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderDefault,
    gap:             spacing.xs,
  },
  headerCell: {
    ...typography.label,
    fontSize: 9,
  },

  // Data rows
  dataRow: {
    flexDirection:   'row',
    alignItems:      'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderDefault,
    gap:             spacing.xs,
  },
  dataCell: {
    ...typography.bodySm,
    color: colors.textPrimary,
  },
  alignRight: { textAlign: 'right' },
  returnText: {
    color:      colors.textPrimary,
    fontWeight: '500',
  },

  // Name cell
  nameCell: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           spacing.sm,
  },
  rowDot: {
    width:        8,
    height:       8,
    borderRadius: radius.pill,
    flexShrink:   0,
  },
  nameBlock: { flex: 1 },
  institutionText: {
    ...typography.bodySmStrong,
    color: colors.textPrimary,
  },
  productText: {
    ...typography.caption,
    color:   colors.textSecondary,
    marginTop: 1,
  },

  // Over-cap sub-row
  overCapRow: {
    paddingHorizontal: spacing.md,
    paddingBottom:     spacing.sm,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderDefault,
    marginTop:         -spacing.xs,
  },
  overCapText: {
    ...typography.caption,
    color: colors.statusAlert,
  },

  // Totals
  totalRow: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingVertical:   spacing.md,
    paddingHorizontal: spacing.md,
    backgroundColor:   colors.bgSubtle,
    gap:               spacing.xs,
  },
  totalLabel: {
    ...typography.bodySmStrong,
    color: colors.textPrimary,
  },
  totalValue: {
    ...typography.bodySmStrong,
    color:     colors.textPrimary,
    textAlign: 'right',
  },
});