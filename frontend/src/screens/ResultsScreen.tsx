import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { SEED_ACCOUNTS, FCS_GUARANTEE_LIMIT } from '../core/accounts';
import { formatCurrency, formatRate } from '../core/calculator';
import { useSplit } from '../hooks/useSplit';
import MetricCard from '../components/MetricCard';
import AllocationBar from '../components/AllocationBar';
import AllocationTable from '../components/AllocationTable';
import Footer from '../components/Footer';
import Button from '../components/Button';
import { colors, spacing, typography, radius } from '../theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Results'>;
  route:      RouteProp<RootStackParamList, 'Results'>;
};

export default function ResultsScreen({ navigation, route }: Props) {
  const { balance, selectedAccountIds } = route.params;

  // Reconstruct accounts from IDs passed through navigation
  const selectedAccounts = SEED_ACCOUNTS.filter(a =>
    selectedAccountIds.includes(a.id),
  );

  const result = useSplit(balance, selectedAccounts);
  const {
    allocations,
    totalOptimisedReturn,
    totalCurrentReturn,
    annualGain,
    unallocated,
    effectiveRate,
  } = result;

  const hasGain        = annualGain > 0;
  const exceedsAllCaps = unallocated > 0;
  const fcsRisk        = balance > FCS_GUARANTEE_LIMIT;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Hero: balance summary */}
        <View style={styles.hero}>
          <Text style={styles.heroLabel}>Splitting</Text>
          <Text style={styles.heroBalance}>{formatCurrency(balance)}</Text>
          <Text style={styles.heroRate}>
            across {allocations.length} account{allocations.length !== 1 ? 's' : ''} · blended {formatRate(effectiveRate)}
          </Text>
        </View>

        {/* Metric cards */}
        <View style={styles.metricsRow}>
          <MetricCard
            label="Optimised return"
            value={formatCurrency(totalOptimisedReturn)}
            subLabel="per year"
            variant="primary"
          />
          <MetricCard
            label="vs single account"
            value={formatCurrency(totalCurrentReturn)}
            subLabel="per year"
            variant="muted"
          />
        </View>

        {hasGain && (
          <MetricCard
            label="You gain by splitting"
            value={`+${formatCurrency(annualGain)}`}
            subLabel={`+${formatCurrency(annualGain * 10)} over 10 years`}
            variant="gain"
          />
        )}

        {/* Allocation bar */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recommended split</Text>
          <AllocationBar
            allocations={allocations}
            balance={balance}
            unallocated={unallocated}
          />

          {/* Allocation table */}
          <AllocationTable
            allocations={allocations}
            totalOptimisedReturn={totalOptimisedReturn}
            balance={balance}
          />
        </View>

        {/* Warnings */}
        {exceedsAllCaps && (
          <View style={[styles.banner, styles.bannerWarn]}>
            <Text style={styles.bannerIcon}>⚠️</Text>
            <View style={styles.bannerBody}>
              <Text style={styles.bannerTitle}>Balance exceeds all caps</Text>
              <Text style={styles.bannerText}>
                {formatCurrency(unallocated)} can't be placed in any selected
                account at the bonus rate. Consider adding a term deposit or
                another account.
              </Text>
            </View>
          </View>
        )}

        {fcsRisk && (
          <View style={[styles.banner, styles.bannerInfo]}>
            <View style={styles.bannerBody}>
              <Text style={styles.bannerTitle}>Financial Claims Scheme</Text>
              <Text style={styles.bannerText}>
                The Australian Government guarantees deposits up to{' '}
                {formatCurrency(FCS_GUARANTEE_LIMIT)} per institution. Splitting
                across banks keeps more of your money protected.
              </Text>
            </View>
          </View>
        )}

        {/* Back button */}
        <Button
          label="Adjust my balance"
          hierarchy="secondary"
          surface="dark"
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        />

        {/* Footer */}
        <View style={{ height: spacing.xxxl }} />
        <Footer />

        <View style={{ height: spacing.xxl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex:            1,
    backgroundColor: colors.bgPrimary,
  },
  scroll:        { flex: 1 },
  scrollContent: { padding: spacing.lg },

  // ── Hero ──────────────────────────────────────────────────────
  hero: {
    alignItems:   'center',
    paddingTop:   spacing.xl,
    paddingBottom: spacing.xxl,
  },
  heroLabel: {
    ...typography.label,
    marginBottom: spacing.sm,
  },
  heroBalance: {
    fontSize:      52,
    fontWeight:    '300',
    color:         colors.textPrimary,
    letterSpacing: -2,
    marginBottom:  spacing.sm,
  },
  heroRate: {
    ...typography.bodySm,
    color: colors.textSecondary,
  },

  // ── Metrics ───────────────────────────────────────────────────
  metricsRow: {
    flexDirection: 'row',
    gap:           spacing.sm,
    marginBottom:  spacing.sm,
  },

  // ── Cards ─────────────────────────────────────────────────────
  card: {
    backgroundColor: colors.bgSubtle,
    borderRadius:    radius.lg,
    borderWidth:     0.5,
    borderColor:     colors.borderDefault,
    padding:         spacing.xl,
    marginTop:       spacing.md,
    marginBottom:    spacing.sm,
  },
  cardTitle: {
    ...typography.bodyMdStrong,
    marginBottom: spacing.lg,
  },

  // ── Banners ───────────────────────────────────────────────────
  banner: {
    flexDirection:  'row',
    alignItems:     'flex-start',
    gap:            spacing.md,
    borderRadius:   radius.md,
    padding:        spacing.md,
    marginTop:      spacing.sm,
    borderWidth:    0.5,
  },
  bannerWarn: {
    backgroundColor: colors.statusAlertBg,
    borderColor:     colors.statusAlert,
  },
  bannerInfo: {
    backgroundColor: colors.infoBg,
    borderColor:     colors.infoBorder,
  },
  bannerIcon: {
    fontSize:  18,
    marginTop: 1,
  },
  bannerBody:  { flex: 1 },
  bannerTitle: {
    ...typography.bodySmStrong,
    marginBottom: spacing.xs,
  },
  bannerText: {
    ...typography.bodyXs,
    lineHeight: 16,
  },

  // ── Footer ────────────────────────────────────────────────────
  backBtn: {
    marginTop: spacing.sm,
  },
});