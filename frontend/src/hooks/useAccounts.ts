import { useState, useCallback } from 'react';
import { Account } from '../core/types';
import { SEED_ACCOUNTS } from '../core/accounts';
import { RateStatus } from '../components/LiveRateBanner';

// Live rate fetch
// Falls back to seed data silently on any error.

const BACKEND_URL = 'http://10.0.2.2:3000';  // Android emulator → localhost

async function fetchLiveRates(): Promise<Account[]> {
  const response = await fetch(`${BACKEND_URL}/rates`, {
    method:  'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) throw new Error(`HTTP ${response.status}`);

  const data: Array<{
    id:          string;
    bonusRate:   number;
    baseRate:    number;
    bonusCap:    number;
    lastUpdated: string;
  }> = await response.json();

  // Merge live updates into seed accounts
  return SEED_ACCOUNTS.map(seed => {
    const update = data.find(d => d.id === seed.id);
    if (!update) return seed;
    return {
      ...seed,
      bonusRate:   update.bonusRate,
      baseRate:    update.baseRate,
      bonusCap:    update.bonusCap,
      lastUpdated: update.lastUpdated,
      isLive:      true,
    };
  });
}

// Hook

interface UseAccountsReturn {
  accounts:     Account[];
  selectedIds:  Set<string>;
  toggleAccount: (id: string) => void;
  selectedAccounts: Account[];

  rateStatus:   RateStatus;
  fetchedAt:    string | null;
  refreshRates: () => Promise<void>;
}

export function useAccounts(): UseAccountsReturn {
  const [accounts, setAccounts] = useState<Account[]>(SEED_ACCOUNTS);

  // All accounts selected by default
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(SEED_ACCOUNTS.map(a => a.id)),
  );

  const [rateStatus, setRateStatus] = useState<RateStatus>('seed');
  const [fetchedAt, setFetchedAt]   = useState<string | null>(null);

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

  // Live rate refresh
  const refreshRates = useCallback(async () => {
    setRateStatus('loading');
    try {
      const liveAccounts = await fetchLiveRates();
      setAccounts(liveAccounts);
      setRateStatus('live');
      setFetchedAt(new Date().toISOString());
    } catch (err) {
      console.warn('Live rate fetch failed:', err);
      setRateStatus('error');
    }
  }, []);

  const selectedAccounts = accounts.filter(a => selectedIds.has(a.id));

  return {
    accounts,
    selectedIds,
    toggleAccount,
    selectedAccounts,
    rateStatus,
    fetchedAt,
    refreshRates,
  };
}