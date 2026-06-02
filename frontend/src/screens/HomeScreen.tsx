import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { optimiseSplit, formatCurrency } from '../core/calculator';
import { useAccounts } from '../hooks/useAccounts';
import LiveRateBanner from '../components/LiveRateBanner';
import BalanceInput from '../components/BalanceInput';
import AccountCard from '../components/AccountCard';

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
    rateStatus,
    fetchedAt,
    refreshRates,
  } = useAccounts();

  const result = optimiseSplit(balance, selectedAccounts);
  const gainText = result.annualGain > 0
    ? `+${formatCurrency(result.annualGain)}/yr`
    : null;

  function handleSeeResults() {
    navigation.navigate('Results', { balance });
  }

  return (
    <View>
      <LiveRateBanner
        status={rateStatus}
        fetchedAt={fetchedAt}
        onRefresh={refreshRates}
      />

      <ScrollView>
        <BalanceInput value={balance} onChange={setBalance} />

        <Text>Include accounts</Text>
        <Text>{selectedIds.size} of {accounts.length} selected</Text>

        {accounts.map(account => (
          <AccountCard
            key={account.id}
            account={account}
            isSelected={selectedIds.has(account.id)}
            onToggle={() => toggleAccount(account.id)}
          />
        ))}

        <Text>
          Rates are indicative. Verify current rates with each institution
          before transferring funds.
        </Text>
      </ScrollView>

      <TouchableOpacity onPress={handleSeeResults} disabled={selectedAccounts.length === 0}>
        <Text>See my optimised split</Text>
        {gainText && <Text>{gainText}</Text>}
      </TouchableOpacity>
    </View>
  );
}