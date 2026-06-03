import { useState, useCallback } from 'react';
import { Account } from '../core/types';
import { SEED_ACCOUNTS } from '../core/accounts';

interface UseAccountsReturn {
  accounts:         Account[];
  selectedIds:      Set<string>;
  toggleAccount:    (id: string) => void;
  selectedAccounts: Account[];
}

export function useAccounts(): UseAccountsReturn {
  const [accounts] = useState<Account[]>(SEED_ACCOUNTS);

  // All accounts selected by default
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(SEED_ACCOUNTS.map(a => a.id)),
  );

  // Toggle selection
  const toggleAccount = useCallback((id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        // Keep at least one account selected
        if (next.size > 1) next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectedAccounts = accounts.filter(a => selectedIds.has(a.id));

  return {
    accounts,
    selectedIds,
    toggleAccount,
    selectedAccounts,
  };
}