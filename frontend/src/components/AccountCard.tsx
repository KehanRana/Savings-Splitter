import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Account } from '../core/types';
import { formatRate, formatCurrency } from '../core/calculator';

interface Props {
  account: Account;
  isSelected: boolean;
  onToggle: () => void;
}

export default function AccountCard({ account, isSelected, onToggle }: Props) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View>
      {/* Top row */}
      <TouchableOpacity onPress={onToggle}>
        <Text>{account.institution} - {account.name}</Text>
        <Text>{formatRate(account.bonusRate)} up to {formatCurrency(account.bonusCap)}</Text>
      </TouchableOpacity>

      {/* Expand/collapse button */}
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Text>{expanded ? '▼' : '▶'}</Text>
      </TouchableOpacity>

      {/* Expanded details */}
      {expanded && (
        <View>
          {account.type === 'unconditional' ? (
            <Text>✓ No monthly conditions</Text>
          ) : (
            account.conditions.map((condition, i) => (
              <Text key={i}>• {condition}</Text>
            ))
          )}
          
          {account.type === 'bonus' && (
            <Text>Base rate: {formatRate(account.baseRate)}</Text>
          )}
          
          {account.fcsProtected && <Text>🛡 FCS protected</Text>}
          {account.isLive && <Text>⚡ Live</Text>}
          
          <Text>Updated {account.lastUpdated}</Text>
        </View>
      )}
    </View>
  );
}