import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { optimiseSplit, formatCurrency } from '../core/calculator';
import { useAccounts } from '../hooks/useAccounts';
import BalanceInput from '../components/BalanceInput';
import AccountCard from '../components/AccountCard';
import Button from '../components/Button';
import { colors, spacing, typography, radius } from '../theme';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

const DEFAULT_BALANCE = 150_000;

export default function HomeScreen({ navigation }: Props) {
  const [balance, setBalance] = useState(DEFAULT_BALANCE);

  const {
    accounts,
    selectedIds,
    toggleAccount,
    selectedAccounts,
  } = useAccounts();

  const result  = optimiseSplit(balance, selectedAccounts);
  const hasGain = result.annualGain > 0;
  const gainText = hasGain ? `+${formatCurrency(result.annualGain)}/yr` : null;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <BalanceInput value={balance} onChange={setBalance} />

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Include accounts</Text>
            <Text style={styles.sectionHint}>
              {selectedIds.size} of {accounts.length} selected
            </Text>
          </View>

          {accounts.map(account => (
            <AccountCard
              key={account.id}
              account={account}
              isSelected={selectedIds.has(account.id)}
              onToggle={() => toggleAccount(account.id)}
            />
          ))}

          <Text style={styles.disclaimer}>
            Rates are indicative. Verify with each institution before transferring funds.
          </Text>

          <View style={{ height: spacing.xl }} />
        </ScrollView>

        {/* Sticky CTA */}
        <View style={styles.ctaContainer}>
          <Button
            label="See my optimised split"
            hierarchy="primary"
            surface="dark"
            disabled={selectedAccounts.length === 0}
            onPress={() => navigation.navigate('Results', { balance, selectedAccountIds: Array.from(selectedIds) })}
            trailing={
              gainText && selectedAccounts.length > 0 ? (
                <View style={styles.gainPill}>
                  <Text style={styles.gainPillText}>{gainText}</Text>
                </View>
              ) : undefined
            }
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex:            1,
    backgroundColor: colors.bgPrimary,
  },
  flex: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: {
    padding: spacing.lg,
  },
  sectionHeader: {
    flexDirection:  'row',
    alignItems:     'baseline',
    justifyContent: 'space-between',
    marginBottom:   spacing.sm,
    marginTop:      spacing.xs,
  },
  sectionTitle: {
    ...typography.bodyMdStrong,
  },
  sectionHint: {
    ...typography.caption,
  },
  disclaimer: {
    ...typography.caption,
    textAlign:         'center',
    marginTop:         spacing.lg,
    lineHeight:        16,
    paddingHorizontal: spacing.lg,
  },

  // CTA
  ctaContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom:     spacing.lg,
    paddingTop:        spacing.md,
    backgroundColor:   colors.bgPrimary,
    borderTopWidth:    0.5,
    borderTopColor:    colors.borderDefault,
  },
  gainPill: {
    backgroundColor: colors.brand400,         // gold pill
    borderRadius:    radius.pill,
    paddingVertical:   3,
    paddingHorizontal: spacing.sm,
  },
  gainPillText: {
    color:      colors.black,
    fontSize:   12,
    fontWeight: '700',
  },
});