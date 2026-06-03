import { useMemo } from 'react';
import { optimiseSplit } from '../core/calculator';
import { Account, SplitResult } from '../core/types';

// Re-export SplitResult so screens don't need to import from calculator directly
export type { SplitResult };

/**
 * Memoised wrapper around optimiseSplit.
 * Re-runs only when balance or selectedAccounts reference changes.
 */
export function useSplit(
  balance: number,
  selectedAccounts: Account[],
) {
  return useMemo(
    () => optimiseSplit(balance, selectedAccounts),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [balance, selectedAccounts.map(a => a.id).join(','), selectedAccounts.map(a => a.bonusRate).join(',')],
  );
}